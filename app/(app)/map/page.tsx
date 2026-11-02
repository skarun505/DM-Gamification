'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGame } from '@/components/game/GameContext';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { RealLabModal, RealLabScenario } from '@/components/map/RealLabModal';
import { TeachingConceptViewer, TeachingConcept } from '@/components/map/TeachingConceptViewer';
import {
  Lock,
  CheckCircle2,
  Play,
  Flag,
  Shield,
  Star,
  Sparkles,
  ArrowRight,
  Camera,
  Layers,
  BookOpen,
  HelpCircle,
  TrendingUp,
  Award,
} from 'lucide-react';

export default function WorldMapPage() {
  const router = useRouter();
  const { profile } = useGame();
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState<RealLabScenario | null>(null);
  const [selectedConcept, setSelectedConcept] = useState<TeachingConcept | null>(null);
  const [activeTierTab, setActiveTierTab] = useState<'rookie' | 'operator' | 'strategist'>('rookie');
  const supabase = createClient();

  useEffect(() => {
    async function loadProgress() {
      if (!profile?.id) return;
      try {
        const { data: lp } = await supabase
          .from('lesson_progress')
          .select('lesson_slug')
          .eq('user_id', profile.id)
          .eq('status', 'completed');

        const { data: sr } = await supabase
          .from('sim_runs')
          .select('task_slug')
          .eq('user_id', profile.id)
          .eq('passed', true);

        const { data: ba } = await supabase
          .from('boss_attempts')
          .select('boss_slug')
          .eq('user_id', profile.id)
          .eq('passed', true);

        const { data: xp } = await supabase
          .from('xp_events')
          .select('ref')
          .eq('user_id', profile.id)
          .eq('source', 'real_lab');

        const set = new Set<string>();
        lp?.forEach((r) => set.add(r.lesson_slug));
        sr?.forEach((r) => set.add(r.task_slug));
        ba?.forEach((r) => set.add(r.boss_slug));
        xp?.forEach((r) => r.ref && set.add(r.ref));

        setCompletedSlugs(set);
      } catch (err) {
        console.error('Failed to load map progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [profile?.id]);

  // Teaching concepts bank
  const teachingConcepts: Record<string, TeachingConcept> = {
    'meta-rookie-01-what-is-performance-marketing': {
      id: 'tc-r-01',
      lessonSlug: 'meta-rookie-01-what-is-performance-marketing',
      unitNumber: 1,
      title: 'The Marketing Funnel & Paid Ads Power',
      subtitle: 'Chronological customer journey & paid vs organic reach',
      tier: 'rookie',
      keyTakeaway: 'Performance marketing tracks exact measurable returns. Funnel stages always flow chronologically: Ad View ➔ Link Click ➔ Form Submission ➔ Customer Purchase.',
      visualType: 'funnel',
      visualData: {},
      quizAnswerTeaser: 'In the quiz, arrange the funnel stages in chronological order: 1. See ad on Instagram ➔ 2. Click to view salon menu ➔ 3. Fill appointment form ➔ 4. Visit salon for service.',
    },
    'meta-rookie-02-meet-the-meta-world': {
      id: 'tc-r-02',
      lessonSlug: 'meta-rookie-02-meet-the-meta-world',
      unitNumber: 2,
      title: 'Meta Ecosystem Command Center',
      subtitle: 'Business Portfolio vs Ads Manager vs Personal Profiles',
      tier: 'rookie',
      keyTakeaway: 'Meta Business Portfolio connects and secures all pixels, pages, Instagram handles, and credit cards in one central hub.',
      visualType: 'hierarchy',
      visualData: {},
      quizAnswerTeaser: 'Always run ads through a Business Portfolio, never by boosting posts on personal profile accounts.',
    },
    'meta-rookie-03-campaign-adset-ad-structure': {
      id: 'tc-r-03',
      lessonSlug: 'meta-rookie-03-campaign-adset-ad-structure',
      unitNumber: 3,
      title: 'The 3-Level Campaign Architecture',
      subtitle: 'Campaign (Objective) ➔ Ad Set (Audience/Budget) ➔ Ad (Creative)',
      tier: 'rookie',
      keyTakeaway: 'Campaign Level = Objective. Ad Set Level = Audience Targeting, Daily Budget & Placements. Ad Level = Video Creative & Copy.',
      visualType: 'hierarchy',
      visualData: {},
      quizAnswerTeaser: 'Remember: Budget and Audience are set at the Ad Set level (or Campaign level with CBO). Creative lives at the Ad level.',
    },
    'meta-rookie-04-campaign-objectives': {
      id: 'tc-r-04',
      lessonSlug: 'meta-rookie-04-campaign-objectives',
      unitNumber: 4,
      title: 'The 6 Core Campaign Objectives',
      subtitle: 'Matching business goals to Meta algorithm optimization',
      tier: 'rookie',
      keyTakeaway: 'Meta gives you exactly what you ask for. If you pick Traffic, you get cheap clickers. If you want inquiries, choose Leads. If you want orders, pick Sales.',
      visualType: 'hierarchy',
      visualData: {},
      quizAnswerTeaser: 'For booking appointments or inquiries, always choose the Leads objective, NOT Traffic.',
    },
    'meta-rookie-05-metrics-101': {
      id: 'tc-r-05',
      lessonSlug: 'meta-rookie-05-metrics-101',
      unitNumber: 5,
      title: 'The Media Buying Math Laboratory',
      subtitle: 'CTR, CPL, CPC, ROAS and CPM calculations',
      tier: 'rookie',
      keyTakeaway: 'CPL = Spend ÷ Leads. CTR = (Clicks ÷ Impressions) × 100. ROAS = Revenue ÷ Spend.',
      visualType: 'metrics',
      visualData: {},
      quizAnswerTeaser: 'If you spend ₹3,000 and get 60 leads, your Cost Per Lead is ₹3,000 / 60 = ₹50 CPL.',
    },
    'meta-rookie-06-audiences-basics': {
      id: 'tc-r-06',
      lessonSlug: 'meta-rookie-06-audiences-basics',
      unitNumber: 6,
      title: 'Audience Targeting & Reach Pools',
      subtitle: 'Broad vs Interests vs Demographics',
      tier: 'rookie',
      keyTakeaway: 'Narrow interest stacking spikes CPM. Modern Meta algorithms perform best with broader audiences where ad creative does the targeting.',
      visualType: 'audiences',
      visualData: {},
      quizAnswerTeaser: 'Hyper-narrow audiences raise auction bids and fatigue rapidly. Keep reach pools balanced.',
    },
    'meta-rookie-07-budget-basics': {
      id: 'tc-r-07',
      lessonSlug: 'meta-rookie-07-budget-basics',
      unitNumber: 7,
      title: 'Budget Pacing & Learning Phase',
      subtitle: 'The 50 conversion events rule of thumb',
      tier: 'rookie',
      keyTakeaway: 'Meta machine learning requires approximately 50 conversion events per ad set within 7 days to exit the Learning Phase.',
      visualType: 'scaling',
      visualData: {},
      quizAnswerTeaser: 'Start daily budget at 3x-5x your target CPL so the algorithm gathers enough daily conversions to optimize.',
    },
    'meta-rookie-08-creative-basics': {
      id: 'tc-r-08',
      lessonSlug: 'meta-rookie-08-creative-basics',
      unitNumber: 8,
      title: 'Creative Hooks & Mobile Formats',
      subtitle: 'The 3-second hook rule for Instagram Reels',
      tier: 'rookie',
      keyTakeaway: 'Users scroll fast. 80% of attention is won or lost in the first 3 seconds. Use vertical 9:16 video formats with bold on-screen subtitles.',
      visualType: 'funnel',
      visualData: {},
      quizAnswerTeaser: 'The 3-second hook is the #1 lever for stopping feed scrolling and reducing CPM.',
    },
    'meta-rookie-09-how-ad-auction-works': {
      id: 'tc-r-09',
      lessonSlug: 'meta-rookie-09-how-ad-auction-works',
      unitNumber: 9,
      title: 'The Total Value Ad Auction',
      subtitle: 'Total Value = Bid × Estimated Action Rate + Ad Quality',
      tier: 'rookie',
      keyTakeaway: 'The highest monetary bidder does NOT always win. High Ad Quality and user relevance give you discounts in the auction.',
      visualType: 'auction',
      visualData: {},
      quizAnswerTeaser: 'Meta rewards high-engagement ads with lower CPMs, allowing smart marketers to beat big spenders.',
    },
    'meta-rookie-10-launch-checklist-first-results': {
      id: 'tc-r-10',
      lessonSlug: 'meta-rookie-10-launch-checklist-first-results',
      unitNumber: 10,
      title: 'Launch Day Checklist & Pre-Flight Protocol',
      subtitle: 'UTM tracking, pixel verification & early diagnostics',
      tier: 'rookie',
      keyTakeaway: 'Never launch blind. Verify pixel events with Meta Pixel Helper, ensure UTM parameters are tagged, and check mobile landing page speed.',
      visualType: 'funnel',
      visualData: {},
      quizAnswerTeaser: 'Check tracking health first before scaling budget. Give campaigns at least 48 hours before judging performance.',
    },
  };

  // Lessons list
  const rookieLessons = [
    { slug: 'meta-rookie-01-what-is-performance-marketing', title: '1. What is Performance Marketing?' },
    { slug: 'meta-rookie-02-meet-the-meta-world', title: '2. Meet the Meta World' },
    { slug: 'meta-rookie-03-campaign-adset-ad-structure', title: '3. 3-Level Structure' },
    { slug: 'meta-rookie-04-campaign-objectives', title: '4. Campaign Objectives' },
    { slug: 'meta-rookie-05-metrics-101', title: '5. Metrics 101' },
    { slug: 'meta-rookie-06-audiences-basics', title: '6. Audiences Basics' },
    { slug: 'meta-rookie-07-budget-basics', title: '7. Budget Basics & Learning' },
    { slug: 'meta-rookie-08-creative-basics', title: '8. Creative Basics' },
    { slug: 'meta-rookie-09-how-ad-auction-works', title: '9. How the Ad Auction Works' },
    { slug: 'meta-rookie-10-launch-checklist-first-results', title: '10. Launch Checklist' },
  ];

  const rookieSims = [
    { slug: 'sim-rookie-01-salon-leads', title: 'Sim R1: Salon Leads' },
    { slug: 'sim-rookie-02-fix-narrow-audience', title: 'Sim R2: Fix Audience' },
  ];

  const rookieBoss = { slug: 'boss-rookie-launch-day', title: 'Boss 1: Launch Day Pre-Flight' };

  // Real labs definition
  const realLabs: Record<string, RealLabScenario> = {
    'real-lab-rookie': {
      id: 'real-lab-rookie',
      tier: 'rookie',
      title: 'Lab 1: Live Meta Ad Library Competitor Spy',
      platform: 'Meta Ads',
      objective: 'Open Meta Ad Library, research 3 live competitor ad creatives in your region, analyze their hooks, and submit proof.',
      steps: [
        'Open the official Meta Ad Library (link below) in your browser.',
        'Set Country to India and Category to "All Ads".',
        'Search for any active brand (e.g. "hair salon bangalore", "coffee", or "gym").',
        'Find 3 active video/image ads and observe what problem they solve in the first 3 seconds.',
        'Take a clear screenshot of the Ad Library search results page showing active ads.',
        'Upload your screenshot below for mentor evaluation.',
      ],
      externalUrl: 'https://www.facebook.com/ads/library',
      urlLabel: 'Open Meta Ad Library ↗',
      xpReward: 50,
      coinsReward: 15,
    },
    'real-lab-operator': {
      id: 'real-lab-operator',
      tier: 'operator',
      title: 'Lab 2: Live Pixel Helper & Tracking Audit',
      platform: 'Meta Ads',
      objective: 'Inspect standard events firing on a real live website using Meta Pixel Helper Chrome extension.',
      steps: [
        'Install or open the "Meta Pixel Helper" extension in Google Chrome.',
        'Visit any live e-commerce or local business website (e.g., your own store, Nykaa, or Zomato).',
        'Click the Pixel Helper icon in your browser toolbar to view active events.',
        'Verify that PageView, ViewContent, or AddToCart fires with a green checkmark.',
        'Take a screenshot showing the open Pixel Helper dropdown with active events.',
        'Upload your screenshot below for mentor verification.',
      ],
      externalUrl: 'https://chromewebstore.google.com/detail/meta-pixel-helper/fdgfkebogiimcoedlicjlajpkdmockpc',
      urlLabel: 'Get Meta Pixel Helper ↗',
      xpReward: 60,
      coinsReward: 20,
    },
    'real-lab-strategist': {
      id: 'real-lab-strategist',
      tier: 'strategist',
      title: 'Lab 3: Live Account Structure & Frequency Audit',
      platform: 'Meta Ads',
      objective: 'Log in to real Meta Ads Manager or Google Ads, review 14-day frequency and CPM metrics, and submit your audit.',
      steps: [
        'Open Meta Ads Manager (adsmanager.facebook.com) or Google Ads (ads.google.com).',
        'Navigate to the Campaigns or Ad Sets reporting table.',
        'Set the date range to "Last 14 Days" and customize columns to show Spend, CPM, CTR, Frequency, and Conversions.',
        'Identify which ad set has the highest frequency and observe whether CPA increased.',
        'Take a screenshot of your dashboard reporting table.',
        'Upload your screenshot proof for senior mentor review.',
      ],
      externalUrl: 'https://adsmanager.facebook.com',
      urlLabel: 'Open Meta Ads Manager ↗',
      xpReward: 75,
      coinsReward: 25,
    },
  };

  const isRookieLessonUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedSlugs.has(rookieLessons[idx - 1].slug);
  };
  const areRookieSimsUnlocked = completedSlugs.has(rookieLessons[rookieLessons.length - 1].slug);
  const isRookieLabUnlocked = completedSlugs.has('sim-rookie-01-salon-leads');
  const isRookieBossUnlocked = completedSlugs.has('sim-rookie-02-fix-narrow-audience') || completedSlugs.has('real-lab-rookie');

  const handleLabCompleted = (labId: string) => {
    setCompletedSlugs((prev) => {
      const next = new Set(prev);
      next.add(labId);
      return next;
    });
  };

  const handleProceedToLesson = (lessonSlug: string) => {
    setSelectedConcept(null);
    router.push(`/lesson/${lessonSlug}`);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-3">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-600 rounded-3xl p-6 text-white shadow-card flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
            Campaign Journey
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl mt-0.5">
            Meta Ads Universe
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-md">
            The dual learning path: Master concepts visually on the left ➔ test your skills in lessons, real-world labs & boss battles on the right!
          </p>
        </div>
        <PixieMascot mood="happy" size={76} className="shrink-0 hidden sm:block" />
      </div>

      {/* Tier Switcher Tabs */}
      <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTierTab('rookie')}
          className={`py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTierTab === 'rookie'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Tier 1: Rookie</span>
        </button>

        <button
          onClick={() => setActiveTierTab('operator')}
          className={`py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTierTab === 'operator'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Tier 2: Operator</span>
          {!completedSlugs.has('boss-rookie-launch-day') && <Lock size={12} className="text-slate-400" />}
        </button>

        <button
          onClick={() => setActiveTierTab('strategist')}
          className={`py-2.5 px-3 rounded-xl font-heading font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 ${
            activeTierTab === 'strategist'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>Tier 3: Strategist</span>
          {!completedSlugs.has('boss-operator-expensive-leads') && <Lock size={12} className="text-slate-400" />}
        </button>
      </div>

      {/* DUAL COLUMN FLOW: LEFT SIDE TEACHING MAP ➔ RIGHT SIDE LESSON & QUIZ ARENA */}
      {activeTierTab === 'rookie' && (
        <div className="space-y-6">
          {/* Dual Flow Column Header */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <BookOpen size={20} />
              <h3 className="font-heading font-extrabold text-lg">
                Left: 📚 Visual Teaching Map
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700">
                Learn First
              </span>
            </div>

            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <Sparkles size={20} />
              <h3 className="font-heading font-extrabold text-lg">
                Right: 🎯 Practice & Quiz Arena
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700">
                Answer & Win XP
              </span>
            </div>
          </div>

          {/* 10 Paired Interactive Units */}
          <div className="space-y-4">
            {rookieLessons.map((l, idx) => {
              const isCompleted = completedSlugs.has(l.slug);
              const isUnlocked = isRookieLessonUnlocked(idx);
              const concept = teachingConcepts[l.slug];

              return (
                <div
                  key={l.slug}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-md transition-all items-center"
                >
                  {/* LEFT SIDE: Teaching Concept Node */}
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-heading font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm">
                        T{idx + 1}
                      </span>
                      <div className="min-w-0">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                          Visual Guide #{idx + 1}
                        </span>
                        <h4 className="font-heading font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 truncate">
                          {concept?.title || l.title}
                        </h4>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => concept && setSelectedConcept(concept)}
                      className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-heading font-bold text-xs border border-indigo-200 dark:border-slate-700 hover:bg-indigo-50 shadow-xs flex items-center gap-1 shrink-0 transition-colors"
                    >
                      <BookOpen size={13} />
                      <span>Learn 📖</span>
                    </button>
                  </div>

                  {/* RIGHT SIDE: Lesson & Quiz Challenge Node */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {isUnlocked ? (
                        <Link
                          href={`/lesson/${l.slug}`}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-all active:scale-95 ${
                            isCompleted
                              ? 'bg-emerald-500 text-white ring-2 ring-emerald-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700 animate-pulse'
                          }`}
                        >
                          {isCompleted ? (
                            <Star size={18} className="fill-amber-300 text-amber-300" />
                          ) : (
                            <Play size={16} className="fill-white translate-x-0.5" />
                          )}
                        </Link>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-400 flex items-center justify-center shrink-0">
                          <Lock size={16} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Lesson {idx + 1} Quiz
                        </span>
                        <h4 className={`font-heading font-bold text-xs sm:text-sm truncate ${
                          isCompleted ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-100'
                        }`}>
                          {l.title.replace(/^\d+\.\s*/, '')}
                        </h4>
                      </div>
                    </div>

                    {isUnlocked ? (
                      <Link
                        href={`/lesson/${l.slug}`}
                        className={`py-1.5 px-3 rounded-xl font-heading font-bold text-xs flex items-center gap-1 shrink-0 transition-colors ${
                          isCompleted
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                        }`}
                      >
                        <span>{isCompleted ? 'Review ✓' : 'Start Quiz ➔'}</span>
                      </Link>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-semibold shrink-0">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SIMULATORS, REAL LAB & BOSS BATLLE FOOTER ROW */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-amber-300 dark:border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Flag size={18} />
                <span>Capstone Simulators & Real-World Labs</span>
              </span>
              <span className="text-xs font-bold text-slate-500">
                Unlock After Lesson 10
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Sim 1 */}
              <Link
                href="/sim/sim-rookie-01-salon-leads"
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                  completedSlugs.has('sim-rookie-01-salon-leads')
                    ? 'border-emerald-300 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : areRookieSimsUnlocked
                    ? 'border-amber-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-amber-500'
                    : 'border-slate-200 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Flag size={20} className="mb-1 text-amber-500" />
                <span className="font-heading font-bold text-xs">Sim R1: Salon Leads</span>
                <span className="text-[10px] text-slate-400 mt-0.5">₹120 Target CPL</span>
              </Link>

              {/* Sim 2 */}
              <Link
                href="/sim/sim-rookie-02-fix-narrow-audience"
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                  completedSlugs.has('sim-rookie-02-fix-narrow-audience')
                    ? 'border-emerald-300 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : areRookieSimsUnlocked
                    ? 'border-amber-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-amber-500'
                    : 'border-slate-200 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Flag size={20} className="mb-1 text-amber-500" />
                <span className="font-heading font-bold text-xs">Sim R2: Fix Audience</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Eliminate Overlap</span>
              </Link>

              {/* Real Lab 1 */}
              <button
                type="button"
                onClick={() => setSelectedLab(realLabs['real-lab-rookie'])}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                  completedSlugs.has('real-lab-rookie')
                    ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 shadow-sm'
                    : 'border-indigo-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-indigo-500'
                }`}
              >
                <Camera size={20} className="mb-1 text-indigo-600" />
                <span className="font-heading font-bold text-xs">Real Lab: Ad Library</span>
                <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">Upload Proof (+50 XP)</span>
              </button>
            </div>

            {/* Boss 1 Launch Day CTA */}
            <div className="pt-2">
              <Link
                href="/boss/boss-rookie-launch-day"
                className={`w-full py-4 px-6 rounded-2xl text-white font-heading font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 transition-all ${
                  completedSlugs.has('boss-rookie-launch-day')
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                    : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 shadow-rose-500/20 animate-pulse'
                }`}
              >
                <Shield size={24} className="fill-white" />
                <span>
                  {completedSlugs.has('boss-rookie-launch-day')
                    ? 'Boss 1 Conquered! Replay Battle or View Certificate 🏆'
                    : 'Conquer Boss 1: Launch Day & Claim Your E-Certificate ⚔️'}
                </span>
                <Award size={20} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* TIER 2: OPERATOR */}
      {activeTierTab === 'operator' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
            <Layers size={32} />
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            Tier 2: Operator Hub
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Custom Audiences, Lookalikes, Pixel Events Manager, CAPI Tracking, and the Boss 2 Expensive Leads Autopsy.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
            <Link
              href="/lesson/meta-operator-01-custom-audiences"
              className="py-3 px-5 rounded-2xl bg-indigo-600 text-white font-heading font-bold text-sm shadow-md hover:bg-indigo-700"
            >
              Start Operator Lessons ➔
            </Link>
            <Link
              href="/boss/boss-operator-expensive-leads"
              className="py-3 px-5 rounded-2xl bg-amber-500 text-white font-heading font-bold text-sm shadow-md hover:bg-amber-600"
            >
              Boss 2: Expensive Leads ⚔️
            </Link>
          </div>
        </div>
      )}

      {/* TIER 3: STRATEGIST */}
      {activeTierTab === 'strategist' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-600 mx-auto flex items-center justify-center">
            <TrendingUp size={32} />
          </div>
          <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            Tier 3: Strategist Hub
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Full-Funnel Architecture, Safe 20% Scaling, Advantage+ Shopping (ASC), and Boss 3: Scale or Kill?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2">
            <Link
              href="/lesson/meta-strategist-01-funnel-architecture"
              className="py-3 px-5 rounded-2xl bg-purple-600 text-white font-heading font-bold text-sm shadow-md hover:bg-purple-700"
            >
              Start Strategist Lessons ➔
            </Link>
            <Link
              href="/boss/boss-strategist-scale-or-kill"
              className="py-3 px-5 rounded-2xl bg-rose-600 text-white font-heading font-bold text-sm shadow-md hover:bg-rose-700"
            >
              Boss 3: Scale or Kill? ⚔️
            </Link>
          </div>
        </div>
      )}

      {/* Real Lab Modal */}
      {selectedLab && (
        <RealLabModal
          lab={selectedLab}
          isOpen={!!selectedLab}
          onClose={() => setSelectedLab(null)}
          onComplete={handleLabCompleted}
        />
      )}

      {/* Teaching Concept Viewer */}
      {selectedConcept && (
        <TeachingConceptViewer
          concept={selectedConcept}
          isOpen={!!selectedConcept}
          onClose={() => setSelectedConcept(null)}
          onProceedToLesson={handleProceedToLesson}
        />
      )}
    </div>
  );
}
