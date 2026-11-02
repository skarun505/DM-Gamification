# AdQuest: The Duolingo of Performance Marketing

> A free, mobile-first, gamified web app that transforms complete beginners into confident media buyers who can launch real campaigns and clear agency interviews.

---

## 🌟 Features Overview

### 1. Interactive Curriculum (Meta Ads Universe)
- **Tier 1: Rookie (10 Lessons)**: What is performance marketing, Meta ecosystem, 3-level campaign structure, 6 objectives, metrics 101, audience basics, budget basics, creative basics, ad auction mechanics, launch checklist.
- **Tier 2: Operator (10 Lessons)**: Custom audiences, Lookalikes, Pixel & standard events, CAPI & Events Manager, lead funnels (Instant Forms vs Landing Pages vs WhatsApp), bidding & cost controls, learning phase optimization, creative testing frameworks, retargeting funnels, reporting breakdowns.
- **Tier 3: Strategist (8 Lessons)**: Full-funnel architecture, safe 20% scaling, Advantage+ Shopping (ASC), attribution windows & incrementality, creative strategy at scale, account consolidation, client reporting & "Client-Talk", ad policies, rejections & account health.
- **Locked Google Ads Realm**: Teaser island showcasing Search, PMax, YouTube, and GA4 to build anticipation.

### 2. Interactive Ads Manager Simulator
- Pure TypeScript deterministic math engine using Mulberry32 PRNG.
- Realistic simulation of budget, CPM, frequency fatigue, CTR, CVR, and learning phase dynamics.
- Interactive controls: daily budget, audience size & type, creative selection, placements, and pixel toggle.
- Interactive Recharts visualization showing 7-day cumulative spend, impressions, clicks, and conversions.
- Real-time Pixie commentary and automated pass/fail evaluation against industry benchmarks.

### 3. Boss Battle Arenas (Tiers 1, 2, and 3)
- **Boss 1 (Rookie)**: *First Launch Day* — 6 high-stakes pre-launch questions with instant feedback and graduation confetti.
- **Boss 2 (Operator)**: *Why Are Leads So Expensive?* — Surgical diagnostic investigation analyzing frequency fatigue, audience overlap, and landing page drops.
- **Boss 3 (Strategist)**: *Scale or Kill? The ₹50,000 Reallocation* — Multi-campaign data evaluation, budget reallocation, creative pipeline planning, and CEO defense.

### 4. Full Interview Dojo
- **Learn Cards**: Spaced repetition flashcards using the Leitner box system with self-evaluation rubrics.
- **Rapid Fire**: 30-second timed quiz with 60 real interview MCQs across Rookie, Operator, and Strategist tiers.
- **Scenario Lab**: 9 deep agency case studies (e-commerce, real estate, salons, gym memberships, B2B SaaS) with data tables and written response evaluation.
- **Mock Interview**: Simulated agency director interviewer with Gemini AI scoring, audio response recording via Web Speech API, and actionable scorecards.
- **STAR Story Builder**: Structured framework for crafting interview-ready Situation, Task, Action, and Result case studies.
- **Interview-Ready Kit**: Checklist for resume bullet points, LinkedIn optimization, Meta Ad Library research, and high-impact questions to ask interviewers.
- **Portfolio Generator**: Printable A4 campaign case study export for interviews.

### 5. Gamification Mechanics
- **Progression**: Dynamic XP leveling system (`level = floor(sqrt(xp/50)) + 1`) and coin rewards.
- **Streaks**: Daily tracking tied to `Asia/Kolkata` (IST) with Streak Freeze protection purchasable with in-game coins.
- **Badges**: 21 achievement badges (15 Core + 6 Interview Dojo) with animated confetti unlock toasts.
- **Daily Challenge**: 3 fresh multi-tier marketing questions every day for bonus XP and streak maintenance.

### 6. AI Tutor (Pixie)
- Powered by Google Gemini 1.5 Flash with Socratic tutoring prompts.
- Enforced rate limiting (30 requests/day/user) stored in Supabase.
- Built-in offline fallback answer bank for zero-latency instant responses.

### 7. Mentor / Admin Portal
- Admin-protected dashboard (`/admin`) for educators and team leads.
- Real-time learner progress analytics, XP tracking, and streak monitoring.
- Direct-to-learner mentor notes and XP challenge dispatcher.
- 1-click WhatsApp weekly summary formatter for parent/student progress updates.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: Next.js 14 (App Router) + React 18 + TypeScript (strict mode)
- **Styling**: Tailwind CSS + Lucide Icons + Framer Motion
- **Typography**: Fredoka (headings) & Nunito (body text)
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS) & RPC functions
- **AI**: Google Gemini API via `@google/generative-ai`
- **Charts & Visuals**: Recharts + Canvas Confetti
- **Testing**: Vitest (unit tests for math engine and game formulas)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17+ or 20+
- A free [Supabase](https://supabase.com) account
- A free [Google AI Studio](https://aistudio.google.com/) API key

### 1. Clone & Install
```bash
git clone <repo-url>
cd "DM Gamification"
npm install
```

### 2. Environment Variables
Create `.env.local` in the project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
ADMIN_EMAIL=your_email@example.com
```

### 3. Database Setup
Execute the two SQL migration files inside your Supabase SQL Editor:
1. `db/migrations/001_init.sql` (Creates core tables, RLS policies, `is_admin()`, and `award_xp()` RPC)
2. `db/migrations/002_interview.sql` (Creates interview tables, badges seed, and RLS policies)

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser (or toggle mobile view at 390px width).

### 5. Run Tests & Build
```bash
npm test          # Runs Vitest unit tests
npm run build     # Verifies production Next.js build
```

---

## 📱 Mobile-First Design
AdQuest is designed from the ground up for mobile screens:
- Optimized for iPhone / Android viewports (390px width).
- Minimum 44px touch targets on all buttons and interactive cards.
- Bottom navigation bar on mobile, switching to a responsive desktop sidebar on large screens.
- Web app manifest configured with custom SVG app icon for home screen installation (PWA).

---

## 📄 License
MIT License. Free for learners, educators, and mentors.
