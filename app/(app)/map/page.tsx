'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getWorlds, WorldMap } from '@/lib/content/loader';
import { useGame } from '@/components/game/GameContext';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import {
  Lock,
  CheckCircle2,
  Play,
  Flag,
  Shield,
  Star,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export default function WorldMapPage() {
  const { profile } = useGame();
  const [completedSlugs, setCompletedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
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

        const set = new Set<string>();
        lp?.forEach((r) => set.add(r.lesson_slug));
        sr?.forEach((r) => set.add(r.task_slug));
        ba?.forEach((r) => set.add(r.boss_slug));

        setCompletedSlugs(set);
      } catch (err) {
        console.error('Failed to load map progress:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProgress();
  }, [profile?.id]);

  // Static tiers definition from worlds.json
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

  const rookieBoss = { slug: 'boss-rookie-launch-day', title: 'Boss 1: Launch Day' };

  // Calculate unlocks:
  // Lesson 1 is always unlocked.
  // Next lesson unlocks if previous is completed.
  const isLessonUnlocked = (index: number) => {
    if (index === 0) return true;
    const prevSlug = rookieLessons[index - 1].slug;
    return completedSlugs.has(prevSlug);
  };

  const areRookieSimsUnlocked = completedSlugs.has('meta-rookie-10-launch-checklist-first-results');
  const isRookieBossUnlocked = completedSlugs.has('sim-rookie-02-fix-narrow-audience') || completedSlugs.has('sim-rookie-01-salon-leads');
  const isOperatorTierUnlocked = completedSlugs.has('boss-rookie-launch-day');

  return (
    <div className="max-w-xl mx-auto space-y-8 py-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white shadow-card flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
            World 1
          </span>
          <h2 className="font-heading font-extrabold text-2xl mt-0.5">Meta Ads Universe</h2>
          <p className="text-xs text-indigo-100 mt-1 max-w-xs">
            Follow the winding path from Rookie to Head of Performance.
          </p>
        </div>
        <PixieMascot mood="happy" size={68} />
      </div>

      {/* Tier 1: Rookie Path */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
              Tier 1: Rookie
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Foundations, metrics, auction & launch checklist</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
            Active Tier
          </span>
        </div>

        {/* Winding Path Nodes */}
        <div className="relative flex flex-col items-center space-y-6">
          {/* Path line background */}
          <div className="absolute top-6 bottom-6 w-1.5 bg-slate-200 dark:bg-slate-700 -z-0 rounded-full" />

          {/* Lessons */}
          {rookieLessons.map((l, idx) => {
            const isCompleted = completedSlugs.has(l.slug);
            const isUnlocked = isLessonUnlocked(idx);
            const isCurrent = isUnlocked && !isCompleted;

            // Alternate zigzag left/right slightly for playful winding look
            const offset = idx % 2 === 0 ? '-translate-x-6' : 'translate-x-6';

            return (
              <div
                key={l.slug}
                className={`z-10 flex items-center gap-3 transition-transform ${offset}`}
              >
                {isUnlocked ? (
                  <Link
                    href={`/lesson/${l.slug}`}
                    className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 ${
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
                    <span className="sr-only">{l.title}</span>
                  </Link>
                ) : (
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400">
                    <Lock size={20} />
                  </div>
                )}

                <div className="text-left max-w-[180px]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Lesson {idx + 1}
                  </span>
                  <span className={`text-xs font-heading font-bold line-clamp-2 ${
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

          {/* Divider to Sims */}
          <div className="z-10 py-2">
            <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900">
              🛠️ Practice Simulators
            </span>
          </div>

          {/* Sims */}
          {rookieSims.map((sim, sIdx) => {
            const isCompleted = completedSlugs.has(sim.slug);
            const isUnlocked = areRookieSimsUnlocked;

            return (
              <div key={sim.slug} className="z-10 flex items-center gap-3">
                {isUnlocked ? (
                  <Link
                    href={`/sim/${sim.slug}`}
                    className={`flex items-center justify-center w-14 h-14 rounded-2xl shadow-md transition-all active:scale-95 ${
                      isCompleted
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                        : 'bg-amber-600 text-white ring-4 ring-amber-200 animate-bounce'
                    }`}
                  >
                    <Flag size={22} className="fill-white" />
                  </Link>
                ) : (
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-400">
                    <Lock size={20} />
                  </div>
                )}
                <div className="text-left max-w-[180px]">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">
                    Simulator {sIdx + 1}
                  </span>
                  <span className="text-xs font-heading font-bold text-slate-800 dark:text-slate-200">
                    {sim.title}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Boss Battle Castle Node */}
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

      {/* Tier 2: Operator (Locked until Boss 1 completed) */}
      <div className={`rounded-3xl p-6 sm:p-8 shadow-card border transition-all ${
        isOperatorTierUnlocked
          ? 'bg-white dark:bg-slate-800 border-slate-200'
          : 'bg-slate-100/60 dark:bg-slate-800/40 border-slate-200/40 opacity-75'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
                Tier 2: Operator
              </h3>
              {!isOperatorTierUnlocked && <Lock size={16} className="text-slate-400" />}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Custom/Lookalike Audiences, Pixel & CAPI, A/B Testing & Diagnostics.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            {isOperatorTierUnlocked ? 'Unlocked' : 'Beat Boss 1 to Unlock'}
          </span>
        </div>
      </div>

      {/* World 2: Google Ads (Locked Island) */}
      <div className="rounded-3xl p-6 bg-slate-100/80 dark:bg-slate-800/50 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold">
          <Lock size={12} />
          <span>Locked Realm</span>
        </div>
        <h4 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-300">
          World 2: Google Ads
        </h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Search Ads, Performance Max, YouTube Ads & GA4. Coming soon in future expansions!
        </p>
      </div>
    </div>
  );
}
