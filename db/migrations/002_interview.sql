create table if not exists interview_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  question_slug text not null,
  mode text not null check (mode in ('learn','rapid','scenario','mock','star')),
  answer_text text,
  hit_points text[] default '{}',
  score int not null check (score between 0 and 20),
  ai_graded boolean not null default false,
  box int not null default 1,
  next_due date,
  created_at timestamptz not null default now()
);

create table if not exists interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mode text not null,
  tier text not null,
  total_score int not null,
  max_score int not null,
  scorecard jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists star_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  situation text,
  task text,
  action text,
  result text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists interview_usage (
  user_id uuid references profiles(id) on delete cascade,
  day date not null,
  ai_count int not null default 0,
  mock_count int not null default 0,
  primary key (user_id, day)
);

alter table interview_attempts enable row level security;
alter table interview_sessions enable row level security;
alter table star_stories enable row level security;
alter table interview_usage enable row level security;

drop policy if exists "ia select" on interview_attempts;
create policy "ia select" on interview_attempts for select using (user_id = auth.uid() or is_admin());
drop policy if exists "ia insert" on interview_attempts;
create policy "ia insert" on interview_attempts for insert with check (user_id = auth.uid());
drop policy if exists "ia update" on interview_attempts;
create policy "ia update" on interview_attempts for update using (user_id = auth.uid());

drop policy if exists "is select" on interview_sessions;
create policy "is select" on interview_sessions for select using (user_id = auth.uid() or is_admin());
drop policy if exists "is insert" on interview_sessions;
create policy "is insert" on interview_sessions for insert with check (user_id = auth.uid());

drop policy if exists "ss select" on star_stories;
create policy "ss select" on star_stories for select using (user_id = auth.uid() or is_admin());
drop policy if exists "ss insert" on star_stories;
create policy "ss insert" on star_stories for insert with check (user_id = auth.uid());
drop policy if exists "ss update" on star_stories;
create policy "ss update" on star_stories for update using (user_id = auth.uid());
drop policy if exists "ss delete" on star_stories;
create policy "ss delete" on star_stories for delete using (user_id = auth.uid());

drop policy if exists "iu select" on interview_usage;
create policy "iu select" on interview_usage for select using (user_id = auth.uid() or is_admin());
drop policy if exists "iu insert" on interview_usage;
create policy "iu insert" on interview_usage for insert with check (user_id = auth.uid());
drop policy if exists "iu update" on interview_usage;
create policy "iu update" on interview_usage for update using (user_id = auth.uid());

