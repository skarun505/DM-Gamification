# ADQUEST — Antigravity Master Build Guide

> **Drop this file into an empty Antigravity workspace and say:**
> *"Read ANTIGRAVITY_GUIDE.md fully. Build the entire project end to end. Only stop to ask me for the credentials listed in Section 2. Do everything else yourself."*

---

## 0. MISSION

Build **AdQuest**: a free, mobile-first, gamified web app that teaches **performance marketing** to a complete beginner, from zero → intermediate → advanced. It replaces a human teacher. Launch world is **Meta Ads**. **Google Ads** is added later (visible as a locked world with "Coming soon").

The learner is a smart, motivated beginner with **no marketing background**. Everything must feel like Duolingo + a game, not a textbook.

**Total budget: ₹0.** Use only free tiers. Never add a paid service.

---

## 1. AGENT OPERATING RULES (read carefully)

1. **Be fully autonomous.** Plan, scaffold, install, write code, write all lesson content, run, test in the browser, fix bugs, and deploy without asking for approval.
2. **Only ask the human for the items in Section 2.** Nothing else. No design questions, no naming questions, no "should I proceed?". When a choice is unspecified, pick the simplest option and move on.
3. Ask for credentials **once, in a single message**, as soon as scaffolding is done. Then continue working on everything that does not need them (UI, content, simulator) while waiting.
4. Create a **Task List artifact** from Section 12 phases and tick items off as you go.
5. After each phase: run `npm run lint` and `npm run build`. Fix all errors before moving on.
6. Test every phase in the built-in browser at **mobile width (390px)** and desktop. Capture a screenshot artifact per phase.
7. Write **real content**, never lorem ipsum or placeholders, for every lesson in the Meta world (Section 9).
8. Use TypeScript strict mode. Keep components small. Add short comments only where logic is non-obvious.
9. Never commit secrets. Secrets live in `.env.local` (gitignored). Provide `.env.example`.
10. If a free-tier limit or API behaves differently than this guide says, check the current official docs and adapt. Keep the product behavior the same.
11. At the end, produce the **Final Handoff** (Section 14).

---

## 2. CREDENTIALS THE AGENT MAY ASK FOR (the ONLY allowed questions)

Ask in ONE message, exactly like this, then wait:

| # | Item | Where the human gets it | Goes into |
|---|---|---|---|
| 1 | **Supabase Project URL** | Supabase dashboard → Project Settings → API | `NEXT_PUBLIC_SUPABASE_URL` |
| 2 | **Supabase anon (public) key** | Same page | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| 3 | **Supabase database connection string** (URI, with password filled in) | Dashboard → Connect → Connection string | `DATABASE_URL` (used ONLY by the migration script, never exposed to the browser) |
| 4 | **Gemini API key** (free) | Google AI Studio → Get API key | `GEMINI_API_KEY` |
| 5 | **GitHub + Vercel login** (only at deploy time) | Browser sign-in prompt | deployment |

After receiving 1-3, the agent runs the migrations itself using a Node script with the `pg` package (do not ask the human to paste SQL). After receiving 4, wire the AI tutor. After 5, deploy.

If the human has not yet provided a credential, **build with a mock fallback** (local JSON store / canned tutor replies) so work never blocks, and switch to the real service when the key arrives.

---

## 3. PRODUCT OVERVIEW

**Name:** AdQuest  **Tagline:** "Learn ads by playing."
**Mascot:** *Pixie*, a friendly rocket-fox who gives tips, celebrates wins, and never shames mistakes.

### Core loop
`Learn (5 min) → Quick quiz → Simulator task → Boss battle → Unlock next level`

### Users
- **Learner** (main user): learns, earns XP, coins, streaks, badges.
- **Mentor/Admin** (the person who commissioned the app, the first account created): sees the learner's progress, sends **Mentor Notes** (cheers, bonus challenges), and can copy a weekly progress summary to WhatsApp.

### Principles
- Beginner-friendly: short sentences, everyday analogies (shop, tea stall, auto-rickshaw, cricket), explain every term the first time it appears.
- Each lesson ≤ 5 minutes. Each screen = one idea.
- Never block on a wrong answer: show a hint, explain why, let her retry. Wrong answers still earn partial XP.
- Always celebrate: confetti, Pixie messages, sound-free by default (optional toggle).
- India-first examples (₹, local businesses, Indian festivals), with a few global ones.

---

## 4. TECH STACK (all free)

| Layer | Choice |
|---|---|
| Framework | **Next.js (latest stable, App Router) + TypeScript** |
| Styling | **Tailwind CSS**, `lucide-react` icons, `framer-motion` animations, `canvas-confetti` |
| Fonts | `next/font` with **Nunito** (body) and **Fredoka** (headings) |
| Auth + DB | **Supabase** (email + password auth, Postgres, RLS) via `@supabase/supabase-js` and `@supabase/ssr` |
| AI tutor | **Gemini API free tier**, called server-side from a Next.js route handler |
| Charts | `recharts` |
| Content | JSON/Markdown files in `/content` (no CMS) |
| Validation | `zod` for content and API validation |
| Hosting | **Vercel free (Hobby)**; installable **PWA** (manifest + icons) |
| Tests | `vitest` for the simulator and gamification math; Playwright-style browser checks via Antigravity browser |

No backend server of our own. No paid APIs. No analytics SDKs.

---

## 5. PROJECT STRUCTURE

```
adquest/
├─ app/
│  ├─ (auth)/login/page.tsx, signup/page.tsx
│  ├─ (app)/
│  │  ├─ layout.tsx              # bottom nav on mobile, sidebar on desktop
│  │  ├─ home/page.tsx           # dashboard: streak, XP, daily challenge, continue
│  │  ├─ map/page.tsx            # world map with levels
│  │  ├─ world/[world]/page.tsx  # tiers + lessons list
│  │  ├─ lesson/[slug]/page.tsx  # lesson player
│  │  ├─ sim/[slug]/page.tsx     # simulator task
│  │  ├─ boss/[slug]/page.tsx    # boss battle
│  │  ├─ daily/page.tsx          # daily challenge
│  │  ├─ tutor/page.tsx          # ask Pixie (AI tutor)
│  │  ├─ interview/page.tsx      # Interview Dojo hub (Section 15)
│  │  ├─ interview/learn/page.tsx, rapid/page.tsx, scenario/[slug]/page.tsx, mock/page.tsx, star/page.tsx, checklist/page.tsx
│  │  ├─ glossary/page.tsx       # searchable terms (unlocks as she learns)
│  │  ├─ profile/page.tsx        # level, badges, stats, avatar
│  │  ├─ notes/page.tsx          # mentor notes inbox
│  │  └─ admin/page.tsx          # mentor-only: progress + send note + WhatsApp summary
│  ├─ api/tutor/route.ts         # Gemini proxy with daily cap + fallback
│  ├─ api/interview/route.ts     # Gemini answer evaluator + mock interviewer (cap + fallback)
│  └─ manifest.ts
├─ components/                   # ui/, lesson/, sim/, game/ (XPBar, StreakFlame, BadgeToast...)
├─ lib/
│  ├─ supabase/ (client.ts, server.ts)
│  ├─ game/ (xp.ts, levels.ts, streak.ts, badges.ts)
│  ├─ sim/ (engine.ts, benchmarks.ts, scenarios.ts)
│  ├─ content/ (loader.ts, schema.ts)
│  └─ tutor/ (prompt.ts, fallback.ts)
├─ content/
│  ├─ worlds.json
│  ├─ meta/rookie/*.json  meta/operator/*.json  meta/strategist/*.json
│  ├─ sim/*.json   boss/*.json   glossary.json   daily-bank.json   hints.json
│  ├─ interview/questions-*.json  scenarios/*.json  behavioral.json  rapid-*.json  frameworks.json  checklist.json
│  └─ google/outline.json        # locked, titles only
├─ db/migrations/001_init.sql  scripts/migrate.mjs  scripts/seed-badges.mjs
├─ public/ (icons, pixie svgs)
├─ .env.example   README.md
```

---

## 6. DATABASE (Supabase) — `db/migrations/001_init.sql`

The agent creates this file and runs it via `scripts/migrate.mjs` using `DATABASE_URL`. Lesson/quiz content is NOT in the DB; the DB stores **progress only**, keyed by content slug.

```sql
create extension if not exists pgcrypto;

create table profiles (
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

create table lesson_progress (
  user_id uuid references profiles(id) on delete cascade,
  lesson_slug text,
  status text not null default 'in_progress' check (status in ('in_progress','completed')),
  best_quiz_score int not null default 0,
  completed_at timestamptz,
  primary key (user_id, lesson_slug)
);

create table quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  lesson_slug text not null, score int not null, total int not null,
  answers jsonb, created_at timestamptz not null default now()
);

create table sim_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  task_slug text not null, inputs jsonb not null, results jsonb not null,
  passed boolean not null default false, created_at timestamptz not null default now()
);

create table boss_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  boss_slug text not null, score int not null, passed boolean not null,
  created_at timestamptz not null default now()
);

create table xp_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  source text not null, ref text, xp int not null default 0, coins int not null default 0,
  created_at timestamptz not null default now()
);

create table badges (slug text primary key, name text not null, description text not null, icon text not null);
create table user_badges (
  user_id uuid references profiles(id) on delete cascade,
  badge_slug text references badges(slug),
  earned_at timestamptz not null default now(),
  primary key (user_id, badge_slug)
);

create table mentor_notes (
  id uuid primary key default gen_random_uuid(),
  to_user uuid references profiles(id) on delete cascade,
  title text not null, body text not null,
  kind text not null default 'note' check (kind in ('note','challenge','cheer')),
  xp_reward int not null default 0,
  read boolean not null default false,
  claimed boolean not null default false,
  created_at timestamptz not null default now()
);

create table tutor_usage (
  user_id uuid references profiles(id) on delete cascade,
  day date not null, count int not null default 0,
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

create policy "badges readable" on badges for select using (true);
create policy "own or admin read" on profiles for select using (id = auth.uid() or is_admin());
create policy "own update" on profiles for update using (id = auth.uid()) with check (id = auth.uid() and role = (select role from profiles where id = auth.uid()));

-- repeat for each user-owned table (lesson_progress, quiz_attempts, sim_runs, boss_attempts, xp_events, user_badges, tutor_usage):
-- select: user_id = auth.uid() or is_admin()
-- insert/update: user_id = auth.uid()
-- mentor_notes: select/update where to_user = auth.uid() or is_admin(); insert only if is_admin()

-- Award XP + coins + streak in one trusted call (called via supabase.rpc)
create or replace function award_xp(p_source text, p_ref text, p_xp int, p_coins int)
returns profiles language plpgsql security definer as $$
declare
  me profiles; today date := (now() at time zone 'Asia/Kolkata')::date;
begin
  select * into me from profiles where id = auth.uid() for update;
  if me.last_active_date = today then null;
  elsif me.last_active_date = today - 1 then me.streak := me.streak + 1;
  elsif me.last_active_date = today - 2 and me.streak_freezes > 0 then
    me.streak := me.streak + 1; me.streak_freezes := me.streak_freezes - 1;
  else me.streak := 1; end if;
  update profiles set xp = xp + p_xp, coins = coins + p_coins,
    streak = me.streak, best_streak = greatest(best_streak, me.streak),
    streak_freezes = me.streak_freezes, last_active_date = today
  where id = auth.uid() returning * into me;
  insert into xp_events(user_id, source, ref, xp, coins) values (auth.uid(), p_source, p_ref, p_xp, p_coins);
  return me;
end $$;
```

Seed the `badges` table from `scripts/seed-badges.mjs` (list in Section 7). Note for the human at handoff: after both accounts exist, turn **off "Allow new signups"** in Supabase Auth settings so the app stays private.

---

## 7. GAMIFICATION RULES (implement in `lib/game/*`, unit-test with vitest)

**XP awards**
| Action | XP | Coins |
|---|---|---|
| Finish a lesson | 20 | 4 |
| Each correct quiz answer (first try) | 5 | 1 |
| Perfect quiz (all correct) | +15 bonus | +3 |
| Pass a simulator task | 50 | 10 |
| Win a boss battle | 150 | 30 |
| Daily challenge complete | 30 | 6 |
| Claim a mentor challenge | per note `xp_reward` | 0 |
| First activity of a new day | +5 | 0 |

Repeating an already-completed lesson gives **no XP** (to stop farming) but is always allowed.

**Levels:** `level = floor(sqrt(xp / 50)) + 1`
**Titles:** L1-2 Intern · L3-5 Executive · L6-9 Specialist · L10-14 Strategist · L15+ Head of Performance

**Streak:** counts days (Asia/Kolkata) with any XP event. Missing a day breaks it unless she has a **Streak Freeze** (buy in the Shop for 50 coins, max 2 stored).

**Shop (coins):** Streak Freeze (50) · Avatars (30 each: rocket, fox, owl, robot, panda, unicorn) · Pixie hint tokens (10): reveals a hint during boss battles.

**Hearts:** none. Never punish. Wrong answers cost nothing.

**Badges** (slug · name · rule)
`first-lesson` First Step · finish any lesson
`streak-3` On Fire · 3-day streak
`streak-7` Unstoppable · 7-day streak
`streak-30` Habit Hero · 30-day streak
`quiz-perfect-5` Sharp Mind · 5 perfect quizzes
`pixel-master` Pixel Master · finish the Pixel & Events lesson
`ctr-hunter` CTR Hunter · pass the creative-testing sim
`budget-boss` Budget Boss · pass any budget sim first try
`first-boss` Boss Slayer · win first boss
`rookie-grad` Rookie Graduate · finish Meta Rookie tier
`operator-grad` Operator Graduate · finish Meta Operator tier
`strategist-grad` Strategist Graduate · finish Meta Strategist tier
`night-owl` Night Owl · finish a lesson after 10pm IST
`curious-cat` Curious Cat · ask Pixie 10 questions
`mentor-fan` Mentor's Pick · claim 3 mentor challenges

Show a badge toast with confetti when earned. Profile page shows earned and locked badges.

---

## 8. CONTENT SYSTEM

### 8.1 Lesson JSON (validate with zod at build time; fail the build on invalid content)

```json
{
  "slug": "meta-rookie-01-what-is-performance-marketing",
  "world": "meta",
  "tier": "rookie",
  "order": 1,
  "title": "What is Performance Marketing?",
  "minutes": 4,
  "objectives": ["Explain performance marketing in one sentence", "Tell paid ads from organic posts"],
  "glossary": ["performance-marketing", "funnel", "conversion"],
  "blocks": [
    { "type": "pixie", "text": "Hi! Today we learn how businesses pay for results, not just views." },
    { "type": "text", "text": "Imagine a tea stall that pays a boy ₹5 every time he brings a new customer. That is performance marketing: you pay for a result you can count." },
    { "type": "analogy", "title": "Tea stall math", "text": "Spend ₹100, get 20 customers → each customer cost ₹5. In ads we call this cost per result." },
    { "type": "compare", "left": {"title": "Organic", "points": ["Free to post", "Slow, unpredictable"]}, "right": {"title": "Paid (performance)", "points": ["You pay", "Fast, measurable"]} },
    { "type": "steps", "title": "The funnel", "items": ["See the ad", "Click it", "Fill the form or buy", "Become a customer"] },
    { "type": "tip", "text": "Everything in this course is about making each step cheaper and better." },
    { "type": "warning", "text": "Views are not results. A million views with zero sales is a failure." }
  ],
  "quiz": [
    { "id": "q1", "q": "A shop pays ₹2,000 and gets 40 enquiries. What is the cost per enquiry?", "options": ["₹20", "₹50", "₹80", "₹200"], "answer": 1, "hint": "Divide money spent by results.", "explain": "2000 ÷ 40 = ₹50 per enquiry. This is called CPL (cost per lead)." }
  ],
  "recap": ["You pay for results you can count", "Funnel = steps from seeing an ad to buying"],
  "next": "meta-rookie-02-meta-ecosystem"
}
```

Block types: `pixie, text, analogy, example, compare, steps, tip, warning, image, table, interactive-sort`. Every lesson: **6-10 blocks, 4-6 quiz questions** (mix: multiple choice, true/false, "order the steps", "spot the mistake"). Quiz question schema also allows `type: "order"` (`items[]`, `answer: number[]`) and `type: "tf"`.

### 8.2 Content quality rules (apply to ALL lesson text the agent writes)
- Reading level: age 14. Max 18 words per sentence. One idea per block.
- Define every term at first use, then add it to `glossary.json`.
- Use ₹ amounts and Indian small-business examples (salon, sweet shop, coaching centre, boutique, gym, real estate, restaurant).
- Reflect **how Meta Ads Manager actually works today**. Before writing each Meta lesson, search current official Meta Business Help docs, and prefer current terminology (e.g., campaign objectives are the "outcome-based" set, Advantage+ features, Conversions API). Do not teach deprecated features as current.
- No fabricated stats. Use "typical range" language and label example numbers as examples.
- Each lesson ends with a 2-bullet `recap` and a `next` link.

### 8.3 Other content files
- `glossary.json`: `[{ "slug","term","simple","example" }]`, 80+ terms for the Meta world. A term unlocks when the first lesson that references it is completed.
- `daily-bank.json`: 150+ short questions tagged by lesson slug. Daily challenge = 3 random questions from lessons she has completed (fallback: from the first 3 lessons).
- `hints.json`: pre-written explanations and hints for every quiz, sim, and boss step, used when the AI tutor is unavailable.
- `worlds.json`: worlds → tiers → ordered lesson slugs → sim slugs → boss slug; includes unlock rules (a tier unlocks when the previous tier's boss is won; lessons within a tier unlock sequentially).

---

## 9. CURRICULUM (the agent writes every lesson fully)

### WORLD 1 — META ADS (build fully)

**Tier 1: Rookie** (10 lessons · 2 sims · Boss 1 "Launch Day")
1. What is performance marketing? (paid vs organic, funnel, cost per result)
2. Meet the Meta world (Facebook, Instagram, WhatsApp; Page, Business Portfolio/Business Manager, Ad Account, payment setup checklist)
3. Campaign → Ad Set → Ad (the 3-level structure, with a "build the house" analogy)
4. Campaign objectives (awareness, traffic, engagement, leads, sales, app; pick the right one for a scenario)
5. Metrics 101 (impressions, reach, frequency, CPM, CTR, CPC, CPL, CVR, ROAS; formula cards)
6. Audiences basics (location, age, gender, interests, broad targeting; audience size meter)
7. Budget basics (daily vs lifetime, how much to start with, what "learning" means)
8. Creative basics (image vs video vs carousel, hook in 3 seconds, copy, CTA, safe-zone for Reels/Stories)
9. How the ad auction works (bid × estimated action rate × ad quality; why a good ad is cheaper)
10. Launch checklist + reading your first results (what to look at on day 1, 3, 7; what NOT to touch)
- **Sim R1:** "Set up your first lead campaign for a salon with ₹500/day" 
- **Sim R2:** "Fix the audience: reach is tiny and CPM is huge"
- **Boss 1 Launch Day:** 6-step scenario: pick objective, pick audience, set budget, choose the best creative, read day-3 numbers, decide next move.

**Tier 2: Operator** (10 lessons · 3 sims · Boss 2 "Why are leads so expensive?")
1. Custom audiences (website visitors, customer lists, engagement)
2. Lookalike audiences (seed quality, 1% vs 5%)
3. The Meta Pixel and events (what it is, standard events, how to check it works)
4. Conversions API and Events Manager (why browser tracking leaks, event match quality, in simple terms)
5. Getting leads: Instant Forms vs website vs Click-to-WhatsApp (pros, cons, lead quality)
6. Bidding and cost controls (lowest cost, cost cap, bid cap in plain words)
7. The learning phase and optimization (≈50 results/week idea, what resets it, "learning limited")
8. Creative testing framework (one variable at a time, hooks vs angles vs formats, how long to test)
9. Retargeting funnels (warm audiences, windows, exclusions)
10. Reporting and breakdowns (age, placement, device; how to find the leak)
- **Sim O1:** Budget split across 3 ad sets · **Sim O2:** Creative A/B test · **Sim O3:** Tracking fix (pixel missing → sales show zero)
- **Boss 2:** Dashboard with rising CPL; she diagnoses over 6 steps (tracking, audience overlap, fatigue, offer, landing page, budget).

**Tier 3: Strategist** (8 lessons · 2 sims · Boss 3 "Scale or Kill")
1. Funnel architecture (top, middle, bottom; budget split; matching creative to stage)
2. Scaling safely (vertical vs horizontal, the 20% rule of thumb, when to duplicate)
3. Advantage+ campaigns (what automation does, what you still control)
4. Attribution and incrementality (attribution windows, why Meta and Google numbers differ, simple tests)
5. Creative strategy at scale (angles, UGC, hooks library, fatigue signals)
6. Account structure and audits (consolidation, naming conventions, 10-point audit checklist)
7. Client reporting and communication (what to report, weekly report template, expectation setting)
8. Policies, rejections, and account health (common disapprovals, appeals, protecting the account)
- **Sim S1:** "Scale from ₹1,000 to ₹5,000/day without breaking CPL" · **Sim S2:** "Audit this messy account" (find 8 of 10 planted problems)
- **Boss 3 Scale or Kill:** 4 campaigns with data; decide which to scale, fix, or kill, with reasons.

### WORLD 2 — GOOGLE ADS (locked, titles only in `content/google/outline.json`)
Search basics · Keywords and match types · Ad copy and Quality Score · Performance Max · YouTube ads · GA4 and Tag Manager basics. Show on the map as a locked island with "Coming soon".

### Later worlds (map shows as fog): LinkedIn · Snapchat · CRM & automation.

---

## 10. SIMULATOR SPEC (`lib/sim`) — pure TypeScript, deterministic with a seeded RNG

**Purpose:** a simplified, safe Ads Manager. She sets choices; the engine returns realistic-looking fake metrics; the task passes if outcomes meet criteria. Unit-test the engine.

**Inputs:** `objective` (awareness|traffic|leads|sales), `dailyBudget` (₹), `days` (1-14), `audience` ({ size: narrow<100k | balanced 100k-2M | broad>2M, type: interests|lookalike|retargeting|broad }), `creative` (pick 1 of 3 options with a hidden quality 0.6-1.6), `placements` (auto|manual), `pixelInstalled` (bool), `offerStrength` (0.7-1.3 from scenario), `landingQuality` (0.6-1.3 from scenario).

**Formulas (per day, then summed; apply ±8% seeded noise):**
```
baseCPM       = scenario.baseCPM                       // e.g. ₹120-250 by industry
audienceCPM   = narrow 1.5 | balanced 1.0 | broad 0.85
CPM           = baseCPM * audienceCPM * (placements=='auto' ? 0.92 : 1.0)
impressions   = dailyBudget / CPM * 1000
frequency     = min(8, 1 + (impressions / reachPool) * days^0.5)   // reachPool from audience size
CTR           = scenario.baseCTR * creative.quality * (frequency>3 ? 0.85^(frequency-3) : 1)
clicks        = impressions * CTR
CVR           = scenario.baseCVR * landingQuality * offerStrength
conversions   = (objective in [leads,sales] && pixelInstalled) ? clicks * CVR : (objective in [leads,sales] ? 0 : clicks*CVR*0.3)
learning      = conversions_per_week >= 50 ? 'Active' : 'Learning limited'
if learning == 'Learning limited': CPM *= 1.12 and conversions *= 0.9
CPL/CPA       = spend / conversions ; ROAS = revenue / spend (sales: revenue = conversions * scenario.aov)
```
**UI:** left panel = form (big touch controls with tooltips from Pixie), right panel = results cards + a recharts line for daily spend/results + Pixie commentary ("Your frequency is 4.2, people are seeing your ad too often!"). A **Run for N days** button animates the numbers counting up.

**Scenario file `content/sim/*.json`:**
```json
{ "slug":"sim-rookie-01-salon-leads", "title":"Salon lead campaign", "brief":"A salon in Bengaluru wants bookings. Budget ₹500/day for 7 days.",
  "fixed": {"baseCPM":140,"baseCTR":0.012,"baseCVR":0.09,"offerStrength":1.0,"landingQuality":1.0,"pixelInstalled":true},
  "editable": ["objective","dailyBudget","audience","creative","placements"],
  "creativeOptions":[{"id":"a","label":"Stock photo + long text","quality":0.7},{"id":"b","label":"Before/after video with offer","quality":1.4},{"id":"c","label":"Logo only","quality":0.6}],
  "pass": {"all":[{"metric":"CPL","op":"<=","value":120},{"metric":"conversions","op":">=","value":25}]},
  "hintIds":["h-sim-r1-1","h-sim-r1-2"], "xp":50 }
```
Allow unlimited retries; the best run counts. Show "Why this worked / failed" explanation after every run.

**Boss battles** `content/boss/*.json`: ordered steps; each step shows a data table or dashboard and a multiple-choice decision with an explanation. Score ≥ 70% wins. Retry freely; hint tokens (coins) reveal a hint.

---

## 11. AI TUTOR (Pixie) + MENTOR FEATURES

### 11.1 Tutor (`app/api/tutor/route.ts`)
- Server-only. Reads `GEMINI_API_KEY` and `GEMINI_MODEL` (default to the current free-tier fast model; **look up the current model name in Google's docs**, don't hardcode from memory).
- Requires an authenticated user. Cap **30 messages/user/day** via `tutor_usage`. On cap, rate-limit, or error → return a pre-written hint from `hints.json` plus a friendly note. The app must work fully with the tutor offline.
- Accepts `{ message, context: { lessonSlug?, simSlug?, bossSlug?, step? } }`. Include only the current lesson's text as context (keep tokens small).
- **System prompt (store in `lib/tutor/prompt.ts`):**
  > You are Pixie, a warm, patient performance-marketing tutor for an absolute beginner. Use simple English, short sentences, and everyday Indian examples. Explain one idea at a time. During quizzes, simulator tasks, and boss battles, give hints and ask guiding questions; never reveal the final answer unless the learner has tried twice. If asked something outside performance marketing or advertising, gently steer back. If you are unsure about a platform feature, say so and suggest checking the official Meta Business Help Center. Keep replies under 120 words unless asked for more. Never shame mistakes.
- UI: chat page and a floating "Ask Pixie" button inside lessons, sims, and bosses that pre-fills context. Suggested starter questions ("Explain CPM like I'm 12").

### 11.2 Mentor notes and admin
- `/admin` (admin role only; hide for learners): learner stats (XP, level, streak, lessons done, quiz average, weak topics = lessons with lowest best score, last active), 14-day activity chart, list of recent XP events.
- **Send Mentor Note:** title, message, type (note / cheer / challenge), optional XP reward. Learner sees a badge dot on the nav, opens `/notes`, and can **Claim** challenge XP once.
- **Weekly summary → WhatsApp:** button that builds a text summary of the last 7 days and opens `https://wa.me/?text=<encoded>` so the mentor can send it with one tap. No paid API.
- Admin can also use the whole app as a learner (progress is tracked normally).

---

## 12. UI / UX SPEC

- **Look:** playful but clean. Rounded-2xl cards, soft shadows, generous spacing. Palette: indigo `#4F46E5` primary, emerald `#10B981` success, amber `#F59E0B` XP/coins, rose `#F43F5E` streak flame, warm off-white background `#FAF8F5`, dark mode supported via `prefers-color-scheme`.
- **Navigation:** mobile bottom bar (Home · Map · Interview · Ask Pixie · Profile), with Notes as a bell icon in the top header; desktop left sidebar with the same items.
- **Home:** greeting, streak flame, XP bar to next level, "Continue where you left off" card, Daily Challenge card, latest mentor note.
- **Map:** vertical, winding path of level nodes (lesson dots, sim flags, boss castle). Locked nodes greyed with a lock; completed show a star; current pulses.
- **Lesson player:** full-screen, one block per swipe/tap ("Next"), progress bar at top, Pixie bubble for `pixie` blocks, keyboard and swipe support. After the last block: quiz, then a results screen (XP gained, confetti, recap, "Next lesson").
- **Accessibility:** min 44px touch targets, 4.5:1 contrast, focus rings, `prefers-reduced-motion` respected, all icons labelled.
- **PWA:** manifest with name AdQuest, theme color indigo, 192/512 icons (generate simple SVG→PNG icons with Pixie), offline fallback page. Lesson content is static so it caches well.
- **Empty/error states** are friendly and in Pixie's voice. Loading skeletons everywhere.
- Copy tone: encouraging, plain English, tiny bits of humour. Never sarcastic.

---

## 13. BUILD PHASES (Task List; acceptance criteria in bold)

**Phase 0: Scaffold** · Next.js + TS + Tailwind, fonts, folder structure, `.env.example`, README, PWA manifest, git init. **`npm run build` passes.**
**Phase 1: Credentials + DB** · Ask Section 2 items 1-3 (single message), write `.env.local`, write and run `001_init.sql` via `scripts/migrate.mjs`, seed badges. **Signup → profile row created; first user is admin.** Meanwhile build mock mode.
**Phase 2: Auth + shell** · login/signup, protected routes, layout + nav, profile page. **Can sign up, log in, log out on mobile width.**
**Phase 3: Content engine + Rookie tier** · loader, zod schema, lesson player, quiz engine (mcq/tf/order), results screen, glossary, **all 10 Rookie lessons fully written**. **Finish lesson 1 → XP awarded, progress saved, lesson 2 unlocks.**
**Phase 4: Gamification** · award_xp RPC wiring, XP bar, levels, streaks, coins, shop, badges + toasts, daily challenge. **Unit tests for xp/levels/streak pass; streak logic verified for same-day, next-day, gap, and freeze.**
**Phase 5: Simulator + Boss 1** · engine + tests, sim UI, Sim R1/R2, boss player, Boss 1. **Engine is deterministic for a given seed; a known good setup passes Sim R1, a bad one fails with a clear explanation.**
**Phase 6: Pixie tutor** · route handler, daily cap, fallback hints, chat UI, contextual button. Ask Section 2 item 4 here. **Works with the key; works with the key removed (fallback).**
**Phase 7: Mentor/admin** · notes, claim flow, admin dashboard, WhatsApp summary. **Admin sends a note → learner sees it, claims XP once.**
**Phase 8: Operator + Strategist content** · all lessons, sims, bosses, glossary (80+ terms), daily bank (150+ questions), Google locked island on the map. **Content validates; every lesson reachable in order; all sims solvable.**
**Phase 8B: Interview Dojo** · implement Section 15 end to end: migration `002_interview.sql`, all modes, `/api/interview`, readiness score, badges, and ALL interview content. **Flashcard → self-grade → XP works offline; Mock Interview works with key and falls back without it; readiness score updates; every question links to its lesson.**
**Phase 9: Polish and QA** · animations, empty states, a11y pass, Lighthouse mobile ≥ 90 (performance and a11y), test full journey in the browser at 390px. **No console errors; full flow recorded as a browser walkthrough artifact.**
**Phase 10: Deploy** · push to GitHub, deploy to Vercel (ask Section 2 item 5 only now), set env vars in Vercel, verify production login and one lesson. **Live URL works on a phone; installable as PWA.**

---

## 14. FINAL HANDOFF (the agent outputs this at the end)

1. Live URL and the GitHub repo link.
2. Short **"How to add new content"** (drop a JSON in `/content`, register it in `worlds.json`, push → auto-deploy). Include a one-paragraph recipe for adding the Google world later.
3. **Two-line first-run instructions for the mentor:** sign up first (becomes admin), share the URL, then let her sign up; afterwards turn off new signups in Supabase.
4. A list of anything stubbed or mocked, plus known limits (free-tier caps: tutor message cap, Supabase pause on inactivity: open the app weekly or ping it).
5. Test results summary (unit tests, Lighthouse scores, browser walkthrough).

**Definition of done:** a total beginner can sign up on her phone, complete the whole Rookie tier in order, earn XP/streaks/badges, run simulator tasks, beat Boss 1, ask Pixie questions, practice interview questions and a mock interview, and receive a mentor note, all at ₹0 cost.

---

## 15. INTERVIEW DOJO (job-interview practice for performance marketing)

**Goal:** after learning a topic, she practices exactly how it gets asked in real interviews for performance marketing roles in India (fresher → junior → mid-level), and builds a portfolio from her simulator work. Fully free, works offline, AI is optional.

### 15.1 Modes (all under `/interview`)
1. **Learn Cards:** question → she thinks or types an answer → taps **Reveal** → sees model answer + key points checklist → ticks which points she covered → self-score. Spaced repetition: missed questions return sooner (simple Leitner boxes stored in `interview_attempts`).
2. **Rapid Fire:** 10 timed questions (30 s each), multiple choice or "pick the best answer". Streak counter, instant explanations. Great for daily practice.
3. **Scenario Lab:** realistic case interviews. A story + data table, then 4-6 steps: pick a decision, then write a short final answer ("What would you tell the client?"). Scored by checklist (self) or AI.
4. **Mock Interview:** a simulated interviewer asks 8 mixed questions (concept, scenario, behavioral) with 1 follow-up each, then shows a **scorecard**. Voice input optional via the browser Web Speech API (feature-detect; fall back to typing).
5. **STAR Builder:** guided 4-box form (Situation, Task, Action, Result) with an example, for behavioral questions. She saves 3+ personal stories she can reuse. For a fresher with no job experience, teach her to use course projects and simulator wins as stories.
6. **Interview-Ready Kit:** checklist pages (see 15.7) plus a printable **Portfolio Page** built from her best simulator runs and boss wins ("Case Study: Salon Lead Campaign: ₹500/day, 7 days, CPL ₹84, 34 leads, what I'd test next"). Provide a print-friendly route `/interview/portfolio` (and a "Copy as text" button).

### 15.2 Unlock logic (ties the Dojo to learning)
Each question has a `lessonSlug`. A question is **unlocked once she completes that lesson**. Locked cards show "Learn *<lesson title>* first" with a link. This keeps the loop: learn → practice → interview-ready. Scenario Lab and Mock Interview unlock per tier (Rookie scenarios after the Rookie boss, etc.). Behavioral questions and the Kit are unlocked from day one.

### 15.3 Scoring and Interview Readiness
- Answer rubric, 4 criteria × 0-5 = 20 points: **Clarity** (simple, to the point) · **Structure** (framework or steps) · **Numbers** (uses metrics or examples) · **Business thinking** (links to the client's goal) .
- Self-grade mode: she ticks key points hit; score = `hit / total × 20`.
- AI mode: Gemini returns the same rubric (see 15.5). Store the best score per question.
- **Readiness score (0-100)** = `round(0.6 × avgBestScorePct + 0.4 × coveragePct)` where coverage = answered unlocked questions ÷ all unlocked questions. Labels: <40 Warming Up · 40-69 Getting Sharp · 70-84 Interview Ready · 85+ Hire Me. Show a ring on Home and Profile, plus "weakest topic" suggestions that link back to lessons.

**XP:** first answer to a question 5 XP + up to 10 for score · Rapid Fire round 40 · Scenario 60 · Mock Interview 120 (max 3 per day) · STAR story saved 40. No XP for repeats of the same question (practice stays free).
**New badges:** `interview-first` First Answer · `star-shiner` 3 STAR stories saved · `rapid-10` perfect Rapid Fire · `mock-grad` first Mock Interview ≥ 60% · `interview-ready` readiness ≥ 70 · `hire-me` readiness ≥ 85. Add them to `scripts/seed-badges.mjs`.

### 15.4 Database: `db/migrations/002_interview.sql`
```sql
create table interview_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  question_slug text not null,
  mode text not null check (mode in ('learn','rapid','scenario','mock','star')),
  answer_text text,
  hit_points text[] default '{}',
  score int not null check (score between 0 and 20),
  ai_graded boolean not null default false,
  box int not null default 1,             -- Leitner box 1-5 for spaced repetition
  next_due date,
  created_at timestamptz not null default now()
);
create table interview_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  mode text not null, tier text not null,
  total_score int not null, max_score int not null,
  scorecard jsonb not null, created_at timestamptz not null default now()
);
create table star_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null, situation text, task text, action text, result text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table interview_usage (
  user_id uuid references profiles(id) on delete cascade,
  day date not null, ai_count int not null default 0, mock_count int not null default 0,
  primary key (user_id, day)
);
alter table interview_attempts enable row level security;
alter table interview_sessions enable row level security;
alter table star_stories enable row level security;
alter table interview_usage enable row level security;
-- For each table: select where user_id = auth.uid() or is_admin(); insert/update/delete where user_id = auth.uid().
```
The admin dashboard gains a card: readiness score, mock-interview history, and the 3 weakest questions.

### 15.5 AI evaluator and mock interviewer (`app/api/interview/route.ts`)
- Same rules as the tutor: server-only key, authenticated, **daily cap 15 AI evaluations and 3 mock interviews per user** via `interview_usage`. Any failure, cap, or missing key → fall back to self-grading with the model answer shown. Never block practice.
- Request `{ action: 'evaluate' | 'interviewer_turn' | 'scorecard', ... }`. Use Gemini JSON output and validate with zod.
- **Evaluate** returns: `{ scores:{clarity,structure,numbers,business}, hit_points:[], missed_points:[], better_answer:"≤120 words", one_tip:"" }`. The prompt receives the question, the `keyPoints` rubric, and her answer. Instruct: grade against the key points, be kind and specific, don't invent facts, say "check Meta's official docs" if a platform detail is uncertain.
- **Interviewer system prompt (`lib/interview/prompt.ts`):**
  > You are a friendly but realistic hiring manager at a digital marketing agency in India interviewing a beginner for a performance marketing role. Ask one question at a time from the provided list. After each answer, ask at most one short follow-up that probes the weakest part. Do not give feedback during the interview. Keep your turns under 40 words. When told the interview is over, produce the scorecard JSON with the 4-criteria rubric per question, 3 strengths, 3 improvements, and a recommended next lesson for each weak topic.
- **Offline fallback mock:** the same 8 questions served in order, with the follow-up taken from each question's `followUp` field, and a self-graded scorecard at the end.

### 15.6 Content schemas

**Question** (`content/interview/questions-rookie.json` etc.; validate with zod)
```json
{
  "slug": "iq-rookie-ctr-what-is-good",
  "tier": "rookie", "platform": "meta", "type": "concept",
  "lessonSlug": "meta-rookie-05-metrics-101",
  "question": "What is CTR, and what is a good CTR?",
  "levelTag": "Fresher",
  "keyPoints": [
    "CTR = clicks ÷ impressions × 100",
    "Shows how attractive the ad is to the people who saw it",
    "No single 'good' number: depends on industry, placement, and objective",
    "Low CTR → test hook, creative, or audience; very high CTR with no leads → check the offer or landing page"
  ],
  "modelAnswer": "CTR is clicks divided by impressions, shown as a percentage. It tells us how many people who saw the ad were interested enough to click. There is no single good number, because it changes by industry and placement. I compare it with the account's own average and test hooks and creatives when it is low. If CTR is high but leads are low, I check the offer and landing page.",
  "followUp": "Your CTR is 3% but leads are very few. What do you check?",
  "commonMistakes": ["Quoting one magic number like '1% is good' without context"],
  "tip": "Always connect a metric to an action. Say what you would DO."
}
```

**Scenario** (`content/interview/scenarios/*.json`)
```json
{
  "slug": "is-op-cpl-jump",
  "tier": "operator", "title": "CPL jumped from ₹150 to ₹400 overnight",
  "lessonSlug": "meta-operator-10-reporting-breakdowns",
  "story": "You manage Meta ads for a coaching centre. Yesterday CPL was ₹150. Today it is ₹400. Spend is the same.",
  "data": { "table": [["Metric","Yesterday","Today"],["Spend","₹3,000","₹3,000"],["CPM","₹160","₹175"],["CTR","1.4%","1.3%"],["Leads","20","7.5"]] },
  "steps": [
    { "prompt": "What do you check FIRST?", "options": ["Change the creative","Check tracking: is the Pixel/CAPI and lead form working?","Double the budget","Pause the campaign"], "answer": 1, "explain": "CPM and CTR barely moved, so people are clicking as before. Leads fell, which points to tracking or form/landing issues, not the ad." },
    { "prompt": "Tracking is fine. The form loads slowly. Next step?", "options": ["…"], "answer": 0, "explain": "…" }
  ],
  "finalQuestion": "In under 100 words, tell the client what happened and what you will do.",
  "keyPoints": ["Compared CPM/CTR first to locate the break","Checked tracking and form before touching creatives","Fixed the root cause, then monitored 24-48 hours","Communicated clearly with a next step and timeline"],
  "modelAnswer": "…"
}
```

### 15.7 Content the agent must write (real, complete, beginner-friendly model answers of 60-120 words, plain English, example numbers labelled as examples)

**A. Concept question bank (≈ 45 questions, each with keyPoints, modelAnswer, followUp, linked lessonSlug)**

*Rookie / Fresher (15):*
1. Performance marketing vs brand marketing? 2. Explain the funnel (top, middle, bottom) with an example. 3. CPM vs CPC vs CPL vs CPA vs ROAS. 4. Explain a Meta campaign's 3-level structure. 5. How do you choose a campaign objective for a lead-gen business? 6. What is CTR and what's a good CTR? 7. Reach vs impressions vs frequency. 8. How would you decide a starting budget? 9. What makes a good ad creative? 10. What is the learning phase? 11. Organic vs paid, when to use which? 12. Instant form vs website landing page for leads. 13. Why might an ad get rejected, and what would you do? 14. What do you need to set up a Meta ad account? 15. Which KPIs matter for an e-commerce store vs a lead-gen business?

*Operator / Junior, 1-3 years (15):*
1. Custom vs lookalike audiences; what makes a good seed? 2. What are the Pixel and Conversions API; why use both; what is deduplication? 3. CPL doubled this week. What do you check? 4. Lowest cost vs cost cap vs bid cap. 5. How do you test creatives properly? 6. How do you reduce CPL without hurting lead quality? 7. Leads are cheap but poor quality. How do you fix it? 8. ROAS is falling while spend is steady. Why? 9. Why do Meta and GA4 show different numbers? 10. What is audience overlap and how do you handle it? 11. How do you structure retargeting and exclusions? 12. Frequency is 5. What now? 13. How would you split ₹50,000/month for a new client? 14. What is Event Match Quality and why does it matter? 15. When do you turn an ad set off?

*Strategist / Mid-level, 3+ years (11):*
1. Scale from ₹5k to ₹50k per day, how? 2. Audit an account in 30 minutes. 3. How would you prove an ad channel is actually incremental? 4. Build a quarterly testing roadmap. 5. Advantage+ vs manual campaigns, when each? 6. A client wants 10x ROAS in two weeks. 7. Present results to a non-technical CEO. 8. How do you split budget across Meta and Google? 9. The ad account is restricted. What do you do? 10. Last-click vs data-driven vs media mix thinking, in simple terms. 11. How do you create SOPs for a team?

*Google (locked until the Google world is added):* leave `questions-google.json` as an empty array with a TODO note in README.

**B. Pixie's answer frameworks** (`frameworks.json`, shown as tips and reused in model answers)
- **Diagnose-a-drop (CPL up or ROAS down):** Tracking → Audience → Creative → Offer/Landing page → Budget/Bids → Outside factors (season, competitors). *Look at CPM, CTR, CVR to locate the break.*
- **Launch plan:** Goal → Audience → Offer → Creative → Budget → Tracking → Test plan → Review dates.
- **Scale plan:** Stabilise → Increase budget ~20% steps → Duplicate winners → New audiences/creatives → Watch CPL/ROAS → Kill or hold.
- **Client-talk formula:** What happened → Why → What I did/will do → What I need from you → Next update date.
- **Metric answer formula:** Definition → Formula → Why it matters → What I'd DO with it.

**C. Behavioral / HR (`behavioral.json`, 10 questions with STAR guidance and a fresher-friendly sample answer each)**
Tell me about yourself (fresher version: course + simulator projects) · Why performance marketing? · Tell me about a mistake and what you learned · A time you used data to change a decision · How do you handle an unhappy client? · How do you work under tight deadlines? · How do you keep learning in a fast-changing field? · Your strengths and weaknesses · Where do you see yourself in 3 years? · Why should we hire you?
Add a short **salary-talk guide** (research market range, give a range, anchor on skills, never lie) without quoting made-up salary figures; tell her to check current job boards.

**D. Scenario Lab (9 scenarios, each with data table, 4-6 decision steps, finalQuestion, keyPoints, modelAnswer)**
1. *Salon (Rookie):* ₹30,000/month, goal = bookings. Plan the campaign.
2. *Gym (Rookie):* 1-page media plan, take-home style task (budget, objective, audience, creatives, KPIs, review plan).
3. *Coaching centre (Operator):* admissions season, 20 days, ₹1 lakh, goal = enquiries.
4. *Real estate (Operator):* leads are cheap but nobody picks up calls. Diagnose (lead quality, form questions, speed to call, CRM feedback).
5. *CPL jumped overnight (Operator):* full sample in 15.6.
6. *E-commerce boutique (Operator):* ROAS 1.2, target 3. Where is the leak (CPM, CTR, CVR, AOV, tracking)?
7. *"Meta shows 12 sales, Shopify shows 20" (Strategist):* attribution windows, view-through, tracking gaps, how to explain it to the client.
8. *Ad account disabled the day before a sale (Strategist):* appeal steps, backup plan, preventing recurrence, client communication.
9. *New D2C brand, ₹2 lakh, zero data (Strategist):* first-30-day structure, testing plan, what you will NOT do (e.g., scale too early).

**E. Rapid Fire banks:** `rapid-rookie.json`, `rapid-operator.json`, `rapid-strategist.json`, each with **20 MCQs** tagged by lesson, interview-style wording ("Which metric tells you if the creative hook is working?"), with an explanation per question.

**F. Interview-Ready Kit (`checklist.json` + pages)**
- *Resume for freshers:* one page, skills section (Meta Ads, metrics, reporting), projects (use AdQuest sim case studies), certifications, links; 6 do's and 6 don'ts.
- *Portfolio:* how to present 2-3 case studies in the format Problem → Plan → Numbers → Result → Next test. The `/interview/portfolio` page auto-fills from her sim runs.
- *LinkedIn:* headline and About templates for a beginner performance marketer.
- *Before the interview:* research the company's ads (use Meta Ad Library, in simple steps), prepare 3 questions to ask the interviewer, 5-minute self-intro script.
- *Common mistakes:* 15 items (e.g., quoting metrics without actions, claiming results you can't back up, not asking clarifying questions in a case).
- *Questions to ask the interviewer:* 8 good ones.
- *Day-of checklist:* video-call setup, timing, how to think aloud in a case, how to say "I don't know, but here's how I'd find out."

### 15.8 UX details
- Hub shows: readiness ring, "Today's practice" (3 due cards via spaced repetition), mode tiles, weakest topic with a "Revise lesson" link, and the next unlockable interview set.
- Learn Cards: swipe left = "Need practice" (comes back sooner), swipe right = "Got it". Large text, Pixie's tip under every answer.
- Mock Interview screen looks like a chat with a hiring manager avatar, a visible question counter (3/8), a timer per answer (soft, 2 min, no punishment), mic button if supported, and a final scorecard card she can screenshot.
- Tone: confidence-building. Mistakes are "practice points", never "failures".

### 15.9 Acceptance tests (add to Phase 8B)
- A locked question shows the exact lesson to finish; completing it unlocks the question on next load.
- Self-graded Learn Card awards XP once; repeating it awards none but still saves the attempt and updates the Leitner box.
- Readiness score matches the formula in unit tests for 3 sample data sets.
- Mock Interview completes with the key present and with the key removed (fallback scripted version).
- STAR story saves, edits, and appears in the Mock Interview "use my story" hint.
- Portfolio page renders from sim runs and prints cleanly on A4.
- All 9 scenarios and all 3 rapid banks validate against zod schemas; no empty `modelAnswer` fields anywhere.
