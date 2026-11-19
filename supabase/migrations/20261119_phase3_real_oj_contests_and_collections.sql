-- =========================================================================
-- AHtest.code Phase 3 Backend Schema: Contests, Collections, Progress & RPCs
-- Purpose:
-- 1. Real Contest Arena, Problem Collections, Progress tracking
-- 2. Safe SECURITY DEFINER RPCs for Leaderboard, Submissions stream & RBAC
-- 3. Row-level security for all tables
-- =========================================================================

-- 0. Ensure profiles table has full_name if existing
alter table if exists public.profiles
  add column if not exists full_name text;

-- 1. Upgrade problems table with tracks and counters
alter table if exists public.problems
  add column if not exists track text not null default 'competitive' check (track in ('competitive', 'lab_practice')),
  add column if not exists accepted_count integer not null default 0,
  add column if not exists submission_count integer not null default 0;

-- 2. Problem Collections Table
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

-- 3. Contests Table
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

-- 4. Contest Problems Table
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

-- 5. Contest Registrations Table
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

-- 6. User Problem Progress Table
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

-- 7. Problem Comments & Discussions Table
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

-- 8. Audit Logs Table (Admin Only)
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

-- =========================================================================
-- 9. SAFE SECURITY DEFINER RPCs
-- =========================================================================

-- RPC 1: Organization Leaderboard (Public aggregated view without PII)
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

-- RPC 2: Recent Public Submissions Stream
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

-- RPC 3: Contest Scoreboard
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

-- RPC 4: Admin Safe User Listing
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

-- RPC 5: Admin Set User Role
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
