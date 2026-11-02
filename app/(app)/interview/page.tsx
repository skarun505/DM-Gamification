'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { createClient } from '@/lib/supabase/client';
import {
  Briefcase,
  Layers,
  Timer,
  PlayCircle,
  FileText,
  Star,
  CheckCircle2,
  Lock,
  ArrowRight,
  TrendingUp,
  Sparkles,
} from 'lucide-react';

export default function InterviewDojoHub() {
  const { profile } = useGame();
  const [readinessScore, setReadinessScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [starStoriesCount, setStarStoriesCount] = useState(0);
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDojoStats() {
      if (!profile?.id) return;
      try {
        // Attempts
        const { data: attempts } = await supabase
          .from('interview_attempts')
          .select('score, box, next_due')
          .eq('user_id', profile.id);

        if (attempts && attempts.length > 0) {
          const avgScore = attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length;
          const avgScorePct = (avgScore / 20) * 100;
          const coveragePct = Math.min(100, (attempts.length / 15) * 100);
          const readiness = Math.round(0.6 * avgScorePct + 0.4 * coveragePct);
          setReadinessScore(readiness);
          setAnsweredCount(attempts.length);

          const today = new Date().toISOString().split('T')[0];
          const due = attempts.filter((a) => !a.next_due || a.next_due <= today).length;
          setDueCardsCount(due);
        } else {
          setDueCardsCount(3);
        }

        // STAR Stories
        const { count: starCount } = await supabase
          .from('star_stories')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);
        setStarStoriesCount(starCount || 0);
      } catch (err) {
        console.error('Failed to load dojo stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDojoStats();
  }, [profile?.id]);

  const getReadinessLabel = (score: number) => {
    if (score < 40) return { label: 'Warming Up', color: 'text-amber-500' };
    if (score < 70) return { label: 'Getting Sharp', color: 'text-indigo-600' };
    if (score < 85) return { label: 'Interview Ready', color: 'text-emerald-600' };
    return { label: 'Hire Me!', color: 'text-rose-600' };
  };

  const status = getReadinessLabel(readinessScore);

  const modes = [
    {
      title: 'Learn Cards',
      desc: 'Master 40+ concept questions with model answers and Leitner spaced repetition.',
      href: '/interview/learn',
      icon: Layers,
      badge: `${dueCardsCount} Due Today`,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60',
    },
    {
      title: 'Rapid Fire',
      desc: '10 timed questions (30s each). Instant feedback and explanation per question.',
      href: '/interview/rapid',
      icon: Timer,
      badge: '+40 XP',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60',
    },
    {
      title: 'Scenario Lab',
      desc: 'Real case interviews: CPL spikes, attribution gaps, zero-data brand setups.',
      href: '/interview/scenario/is-op-cpl-jump',
      icon: TrendingUp,
      badge: '9 Scenarios',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60',
    },
    {
      title: 'Mock Interview',
      desc: 'Simulated agency interviewer asks questions with follow-ups and scorecard.',
      href: '/interview/mock',
      icon: PlayCircle,
      badge: 'AI + Offline',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60',
    },
    {
      title: 'STAR Story Builder',
      desc: 'Structure your behavioral answers (Situation, Task, Action, Result).',
      href: '/interview/star',
      icon: Star,
      badge: `${starStoriesCount}/3 Saved`,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60',
    },
    {
      title: 'Interview Kit & Portfolio',
      desc: 'Printable case study portfolio, resume do’s/don’ts, and Ad Library research.',
      href: '/interview/checklist',
      icon: FileText,
      badge: 'Printable A4',
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Top Banner / Readiness Score */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-card flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold backdrop-blur-sm">
            <Briefcase size={14} className="text-amber-300" />
            <span>Job Placement Prep</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Interview Dojo
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-md">
            Practice the exact questions asked at top Indian performance marketing agencies and build your case study portfolio.
          </p>

          <div className="pt-2 flex items-center justify-center sm:justify-start gap-4 text-xs font-medium text-indigo-200">
            <span>{answeredCount} Questions Practiced</span>
            <span>•</span>
            <span>{starStoriesCount} STAR Stories Saved</span>
          </div>
        </div>

        {/* Readiness Circular Badge */}
        <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 text-center w-36">
          <div className="font-heading font-extrabold text-4xl text-white">
            {readinessScore}%
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mt-1">
            {status.label}
          </span>
          <span className="text-[10px] text-indigo-200 mt-0.5">Readiness Score</span>
        </div>
      </div>

      {/* Mode Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <Link
              key={m.title}
              href={m.href}
              className="group bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-card border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${m.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {m.badge}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-indigo-600 dark:text-indigo-400">
                <span>Start Practice</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recommendation Card */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/40 rounded-3xl p-6 border border-indigo-200 dark:border-indigo-900/60 flex items-start gap-4">
        <PixieMascot mood="happy" size={54} className="shrink-0" />
        <div className="space-y-1">
          <h4 className="font-heading font-bold text-sm text-indigo-900 dark:text-indigo-200">
            Pixie's Dojo Tip:
          </h4>
          <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-300 leading-relaxed">
            "Whenever an interviewer asks you about a metric (like CPM or CTR), never just state the formula! Tell them what physical action you would take in Ads Manager if it is too high or too low."
          </p>
          <div className="pt-1">
            <Link
              href="/interview/checklist"
              className="text-xs font-bold text-indigo-700 dark:text-indigo-400 underline"
            >
              Review the 4-Part Metric Answer Formula →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

