-- Recreate the Auth -> profile trigger and backfill users created before it existed.
-- Run this after 202609060001_auth_profiles.sql.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role text;
  display_name text;
begin
  requested_role := case
    when new.raw_user_meta_data ->> 'role' in ('sender', 'traveler')
      then new.raw_user_meta_data ->> 'role'
    else 'sender'
  end;

  display_name := left(
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'MyTrip member'
    ),
    100
  );

  insert into public.profiles (id, full_name, active_role)
  values (new.id, display_name, requested_role)
  on conflict (id) do nothing;

  insert into public.profile_contacts (user_id, phone)
  values (new.id, left(nullif(trim(new.raw_user_meta_data ->> 'phone'), ''), 30))
  on conflict (user_id) do nothing;

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

insert into public.profiles (id, full_name, active_role)
select
  users.id,
  left(
    coalesce(
      nullif(trim(users.raw_user_meta_data ->> 'full_name'), ''),
      nullif(split_part(coalesce(users.email, ''), '@', 1), ''),
      'MyTrip member'
    ),
    100
  ),
  case
    when users.raw_user_meta_data ->> 'role' in ('sender', 'traveler')
      then users.raw_user_meta_data ->> 'role'
    else 'sender'
  end
from auth.users as users
on conflict (id) do nothing;

insert into public.profile_contacts (user_id, phone)
select users.id, left(nullif(trim(users.raw_user_meta_data ->> 'phone'), ''), 30)
from auth.users as users
on conflict (user_id) do nothing;
