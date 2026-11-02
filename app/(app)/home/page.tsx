'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { XPBar } from '@/components/game/XPBar';
import { StreakFlame } from '@/components/game/StreakFlame';
import { CoinBadge } from '@/components/game/CoinBadge';
import { createClient } from '@/lib/supabase/client';
import {
  Play,
  Calendar,
  Briefcase,
  Award,
  Bell,
  ArrowRight,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';

export default function HomePage() {
  const { profile, unreadNotesCount } = useGame();
  const [completedCount, setCompletedCount] = useState(0);
  const [latestNote, setLatestNote] = useState<any>(null);
  const [readinessScore, setReadinessScore] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    async function loadDashboardData() {
      if (!profile?.id) return;
      try {
        // Lessons completed
        const { count } = await supabase
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id)
          .eq('status', 'completed');
        setCompletedCount(count || 0);

        // Latest mentor note
        const { data: notes } = await supabase
          .from('mentor_notes')
          .select('*')
          .eq('to_user', profile.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (notes?.length) setLatestNote(notes[0]);

        // Readiness score calculation
        const { data: attempts } = await supabase
          .from('interview_attempts')
          .select('score')
          .eq('user_id', profile.id);

        if (attempts && attempts.length > 0) {
          const avgScore = attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length;
          const avgPct = (avgScore / 20) * 100;
          const coveragePct = Math.min(100, (attempts.length / 15) * 100);
          setReadinessScore(Math.round(0.6 * avgPct + 0.4 * coveragePct));
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      }
    }
    loadDashboardData();
  }, [profile?.id]);

  const nextLessonSlug = 'meta-rookie-01-what-is-performance-marketing';

  return (
    <div className="space-y-6">
      {/* Hero Welcome Card */}
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold backdrop-blur-sm">
            <Sparkles size={14} className="text-amber-300" />
            <span>Welcome back, {profile?.display_name || 'Learner'}!</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Ready to master performance ads?
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-md">
            Complete short 5-minute interactive missions, earn AdCoins, and practice for real marketing roles.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <Link
              href={`/lesson/${nextLessonSlug}`}
              className="py-3 px-6 rounded-2xl bg-white text-indigo-700 font-heading font-bold text-sm shadow-md hover:bg-indigo-50 active:scale-98 flex items-center gap-2 transition-all"
            >
              <Play size={16} className="fill-indigo-700" />
              <span>Continue Learning</span>
            </Link>
            <Link
              href="/map"
              className="py-3 px-5 rounded-2xl bg-indigo-500/30 hover:bg-indigo-500/40 text-white font-bold text-sm backdrop-blur-sm flex items-center gap-2 transition-all"
            >
              <span>View Map</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <PixieMascot mood="happy" size={96} className="shrink-0" />
      </div>

      {/* Level & XP Progression Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border border-slate-200/80 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Player Level & XP
          </span>
          <div className="flex items-center gap-2">
            <StreakFlame streak={profile?.streak ?? 1} size="sm" />
            <CoinBadge coins={profile?.coins ?? 0} size="sm" />
          </div>
        </div>
        <XPBar xp={profile?.xp ?? 0} />
      </div>

      {/* 2-Column Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Challenge Card */}
        <Link
          href="/daily"
          className="group bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600">
              <Calendar size={24} />
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200">
              +30 XP Daily
            </span>
          </div>
          <div className="mt-4">
            <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
              Today's Quick Challenge
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Test your recall with 3 rapid questions from lessons you've completed.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Start Challenge</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        {/* Interview Dojo Card */}
        <Link
          href="/interview"
          className="group bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
              <Briefcase size={24} />
            </div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full">
              <span>Readiness: {readinessScore}%</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
              Interview Dojo & Portfolio
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Practice real questions asked at top Indian performance marketing agencies.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400">
            <span>Enter Dojo</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>

      {/* Latest Mentor Note */}
      {latestNote && (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 flex items-center justify-center shrink-0">
            <Bell size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Mentor Note
              </span>
              {latestNote.xp_reward > 0 && (
                <span className="text-xs font-bold text-amber-600">
                  +{latestNote.xp_reward} XP Challenge
                </span>
              )}
            </div>
            <h4 className="font-heading font-bold text-base text-slate-800 dark:text-slate-100 mt-0.5">
              {latestNote.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              {latestNote.body}
            </p>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Missions Done</span>
          <div className="font-heading font-bold text-xl text-slate-800 dark:text-slate-100 mt-1">
            {completedCount}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Streak Freezes</span>
          <div className="font-heading font-bold text-xl text-slate-800 dark:text-slate-100 mt-1">
            {profile?.streak_freezes ?? 0}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-center shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Best Streak</span>
          <div className="font-heading font-bold text-xl text-rose-600 mt-1">
            {profile?.best_streak ?? 1} Days
          </div>
        </div>
      </div>
    </div>
  );
}

