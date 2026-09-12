create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 100),
  active_role text not null default 'sender' check (active_role in ('sender', 'traveler')),
  rating numeric(2, 1) not null default 5.0 check (rating between 0 and 5),
  completed_deliveries integer not null default 0 check (completed_deliveries >= 0),
  verification_status text not null default 'unverified'
    check (verification_status in ('unverified', 'pending', 'verified', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profile_contacts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  phone text check (phone is null or char_length(phone) <= 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.profile_contacts enable row level security;

create policy "Authenticated members can view public profiles"
on public.profiles
for select
to authenticated
using (true);

create policy "Members can update their own public profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Members can view their own contact information"
on public.profile_contacts
for select
to authenticated
using ((select auth.uid()) = user_id);

create policy "Members can update their own contact information"
on public.profile_contacts
for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.profile_contacts from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (full_name, active_role) on table public.profiles to authenticated;
grant select on table public.profile_contacts to authenticated;
grant update (phone) on table public.profile_contacts to authenticated;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger profile_contacts_set_updated_at
before update on public.profile_contacts
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text;
begin
  requested_role := case
    when new.raw_user_meta_data ->> 'role' in ('sender', 'traveler')
      then new.raw_user_meta_data ->> 'role'
    else 'sender'
  end;

  insert into public.profiles (id, full_name, active_role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    requested_role
  );

  insert into public.profile_contacts (user_id, phone)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'phone'), ''));

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
