'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { RealLabModal, RealLabScenario } from '@/components/map/RealLabModal';
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
  ChevronDown,
} from 'lucide-react';

export default function WorldMapPage() {
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

  // Curriculum definitions
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

  const operatorLessons = [
    { slug: 'meta-operator-01-custom-audiences', title: '1. Custom Audiences' },
    { slug: 'meta-operator-02-lookalike-audiences', title: '2. Lookalike Audiences' },
    { slug: 'meta-operator-03-meta-pixel-and-events', title: '3. Pixel & Standard Events' },
    { slug: 'meta-operator-04-conversions-api-events-manager', title: '4. CAPI & Events Manager' },
    { slug: 'meta-operator-05-getting-leads-forms-vs-web-vs-whatsapp', title: '5. Lead Generation Funnels' },
    { slug: 'meta-operator-06-bidding-and-cost-controls', title: '6. Bidding & Cost Controls' },
    { slug: 'meta-operator-07-learning-phase-optimization', title: '7. Learning Phase Mastery' },
    { slug: 'meta-operator-08-creative-testing-framework', title: '8. Creative Testing Sandbox' },
    { slug: 'meta-operator-09-retargeting-funnels', title: '9. Retargeting Funnels' },
    { slug: 'meta-operator-10-reporting-and-breakdowns', title: '10. Advanced Breakdown Reporting' },
  ];

  const operatorSims = [
    { slug: 'sim-operator-01-budget-split', title: 'Sim O1: Budget Allocation' },
    { slug: 'sim-operator-02-creative-ab-test', title: 'Sim O2: Creative A/B Test' },
    { slug: 'sim-operator-03-tracking-fix', title: 'Sim O3: CAPI Tracking Fix' },
  ];

  const operatorBoss = { slug: 'boss-operator-expensive-leads', title: 'Boss 2: Expensive Leads Autopsy' };

  const strategistLessons = [
    { slug: 'meta-strategist-01-funnel-architecture', title: '1. Full-Funnel Architecture' },
    { slug: 'meta-strategist-02-scaling-safely', title: '2. Safe 20% Scaling Protocols' },
    { slug: 'meta-strategist-03-advantage-plus-campaigns', title: '3. Advantage+ Shopping (ASC)' },
    { slug: 'meta-strategist-04-attribution-and-incrementality', title: '4. Attribution & Incrementality' },
    { slug: 'meta-strategist-05-creative-strategy-at-scale', title: '5. Creative Strategy at Scale' },
    { slug: 'meta-strategist-06-account-structure-and-audits', title: '6. Account Consolidation Audits' },
    { slug: 'meta-strategist-07-client-reporting-communication', title: '7. Client Reporting & Talk' },
    { slug: 'meta-strategist-08-policies-rejections-account-health', title: '8. Ad Policies & Rejections' },
  ];

  const strategistSims = [
    { slug: 'sim-strategist-01-scale-budget', title: 'Sim S1: Scale to ₹5k/Day' },
    { slug: 'sim-strategist-02-account-audit', title: 'Sim S2: Account Audit Overhaul' },
  ];

  const strategistBoss = { slug: 'boss-strategist-scale-or-kill', title: 'Boss 3: Scale or Kill? ₹50k Reallocation' };

  // Real-world practical labs
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

  // Unlocks calculations
  const isRookieLessonUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedSlugs.has(rookieLessons[idx - 1].slug);
  };
  const areRookieSimsUnlocked = completedSlugs.has(rookieLessons[rookieLessons.length - 1].slug);
  const isRookieLabUnlocked = completedSlugs.has('sim-rookie-01-salon-leads');
  const isRookieBossUnlocked = completedSlugs.has('sim-rookie-02-fix-narrow-audience') || completedSlugs.has('real-lab-rookie');

  const isOperatorUnlocked = completedSlugs.has('boss-rookie-launch-day');
  const isOperatorLessonUnlocked = (idx: number) => {
    if (!isOperatorUnlocked) return false;
    if (idx === 0) return true;
    return completedSlugs.has(operatorLessons[idx - 1].slug);
  };
  const areOperatorSimsUnlocked = isOperatorUnlocked && completedSlugs.has(operatorLessons[operatorLessons.length - 1].slug);
  const isOperatorLabUnlocked = completedSlugs.has('sim-operator-01-budget-split');
  const isOperatorBossUnlocked = completedSlugs.has('sim-operator-03-tracking-fix') || completedSlugs.has('real-lab-operator');

  const isStrategistUnlocked = completedSlugs.has('boss-operator-expensive-leads');
  const isStrategistLessonUnlocked = (idx: number) => {
    if (!isStrategistUnlocked) return false;
    if (idx === 0) return true;
    return completedSlugs.has(strategistLessons[idx - 1].slug);
  };
  const areStrategistSimsUnlocked = isStrategistUnlocked && completedSlugs.has(strategistLessons[strategistLessons.length - 1].slug);
  const isStrategistLabUnlocked = completedSlugs.has('sim-strategist-01-scale-budget');
  const isStrategistBossUnlocked = completedSlugs.has('sim-strategist-02-account-audit') || completedSlugs.has('real-lab-strategist');

  const handleLabCompleted = (labId: string) => {
    setCompletedSlugs((prev) => {
      const next = new Set(prev);
      next.add(labId);
      return next;
    });
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 py-3">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-amber-600 rounded-3xl p-6 text-white shadow-card flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider block">
            Campaign Journey
          </span>
          <h2 className="font-heading font-extrabold text-2xl mt-0.5">
            Meta Ads Universe
          </h2>
          <p className="text-xs text-indigo-100 mt-1 max-w-xs">
            Follow the winding roadmap through 3 mastery tiers, live simulators, real-world practical labs, and boss battles.
          </p>
        </div>
        <PixieMascot mood="happy" size={72} className="shrink-0" />
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
          {!isOperatorUnlocked && <Lock size={12} className="text-slate-400" />}
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
          {!isStrategistUnlocked && <Lock size={12} className="text-slate-400" />}
        </button>
      </div>

      {/* TAB CONTENT: ROOKIE */}
      {activeTierTab === 'rookie' && (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 dark:border-slate-700">
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Tier 1 Foundation
              </span>
              <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
                Rookie: Media Buying Basics
              </h3>
            </div>
            <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 rounded-full border border-emerald-200">
              Active Path
            </span>
          </div>

          <div className="relative flex flex-col items-center gap-6 py-6">
            {/* Center Winding Guideline */}
            <div className="absolute top-8 bottom-8 w-1.5 bg-gradient-to-b from-indigo-500 via-amber-400 to-rose-500 rounded-full opacity-30" />

            {/* 10 Rookie Lessons */}
            {rookieLessons.map((l, idx) => {
              const isCompleted = completedSlugs.has(l.slug);
              const isUnlocked = isRookieLessonUnlocked(idx);
              const isCurrent = isUnlocked && !isCompleted && (idx === 0 || completedSlugs.has(rookieLessons[idx - 1].slug));

              return (
                <div key={l.slug} className="z-10 flex items-center gap-3 w-full max-w-sm">
                  {isUnlocked ? (
                    <Link
                      href={`/lesson/${l.slug}`}
                      className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/40'
                          : isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900/60 animate-pulse'
                          : 'bg-indigo-500 text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <Star size={24} className="fill-amber-300 text-amber-300" />
                      ) : (
                        <Play size={20} className="fill-white translate-x-0.5" />
                      )}
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 shrink-0">
                      <Lock size={20} />
                    </div>
                  )}

                  <div className="text-left flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Lesson {idx + 1}
                    </span>
                    <span className={`text-xs font-heading font-bold truncate block ${
                      isCompleted
                        ? 'text-emerald-700 dark:text-emerald-400'
                        : isCurrent
                        ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      {l.title.replace(/^\d+\.\s*/, '')}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Simulators Divider */}
            <div className="z-10 py-2">
              <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900 flex items-center gap-1.5">
                <Flag size={13} />
                <span>Practice Simulators</span>
              </span>
            </div>

            {/* Rookie Sims */}
            {rookieSims.map((sim, sIdx) => {
              const isCompleted = completedSlugs.has(sim.slug);
              const isUnlocked = areRookieSimsUnlocked;

              return (
                <div key={sim.slug} className="z-10 flex items-center gap-3 w-full max-w-sm">
                  {isUnlocked ? (
                    <Link
                      href={`/sim/${sim.slug}`}
                      className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                        isCompleted
                          ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                          : 'bg-amber-600 text-white ring-4 ring-amber-200 animate-bounce'
                      }`}
                    >
                      <Flag size={22} className="fill-white" />
                    </Link>
                  ) : (
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 shrink-0">
                      <Lock size={20} />
                    </div>
                  )}
                  <div className="text-left flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                      Simulator {sIdx + 1}
                    </span>
                    <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200 truncate block">
                      {sim.title}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Real-World Lab 1 Node */}
            <div className="z-10 py-2 w-full max-w-sm">
              <div className="flex items-center gap-3 bg-amber-500/10 dark:bg-amber-950/30 p-3 rounded-2xl border-2 border-dashed border-amber-400 dark:border-amber-700">
                <button
                  type="button"
                  disabled={!isRookieLabUnlocked}
                  onClick={() => setSelectedLab(realLabs['real-lab-rookie'])}
                  className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                    completedSlugs.has('real-lab-rookie')
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                      : isRookieLabUnlocked
                      ? 'bg-amber-500 text-white ring-4 ring-amber-200 animate-pulse hover:bg-amber-600'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Camera size={24} />
                </button>
                <div className="text-left flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-500 text-white">
                      Real Exercise
                    </span>
                    {completedSlugs.has('real-lab-rookie') && (
                      <span className="text-emerald-600 text-[11px] font-bold">✓ Submitted</span>
                    )}
                  </div>
                  <h4 className="font-heading font-bold text-xs text-slate-800 dark:text-slate-100 truncate mt-0.5">
                    Meta Ad Library Competitor Spy
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Upload real screenshot proof (+50 XP)
                  </p>
                </div>
              </div>
            </div>

            {/* Boss 1 Node */}
            <div className="z-10 pt-4 flex flex-col items-center">
              {isRookieBossUnlocked ? (
                <Link
                  href={`/boss/${rookieBoss.slug}`}
                  className={`flex flex-col items-center justify-center w-20 h-20 rounded-3xl shadow-xl transition-all active:scale-95 ${
                    completedSlugs.has(rookieBoss.slug)
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                      : 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                  }`}
                >
                  <Shield size={32} className="fill-white mb-1" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">BOSS 1</span>
                </Link>
              ) : (
                <div className="flex flex-col items-center justify-center w-20 h-20 rounded-3xl bg-slate-200 dark:bg-slate-700 text-slate-400">
                  <Lock size={28} className="mb-1" />
                  <span className="text-[10px] font-bold">LOCKED</span>
                </div>
              )}
              <span className="mt-2 text-xs font-heading font-bold text-slate-800 dark:text-slate-100">
                Boss Battle: Launch Day!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: OPERATOR */}
      {activeTierTab === 'operator' && (
        <div className={`rounded-3xl p-6 sm:p-8 shadow-card border transition-all ${
          isOperatorUnlocked
            ? 'bg-white dark:bg-slate-800 border-slate-200'
            : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 opacity-90'
        }`}>
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Tier 2 Operator
              </span>
              <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
                Pixel, CAPI, Bidding & Tests
              </h3>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              isOperatorUnlocked
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-200 text-slate-600 border-slate-300'
            }`}>
              {isOperatorUnlocked ? 'Unlocked' : 'Beat Boss 1 to Unlock'}
            </span>
          </div>

          {!isOperatorUnlocked ? (
            <div className="py-12 text-center space-y-3">
              <Lock size={44} className="mx-auto text-slate-400" />
              <h4 className="font-heading font-bold text-base text-slate-700 dark:text-slate-300">
                Tier 2 is currently locked
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete the Tier 1 Rookie lessons and defeat Boss 1 (Launch Day) to unlock Custom Audiences, Pixel CAPI, and Bidding controls!
              </p>
              <button
                onClick={() => setActiveTierTab('rookie')}
                className="mt-2 py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Go to Tier 1 Roadmap
              </button>
            </div>
          ) : (
            <div className="relative flex flex-col items-center gap-6 py-6">
              <div className="absolute top-8 bottom-8 w-1.5 bg-gradient-to-b from-indigo-500 via-amber-400 to-rose-500 rounded-full opacity-30" />

              {/* 10 Operator Lessons */}
              {operatorLessons.map((l, idx) => {
                const isCompleted = completedSlugs.has(l.slug);
                const isUnlocked = isOperatorLessonUnlocked(idx);
                const isCurrent = isUnlocked && !isCompleted && (idx === 0 || completedSlugs.has(operatorLessons[idx - 1].slug));

                return (
                  <div key={l.slug} className="z-10 flex items-center gap-3 w-full max-w-sm">
                    {isUnlocked ? (
                      <Link
                        href={`/lesson/${l.slug}`}
                        className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/40'
                            : isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900/60 animate-pulse'
                            : 'bg-indigo-500 text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <Star size={24} className="fill-amber-300 text-amber-300" />
                        ) : (
                          <Play size={20} className="fill-white translate-x-0.5" />
                        )}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 shrink-0">
                        <Lock size={20} />
                      </div>
                    )}

                    <div className="text-left flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Lesson {idx + 1}
                      </span>
                      <span className={`text-xs font-heading font-bold truncate block ${
                        isCompleted
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : isCurrent
                          ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {l.title.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Sims */}
              <div className="z-10 py-2">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900 flex items-center gap-1.5">
                  <Flag size={13} />
                  <span>Operator Simulators</span>
                </span>
              </div>

              {operatorSims.map((sim, sIdx) => {
                const isCompleted = completedSlugs.has(sim.slug);
                const isUnlocked = areOperatorSimsUnlocked;

                return (
                  <div key={sim.slug} className="z-10 flex items-center gap-3 w-full max-w-sm">
                    {isUnlocked ? (
                      <Link
                        href={`/sim/${sim.slug}`}
                        className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                          isCompleted
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                            : 'bg-amber-600 text-white ring-4 ring-amber-200 animate-bounce'
                        }`}
                      >
                        <Flag size={22} className="fill-white" />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 shrink-0">
                        <Lock size={20} />
                      </div>
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                        Simulator {sIdx + 1}
                      </span>
                      <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {sim.title}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Real-World Lab 2 Node */}
              <div className="z-10 py-2 w-full max-w-sm">
                <div className="flex items-center gap-3 bg-indigo-500/10 dark:bg-indigo-950/30 p-3 rounded-2xl border-2 border-dashed border-indigo-400 dark:border-indigo-700">
                  <button
                    type="button"
                    disabled={!isOperatorLabUnlocked}
                    onClick={() => setSelectedLab(realLabs['real-lab-operator'])}
                    className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                      completedSlugs.has('real-lab-operator')
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                        : isOperatorLabUnlocked
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 animate-pulse hover:bg-indigo-700'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Camera size={24} />
                  </button>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-600 text-white">
                        Real Exercise
                      </span>
                      {completedSlugs.has('real-lab-operator') && (
                        <span className="text-emerald-600 text-[11px] font-bold">✓ Submitted</span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-xs text-slate-800 dark:text-slate-100 truncate mt-0.5">
                      Live Pixel Helper Audit
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload live event proof (+60 XP)
                    </p>
                  </div>
                </div>
              </div>

              {/* Boss 2 Node */}
              <div className="z-10 pt-4 flex flex-col items-center">
                {isOperatorBossUnlocked ? (
                  <Link
                    href={`/boss/${operatorBoss.slug}`}
                    className={`flex flex-col items-center justify-center w-20 h-20 rounded-3xl shadow-xl transition-all active:scale-95 ${
                      completedSlugs.has(operatorBoss.slug)
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                        : 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                    }`}
                  >
                    <Shield size={32} className="fill-white mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">BOSS 2</span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-3xl bg-slate-200 dark:bg-slate-700 text-slate-400">
                    <Lock size={28} className="mb-1" />
                    <span className="text-[10px] font-bold">LOCKED</span>
                  </div>
                )}
                <span className="mt-2 text-xs font-heading font-bold text-slate-800 dark:text-slate-100">
                  Boss 2: Expensive Leads
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: STRATEGIST */}
      {activeTierTab === 'strategist' && (
        <div className={`rounded-3xl p-6 sm:p-8 shadow-card border transition-all ${
          isStrategistUnlocked
            ? 'bg-white dark:bg-slate-800 border-slate-200'
            : 'bg-slate-100 dark:bg-slate-800/40 border-slate-200 opacity-90'
        }`}>
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-700/60">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Tier 3 Strategist
              </span>
              <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
                Full-Funnel & Safe Scaling
              </h3>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
              isStrategistUnlocked
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-200 text-slate-600 border-slate-300'
            }`}>
              {isStrategistUnlocked ? 'Unlocked' : 'Beat Boss 2 to Unlock'}
            </span>
          </div>

          {!isStrategistUnlocked ? (
            <div className="py-12 text-center space-y-3">
              <Lock size={44} className="mx-auto text-slate-400" />
              <h4 className="font-heading font-bold text-base text-slate-700 dark:text-slate-300">
                Tier 3 is currently locked
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete Tier 2 Operator and defeat Boss 2 (Expensive Leads Autopsy) to unlock Safe Scaling, Advantage+ Shopping, and Executive Client Reporting!
              </p>
              <button
                onClick={() => setActiveTierTab('operator')}
                className="mt-2 py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs"
              >
                Go to Tier 2 Roadmap
              </button>
            </div>
          ) : (
            <div className="relative flex flex-col items-center gap-6 py-6">
              <div className="absolute top-8 bottom-8 w-1.5 bg-gradient-to-b from-indigo-500 via-amber-400 to-rose-500 rounded-full opacity-30" />

              {/* 8 Strategist Lessons */}
              {strategistLessons.map((l, idx) => {
                const isCompleted = completedSlugs.has(l.slug);
                const isUnlocked = isStrategistLessonUnlocked(idx);
                const isCurrent = isUnlocked && !isCompleted && (idx === 0 || completedSlugs.has(strategistLessons[idx - 1].slug));

                return (
                  <div key={l.slug} className="z-10 flex items-center gap-3 w-full max-w-sm">
                    {isUnlocked ? (
                      <Link
                        href={`/lesson/${l.slug}`}
                        className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                          isCompleted
                            ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 dark:ring-emerald-900/40'
                            : isCurrent
                            ? 'bg-indigo-600 text-white ring-4 ring-indigo-200 dark:ring-indigo-900/60 animate-pulse'
                            : 'bg-indigo-500 text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <Star size={24} className="fill-amber-300 text-amber-300" />
                        ) : (
                          <Play size={20} className="fill-white translate-x-0.5" />
                        )}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 shrink-0">
                        <Lock size={20} />
                      </div>
                    )}

                    <div className="text-left flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Lesson {idx + 1}
                      </span>
                      <span className={`text-xs font-heading font-bold truncate block ${
                        isCompleted
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : isCurrent
                          ? 'text-indigo-600 dark:text-indigo-400 font-extrabold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}>
                        {l.title.replace(/^\d+\.\s*/, '')}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Sims */}
              <div className="z-10 py-2">
                <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900 flex items-center gap-1.5">
                  <Flag size={13} />
                  <span>Strategist Simulators</span>
                </span>
              </div>

              {strategistSims.map((sim, sIdx) => {
                const isCompleted = completedSlugs.has(sim.slug);
                const isUnlocked = areStrategistSimsUnlocked;

                return (
                  <div key={sim.slug} className="z-10 flex items-center gap-3 w-full max-w-sm">
                    {isUnlocked ? (
                      <Link
                        href={`/sim/${sim.slug}`}
                        className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                          isCompleted
                            ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                            : 'bg-amber-600 text-white ring-4 ring-amber-200 animate-bounce'
                        }`}
                      >
                        <Flag size={22} className="fill-white" />
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400 shrink-0">
                        <Lock size={20} />
                      </div>
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                        Simulator {sIdx + 1}
                      </span>
                      <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200 truncate block">
                        {sim.title}
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* Real-World Lab 3 Node */}
              <div className="z-10 py-2 w-full max-w-sm">
                <div className="flex items-center gap-3 bg-purple-500/10 dark:bg-purple-950/30 p-3 rounded-2xl border-2 border-dashed border-purple-400 dark:border-purple-700">
                  <button
                    type="button"
                    disabled={!isStrategistLabUnlocked}
                    onClick={() => setSelectedLab(realLabs['real-lab-strategist'])}
                    className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 shrink-0 ${
                      completedSlugs.has('real-lab-strategist')
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                        : isStrategistLabUnlocked
                        ? 'bg-purple-600 text-white ring-4 ring-purple-200 animate-pulse hover:bg-purple-700'
                        : 'bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Camera size={24} />
                  </button>
                  <div className="text-left flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-600 text-white">
                        Real Exercise
                      </span>
                      {completedSlugs.has('real-lab-strategist') && (
                        <span className="text-emerald-600 text-[11px] font-bold">✓ Submitted</span>
                      )}
                    </div>
                    <h4 className="font-heading font-bold text-xs text-slate-800 dark:text-slate-100 truncate mt-0.5">
                      Live Account Structure Audit
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Upload live spend table proof (+75 XP)
                    </p>
                  </div>
                </div>
              </div>

              {/* Boss 3 Node */}
              <div className="z-10 pt-4 flex flex-col items-center">
                {isStrategistBossUnlocked ? (
                  <Link
                    href={`/boss/${strategistBoss.slug}`}
                    className={`flex flex-col items-center justify-center w-20 h-20 rounded-3xl shadow-xl transition-all active:scale-95 ${
                      completedSlugs.has(strategistBoss.slug)
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                        : 'bg-rose-600 text-white ring-4 ring-rose-200 animate-pulse'
                    }`}
                  >
                    <Shield size={32} className="fill-white mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">BOSS 3</span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center justify-center w-20 h-20 rounded-3xl bg-slate-200 dark:bg-slate-700 text-slate-400">
                    <Lock size={28} className="mb-1" />
                    <span className="text-[10px] font-bold">LOCKED</span>
                  </div>
                )}
                <span className="mt-2 text-xs font-heading font-bold text-slate-800 dark:text-slate-100 text-center max-w-[200px]">
                  Boss 3: Scale or Kill?
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* World 2: Google Ads (Locked Island) */}
      <div className="rounded-3xl p-6 bg-slate-100/80 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
          <Lock size={12} />
          <span>Locked Realm</span>
        </div>
        <h4 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-300">
          World 2: Google Ads Realm
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Search Ads, Performance Max, YouTube Ads & GA4. Complete Meta Ads Universe to unlock!
        </p>
      </div>

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
