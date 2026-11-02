'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGame } from '@/components/game/GameContext';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { RealLabModal, RealLabScenario } from '@/components/map/RealLabModal';
import { ALL_TEACHING_CONCEPTS, TeachingConcept } from '@/lib/content/teaching-concepts';
import {
  Lock,
  Play,
  Flag,
  Shield,
  Star,
  Camera,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function WorldMapPage() {
  const router = useRouter();
  const { profile } = useGame();
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState<RealLabScenario | null>(null);
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
  const teachingConcepts: Record<string, TeachingConcept> = ALL_TEACHING_CONCEPTS;

  // TIER 1: ROOKIE LESSONS (1-10)
  const rookieLessons = [
    { slug: 'meta-rookie-01-what-is-performance-marketing', title: '1. What is Performance Marketing?' },
    { slug: 'meta-rookie-02-meet-the-meta-world', title: '2. Meet the Meta World' },
    { slug: 'meta-rookie-03-campaign-adset-ad-structure', title: '3. 3-Level Campaign Structure' },
    { slug: 'meta-rookie-04-campaign-objectives', title: '4. The 6 Campaign Objectives' },
    { slug: 'meta-rookie-05-metrics-101', title: '5. Metrics 101: ROAS, CPA & CTR' },
    { slug: 'meta-rookie-06-audiences-basics', title: '6. Audience Targeting Basics' },
    { slug: 'meta-rookie-07-budget-basics', title: '7. Budget Basics & Learning Phase' },
    { slug: 'meta-rookie-08-creative-basics', title: '8. Creative Anatomy & 3s Hook' },
    { slug: 'meta-rookie-09-how-ad-auction-works', title: '9. Total Value Ad Auction' },
    { slug: 'meta-rookie-10-launch-checklist-first-results', title: '10. Launch Day Pre-Flight Checklist' },
  ];

  const rookieSims = [
    { slug: 'sim-rookie-01-salon-leads', title: 'Sim R1: Salon Leads', target: '₹120 Target CPL' },
    { slug: 'sim-rookie-02-fix-narrow-audience', title: 'Sim R2: Fix Audience', target: 'Expand Reach' },
  ];

  // TIER 2: OPERATOR LESSONS (1-10)
  const operatorLessons = [
    { slug: 'meta-operator-01-custom-audiences', title: '1. Custom Audiences & First-Party Data' },
    { slug: 'meta-operator-02-lookalike-audiences', title: '2. Lookalike Audiences (1-10%)' },
    { slug: 'meta-operator-03-meta-pixel-and-events', title: '3. Meta Pixel & Standard Events' },
    { slug: 'meta-operator-04-conversions-api-events-manager', title: '4. Conversions API (CAPI)' },
    { slug: 'meta-operator-05-getting-leads-forms-vs-web-vs-whatsapp', title: '5. Lead Gen: Forms vs WhatsApp' },
    { slug: 'meta-operator-06-bidding-and-cost-controls', title: '6. Bidding & Cost Caps' },
    { slug: 'meta-operator-07-learning-phase-optimization', title: '7. Learning Phase Diagnostics' },
    { slug: 'meta-operator-08-creative-testing-framework', title: '8. Dynamic Creative Testing (DCT)' },
    { slug: 'meta-operator-09-retargeting-funnels', title: '9. Multi-Step Retargeting Funnels' },
    { slug: 'meta-operator-10-reporting-and-breakdowns', title: '10. Attribution & Reporting' },
  ];

  const operatorSims = [
    { slug: 'sim-operator-01-budget-split', title: 'Sim O1: Budget Split', target: 'ABO vs CBO Allocation' },
    { slug: 'sim-operator-02-creative-ab-test', title: 'Sim O2: Creative A/B Test', target: 'Hook & CTR Testing' },
    { slug: 'sim-operator-03-tracking-fix', title: 'Sim O3: Tracking Fix', target: 'Event Deduplication' },
  ];

  // TIER 3: STRATEGIST LESSONS (1-8)
  const strategistLessons = [
    { slug: 'meta-strategist-01-funnel-architecture', title: '1. Full-Funnel Architecture' },
    { slug: 'meta-strategist-02-scaling-safely', title: '2. Safe 20% Scaling Protocol' },
    { slug: 'meta-strategist-03-advantage-plus-campaigns', title: '3. Advantage+ Shopping (ASC)' },
    { slug: 'meta-strategist-04-attribution-and-incrementality', title: '4. Incrementality & Attribution' },
    { slug: 'meta-strategist-05-creative-strategy-at-scale', title: '5. Creative Strategy at Scale' },
    { slug: 'meta-strategist-06-account-structure-and-audits', title: '6. Account Structure Audits' },
    { slug: 'meta-strategist-07-client-reporting-communication', title: '7. Client Reporting & Storytelling' },
    { slug: 'meta-strategist-08-policies-rejections-account-health', title: '8. Ad Policies & Account Health' },
  ];

  const strategistSims = [
    { slug: 'sim-strategist-01-scale-budget', title: 'Sim S1: Scale Budget Safely', target: 'Vertical & Horizontal Scaling' },
    { slug: 'sim-strategist-02-account-audit', title: 'Sim S2: Account Structure Audit', target: 'Consolidation & Cleanup' },
  ];

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

  // STRICT TIER GATING LOGIC:
  // Tier 2 (Operator) requires conquering Boss 1 (Launch Day Pre-Flight)
  const isOperatorTierUnlocked = completedSlugs.has('boss-rookie-launch-day');
  // Tier 3 (Strategist) requires conquering Boss 2 (Expensive Leads Autopsy)
  const isStrategistTierUnlocked = completedSlugs.has('boss-operator-expensive-leads');

  // Progressive unlocking within Tier 1: Rookie
  const isRookieLessonUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedSlugs.has(rookieLessons[idx - 1].slug);
  };
  const areRookieSimsUnlocked = completedSlugs.has(rookieLessons[rookieLessons.length - 1].slug);
  const isRookieBossUnlocked = completedSlugs.has('sim-rookie-02-fix-narrow-audience') || completedSlugs.has('real-lab-rookie');

  // Progressive unlocking within Tier 2: Operator
  const isOperatorLessonUnlocked = (idx: number) => {
    if (!isOperatorTierUnlocked) return false;
    if (idx === 0) return true;
    return completedSlugs.has(operatorLessons[idx - 1].slug);
  };
  const areOperatorSimsUnlocked = isOperatorTierUnlocked && completedSlugs.has(operatorLessons[operatorLessons.length - 1].slug);
  const isOperatorBossUnlocked = isOperatorTierUnlocked && (completedSlugs.has('sim-operator-03-tracking-fix') || completedSlugs.has('real-lab-operator'));

  // Progressive unlocking within Tier 3: Strategist
  const isStrategistLessonUnlocked = (idx: number) => {
    if (!isStrategistTierUnlocked) return false;
    if (idx === 0) return true;
    return completedSlugs.has(strategistLessons[idx - 1].slug);
  };
  const areStrategistSimsUnlocked = isStrategistTierUnlocked && completedSlugs.has(strategistLessons[strategistLessons.length - 1].slug);
  const isStrategistBossUnlocked = isStrategistTierUnlocked && (completedSlugs.has('sim-strategist-02-account-audit') || completedSlugs.has('real-lab-strategist'));

  const handleLabCompleted = (labId: string) => {
    setCompletedSlugs((prev) => {
      const next = new Set(prev);
      next.add(labId);
      return next;
    });
  };

  // Helper to render the SINGLE LINEAR PROGRESSION FLOW for any tier
  const renderSingleFlowTierTree = (
    lessons: { slug: string; title: string }[],
    isUnlockedFn: (idx: number) => boolean,
    sims: { slug: string; title: string; target: string }[],
    areSimsUnlocked: boolean,
    labKey: 'real-lab-rookie' | 'real-lab-operator' | 'real-lab-strategist',
    bossSlug: string,
    bossTitle: string,
    tierName: string,
    isBossUnlocked: boolean
  ) => {
    const completedLessonsCount = lessons.filter((l) => completedSlugs.has(l.slug)).length;
    const progressPercent = Math.round((completedLessonsCount / lessons.length) * 100);

    return (
      <div className="space-y-6">
        {/* Tier Progress Summary Banner */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-heading font-extrabold text-sm flex items-center justify-center">
              {progressPercent}%
            </span>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                {tierName} Progress
              </span>
              <span className="font-heading font-bold text-sm text-slate-800 dark:text-slate-100">
                {completedLessonsCount} of {lessons.length} Units Mastered
              </span>
            </div>
          </div>

          <div className="w-32 sm:w-48 bg-slate-100 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden hidden sm:block">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* COMBINED LINEAR ROADMAP (Single Flow: Visual Guide + Lesson + Quiz) */}
        <div className="space-y-3.5">
          {lessons.map((l, idx) => {
            const isCompleted = completedSlugs.has(l.slug);
            const isUnlocked = isUnlockedFn(idx);
            const concept = teachingConcepts[l.slug];

            return (
              <div
                key={l.slug}
                className={`p-4 sm:p-5 rounded-3xl border transition-all ${
                  isCompleted
                    ? 'bg-white dark:bg-slate-800/90 border-emerald-200 dark:border-emerald-900/60 shadow-sm'
                    : isUnlocked
                    ? 'bg-white dark:bg-slate-800 border-indigo-300 dark:border-indigo-700/80 shadow-md ring-2 ring-indigo-500/10'
                    : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
                } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
              >
                {/* Left Side: Unit Index, Title & Concept Highlights */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span
                    className={`w-11 h-11 rounded-2xl font-heading font-extrabold text-sm flex items-center justify-center shrink-0 shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-500 text-white'
                        : isUnlocked
                        ? 'bg-indigo-600 text-white animate-pulse'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : `U${idx + 1}`}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                        Unit {idx + 1}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">•</span>
                      <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                        Study Guide & Quiz
                      </span>
                    </div>

                    <h4 className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 truncate mt-0.5">
                      {l.title.replace(/^\d+\.\s*/, '')}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 max-w-md">
                      {concept?.subtitle || 'Interactive Strategy & Performance Architecture'}
                    </p>
                  </div>
                </div>

                {/* Right Side: Single Unified Action Button */}
                <div className="w-full sm:w-auto shrink-0 flex items-center justify-end">
                  {isUnlocked ? (
                    <Link
                      href={`/lesson/${l.slug}`}
                      className={`w-full sm:w-auto py-2.5 px-5 rounded-2xl font-heading font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-98 ${
                        isCompleted
                          ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/25'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <Star size={15} className="fill-emerald-500 text-emerald-500" />
                          <span>Review Unit ➔</span>
                        </>
                      ) : (
                        <>
                          <Play size={14} className="fill-white" />
                          <span>Start Unit ➔</span>
                        </>
                      )}
                    </Link>
                  ) : (
                    <div className="w-full sm:w-auto py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-bold flex items-center justify-center gap-1.5 border border-slate-200 dark:border-slate-700">
                      <Lock size={13} />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CAPSTONE SIMULATORS, REAL LAB & BOSS BATTLE ROW */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-amber-300 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Flag size={18} />
              <span>Capstone Simulators & Real-World Labs</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              {completedLessonsCount === lessons.length ? 'Unlocked 🎉' : 'Complete All Units to Unlock'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sims.map((sim) => {
              const isSimPassed = completedSlugs.has(sim.slug);
              return (
                <Link
                  key={sim.slug}
                  href={areSimsUnlocked ? `/sim/${sim.slug}` : '#'}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                    isSimPassed
                      ? 'border-emerald-300 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : areSimsUnlocked
                      ? 'border-amber-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-amber-500'
                      : 'border-slate-200 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
                  }`}
                >
                  <Flag size={20} className={isSimPassed ? 'text-emerald-500 mb-1' : 'text-amber-500 mb-1'} />
                  <span className="font-heading font-bold text-xs">{sim.title}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{sim.target}</span>
                </Link>
              );
            })}

            {/* Real Lab */}
            <button
              type="button"
              disabled={!areSimsUnlocked}
              onClick={() => areSimsUnlocked && setSelectedLab(realLabs[labKey])}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                completedSlugs.has(labKey)
                  ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : areSimsUnlocked
                  ? 'border-indigo-300 bg-white dark:bg-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-100'
                  : 'border-slate-200 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed opacity-60'
              }`}
            >
              <Camera size={20} className="mb-1 text-indigo-600" />
              <span className="font-heading font-bold text-xs">{realLabs[labKey]?.title}</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                {completedSlugs.has(labKey) ? 'Verified ✓ (+XP)' : 'Upload Proof (+XP)'}
              </span>
            </button>
          </div>

          {/* Boss Battle Action Button */}
          <div className="pt-2">
            <Link
              href={isBossUnlocked ? `/boss/${bossSlug}` : '#'}
              className={`w-full py-4 px-6 rounded-2xl text-white font-heading font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 transition-all ${
                completedSlugs.has(bossSlug)
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : isBossUnlocked
                  ? 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 shadow-rose-500/20 animate-pulse'
                  : 'bg-slate-400 dark:bg-slate-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Shield size={24} className="fill-white" />
              <span>
                {completedSlugs.has(bossSlug)
                  ? `${bossTitle} Conquered! View Certificate 🏆`
                  : isBossUnlocked
                  ? `Conquer ${bossTitle} & Claim Your ${tierName} E-Certificate ⚔️`
                  : `Complete All Simulators to Unlock ${bossTitle} 🔒`}
              </span>
              <Award size={20} />
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 py-3">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-600 rounded-3xl p-6 text-white shadow-card flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
            Campaign Roadmap
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl mt-0.5">
            Meta Ads Learning Pathway
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 mt-1 max-w-md">
            Complete each unit's visual study guide & quiz step-by-step. Clear all units, pass the simulators, and defeat the Boss to unlock the next Tier!
          </p>
        </div>
        <PixieMascot mood="happy" size={76} className="shrink-0 hidden sm:block" />
      </div>

      {/* Tier Switcher Tabs (With Lock Indicators) */}
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
          {completedSlugs.has('boss-rookie-launch-day') && (
            <span className="text-emerald-500 font-bold text-xs">✓</span>
          )}
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
          {!isOperatorTierUnlocked && <Lock size={13} className="text-slate-400" />}
          {completedSlugs.has('boss-operator-expensive-leads') && (
            <span className="text-emerald-500 font-bold text-xs">✓</span>
          )}
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
          {!isStrategistTierUnlocked && <Lock size={13} className="text-slate-400" />}
          {completedSlugs.has('boss-strategist-scale-or-kill') && (
            <span className="text-emerald-500 font-bold text-xs">✓</span>
          )}
        </button>
      </div>

      {/* TIER 1: ROOKIE (Always available as starting point) */}
      {activeTierTab === 'rookie' &&
        renderSingleFlowTierTree(
          rookieLessons,
          isRookieLessonUnlocked,
          rookieSims,
          areRookieSimsUnlocked,
          'real-lab-rookie',
          'boss-rookie-launch-day',
          'Boss 1: Launch Day Pre-Flight',
          'Tier 1 (Rookie)',
          isRookieBossUnlocked
        )}

      {/* TIER 2: OPERATOR (Strictly Locked until Boss 1 is conquered) */}
      {activeTierTab === 'operator' && (
        <>
          {!isOperatorTierUnlocked ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-amber-300 dark:border-amber-800/60 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center shadow-inner">
                <Lock size={32} />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Locked Stage
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-1">
                  Tier 2: Operator is Locked
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  You must complete all 10 Rookie lessons and defeat <strong>Boss 1: Launch Day Pre-Flight</strong> to unlock Custom Audiences, Lookalikes, Meta Pixel & CAPI tracking!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => setActiveTierTab('rookie')}
                  className="py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md"
                >
                  ← Return to Tier 1: Rookie Pathway
                </button>
                <Link
                  href="/boss/boss-rookie-launch-day"
                  className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <span>Battle Boss 1 (Launch Day) ⚔️</span>
                </Link>
              </div>
            </div>
          ) : (
            renderSingleFlowTierTree(
              operatorLessons,
              isOperatorLessonUnlocked,
              operatorSims,
              areOperatorSimsUnlocked,
              'real-lab-operator',
              'boss-operator-expensive-leads',
              'Boss 2: Expensive Leads Autopsy',
              'Tier 2 (Operator)',
              isOperatorBossUnlocked
            )
          )}
        </>
      )}

      {/* TIER 3: STRATEGIST (Strictly Locked until Boss 2 is conquered) */}
      {activeTierTab === 'strategist' && (
        <>
          {!isStrategistTierUnlocked ? (
            <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-800 border-2 border-dashed border-purple-300 dark:border-purple-800/60 text-center space-y-5 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center shadow-inner">
                <Lock size={32} />
              </div>
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Locked Stage
                </span>
                <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-1">
                  Tier 3: Strategist is Locked
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  You must complete Tier 2: Operator and defeat <strong>Boss 2: Expensive Leads Autopsy</strong> to unlock Full-Funnel Architecture, Safe 20% Scaling & Advantage+ Shopping!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <button
                  onClick={() => setActiveTierTab('operator')}
                  className="py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md"
                >
                  ← Return to Tier 2: Operator
                </button>
                <Link
                  href="/boss/boss-operator-expensive-leads"
                  className="py-3.5 px-6 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-heading font-bold text-sm shadow-md flex items-center justify-center gap-2"
                >
                  <span>Battle Boss 2 (Expensive Leads) ⚔️</span>
                </Link>
              </div>
            </div>
          ) : (
            renderSingleFlowTierTree(
              strategistLessons,
              isStrategistLessonUnlocked,
              strategistSims,
              areStrategistSimsUnlocked,
              'real-lab-strategist',
              'boss-strategist-scale-or-kill',
              'Boss 3: Scale or Kill Decision',
              'Tier 3 (Strategist)',
              isStrategistBossUnlocked
            )
          )}
        </>
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
    </div>
  );
}
