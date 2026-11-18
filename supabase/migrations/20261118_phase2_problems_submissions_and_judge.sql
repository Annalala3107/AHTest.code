-- =========================================================================
-- AHtest.code Phase 2 Backend Schema: Problems, Hidden Testcases & Submissions
-- Purpose:
-- 1. Move problem definitions & testcases to Postgres with Zero Hidden Test Leak
-- 2. Persist real user submissions across all languages (C17, C++20, Java, Python, SQL)
-- 3. Restrict hidden testcase access strictly to super_admin / educator & server workers
-- =========================================================================

-- 1. Public Problems Table
create table if not exists public.problems (
  id text primary key,
  title text not null,
  title_en text,
  difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
  points integer not null default 100,
  category text not null default 'General',
  tags text[] not null default '{}',
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
  author_id uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

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

-- 2. Problem Testcases Table (Zero Hidden Testcase Leak)
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

-- 3. Multi-Language Submissions Table
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
