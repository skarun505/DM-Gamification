'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function DailyChallengePage() {
  const { awardLocalXP } = useGame();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/content/daily');
        if (res.ok) {
          const allQ = await res.json();
          // Pick 3 random questions
          const shuffled = [...allQ].sort(() => 0.5 - Math.random());
          setQuestions(shuffled.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load daily questions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQuestions();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <PixieMascot mood="thinking" size={64} className="animate-pulse" />
        <p className="text-sm font-semibold text-slate-500">Loading today's challenge...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  const handleCheck = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === currentQ.answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setCompleted(true);
      await awardLocalXP(30, 6, 'daily_challenge');
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    }
  };

  return (
    <div className="max-w-xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-card flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-100">
            <Calendar size={14} />
            <span>Daily Recall</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl mt-1">Daily Challenge</h2>
          <p className="text-xs text-amber-100 mt-1">3 quick questions to keep your advertising brain sharp.</p>
        </div>
        <PixieMascot mood="happy" size={60} />
      </div>

      {!completed && currentQ ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-600 uppercase tracking-wider">
            <span>Question {currentIndex + 1} of 3</span>
            <span>Score: {score}</span>
          </div>

          <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-800 dark:text-slate-100">
            {currentQ.q}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((opt: string, idx: number) => {
              const isSelected = selectedOption === idx;
              let style = 'border-slate-200 dark:border-slate-700';

              if (isSubmitted) {
                if (idx === currentQ.answer) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected) {
                  style = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                }
              } else if (isSelected) {
                style = 'border-amber-500 bg-amber-50 text-amber-900 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 text-sm flex items-center justify-between transition-all ${style}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && idx === currentQ.answer && (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  )}
                  {isSubmitted && isSelected && idx !== currentQ.answer && (
                    <XCircle size={18} className="text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed border border-slate-200 dark:border-slate-700">
              <span className="font-bold block mb-1">Explanation:</span>
              <p>{currentQ.explain}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            {!isSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleCheck}
                className="py-3 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-heading font-bold text-sm shadow-md transition-all"
              >
                Submit Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="py-3 px-8 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-sm shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>{currentIndex === 2 ? 'Collect Reward' : 'Next'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-card border border-slate-200 dark:border-slate-700 text-center space-y-4">
          <PixieMascot mood="celebrating" size={80} className="mx-auto" />
          <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            Daily Challenge Complete!
          </h2>
          <p className="text-sm text-slate-500">
            You scored {score} / 3. Streak updated for today!
          </p>

          <div className="py-4 px-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 inline-block font-heading font-bold text-amber-700 text-xl">
            +30 XP & +6 AdCoins Earned
          </div>

          <div className="pt-2">
            <Link
              href="/home"
              className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md inline-block"
            >
              Return Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
