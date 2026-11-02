'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGame } from '@/components/game/GameContext';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { RealLabModal, RealLabScenario } from '@/components/map/RealLabModal';
import { TeachingConceptViewer } from '@/components/map/TeachingConceptViewer';
import { ALL_TEACHING_CONCEPTS, TeachingConcept } from '@/lib/content/teaching-concepts';
import {
  Lock,
  Play,
  Flag,
  Shield,
  Star,
  Camera,
  BookOpen,
  Award,
  Sparkles,
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
  const teachingConcepts: Record<string, TeachingConcept> = ALL_TEACHING_CONCEPTS;

  // TIER 1: ROOKIE LESSONS (1-10)
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

  const isRookieLessonUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedSlugs.has(rookieLessons[idx - 1].slug);
  };
  const areRookieSimsUnlocked = completedSlugs.has(rookieLessons[rookieLessons.length - 1].slug) || completedSlugs.has('meta-rookie-01-what-is-performance-marketing');

  const isOperatorLessonUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedSlugs.has(operatorLessons[idx - 1].slug);
  };
  const areOperatorSimsUnlocked = completedSlugs.has(operatorLessons[operatorLessons.length - 1].slug) || completedSlugs.has('meta-operator-01-custom-audiences');

  const isStrategistLessonUnlocked = (idx: number) => {
    if (idx === 0) return true;
    return completedSlugs.has(strategistLessons[idx - 1].slug);
  };
  const areStrategistSimsUnlocked = completedSlugs.has(strategistLessons[strategistLessons.length - 1].slug) || completedSlugs.has('meta-strategist-01-funnel-architecture');

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

  // Helper to render dual column units tree for any tier
  const renderTierUnitsTree = (
    lessons: { slug: string; title: string }[],
    isUnlockedFn: (idx: number) => boolean,
    sims: { slug: string; title: string; target: string }[],
    areSimsUnlocked: boolean,
    labKey: 'real-lab-rookie' | 'real-lab-operator' | 'real-lab-strategist',
    bossSlug: string,
    bossTitle: string,
    tierName: string
  ) => {
    return (
      <div className="space-y-6">
        {/* Dual Flow Column Header */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <BookOpen size={20} />
            <h3 className="font-heading font-extrabold text-lg">
              Left: 📚 Visual Teaching Map
            </h3>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700">
              Visual Concept
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

        {/* Paired Interactive Units */}
        <div className="space-y-4">
          {lessons.map((l, idx) => {
            const isCompleted = completedSlugs.has(l.slug);
            const isUnlocked = isUnlockedFn(idx);
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
                      <h4
                        className={`font-heading font-bold text-xs sm:text-sm truncate ${
                          isCompleted
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-slate-800 dark:text-slate-100'
                        }`}
                      >
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

        {/* SIMULATORS, REAL LAB & BOSS BATTLE ROW */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-indigo-50/40 dark:from-slate-800 dark:to-slate-900 border-2 border-dashed border-amber-300 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-heading font-extrabold text-sm uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <Flag size={18} />
              <span>Capstone Simulators & Real-World Labs</span>
            </span>
            <span className="text-xs font-bold text-slate-500">
              Tier Mastery Hub
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {sims.map((sim, sIdx) => {
              const isSimPassed = completedSlugs.has(sim.slug);
              return (
                <Link
                  key={sim.slug}
                  href={`/sim/${sim.slug}`}
                  className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                    isSimPassed
                      ? 'border-emerald-300 bg-white dark:bg-slate-800 text-emerald-800 dark:text-emerald-300 shadow-sm'
                      : areSimsUnlocked
                      ? 'border-amber-300 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:border-amber-500'
                      : 'border-slate-200 bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Flag size={20} className="mb-1 text-amber-500" />
                  <span className="font-heading font-bold text-xs">{sim.title}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{sim.target}</span>
                </Link>
              );
            })}

            {/* Real Lab */}
            <button
              type="button"
              onClick={() => setSelectedLab(realLabs[labKey])}
              className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                completedSlugs.has(labKey)
                  ? 'border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200'
                  : 'border-indigo-300 bg-white dark:bg-slate-800 hover:border-indigo-500 text-slate-800 dark:text-slate-100'
              }`}
            >
              <Camera size={20} className="mb-1 text-indigo-600" />
              <span className="font-heading font-bold text-xs">{realLabs[labKey]?.title}</span>
              <span className="text-[10px] text-indigo-600 dark:text-indigo-400 mt-0.5">
                {completedSlugs.has(labKey) ? 'Verified ✓ (+XP)' : 'Upload Proof (+XP)'}
              </span>
            </button>
          </div>

          {/* Boss Battle CTA */}
          <div className="pt-2">
            <Link
              href={`/boss/${bossSlug}`}
              className={`w-full py-4 px-6 rounded-2xl text-white font-heading font-extrabold text-sm sm:text-base shadow-xl flex items-center justify-center gap-3 transition-all ${
                completedSlugs.has(bossSlug)
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 shadow-rose-500/20 animate-pulse'
              }`}
            >
              <Shield size={24} className="fill-white" />
              <span>
                {completedSlugs.has(bossSlug)
                  ? `${bossTitle} Conquered! Replay Battle or View Certificate 🏆`
                  : `Conquer ${bossTitle} & Claim Your ${tierName} E-Certificate ⚔️`}
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
        </button>
      </div>

      {/* TIER 1: ROOKIE FULL TREE */}
      {activeTierTab === 'rookie' &&
        renderTierUnitsTree(
          rookieLessons,
          isRookieLessonUnlocked,
          rookieSims,
          areRookieSimsUnlocked,
          'real-lab-rookie',
          'boss-rookie-launch-day',
          'Boss 1: Launch Day Pre-Flight',
          'Tier 1 (Rookie)'
        )}

      {/* TIER 2: OPERATOR FULL TREE */}
      {activeTierTab === 'operator' &&
        renderTierUnitsTree(
          operatorLessons,
          isOperatorLessonUnlocked,
          operatorSims,
          areOperatorSimsUnlocked,
          'real-lab-operator',
          'boss-operator-expensive-leads',
          'Boss 2: Expensive Leads Autopsy',
          'Tier 2 (Operator)'
        )}

      {/* TIER 3: STRATEGIST FULL TREE */}
      {activeTierTab === 'strategist' &&
        renderTierUnitsTree(
          strategistLessons,
          isStrategistLessonUnlocked,
          strategistSims,
          areStrategistSimsUnlocked,
          'real-lab-strategist',
          'boss-strategist-scale-or-kill',
          'Boss 3: Scale or Kill Decision',
          'Tier 3 (Strategist)'
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
