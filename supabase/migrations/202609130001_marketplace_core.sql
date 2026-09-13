-- Shared marketplace records. This replaces browser-only localStorage for the
-- trip, delivery-request, and match-proposal flows.

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  traveler_id uuid not null references public.profiles(id) on delete cascade,
  from_location text not null check (char_length(from_location) between 2 and 120),
  to_location text not null check (char_length(to_location) between 2 and 120),
  travel_date date not null,
  available_space text not null check (available_space in ('small', 'medium', 'large')),
  accepted_items text[] not null check (cardinality(accepted_items) > 0),
  delivery_area text check (delivery_area is null or char_length(delivery_area) <= 160),
  status text not null default 'available' check (status in ('available', 'matched', 'cancelled', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_location <> to_location)
);

create table public.delivery_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  item_type text not null check (item_type in ('documents', 'electronics', 'clothes', 'gifts')),
  from_location text not null check (char_length(from_location) between 2 and 120),
  to_location text not null check (char_length(to_location) between 2 and 120),
  needed_by date not null,
  size text not null check (size in ('small', 'medium', 'large')),
  description text check (description is null or char_length(description) <= 600),
  status text not null default 'pending' check (status in ('pending', 'matched', 'cancelled', 'expired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (from_location <> to_location)
);

create table public.match_proposals (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.profiles(id) on delete cascade,
  traveler_id uuid not null references public.profiles(id) on delete cascade,
  trip_id uuid references public.trips(id) on delete cascade,
  request_id uuid references public.delivery_requests(id) on delete cascade,
  proposed_by uuid not null references public.profiles(id) on delete cascade,
  proposal_type text not null check (proposal_type in ('sender_to_traveler', 'traveler_to_sender')),
  from_location text not null,
  to_location text not null,
  item_type text not null check (item_type in ('documents', 'electronics', 'clothes', 'gifts')),
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'cancelled')),
  created_at timestamptz not null default now(),
  responded_at timestamptz,
  check (sender_id <> traveler_id),
  check ((trip_id is not null)::integer + (request_id is not null)::integer = 1),
  check (proposed_by in (sender_id, traveler_id))
);

create unique index match_proposals_pending_trip
  on public.match_proposals (sender_id, traveler_id, trip_id)
  where status = 'pending' and trip_id is not null;

create unique index match_proposals_pending_request
  on public.match_proposals (sender_id, traveler_id, request_id)
  where status = 'pending' and request_id is not null;

create index trips_discovery on public.trips (status, travel_date);
create index requests_discovery on public.delivery_requests (status, needed_by);
create index proposals_sender on public.match_proposals (sender_id, status);
create index proposals_traveler on public.match_proposals (traveler_id, status);

create trigger trips_set_updated_at before update on public.trips
for each row execute procedure public.set_updated_at();

create trigger requests_set_updated_at before update on public.delivery_requests
for each row execute procedure public.set_updated_at();

alter table public.trips enable row level security;
alter table public.delivery_requests enable row level security;
alter table public.match_proposals enable row level security;

create policy "Members can discover trips"
on public.trips for select to authenticated
using (status = 'available' or traveler_id = (select auth.uid()));

create policy "Travelers can publish their trips"
on public.trips for insert to authenticated
with check (traveler_id = (select auth.uid()));

create policy "Travelers can update their trips"
on public.trips for update to authenticated
using (traveler_id = (select auth.uid()))
with check (traveler_id = (select auth.uid()));

create policy "Members can discover delivery requests"
on public.delivery_requests for select to authenticated
using (status = 'pending' or sender_id = (select auth.uid()));

create policy "Senders can publish their requests"
on public.delivery_requests for insert to authenticated
with check (sender_id = (select auth.uid()));

create policy "Senders can update their requests"
on public.delivery_requests for update to authenticated
using (sender_id = (select auth.uid()))
with check (sender_id = (select auth.uid()));

create policy "Participants can view match proposals"
on public.match_proposals for select to authenticated
using ((select auth.uid()) in (sender_id, traveler_id));

create policy "Participants can create valid match proposals"
on public.match_proposals for insert to authenticated
with check (
  proposed_by = (select auth.uid())
  and (select auth.uid()) in (sender_id, traveler_id)
  and (
    (trip_id is not null and request_id is null and exists (
      select 1 from public.trips t
      where t.id = match_proposals.trip_id
        and t.traveler_id = match_proposals.traveler_id
        and t.status = 'available'
    ))
    or
    (request_id is not null and trip_id is null and exists (
      select 1 from public.delivery_requests r
      where r.id = match_proposals.request_id
        and r.sender_id = match_proposals.sender_id
        and r.status = 'pending'
    ))
  )
);

revoke all on public.trips, public.delivery_requests, public.match_proposals from anon, authenticated;
grant select, insert, update on public.trips to authenticated;
grant select, insert, update on public.delivery_requests to authenticated;
grant select, insert on public.match_proposals to authenticated;

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
begin
  if response not in ('accepted', 'declined') then
    raise exception 'Response must be accepted or declined';
  end if;

  select * into proposal
  from public.match_proposals
  where id = proposal_id
  for update;

  if proposal.id is null then
    raise exception 'Match proposal not found';
  end if;

  if proposal.status <> 'pending' then
    raise exception 'Match proposal has already been answered';
  end if;

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
  end if;

  return jsonb_build_object('id', proposal_id, 'status', response);
end;
$$;

revoke all on function public.respond_to_match_proposal(uuid, text) from public;
grant execute on function public.respond_to_match_proposal(uuid, text) to authenticated;
