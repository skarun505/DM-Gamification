'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { BossBattle, BossStep } from '@/lib/content/schema';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { createClient } from '@/lib/supabase/client';
import {
  Shield,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Trophy,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function BossPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { profile, awardLocalXP, showBadgeToast } = useGame();
  const supabase = createClient();

  const [boss, setBoss] = useState<BossBattle | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/content/boss?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setBoss(data);
        }
      } catch (err) {
        console.error('Failed to load boss battle:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <PixieMascot mood="thinking" size={64} className="animate-pulse" />
        <p className="text-sm font-semibold text-slate-500">Entering Boss Arena...</p>
      </div>
    );
  }

  if (!boss) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Boss Battle Not Found</h2>
        <Link href="/map" className="mt-4 inline-block text-indigo-600 font-bold">
          ← Return to Map
        </Link>
      </div>
    );
  }

  const currentStep: BossStep = boss.steps[currentStepIndex];
  const totalSteps = boss.steps.length;

  const handleSubmitStep = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === currentStep.answer;
    setIsAnswerCorrect(correct);
    setIsAnswerSubmitted(true);
    if (correct) setScore((prev) => prev + 1);
  };

  const handleNextStep = async () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      // Finished Boss Battle
      const finalScore = isAnswerCorrect ? score + 1 : score;
      const scorePct = Math.round((finalScore / totalSteps) * 100);
      const passed = scorePct >= (boss.passScorePct || 70);

      setIsFinished(true);

      if (passed) {
        try {
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E'],
          });
        } catch {}

        await awardLocalXP(boss.xp || 150, boss.coins || 30, 'boss', boss.slug);

        if (profile?.id) {
          await supabase.from('boss_attempts').insert({
            user_id: profile.id,
            boss_slug: boss.slug,
            score: finalScore,
            passed: true,
          });

          // Check Boss Badges
          showBadgeToast({
            slug: 'first-boss',
            name: 'Boss Slayer',
            description: 'Defeat your first Boss Battle',
            icon: 'Shield',
          });
        }
      }
    }
  };

  const scorePct = Math.round((score / totalSteps) * 100);
  const passed = scorePct >= (boss.passScorePct || 70);

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/map"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit Arena</span>
        </Link>
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-3 py-1 rounded-full border border-rose-200 dark:border-rose-900">
          <Shield size={14} className="fill-rose-500" />
          <span>Boss Arena</span>
        </div>
      </div>

      {!isFinished ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Boss Header Banner */}
          <div className="bg-gradient-to-r from-rose-600 to-indigo-700 text-white p-6 rounded-3xl shadow-card flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-200">
                Step {currentStepIndex + 1} of {totalSteps}
              </span>
              <h2 className="font-heading font-extrabold text-2xl mt-0.5">{boss.title}</h2>
              <p className="text-xs text-rose-100 mt-1 max-w-md">{currentStep.title}</p>
            </div>
            <PixieMascot mood="thinking" size={60} />
          </div>

          {/* Context & Data Table */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
            <div className="text-sm sm:text-base text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
              {currentStep.context}
            </div>

            {/* Optional Step Data Table */}
            {currentStep.tableData && (
              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 my-4">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-heading">
                    <tr>
                      {currentStep.tableData[0].map((h, i) => (
                        <th key={i} className="p-3 font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {currentStep.tableData.slice(1).map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 text-slate-600 dark:text-slate-300 font-medium">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Question */}
            <div className="pt-2">
              <h3 className="font-heading font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100 mb-4">
                {currentStep.question}
              </h3>

              {/* Options */}
              <div className="space-y-3">
                {currentStep.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  let btnColor = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300';

                  if (isAnswerSubmitted) {
                    if (idx === currentStep.answer) {
                      btnColor = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold';
                    } else if (isSelected) {
                      btnColor = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200 font-bold';
                    }
                  } else if (isSelected) {
                    btnColor = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 font-bold';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm flex items-center justify-between transition-all ${btnColor}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && idx === currentStep.answer && (
                        <CheckCircle2 size={18} className="text-emerald-600 shrink-0 ml-2" />
                      )}
                      {isAnswerSubmitted && isSelected && idx !== currentStep.answer && (
                        <XCircle size={18} className="text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation box */}
            {isAnswerSubmitted && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isAnswerCorrect
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                    : 'bg-amber-50 border border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200'
                }`}
              >
                <span className="font-bold block mb-1">
                  {isAnswerCorrect ? '✓ Excellent strategic choice!' : '💡 Strategic Correction:'}
                </span>
                <p>{currentStep.explain}</p>
              </div>
            )}

            {/* Hint */}
            {!isAnswerSubmitted && currentStep.hint && (
              <div className="pt-2">
                {showHint ? (
                  <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                    💡 {currentStep.hint}
                  </p>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <HelpCircle size={14} />
                    <span>Pixie Hint (Free in Training)</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                disabled={selectedAnswer === null}
                onClick={handleSubmitStep}
                className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-heading font-bold text-sm shadow-md transition-all"
              >
                Confirm Decision
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>{currentStepIndex === totalSteps - 1 ? 'View Boss Outcome' : 'Next Step'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Boss Battle Result */
        <div className="space-y-6 text-center animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-card border border-slate-200 dark:border-slate-700">
            <PixieMascot
              mood={passed ? 'celebrating' : 'thinking'}
              size={88}
              className="mx-auto mb-4"
            />
            <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              {passed ? '🎉 Boss Defeated!' : 'Battle Ended — Try Again!'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              You scored {score} / {totalSteps} ({scorePct}%)
            </p>

            {passed ? (
              <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-emerald-300 dark:border-slate-700 flex justify-around">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 font-bold uppercase">Reward</span>
                  <span className="font-heading font-extrabold text-2xl text-emerald-600">
                    +{boss.xp} XP
                  </span>
                </div>
                <div className="w-px bg-slate-200 dark:bg-slate-700" />
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 font-bold uppercase">AdCoins</span>
                  <span className="font-heading font-extrabold text-2xl text-amber-600">
                    +{boss.coins}
                  </span>
                </div>
              </div>
            ) : (
              <div className="my-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
                You need at least {boss.passScorePct}% to defeat the Boss and unlock the next tier.
                Review the hints and give it another try!
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setIsFinished(false);
                  setCurrentStepIndex(0);
                  setScore(0);
                  setSelectedAnswer(null);
                  setIsAnswerSubmitted(false);
                }}
                className="py-3 px-6 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw size={16} />
                <span>Retry Battle</span>
              </button>

              <Link
                href="/map"
                className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md"
              >
                Return to Map
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

