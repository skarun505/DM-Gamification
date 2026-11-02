'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import confetti from 'canvas-confetti';
import {
  Timer,
  ArrowLeft,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';

export default function RapidFirePage() {
  const { awardLocalXP, showBadgeToast } = useGame();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isFinished, setIsFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRapid() {
      try {
        const res = await fetch('/api/content/interview-rapid');
        if (res.ok) {
          const data = await res.json();
          const shuffled = [...data]
            .sort(() => 0.5 - Math.random())
            .slice(0, 10)
            .map((q: any) => {
              if (!q.options || q.options.length <= 1) return q;
              const originalAns = q.answer;
              const mapped = q.options.map((opt: string, i: number) => ({
                text: opt,
                isCorrect: i === originalAns,
              }));
              for (let i = mapped.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [mapped[i], mapped[j]] = [mapped[j], mapped[i]];
              }
              return {
                ...q,
                options: mapped.map((m: any) => m.text),
                answer: mapped.findIndex((m: any) => m.isCorrect),
              };
            });
          setQuestions(shuffled);
        }
      } catch (err) {
        console.error('Failed to load rapid fire:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRapid();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (loading || isFinished || isSubmitted) return;

    if (timeLeft <= 0) {
      // Time up: auto-fail step
      setIsSubmitted(true);
      setStreak(0);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, isFinished, isSubmitted]);

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
    setIsSubmitted(true);

    const isCorrect = idx === currentQ.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
      setTimeLeft(30);
    } else {
      setIsFinished(true);
      await awardLocalXP(40, 8, 'rapid_fire');

      if (score === 10) {
        showBadgeToast({
          slug: 'rapid-10',
          name: 'Rapid Fire Pro',
          description: 'Score 100% in a Rapid Fire interview challenge',
          icon: 'Timer',
        });
      }

      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <PixieMascot mood="thinking" size={64} className="animate-pulse" />
        <p className="text-sm font-semibold text-slate-500">Starting timer & loading questions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-2 space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/interview"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit Dojo</span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-rose-600">
            <Flame size={16} className="fill-rose-500" />
            <span>Streak: {streak}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
            <Timer size={14} />
            <span>{timeLeft}s</span>
          </div>
        </div>
      </div>

      {!isFinished && currentQ ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Question Card */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Rapid Question {currentIndex + 1} of 10</span>
              <span className="text-indigo-600 font-bold">Score: {score}</span>
            </div>

            <h3 className="font-heading font-extrabold text-lg sm:text-xl text-slate-800 dark:text-slate-100">
              {currentQ.q}
            </h3>

            {/* Timer bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeLeft <= 5 ? 'bg-rose-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt: string, idx: number) => {
                const isSelected = selectedOption === idx;
                let btnStyle = 'border-slate-200 dark:border-slate-700 hover:border-indigo-400';

                if (isSubmitted) {
                  if (idx === currentQ.answer) {
                    btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isSubmitted}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${btnStyle}`}
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

            {/* Explanation on submission */}
            {isSubmitted && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="font-bold block mb-1">
                  {selectedOption === currentQ.answer ? '🎉 Sharp answer!' : '💡 Correct logic:'}
                </span>
                <p>{currentQ.explain}</p>
              </div>
            )}
          </div>

          {/* Next Button */}
          {isSubmitted && (
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md flex items-center gap-1.5"
              >
                <span>{currentIndex === 9 ? 'Complete Round' : 'Next Question'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Final Scorecard */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-card border border-slate-200 dark:border-slate-700 text-center space-y-5">
          <PixieMascot mood="celebrating" size={84} className="mx-auto" />
          <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            Rapid Fire Complete!
          </h2>
          <p className="text-sm text-slate-500">
            You scored {score} / 10 • Best Streak: {bestStreak} 🔥
          </p>

          <div className="py-4 px-6 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 inline-block font-heading font-bold text-amber-700 text-xl">
            +40 XP & +8 AdCoins
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setIsFinished(false);
                setCurrentIndex(0);
                setScore(0);
                setStreak(0);
                setSelectedOption(null);
                setIsSubmitted(false);
                setTimeLeft(30);
              }}
              className="py-3 px-6 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm font-semibold flex items-center gap-1.5"
            >
              <RotateCcw size={16} />
              <span>Play Again</span>
            </button>

            <Link
              href="/interview"
              className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md inline-block"
            >
              Back to Dojo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

