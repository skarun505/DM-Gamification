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
  Zap,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';

export default function InterviewDojoHub() {
  const { profile } = useGame();
  const [readinessScore, setReadinessScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [starStoriesCount, setStarStoriesCount] = useState(0);
  const [dueCardsCount, setDueCardsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // New Interview Dojo enhancements
  const [targetRole, setTargetRole] = useState<'executive' | 'specialist' | 'strategist'>('executive');
  const [showQuestionAnswer, setShowQuestionAnswer] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCopyScript = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(dailyQuestion.modelScript);
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    }
  };

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

  // Agency Role Definitions
  const roles = {
    executive: {
      title: 'Performance Marketing Executive',
      badge: 'Fresher / 0–1 yr (₹3.5L – ₹6L)',
      desc: 'Focus on campaign setup, metrics math (CTR, CPL, ROAS), standard events, and basic ABO vs CBO.',
      primaryFocus: 'Metrics Math & Ad Hierarchy',
    },
    specialist: {
      title: 'Senior Media Buyer / Specialist',
      badge: 'Mid-Level / 1–3 yrs (₹6L – ₹12L)',
      desc: 'Focus on creative testing frameworks, dynamic creatives, CAPI deduplication, and diagnosing CPL spikes.',
      primaryFocus: 'Troubleshooting & Scaling',
    },
    strategist: {
      title: 'Lead Growth Strategist',
      badge: 'Senior / 3–5+ yrs (₹12L – ₹25L+)',
      desc: 'Focus on full-funnel media mix, incrementality experiments, Advantage+ Shopping (ASC), and client retention.',
      primaryFocus: 'Full-Funnel & Incrementality',
    },
  };

  // Featured Daily Real Agency Question
  const dailyQuestion = {
    role: 'Media Buyer / Specialist',
    company: 'Top Performance Agency Case Study',
    question:
      '“Our client doubled daily budget on an e-commerce campaign from ₹10,000 to ₹20,000 yesterday, and CPA shot up from ₹400 to ₹1,100 overnight. Walk me through your first 3 troubleshooting steps.”',
    modelScript:
      '“First, I would inspect whether doubling the budget reset the ad set back into the Learning Phase, which destabilizes auction bids. Second, I would segment performance by Placement and Age breakdown in Ads Manager to verify if Meta dumped the excess budget into low-intent Audience Network or Reels clicks. Third, I would check frequency and Creative Fatigue over the last 72 hours, recommending that budget increases be scaled incrementally at 15–20% every 48 hours rather than doubling overnight.”',
    rookieTrap:
      'Amateurs usually panic and say “I would immediately turn off all the ads and restart from scratch,” which loses all algorithmic learning signal.',
    pixieClue:
      'Always refer to the 15–20% budget staircase and performance breakdowns (Placements, Gender, Regions) before making destructive changes!',
  };

  const modes = [
    {
      title: 'Learn Cards',
      desc: 'Master 40+ agency concept questions with model answers and Leitner spaced repetition.',
      href: '/interview/learn',
      icon: Layers,
      badge: `${dueCardsCount} Due Today`,
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60',
    },
    {
      title: 'Rapid Fire Sprint',
      desc: '10 timed questions (30s each). Instant randomized choices & feedback per question.',
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
      title: 'Mock Interview Simulator',
      desc: 'Simulated agency interviewer asks questions with voice input, follow-ups & scorecard.',
      href: '/interview/mock',
      icon: PlayCircle,
      badge: 'Voice / AI Mode',
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60',
    },
    {
      title: 'STAR Story Builder',
      desc: 'Structure your behavioral answers (Situation, Task, Action, Result) for agency leadership.',
      href: '/interview/star',
      icon: Star,
      badge: `${starStoriesCount}/3 Saved`,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60',
    },
    {
      title: 'Agency Kit & Case Studies',
      desc: 'Printable case study portfolio, resume do’s/don’ts, and Ad Library pitch templates.',
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
            <span>Agency Placement Center</span>
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl">
            Interview Dojo
          </h1>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-md">
            Master the exact technical and scenario questions asked by top Indian performance marketing agencies and growth brands.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs font-medium text-indigo-200">
            <span>{answeredCount} Questions Practiced</span>
            <span>•</span>
            <span>{starStoriesCount} STAR Stories Saved</span>
            <span>•</span>
            <Link
              href="/interview/rapid"
              className="inline-flex items-center gap-1 text-amber-300 font-bold hover:underline"
            >
              <Zap size={14} />
              <span>Take 2-Min Warmup Sprint ➔</span>
            </Link>
          </div>
        </div>

        {/* Readiness Circular Score */}
        <div className="flex flex-col items-center justify-center p-5 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 shrink-0 text-center w-36 shadow-inner">
          <div className="font-heading font-extrabold text-4xl text-white">
            {readinessScore}%
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 mt-1">
            {status.label}
          </span>
          <span className="text-[10px] text-indigo-200 mt-0.5">Agency Ready</span>
        </div>
      </div>

      {/* Target Role Selector */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 shadow-sm border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Award size={15} className="text-indigo-600" />
            <span>Select Target Agency Role</span>
          </span>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {roles[targetRole].badge}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(['executive', 'specialist', 'strategist'] as const).map((rKey) => {
            const isSelected = targetRole === rKey;
            const rData = roles[rKey];
            return (
              <button
                key={rKey}
                onClick={() => setTargetRole(rKey)}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-200 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                }`}
              >
                <div className="font-heading font-extrabold text-xs sm:text-sm">
                  {rData.title}
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                  Focus: {rData.primaryFocus}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Agency Question of the Day with Interactive Script Reveal */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50/80 via-white to-indigo-50/60 dark:from-slate-800 dark:via-slate-800/90 dark:to-slate-900 border border-amber-200 dark:border-slate-700 shadow-card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-heading font-extrabold text-xs uppercase tracking-wider">
            <Sparkles size={16} className="text-amber-500" />
            <span>Featured Agency Question of the Day</span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
            {dailyQuestion.company}
          </span>
        </div>

        <h3 className="font-heading font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-snug">
          {dailyQuestion.question}
        </h3>

        <div className="pt-1">
          <button
            onClick={() => setShowQuestionAnswer(!showQuestionAnswer)}
            className="py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all active:scale-98"
          >
            <span>{showQuestionAnswer ? 'Hide Model Script' : '💡 Reveal Model Answer & Agency Script'}</span>
            {showQuestionAnswer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {showQuestionAnswer && (
          <div className="mt-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3.5 animate-fadeIn">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 size={14} />
                  <span>What to Say in the Interview (Model Script):</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyScript}
                  className="py-1 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1 transition-colors"
                  title="Copy model script to clipboard"
                >
                  {copiedScript ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedScript ? 'Copied! ✓' : 'Copy Script'}</span>
                </button>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                {dailyQuestion.modelScript}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600 block mb-0.5">
                ⚠️ Rookie Trap to Avoid:
              </span>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {dailyQuestion.rookieTrap}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-start gap-2">
              <PixieMascot mood="happy" size={28} className="shrink-0 mt-0.5" />
              <p className="text-xs text-indigo-900 dark:text-indigo-300 font-medium">
                <strong>Pixie's Pro Tip:</strong> {dailyQuestion.pixieClue}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 6 Core Practice Modes Grid */}
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

      {/* Agency Competency Radar / Pillars */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4">
        <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-slate-100 uppercase tracking-wider">
          4 Core Interview Competency Pillars
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900">
            <span className="text-lg">📊</span>
            <div className="font-heading font-bold text-xs text-indigo-900 dark:text-indigo-200 mt-1">
              Media Math
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">ROAS, CPA, CPC, CPM</p>
          </div>

          <div className="p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900">
            <span className="text-lg">🏗️</span>
            <div className="font-heading font-bold text-xs text-purple-900 dark:text-purple-200 mt-1">
              Architecture
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">CBO, ASC, LAL, CAPI</p>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900">
            <span className="text-lg">🧪</span>
            <div className="font-heading font-bold text-xs text-amber-900 dark:text-amber-200 mt-1">
              Diagnostics
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">CPL Spikes & Hook Drop</p>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
            <span className="text-lg">🗣️</span>
            <div className="font-heading font-bold text-xs text-emerald-900 dark:text-emerald-200 mt-1">
              STAR Stories
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">Client Storytelling</p>
          </div>
        </div>
      </div>
    </div>
  );
}
