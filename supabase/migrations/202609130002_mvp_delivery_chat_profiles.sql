-- Chagga MVP: one shared post-match delivery, one conversation, simple
-- confirmations, ratings, and lightweight profile details.

alter table public.profiles
  add column if not exists avatar_url text,
  add column if not exists usual_routes jsonb not null default '[]'::jsonb;

alter table public.profiles
  add constraint profiles_usual_routes_is_array
  check (jsonb_typeof(usual_routes) = 'array');

grant update (avatar_url, usual_routes) on public.profiles to authenticated;

create table public.deliveries (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null unique references public.match_proposals(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  traveler_id uuid not null references public.profiles(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete set null,
  request_id uuid references public.delivery_requests(id) on delete set null,
  from_location text not null,
  to_location text not null,
  item_type text not null,
  status text not null default 'accepted'
    check (status in ('accepted', 'in_transit', 'dropped_off', 'delivered', 'completed', 'cancelled')),
  sender_confirmed_at timestamptz,
  traveler_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  check (sender_id <> traveler_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references public.deliveries(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(trim(body)) between 1 and 1200),
  kind text not null default 'text' check (kind in ('text', 'system')),
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.ratings (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references public.deliveries(id) on delete cascade,
  rater_id uuid not null references public.profiles(id) on delete cascade,
  rated_user_id uuid not null references public.profiles(id) on delete cascade,
  stars integer not null check (stars between 1 and 5),
  comment text check (comment is null or char_length(comment) <= 300),
  created_at timestamptz not null default now(),
  unique (delivery_id, rater_id),
  check (rater_id <> rated_user_id)
);

create index deliveries_sender on public.deliveries (sender_id, status);
create index deliveries_traveler on public.deliveries (traveler_id, status);
create index messages_delivery_created on public.messages (delivery_id, created_at);
create index messages_unread on public.messages (recipient_id, read_at) where read_at is null;
create index ratings_user on public.ratings (rated_user_id, created_at);

create trigger deliveries_set_updated_at before update on public.deliveries
for each row execute procedure public.set_updated_at();

alter table public.deliveries enable row level security;
alter table public.messages enable row level security;
alter table public.ratings enable row level security;

create policy "Delivery participants can view deliveries"
on public.deliveries for select to authenticated
using ((select auth.uid()) in (sender_id, traveler_id));

create policy "Delivery participants can view messages"
on public.messages for select to authenticated
using (exists (
  select 1 from public.deliveries d
  where d.id = messages.delivery_id
    and (select auth.uid()) in (d.sender_id, d.traveler_id)
));

create policy "Participants can send messages"
on public.messages for insert to authenticated
with check (
  sender_id = (select auth.uid())
  and kind = 'text'
  and exists (
    select 1 from public.deliveries d
    where d.id = messages.delivery_id
      and (select auth.uid()) in (d.sender_id, d.traveler_id)
      and recipient_id in (d.sender_id, d.traveler_id)
      and recipient_id <> (select auth.uid())
  )
);

create policy "Recipients can mark messages read"
on public.messages for update to authenticated
using (recipient_id = (select auth.uid()))
with check (recipient_id = (select auth.uid()));

create policy "Authors can delete their messages"
on public.messages for delete to authenticated
using (sender_id = (select auth.uid()) and kind = 'text');

create policy "Members can view ratings"
on public.ratings for select to authenticated using (true);

create policy "Participants can rate completed deliveries"
on public.ratings for insert to authenticated
with check (
  rater_id = (select auth.uid())
  and exists (
    select 1 from public.deliveries d
    where d.id = ratings.delivery_id
      and d.status = 'completed'
      and rater_id in (d.sender_id, d.traveler_id)
      and rated_user_id in (d.sender_id, d.traveler_id)
      and rated_user_id <> rater_id
  )
);

revoke all on public.deliveries, public.messages, public.ratings from anon, authenticated;
grant select on public.deliveries to authenticated;
grant select, insert, update (read_at), delete on public.messages to authenticated;
grant select, insert on public.ratings to authenticated;

-- Replace the earlier response function so accepting a proposal also opens a
-- shared delivery and conversation for both people.
create or replace function public.respond_to_match_proposal(
  proposal_id uuid,
  response text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  proposal public.match_proposals;
  new_delivery_id uuid;
begin
  if response not in ('accepted', 'declined') then
    raise exception 'Response must be accepted or declined';
  end if;

  select * into proposal from public.match_proposals
  where id = proposal_id for update;

  if proposal.id is null then raise exception 'Match proposal not found'; end if;
  if proposal.status <> 'pending' then raise exception 'Match proposal has already been answered'; end if;
  if auth.uid() not in (proposal.sender_id, proposal.traveler_id)
     or auth.uid() = proposal.proposed_by then
    raise exception 'Only the recipient can answer this proposal';
  end if;

  update public.match_proposals
  set status = response, responded_at = now()
  where id = proposal_id;

  if response = 'accepted' then
    if proposal.trip_id is not null then
      update public.trips set status = 'matched' where id = proposal.trip_id;
    else
      update public.delivery_requests set status = 'matched' where id = proposal.request_id;
    end if;

    insert into public.deliveries (
      proposal_id, sender_id, traveler_id, trip_id, request_id,
      from_location, to_location, item_type
    ) values (
      proposal.id, proposal.sender_id, proposal.traveler_id, proposal.trip_id,
      proposal.request_id, proposal.from_location, proposal.to_location, proposal.item_type
    ) returning id into new_delivery_id;
  end if;

  return jsonb_build_object('id', proposal_id, 'status', response, 'delivery_id', new_delivery_id);
end;
$$;

create or replace function public.update_delivery_status(
  delivery_id uuid,
  next_status text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  delivery public.deliveries;
  notice_text text;
begin
  select * into delivery from public.deliveries where id = delivery_id for update;
  if delivery.id is null then raise exception 'Delivery not found'; end if;
  if auth.uid() <> delivery.traveler_id then raise exception 'Only the traveler can update the journey'; end if;

  if not (
    (delivery.status = 'accepted' and next_status = 'in_transit') or
    (delivery.status = 'in_transit' and next_status = 'dropped_off')
  ) then
    raise exception 'This status change is not available';
  end if;

  update public.deliveries set status = next_status where id = delivery_id;
  notice_text := case next_status
    when 'in_transit' then 'Your package is now in transit with the traveller.'
    else 'Your package has been dropped off by the traveller.'
  end;

  insert into public.messages (delivery_id, sender_id, recipient_id, body, kind)
  values (delivery.id, delivery.traveler_id, delivery.sender_id, notice_text, 'system');

  return jsonb_build_object('id', delivery_id, 'status', next_status);
end;
$$;

create or replace function public.confirm_delivery(delivery_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  delivery public.deliveries;
  final_status text;
  other_user uuid;
begin
  select * into delivery from public.deliveries where id = delivery_id for update;
  if delivery.id is null then raise exception 'Delivery not found'; end if;
  if auth.uid() not in (delivery.sender_id, delivery.traveler_id) then raise exception 'Not a delivery participant'; end if;
  if delivery.status not in ('dropped_off', 'delivered') then raise exception 'The item must be dropped off first'; end if;

  if auth.uid() = delivery.sender_id then
    update public.deliveries set sender_confirmed_at = coalesce(sender_confirmed_at, now()) where id = delivery_id;
    other_user := delivery.traveler_id;
  else
    update public.deliveries set traveler_confirmed_at = coalesce(traveler_confirmed_at, now()) where id = delivery_id;
    other_user := delivery.sender_id;
  end if;

  select * into delivery from public.deliveries where id = delivery_id;
  if delivery.sender_confirmed_at is not null and delivery.traveler_confirmed_at is not null then
    final_status := 'completed';
    update public.deliveries set status = 'completed', completed_at = now() where id = delivery_id;
    update public.profiles set completed_deliveries = completed_deliveries + 1
    where id in (delivery.sender_id, delivery.traveler_id);
  else
    final_status := 'delivered';
    update public.deliveries set status = 'delivered' where id = delivery_id;
  end if;

  insert into public.messages (delivery_id, sender_id, recipient_id, body, kind)
  values (
    delivery.id, auth.uid(), other_user,
    case when final_status = 'completed'
      then 'Delivery completed. You can now rate your experience.'
      else 'The other person confirmed delivery. Please confirm when you are ready.' end,
    'system'
  );

  return jsonb_build_object('id', delivery_id, 'status', final_status);
end;
$$;

create or replace function public.refresh_profile_rating()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set rating = (select round(avg(stars)::numeric, 1) from public.ratings where rated_user_id = new.rated_user_id)
  where id = new.rated_user_id;
  return new;
end;
$$;

create trigger ratings_refresh_profile
after insert on public.ratings
for each row execute procedure public.refresh_profile_rating();

revoke all on function public.respond_to_match_proposal(uuid, text) from public;
revoke all on function public.update_delivery_status(uuid, text) from public;
revoke all on function public.confirm_delivery(uuid) from public;
revoke all on function public.refresh_profile_rating() from public;
grant execute on function public.respond_to_match_proposal(uuid, text) to authenticated;
grant execute on function public.update_delivery_status(uuid, text) to authenticated;
grant execute on function public.confirm_delivery(uuid) to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-pictures', 'profile-pictures', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Members can upload their profile picture"
on storage.objects for insert to authenticated
with check (bucket_id = 'profile-pictures' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "Members can update their profile picture"
on storage.objects for update to authenticated
using (bucket_id = 'profile-pictures' and owner_id = (select auth.uid())::text)
with check (bucket_id = 'profile-pictures' and owner_id = (select auth.uid())::text);

create policy "Members can delete their profile picture"
on storage.objects for delete to authenticated
using (bucket_id = 'profile-pictures' and owner_id = (select auth.uid())::text);

do $$
begin
  alter publication supabase_realtime add table public.messages;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.deliveries;
exception when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.match_proposals;
exception when duplicate_object then null;
end $$;
