-- =========================================================================
-- AHtest.code MASTER DATABASE INITIALIZATION & MIGRATION SCRIPT
-- =========================================================================
-- Purpose:
-- Run this script in Supabase SQL Editor on a clean or existing database.
-- It is 100% idempotent (safe to run multiple times without data loss).
-- It provisions:
--   1. Profiles & Privacy-by-design tables (zero email leak)
--   2. RBAC & is_super_admin() security definer helpers
--   3. Auto-provisioning trigger on auth.users for new registrations
--   4. Problems, Hidden Testcases & Submissions (OJ Core)
--   5. Contests, Contest Registrations & Problem Collections
--   6. User Problem Progress, Comments & Audit Logs
--   7. Safe SECURITY DEFINER RPCs (Leaderboard, Submissions, Scoreboard, RBAC)
--   8. Initial Seed Data (Problems, Contests, Collections)
-- =========================================================================

-- -------------------------------------------------------------------------
-- PART 1: PROFILES & AUTH SYNCHRONIZATION
-- -------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  full_name text,
  username text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'educator', 'super_admin')),
  rating integer not null default 1200,
  streak_days integer not null default 0,
  rank_class text not null default 'Newbie',
  organization text,
  show_organization boolean not null default true,
  privacy_consented_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure all columns exist if table was already created in earlier steps
alter table public.profiles
  add column if not exists name text,
  add column if not exists full_name text,
  add column if not exists username text,
  add column if not exists organization text,
  add column if not exists show_organization boolean not null default true,
  add column if not exists privacy_consented_at timestamp with time zone;

create unique index if not exists profiles_username_lower_idx
  on public.profiles (lower(username))
  where username is not null;

-- Private profiles table for PII isolation
create table if not exists public.private_profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  consent_privacy_at timestamp with time zone,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SECURITY DEFINER helper to prevent infinite RLS recursion
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

-- Enable RLS on Profiles
alter table public.profiles enable row level security;
alter table public.private_profiles enable row level security;

-- Profiles RLS Policies
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

-- Private Profiles RLS Policies
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

-- Profile Security Invariant Trigger
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

-- User Provisioning Trigger on auth.users
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
    full_name,
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
  on conflict (id) do update set
    email = excluded.email,
    name = coalesce(public.profiles.name, excluded.name),
    full_name = coalesce(public.profiles.full_name, excluded.full_name);

  insert into public.private_profiles (id, email, full_name, consent_privacy_at)
  values (new.id, new.email, resolved_name, resolved_consent)
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- -------------------------------------------------------------------------
-- PART 2: PROBLEMS, HIDDEN TESTCASES & SUBMISSIONS
-- -------------------------------------------------------------------------

create table if not exists public.problems (
  id text primary key,
  title text not null,
  title_en text,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  points integer not null default 100,
  category text not null default 'General',
  tags text[] not null default '{}',
  track text not null default 'competitive' check (track in ('competitive', 'lab_practice')),
  time_limit_ms integer not null default 1000,
  memory_limit_kb integer not null default 262144,
  statement text not null,
  statement_en text,
  input_format text not null default '',
  input_format_en text,
  output_format text not null default '',
  output_format_en text,
  constraints text not null default '',
  constraints_en text,
  samples jsonb not null default '[]'::jsonb,
  editorial text,
  is_published boolean not null default true,
  accepted_count integer not null default 0,
  submission_count integer not null default 0,
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Upgrade existing table if needed
alter table public.problems
  add column if not exists track text not null default 'competitive' check (track in ('competitive', 'lab_practice')),
  add column if not exists accepted_count integer not null default 0,
  add column if not exists submission_count integer not null default 0;

alter table public.problems enable row level security;

drop policy if exists "Published problems are viewable by everyone" on public.problems;
drop policy if exists "Admins and educators manage problems" on public.problems;

create policy "Published problems are viewable by everyone"
  on public.problems
  for select
  using (is_published = true or public.is_super_admin());

create policy "Admins and educators manage problems"
  on public.problems
  for all
  using (
    public.is_super_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('educator', 'super_admin')
    )
  )
  with check (
    public.is_super_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('educator', 'super_admin')
    )
  );

-- Hidden Testcases Table (Zero Hidden Test Leak)
create table if not exists public.problem_testcases (
  id bigserial primary key,
  problem_id text not null references public.problems(id) on delete cascade,
  test_order integer not null default 1,
  input text not null default '',
  expected_output text not null default '',
  is_hidden boolean not null default true,
  weight integer not null default 20,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists problem_testcases_problem_id_idx
  on public.problem_testcases(problem_id, test_order);

alter table public.problem_testcases enable row level security;

drop policy if exists "Students view sample testcases only" on public.problem_testcases;
drop policy if exists "Staff manage all problem testcases" on public.problem_testcases;

create policy "Students view sample testcases only"
  on public.problem_testcases
  for select
  using (is_hidden = false or public.is_super_admin());

create policy "Staff manage all problem testcases"
  on public.problem_testcases
  for all
  using (
    public.is_super_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('educator', 'super_admin')
    )
  )
  with check (
    public.is_super_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('educator', 'super_admin')
    )
  );

-- Multi-Language Submissions Table
create table if not exists public.submissions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id text not null,
  language text not null check (language in ('c17', 'cpp17', 'cpp20', 'py3', 'java', 'sql', 'rust')),
  code text not null,
  verdict text not null check (verdict in ('Pending', 'Judging', 'AC', 'WA', 'TLE', 'MLE', 'RTE', 'CE')),
  score integer not null default 0,
  max_score integer not null default 100,
  time_ms integer not null default 0,
  memory_kb integer not null default 0,
  passed_tests integer not null default 0,
  total_tests integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists submissions_user_problem_idx
  on public.submissions(user_id, problem_id, created_at desc);

alter table public.submissions enable row level security;

drop policy if exists "Users view own submissions" on public.submissions;
drop policy if exists "Users insert own submissions" on public.submissions;
drop policy if exists "Staff view all submissions" on public.submissions;

create policy "Users view own submissions"
  on public.submissions
  for select
  using (auth.uid() = user_id or public.is_super_admin());

create policy "Users insert own submissions"
  on public.submissions
  for insert
  with check (auth.uid() = user_id);

create policy "Staff view all submissions"
  on public.submissions
  for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

-- -------------------------------------------------------------------------
-- PART 3: CONTESTS, COLLECTIONS, PROGRESS & DISCUSSIONS
-- -------------------------------------------------------------------------

-- Problem Collections
create table if not exists public.problem_collections (
  id text primary key,
  title text not null,
  description text not null default '',
  icon text not null default 'Folder',
  color text not null default 'indigo',
  category text not null default 'General',
  problem_ids text[] not null default '{}',
  is_official boolean not null default false,
  creator_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.problem_collections enable row level security;

drop policy if exists "Collections are viewable by everyone" on public.problem_collections;
drop policy if exists "Authenticated users can create collections" on public.problem_collections;
drop policy if exists "Users or staff can update collections" on public.problem_collections;

create policy "Collections are viewable by everyone"
  on public.problem_collections for select
  using (true);

create policy "Authenticated users can create collections"
  on public.problem_collections for insert
  with check (auth.uid() is not null);

create policy "Users or staff can update collections"
  on public.problem_collections for update
  using (creator_id = auth.uid() or public.is_super_admin());

-- Contests Table
create table if not exists public.contests (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  description text not null default '',
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  duration_minutes integer not null default 180,
  status text not null default 'UPCOMING' check (status in ('UPCOMING', 'RUNNING', 'ENDED')),
  is_rated boolean not null default true,
  tags text[] not null default '{}',
  registration_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists contests_slug_idx on public.contests(slug);

alter table public.contests enable row level security;

drop policy if exists "Contests viewable by everyone" on public.contests;
drop policy if exists "Staff can manage contests" on public.contests;

create policy "Contests viewable by everyone"
  on public.contests for select
  using (true);

create policy "Staff can manage contests"
  on public.contests for all
  using (
    public.is_super_admin()
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('educator', 'super_admin')
    )
  );

-- Contest Problems
create table if not exists public.contest_problems (
  contest_id uuid not null references public.contests(id) on delete cascade,
  problem_id text not null references public.problems(id) on delete cascade,
  letter text not null,
  points integer not null default 100,
  order_index integer not null default 1,
  primary key (contest_id, problem_id)
);

alter table public.contest_problems enable row level security;

drop policy if exists "Contest problems viewable by everyone" on public.contest_problems;
create policy "Contest problems viewable by everyone"
  on public.contest_problems for select
  using (true);

-- Contest Registrations
create table if not exists public.contest_registrations (
  contest_id uuid not null references public.contests(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  registered_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (contest_id, user_id)
);

alter table public.contest_registrations enable row level security;

drop policy if exists "Users view own registrations" on public.contest_registrations;
drop policy if exists "Users register themselves" on public.contest_registrations;

create policy "Users view own registrations"
  on public.contest_registrations for select
  using (user_id = auth.uid() or public.is_super_admin());

create policy "Users register themselves"
  on public.contest_registrations for insert
  with check (user_id = auth.uid());

-- User Problem Progress
create table if not exists public.user_problem_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  problem_id text not null references public.problems(id) on delete cascade,
  status text not null check (status in ('unattempted', 'attempted', 'solved')),
  star_score integer not null default 0,
  last_attempt_at timestamp with time zone default timezone('utc'::text, now()) not null,
  solved_at timestamp with time zone,
  primary key (user_id, problem_id)
);

create index if not exists user_problem_progress_user_idx
  on public.user_problem_progress(user_id, status);

alter table public.user_problem_progress enable row level security;

drop policy if exists "Users view own progress" on public.user_problem_progress;
drop policy if exists "Users update own progress" on public.user_problem_progress;

create policy "Users view own progress"
  on public.user_problem_progress for select
  using (user_id = auth.uid() or public.is_super_admin());

create policy "Users update own progress"
  on public.user_problem_progress for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Problem Comments & Discussions
create table if not exists public.problem_comments (
  id uuid default gen_random_uuid() primary key,
  problem_id text not null references public.problems(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  user_name text not null,
  user_avatar text,
  content text not null,
  likes_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists problem_comments_prob_idx
  on public.problem_comments(problem_id, created_at desc);

alter table public.problem_comments enable row level security;

drop policy if exists "Comments viewable by everyone" on public.problem_comments;
drop policy if exists "Users insert own comments" on public.problem_comments;
drop policy if exists "Users delete own comments" on public.problem_comments;

create policy "Comments viewable by everyone"
  on public.problem_comments for select
  using (true);

create policy "Users insert own comments"
  on public.problem_comments for insert
  with check (user_id = auth.uid());

create policy "Users delete own comments"
  on public.problem_comments for delete
  using (user_id = auth.uid() or public.is_super_admin());

-- Audit Logs Table (Admin Only)
create table if not exists public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  event_type text not null,
  user_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.audit_logs enable row level security;

drop policy if exists "Staff only audit logs" on public.audit_logs;
create policy "Staff only audit logs"
  on public.audit_logs for all
  using (public.is_super_admin());

-- -------------------------------------------------------------------------
-- PART 4: SAFE SECURITY DEFINER RPCs
-- -------------------------------------------------------------------------

-- RPC 1: Public Leaderboard
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
    coalesce(nullif(p.username, ''), p.full_name, p.name, 'Coder') as display_name,
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

-- RPC 2: Organization Leaderboard (Aggregated with solved count)
create or replace function public.get_organization_leaderboard()
returns table (
  id uuid,
  username text,
  full_name text,
  organization text,
  rating integer,
  rank_class text,
  avatar_url text,
  solved_count bigint,
  total_submissions bigint
)
language sql
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    case
      when p.role in ('super_admin', 'educator') then coalesce(p.full_name, p.name, p.username, 'Giáo viên')
      else coalesce(p.username, 'Thí sinh')
    end as full_name,
    case
      when p.show_organization then coalesce(p.organization, 'Tự do')
      else 'Tự do'
    end as organization,
    p.rating,
    p.rank_class,
    p.avatar_url,
    coalesce(count(distinct case when upp.status = 'solved' then upp.problem_id end), 0) as solved_count,
    coalesce(count(distinct s.id), 0) as total_submissions
  from public.profiles p
  left join public.user_problem_progress upp on upp.user_id = p.id
  left join public.submissions s on s.user_id = p.id
  where p.role != 'guest'
  group by p.id, p.username, coalesce(p.full_name, p.name, p.username, 'Giáo viên'), p.organization, p.show_organization, p.rating, p.rank_class, p.avatar_url, p.role
  order by p.rating desc, solved_count desc
  limit 100;
$$;

grant execute on function public.get_organization_leaderboard() to anon, authenticated;

-- RPC 3: Recent Public Submissions Stream
create or replace function public.get_recent_public_submissions(limit_count int default 20)
returns table (
  id uuid,
  problem_id text,
  problem_title text,
  username text,
  language text,
  verdict text,
  score integer,
  time_ms integer,
  memory_kb integer,
  created_at timestamp with time zone
)
language sql
security definer
set search_path = public
as $$
  select
    s.id,
    s.problem_id,
    coalesce(p.title, s.problem_id) as problem_title,
    coalesce(prof.username, 'Thí sinh') as username,
    s.language,
    s.verdict,
    s.score,
    s.time_ms,
    s.memory_kb,
    s.created_at
  from public.submissions s
  left join public.problems p on p.id = s.problem_id
  left join public.profiles prof on prof.id = s.user_id
  order by s.created_at desc
  limit limit_count;
$$;

grant execute on function public.get_recent_public_submissions(int) to anon, authenticated;

-- RPC 4: Contest Scoreboard
create or replace function public.get_contest_scoreboard(p_contest_slug text)
returns table (
  user_id uuid,
  username text,
  organization text,
  total_score bigint,
  total_penalty bigint,
  solved_problems jsonb
)
language sql
security definer
set search_path = public
as $$
  select
    p.id as user_id,
    p.username,
    coalesce(p.organization, 'Tự do') as organization,
    coalesce(sum(s.score), 0) as total_score,
    coalesce(sum(s.time_ms), 0) as total_penalty,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'problem_id', s.problem_id,
          'verdict', s.verdict,
          'score', s.score,
          'time_ms', s.time_ms
        )
      ) filter (where s.id is not null),
      '[]'::jsonb
    ) as solved_problems
  from public.contests c
  join public.contest_registrations cr on cr.contest_id = c.id
  join public.profiles p on p.id = cr.user_id
  left join public.submissions s on s.user_id = p.id and s.created_at between c.start_time and c.end_time
  where c.slug = p_contest_slug
  group by p.id, p.username, p.organization
  order by total_score desc, total_penalty asc;
$$;

grant execute on function public.get_contest_scoreboard(text) to anon, authenticated;

-- RPC 5: Admin Safe User Listing
create or replace function public.admin_list_users_safe()
returns table (
  id uuid,
  username text,
  full_name text,
  role text,
  rating integer,
  rank_class text,
  avatar_url text,
  created_at timestamp with time zone
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Access denied: super_admin role required';
  end if;

  return query
  select
    p.id,
    p.username,
    coalesce(p.full_name, p.name, p.username, 'User') as full_name,
    p.role,
    p.rating,
    p.rank_class,
    p.avatar_url,
    p.created_at
  from public.profiles p
  order by p.created_at desc;
end;
$$;

grant execute on function public.admin_list_users_safe() to authenticated;

-- RPC 6: Admin Set User Role
create or replace function public.admin_set_user_role(target_user_id uuid, new_role text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_super_admin() then
    raise exception 'Access denied: super_admin role required';
  end if;

  if new_role not in ('student', 'educator', 'super_admin') then
    raise exception 'Invalid role: %', new_role;
  end if;

  update public.profiles
  set role = new_role, updated_at = now()
  where id = target_user_id;

  insert into public.audit_logs (event_type, user_id, metadata)
  values ('ROLE_CHANGED', auth.uid(), jsonb_build_object('target_user', target_user_id, 'new_role', new_role));

  return true;
end;
$$;

grant execute on function public.admin_set_user_role(uuid, text) to authenticated;

-- -------------------------------------------------------------------------
-- PART 5: INITIAL SEED DATA
-- -------------------------------------------------------------------------

-- 1. Insert Core Competitive Problems
insert into public.problems (
  id, title, title_en, difficulty, points, category, tags,
  time_limit_ms, memory_limit_kb, statement, input_format, output_format, constraints,
  samples, is_published, track
) values
(
  'icpc26_mn_c',
  'Cây Khung Cân Bằng (Balanced Spanning Tree)',
  'Balanced Spanning Tree',
  'Hard',
  100,
  'Đồ thị & Cây',
  array['Graph', 'Spanning Tree', 'ICPC', 'DSU'],
  2000,
  262144,
  'Cho một đơn đồ thị vô hướng liên thông gồm N đỉnh và M cạnh có trọng số...',
  'Dòng đầu tiên chứa hai số nguyên N và M...',
  'In ra một số nguyên duy nhất là độ chênh lệch nhỏ nhất...',
  '2 <= N <= 1000, N - 1 <= M <= 5000',
  '[{"input": "4 5\n1 2 3\n2 3 5\n3 4 8\n4 1 2\n1 3 6", "output": "3"}]'::jsonb,
  true,
  'competitive'
),
(
  'torch',
  'Rước Đuốc Olympic (Torch Relay)',
  'Torch Relay',
  'Medium',
  100,
  'Quy hoạch động',
  array['DP', 'Olympic', 'Binary Search'],
  1000,
  262144,
  'Ban tổ chức Olympic chuẩn bị tổ chức lễ rước đuốc qua N địa điểm...',
  'Dòng đầu chứa N và K...',
  'In ra thời gian tối thiểu...',
  '1 <= N <= 100000, 1 <= K <= N',
  '[{"input": "5 2\n1 3 6 8 10", "output": "3"}]'::jsonb,
  true,
  'competitive'
),
(
  'voi26_pine',
  'Rừng Thông Đà Lạt (Pine Forest)',
  'Pine Forest',
  'Hard',
  100,
  'Hình học & Cây',
  array['Geometry', 'Convex Hull', 'VOI'],
  2000,
  262144,
  'Thành phố Đà Lạt nổi tiếng với những cánh rừng thông xanh ngát...',
  'Dòng đầu chứa số nguyên N...',
  'In ra diện tích đa giác lồi nhỏ nhất...',
  '3 <= N <= 50000',
  '[{"input": "4\n0 0\n0 4\n4 0\n4 4", "output": "16.0"}]'::jsonb,
  true,
  'competitive'
),
(
  'olp_ct25_lgsqr',
  'Hình Vuông Lớn Nhất (Largest Square)',
  'Largest Square',
  'Medium',
  100,
  'Quy hoạch động',
  array['DP', 'Matrix', 'Olympic'],
  1000,
  262144,
  'Cho một ma trận nhị phân kích thước M x N chỉ gồm các ký tự 0 và 1...',
  'Dòng đầu chứa hai số M và N...',
  'In ra diện tích hình vuông lớn nhất chỉ gồm toàn số 1...',
  '1 <= M, N <= 1000',
  '[{"input": "4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0", "output": "4"}]'::jsonb,
  true,
  'competitive'
)
on conflict (id) do update set
  title = excluded.title,
  difficulty = excluded.difficulty,
  samples = excluded.samples;

-- 2. Insert Core Contests
insert into public.contests (
  slug, title, description, start_time, end_time, duration_minutes,
  status, is_rated, tags, registration_count
) values
(
  'icpc_national_2026',
  'Kỳ thi Lập trình Sinh viên Quốc tế ICPC Quốc gia 2026',
  'Vòng thi chính thức lựa chọn các đội tuyển xuất sắc nhất tham dự Vòng khu vực Châu Á.',
  now() - interval '1 hour',
  now() + interval '4 hours',
  300,
  'RUNNING',
  true,
  array['ICPC', 'National', 'ACM'],
  142
),
(
  'ahcup26_final',
  'AHtest Championship Cup 2026 - Chung Kết',
  'Đấu trường chung kết toàn quốc hội tụ top 50 coder xuất sắc nhất bảng xếp hạng.',
  now() + interval '2 days',
  now() + interval '2 days 3 hours',
  180,
  'UPCOMING',
  true,
  array['Official', 'Championship', 'Rated'],
  38
),
(
  'vnoi_cup_2026',
  'VNOI Practice Arena Round 42',
  'Kỳ thi luyện tập mở định kỳ theo thể thức OI/ICPC cho cộng đồng.',
  now() - interval '3 days',
  now() - interval '3 days' + interval '2 hours',
  120,
  'ENDED',
  false,
  array['Practice', 'OI'],
  89
)
on conflict (slug) do update set
  title = excluded.title,
  status = excluded.status;

-- 3. Insert Official Problem Collections
insert into public.problem_collections (
  id, title, description, icon, color, category, problem_ids, is_official
) values
(
  'col_national_olympiad',
  'Kho Đề Thi Học Sinh Giỏi & Olympic Quốc Gia',
  'Tổng hợp đề thi chính thức VOI, ICPC và Olympic Tin học Sinh viên các năm.',
  'Trophy',
  'amber',
  'Olympic',
  array['icpc26_mn_c', 'torch', 'voi26_pine', 'olp_ct25_lgsqr'],
  true
),
(
  'col_prf192_master',
  'PRF192 - C Programming Master Curriculum',
  '115 bài tập nhập môn lập trình C chuẩn Đại học FPT với đầy đủ testcase mẫu và barem chấm điểm.',
  'Code',
  'rose',
  'Foundation',
  array['src_01', 'src_08', 'src_18', 'src_22', 'src_80'],
  true
),
(
  'col_data_structures',
  'Cấu Trúc Dữ Liệu & Giải Thuật Thực Chiến',
  'Bộ bài tập nâng cao về Quy hoạch động, Đồ thị, Cây phân đoạn và DSU.',
  'Layers',
  'indigo',
  'Algorithms',
  array['icpc26_mn_c', 'torch', 'voi26_pine'],
  true
)
on conflict (id) do update set
  title = excluded.title,
  description = excluded.description;

-- 4. Map Problems to Contests
insert into public.contest_problems (contest_id, problem_id, letter, points, order_index)
select c.id, 'icpc26_mn_c', 'A', 100, 1
from public.contests c where c.slug = 'icpc_national_2026'
on conflict do nothing;

insert into public.contest_problems (contest_id, problem_id, letter, points, order_index)
select c.id, 'torch', 'B', 100, 2
from public.contests c where c.slug = 'icpc_national_2026'
on conflict do nothing;

insert into public.contest_problems (contest_id, problem_id, letter, points, order_index)
select c.id, 'voi26_pine', 'C', 100, 3
from public.contests c where c.slug = 'icpc_national_2026'
on conflict do nothing;

insert into public.contest_problems (contest_id, problem_id, letter, points, order_index)
select c.id, 'olp_ct25_lgsqr', 'D', 100, 4
from public.contests c where c.slug = 'icpc_national_2026'
on conflict do nothing;
