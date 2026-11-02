-- =========================================================================
-- AHtest.code Production RBAC & Profiles Migration
-- Purpose:
-- 1. Create 'public.profiles' table synchronized with 'auth.users'
-- 2. Enforce Row-Level Security (RLS) to prevent privilege escalation
-- 3. Automatic trigger provisioning with default 'student' role
-- =========================================================================

-- 1. Create public.profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'educator', 'super_admin')),
  rating integer not null default 1200,
  streak_days integer not null default 0,
  rank_class text not null default 'Newbie',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row-Level Security
alter table public.profiles enable row level security;

-- 3. Drop any pre-existing policies to allow idempotent execution
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update their own profile details" on public.profiles;
drop policy if exists "Super admins have full management access" on public.profiles;

-- 4. Policy: Public profiles are readable by everyone (Leaderboard, Authors)
create policy "Public profiles are viewable by everyone"
  on public.profiles
  for select
  using (true);

-- 5. Policy: Users can update their own display info, but CANNOT self-elevate role
create policy "Users can update their own profile details"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    -- Critical Security Invariant: The updated row's role MUST match the currently stored role in the database
    and role = (select p.role from public.profiles p where p.id = auth.uid())
  );

-- 6. Policy: Super admins can view, update, and manage all user profiles and roles
create policy "Super admins have full management access"
  on public.profiles
  for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'super_admin'
    )
  );

-- 7. Provisioning Function & Trigger
create or replace function public.handle_new_user()
returns trigger
security definer set search_path = public
language plpgsql
as $$
begin
  insert into public.profiles (id, email, name, avatar_url, role, rating, streak_days, rank_class)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', 'https://api.dicebear.com/7.x/bottts/svg?seed=' || new.id::text),
    'student', -- Enforce strictly 'student' role upon registration. Never trust raw_user_meta_data for roles!
    1200,
    0,
    'Newbie'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =========================================================================
-- SECURE ROLE ELEVATION HELPER:
-- To promote an initial Super Admin, run this query in Supabase SQL Editor:
--
-- UPDATE public.profiles
-- SET role = 'super_admin', rank_class = 'Super Admin', rating = 3000
-- WHERE email = 'your-verified-admin-email@domain.com';
-- =========================================================================
