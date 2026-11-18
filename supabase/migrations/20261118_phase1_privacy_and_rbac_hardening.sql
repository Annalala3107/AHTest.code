-- =========================================================================
-- AHtest.code Phase 1 Privacy-by-Design & RBAC Hardening Migration
-- Purpose:
-- 1. Extend public.profiles with username, organization, privacy flags
-- 2. Separate private PII into public.private_profiles (zero email exposure)
-- 3. Prevent infinite RLS recursion via SECURITY DEFINER public.is_super_admin()
-- 4. Close PII email leak on public.profiles & lock rating/streak/rank_class
-- 5. Provide safe public leaderboard RPC without exposing email addresses
-- =========================================================================

-- 1. Extend public.profiles idempotently
alter table public.profiles
  add column if not exists username text,
  add column if not exists organization text,
  add column if not exists show_organization boolean not null default true,
  add column if not exists privacy_consented_at timestamp with time zone;

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username is not null;

-- 2. Create public.private_profiles table for sensitive PII
create table if not exists public.private_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  consent_privacy_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.private_profiles enable row level security;

-- Backfill existing profiles into private_profiles
insert into public.private_profiles (id, email, full_name, consent_privacy_at)
select id, email, name, privacy_consented_at
from public.profiles
on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(public.private_profiles.full_name, excluded.full_name);

-- 3. SECURITY DEFINER helper to avoid RLS self-query recursion
create or replace function public.is_super_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'super_admin'
  );
$$;

-- 4. Harden RLS on public.profiles (Close PII Email Leak)
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can view own profile" on public.profiles;
drop policy if exists "Users can update their own profile details" on public.profiles;
drop policy if exists "Super admins have full management access" on public.profiles;

create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id or public.is_super_admin());

create policy "Users can update their own profile details"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and rating = (select p.rating from public.profiles p where p.id = auth.uid())
    and streak_days = (select p.streak_days from public.profiles p where p.id = auth.uid())
    and rank_class = (select p.rank_class from public.profiles p where p.id = auth.uid())
    and email = (select p.email from public.profiles p where p.id = auth.uid())
  );

create policy "Super admins have full management access"
  on public.profiles
  for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- 5. RLS policies on public.private_profiles
drop policy if exists "Users can view own private profile" on public.private_profiles;
drop policy if exists "Users can update own private profile" on public.private_profiles;
drop policy if exists "Super admins manage private profiles" on public.private_profiles;

create policy "Users can view own private profile"
  on public.private_profiles
  for select
  using (auth.uid() = id or public.is_super_admin());

create policy "Users can update own private profile"
  on public.private_profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and email = (select pp.email from public.private_profiles pp where pp.id = auth.uid())
  );

create policy "Super admins manage private profiles"
  on public.private_profiles
  for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- 6. BEFORE UPDATE trigger to lock role/rating/streak_days/rank_class/email on client updates
create or replace function public.enforce_profile_security_invariants()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
begin
  if not public.is_super_admin()
     and current_user not in ('postgres', 'service_role', 'supabase_auth_admin') then
    new.role := old.role;
    new.rating := old.rating;
    new.streak_days := old.streak_days;
    new.rank_class := old.rank_class;
    new.email := old.email;
  end if;
  new.updated_at := timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_enforce_profile_security_invariants on public.profiles;
create trigger trg_enforce_profile_security_invariants
  before update on public.profiles
  for each row execute function public.enforce_profile_security_invariants();

-- 7. Safe Public Leaderboard RPC (Zero Email Exposure)
create or replace function public.get_public_leaderboard(limit_count integer default 100)
returns table (
  id uuid,
  username text,
  display_name text,
  avatar_url text,
  role text,
  rating integer,
  streak_days integer,
  rank_class text,
  organization text
)
language sql
security definer
set search_path = public
stable
as $$
  select
    p.id,
    p.username,
    coalesce(nullif(p.username, ''), p.name, 'Coder') as display_name,
    p.avatar_url,
    p.role,
    p.rating,
    p.streak_days,
    p.rank_class,
    case when p.show_organization then p.organization else null end as organization
  from public.profiles p
  order by p.rating desc, p.streak_days desc
  limit greatest(1, least(coalesce(limit_count, 100), 200));
$$;

grant execute on function public.get_public_leaderboard(integer) to anon, authenticated;

-- 8. Update Provisioning Function & Trigger
create or replace function public.handle_new_user()
returns trigger
security definer
set search_path = public
language plpgsql
as $$
declare
  resolved_name text;
  resolved_avatar text;
  resolved_username text;
  resolved_org text;
  resolved_show_org boolean;
  resolved_consent timestamptz;
begin
  resolved_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    split_part(new.email, '@', 1)
  );
  resolved_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id::text
  );
  resolved_username := nullif(trim(coalesce(new.raw_user_meta_data->>'username', '')), '');
  resolved_org := nullif(trim(coalesce(new.raw_user_meta_data->>'organization', '')), '');
  resolved_show_org := coalesce((new.raw_user_meta_data->>'show_organization')::boolean, true);

  begin
    resolved_consent := (new.raw_user_meta_data->>'privacy_consented_at')::timestamptz;
  exception when others then
    resolved_consent := null;
  end;

  insert into public.profiles (
    id,
    email,
    username,
    name,
    avatar_url,
    organization,
    show_organization,
    privacy_consented_at,
    role,
    rating,
    streak_days,
    rank_class
  )
  values (
    new.id,
    new.email,
    resolved_username,
    resolved_name,
    resolved_avatar,
    resolved_org,
    resolved_show_org,
    resolved_consent,
    'student',
    1200,
    0,
    'Newbie'
  )
  on conflict (id) do nothing;

  insert into public.private_profiles (id, email, full_name, consent_privacy_at)
  values (new.id, new.email, resolved_name, resolved_consent)
  on conflict (id) do nothing;

  return new;
end;
$$;
