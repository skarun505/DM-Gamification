create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null default 'Learner',
  role text not null default 'learner' check (role in ('learner','admin')),
  avatar text not null default 'rocket',
  xp int not null default 0,
  coins int not null default 0,
  streak int not null default 0,
  best_streak int not null default 0,
  streak_freezes int not null default 0,
  last_active_date date,
  created_at timestamptz not null default now()
);

create table if not exists lesson_progress (
  user_id uuid references profiles(id) on delete cascade,
  lesson_slug text,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  best_quiz_score int not null default 0,
  completed_at timestamptz,
  primary key (user_id, lesson_slug)
);

create table if not exists quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lesson_slug text not null,
  score int not null,
  total int not null,
  answers jsonb,
  created_at timestamptz not null default now()
);

create table if not exists sim_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  task_slug text not null,
  inputs jsonb not null,
  results jsonb not null,
  passed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists boss_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  boss_slug text not null,
  score int not null,
  passed boolean not null,
  created_at timestamptz not null default now()
);

create table if not exists xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  source text not null,
  ref text,
  xp int not null default 0,
  coins int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists badges (
  slug text primary key,
  name text not null,
  description text not null,
  icon text not null
);

create table if not exists user_badges (
  user_id uuid references profiles(id) on delete cascade,
  badge_slug text references badges(slug),
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_slug)
);

create table if not exists mentor_notes (
  id uuid primary key default gen_random_uuid(),
  to_user uuid references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  kind text not null default 'note' check (kind in ('note','challenge','cheer')),
  xp_reward int not null default 0,
  read boolean not null default false,
  claimed boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists tutor_usage (
  user_id uuid references profiles(id) on delete cascade,
  day date not null,
  count int not null default 0,
  primary key (user_id, day)
);

-- helper
create or replace function is_admin() returns boolean
language sql security definer stable as
$$ select exists(select 1 from profiles where id = auth.uid() and role = 'admin') $$;

-- auto-create profile; FIRST signup becomes admin (mentor), later signups are learners
create or replace function handle_new_user() returns trigger
language plpgsql security definer as $$
begin
  insert into profiles (id, display_name, role)
  values (new.id,
          coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email,'@',1)),
          case when (select count(*) from profiles) = 0 then 'admin' else 'learner' end);
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- RLS
alter table profiles enable row level security;
alter table lesson_progress enable row level security;
alter table quiz_attempts enable row level security;
alter table sim_runs enable row level security;
alter table boss_attempts enable row level security;
alter table xp_events enable row level security;
alter table user_badges enable row level security;
alter table mentor_notes enable row level security;
alter table tutor_usage enable row level security;
alter table badges enable row level security;

-- Policies
drop policy if exists "badges readable" on badges;
create policy "badges readable" on badges for select using (true);

drop policy if exists "own or admin read" on profiles;
create policy "own or admin read" on profiles for select using (id = auth.uid() or is_admin());

drop policy if exists "own update" on profiles;
create policy "own update" on profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "lp select" on lesson_progress;
create policy "lp select" on lesson_progress for select using (user_id = auth.uid() or is_admin());
drop policy if exists "lp insert" on lesson_progress;
create policy "lp insert" on lesson_progress for insert with check (user_id = auth.uid());
drop policy if exists "lp update" on lesson_progress;
create policy "lp update" on lesson_progress for update using (user_id = auth.uid());

drop policy if exists "qa select" on quiz_attempts;
create policy "qa select" on quiz_attempts for select using (user_id = auth.uid() or is_admin());
drop policy if exists "qa insert" on quiz_attempts;
create policy "qa insert" on quiz_attempts for insert with check (user_id = auth.uid());

drop policy if exists "sr select" on sim_runs;
create policy "sr select" on sim_runs for select using (user_id = auth.uid() or is_admin());
drop policy if exists "sr insert" on sim_runs;
create policy "sr insert" on sim_runs for insert with check (user_id = auth.uid());

drop policy if exists "ba select" on boss_attempts;
create policy "ba select" on boss_attempts for select using (user_id = auth.uid() or is_admin());
drop policy if exists "ba insert" on boss_attempts;
create policy "ba insert" on boss_attempts for insert with check (user_id = auth.uid());

drop policy if exists "xe select" on xp_events;
create policy "xe select" on xp_events for select using (user_id = auth.uid() or is_admin());
drop policy if exists "xe insert" on xp_events;
create policy "xe insert" on xp_events for insert with check (user_id = auth.uid());

drop policy if exists "ub select" on user_badges;
create policy "ub select" on user_badges for select using (user_id = auth.uid() or is_admin());
drop policy if exists "ub insert" on user_badges;
create policy "ub insert" on user_badges for insert with check (user_id = auth.uid());

drop policy if exists "mn select" on mentor_notes;
create policy "mn select" on mentor_notes for select using (to_user = auth.uid() or is_admin());
drop policy if exists "mn insert" on mentor_notes;
create policy "mn insert" on mentor_notes for insert with check (is_admin());
drop policy if exists "mn update" on mentor_notes;
create policy "mn update" on mentor_notes for update using (to_user = auth.uid() or is_admin());

drop policy if exists "tu select" on tutor_usage;
create policy "tu select" on tutor_usage for select using (user_id = auth.uid() or is_admin());
drop policy if exists "tu insert" on tutor_usage;
create policy "tu insert" on tutor_usage for insert with check (user_id = auth.uid());
drop policy if exists "tu update" on tutor_usage;
create policy "tu update" on tutor_usage for update using (user_id = auth.uid());

-- Award XP RPC
create or replace function award_xp(p_source text, p_ref text, p_xp int, p_coins int)
returns profiles language plpgsql security definer as $$
declare
  me profiles; today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  select * into me from profiles where id = auth.uid() for update;
  if me.id is null then
    raise exception 'Profile not found';
  end if;

  if me.last_active_date = today then null;
  elsif me.last_active_date = today - 1 then me.streak := me.streak + 1;
  elsif me.last_active_date = today - 2 and me.streak_freezes > 0 then
    me.streak := me.streak + 1; me.streak_freezes := me.streak_freezes - 1;
  else me.streak := 1; end if;

  update profiles set
    xp = xp + p_xp,
    coins = coins + p_coins,
    streak = me.streak,
    best_streak = greatest(best_streak, me.streak),
    streak_freezes = me.streak_freezes,
    last_active_date = today
  where id = auth.uid() returning * into me;

  insert into xp_events(user_id, source, ref, xp, coins) values (auth.uid(), p_source, p_ref, p_xp, p_coins);
  return me;
end $$;
