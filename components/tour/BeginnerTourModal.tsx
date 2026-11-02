'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { soundFx } from '@/lib/sound/audio';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Compass,
  Map,
  BookOpen,
  Sword,
  Briefcase,
  Calculator,
  Award,
  CheckCircle2,
  Sparkles,
  Zap,
  Target,
} from 'lucide-react';

interface TourStep {
  title: string;
  tagline: string;
  badge: string;
  icon: React.ReactNode;
  pixieMood: 'happy' | 'thinking' | 'celebrating' | 'cheering';
  description: string;
  points: { title: string; desc: string; icon: string }[];
  ctaLabel?: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: 'Welcome to AdQuest! 🦊',
    tagline: 'Your performance marketing career starts here',
    badge: 'Step 1 of 6 • The Mission',
    icon: <Sparkles className="text-amber-500" size={24} />,
    pixieMood: 'cheering',
    description:
      'AdQuest turns real-world Meta and Google performance advertising into a bite-sized, gamified quest. No boring PDF textbooks—learn by doing in 5-minute missions!',
    points: [
      {
        icon: '⚡',
        title: 'Earn XP & Level Up',
        desc: 'Progress from Intern (Level 1) to Senior Media Buyer as you complete units.',
      },
      {
        icon: '🔥',
        title: 'Build Your Daily Streak',
        desc: 'Solve 1 mission each day to maintain your streak flame and unlock bonus AdCoins.',
      },
      {
        icon: '🪙',
        title: 'AdCoins & Hint Tokens',
        desc: 'Spend coins on streak freezes or mentor hints during tough boss battles.',
      },
    ],
  },
  {
    title: 'The Campaign Learning Map 🗺️',
    tagline: 'Visual Guides first, then Practice Quizzes',
    badge: 'Step 2 of 6 • Curriculum Flow',
    icon: <Map className="text-indigo-500" size={24} />,
    pixieMood: 'happy',
    description:
      'Every unit on the Campaign Map is structured in a clean, single-flow card designed to guarantee understanding before testing:',
    points: [
      {
        icon: '📖',
        title: '1. Visual Teaching Guide',
        desc: 'Tap "Learn" on any unit to explore visual funnels, ecosystem charts, and media buying math.',
      },
      {
        icon: '🎯',
        title: '2. Practice & Quiz Arena',
        desc: 'Tap "Start Quiz" to test your retention with multiple-choice, true/false, and funnel ordering questions.',
      },
      {
        icon: '🛡️',
        title: '3. Two Chances & 70% Mastery Rule',
        desc: 'Got an answer wrong? You get a 2nd chance with a mentor hint! Score ≥ 70% to master the unit.',
      },
    ],
  },
  {
    title: 'Real-World Labs & Boss Battles ⚔️',
    tagline: 'Apply your knowledge on live ad accounts',
    badge: 'Step 3 of 6 • Practical Exercises',
    icon: <Sword className="text-rose-500" size={24} />,
    pixieMood: 'thinking',
    description:
      'We prepare you for actual agency work with hands-on exercises in the real Meta Ads ecosystem:',
    points: [
      {
        icon: '🔍',
        title: 'Meta Ad Library Spy Lab',
        desc: 'Audit real competitor creative angles and hooks directly on facebook.com/ads/library.',
      },
      {
        icon: '📸',
        title: 'Client-Side Screenshot Upload',
        desc: 'Upload proof of your account setup. No complex storage—your mentor logs it with instant praise!',
      },
      {
        icon: '👑',
        title: 'End-of-Tier Boss Battles',
        desc: 'Defeat Boss 1 (Launch Day Pre-Flight) to unlock Tier 2 (Operator Hub) and advanced retargeting!',
      },
    ],
  },
  {
    title: 'Interview Dojo & Agency Scripts 🥋',
    tagline: 'Prepare to land high-paying marketing roles',
    badge: 'Step 4 of 6 • Career Training',
    icon: <Briefcase className="text-emerald-500" size={24} />,
    pixieMood: 'happy',
    description:
      'The Interview Dojo gives you the exact questions and frameworks asked by top agencies and brands:',
    points: [
      {
        icon: '🎙️',
        title: 'Question of the Day & Model Scripts',
        desc: 'Read real interview questions with 1-tap copyable model answers ready to practice in front of a mirror.',
      },
      {
        icon: '⏱️',
        title: '60-Second Rapid Fire Sprint',
        desc: 'Test your quick decision-making under time pressure to sharpen your media buying instincts.',
      },
      {
        icon: '👔',
        title: 'Role-Specific Paths',
        desc: 'Switch between Executive, Specialist, and Strategist tracks tailored to your career goals.',
      },
    ],
  },
  {
    title: 'Smart Tools: Pixie & Formula Calculator 🧮',
    tagline: 'Never get stuck in media buying math',
    badge: 'Step 5 of 6 • In-App Superpowers',
    icon: <Calculator className="text-blue-500" size={24} />,
    pixieMood: 'thinking',
    description:
      'AdQuest comes equipped with high-utility tools built directly into your lessons and quizzes:',
    points: [
      {
        icon: '💬',
        title: 'Ask Pixie Floating Bubble',
        desc: 'Tap the Pixie Fox bubble at the bottom right of any screen for instant Socratic explanations.',
      },
      {
        icon: '🧮',
        title: 'In-Quiz Media Buying Calculator',
        desc: 'Compute ROAS, CPA, CTR, CPC, and CPM on the fly, with formulas and quick examples provided.',
      },
      {
        icon: '📓',
        title: 'Smart Mistake Notebook',
        desc: 'Any question you struggle with is automatically saved to your notebook on the Home Dashboard for easy review.',
      },
    ],
  },
  {
    title: 'Earn Verified E-Certificates 🎓',
    tagline: 'Showcase your credentials on LinkedIn and resume',
    badge: 'Step 6 of 6 • Certification',
    icon: <Award className="text-amber-500" size={24} />,
    pixieMood: 'celebrating',
    description:
      'Your hard work translates into certified proof of your skills as a performance media buyer:',
    points: [
      {
        icon: '📜',
        title: 'Three Progressive Certifications',
        desc: 'Earn the Tier 1 Rookie Certificate, Tier 2 Operator Certificate, and Tier 3 Strategist Diploma.',
      },
      {
        icon: '🔒',
        title: 'Unique Verification ID & QR Code',
        desc: 'Each certificate includes a tamper-proof verification ID for employers to verify your achievement.',
      },
      {
        icon: '📥',
        title: 'High-Resolution Export',
        desc: 'Print or export your full-color diploma preview anytime from the Home Dashboard or Profile.',
      },
    ],
    ctaLabel: 'Let’s Start Playing! 🚀',
  },
];

export function BeginnerTourModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Check if this is the user's first visit
    const hasSeen = localStorage.getItem('adquest_tour_completed');
    if (!hasSeen) {
      // Auto-open after a brief delay for new visitors
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    // Global listener for "open-adquest-tour" custom event
    const handleOpen = () => {
      setCurrentStep(0);
      setIsOpen(true);
      soundFx.playCorrect();
    };

    window.addEventListener('open-adquest-tour', handleOpen);
    return () => window.removeEventListener('open-adquest-tour', handleOpen);
  }, []);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      soundFx.playCorrect();
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      soundFx.playCorrect();
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    soundFx.playVictory();
    localStorage.setItem('adquest_tour_completed', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const step = TOUR_STEPS[currentStep];
  const isLast = currentStep === TOUR_STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header / Status Bar */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Compass className="text-amber-300 animate-spin-slow" size={22} />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-200 block">
                {step.badge}
              </span>
              <span className="font-heading font-extrabold text-lg text-white">
                Beginner’s Guide & Tour
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            aria-label="Close tour"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 shrink-0">
          <div
            className="bg-indigo-600 h-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
          />
        </div>

        {/* Scrollable Step Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-5">
          {/* Hero Banner with Mascot & Step Title */}
          <div className="flex items-start gap-4">
            <div className="shrink-0 p-2 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900/50">
              <PixieMascot size={56} mood={step.pixieMood} />
            </div>
            <div className="min-w-0">
              <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
                {step.title}
              </h2>
              <p className="text-xs sm:text-sm text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                {step.tagline}
              </p>
            </div>
          </div>

          {/* Intro Description */}
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {step.description}
          </p>

          {/* 3 Key Takeaway Points */}
          <div className="space-y-3 pt-1">
            {step.points.map((pt, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 flex items-start gap-3 transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
              >
                <span className="text-xl shrink-0 mt-0.5">{pt.icon}</span>
                <div>
                  <span className="text-xs sm:text-sm font-heading font-bold text-slate-800 dark:text-slate-100 block">
                    {pt.title}
                  </span>
                  <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-relaxed block mt-0.5">
                    {pt.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation & Controls */}
        <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 flex items-center justify-between gap-3 shrink-0">
          {/* Step Dots */}
          <div className="flex items-center gap-1.5">
            {TOUR_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  soundFx.playCorrect();
                  setCurrentStep(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentStep
                    ? 'w-6 bg-indigo-600'
                    : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
                }`}
                title={`Go to step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={handlePrev}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold font-heading hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Back</span>
              </button>
            )}

            {!isLast ? (
              <button
                type="button"
                onClick={handleNext}
                className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-xs font-bold font-heading shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Next</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleComplete}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white text-xs font-bold font-heading shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
              >
                <span>{step.ctaLabel || 'Start Playing! 🚀'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
