'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { InterviewScenario } from '@/lib/content/schema';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { createClient } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
} from 'lucide-react';

export default function ScenarioLabPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { profile, awardLocalXP } = useGame();
  const supabase = createClient();

  const [scenario, setScenario] = useState<InterviewScenario | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isStepSubmitted, setIsStepSubmitted] = useState(false);
  const [stepScore, setStepScore] = useState(0);

  // Final written question state
  const [isFinalStage, setIsFinalStage] = useState(false);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [aiEvaluation, setAiEvaluation] = useState<any>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function loadScenario() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/content/interview-scenario?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setScenario(data);
        }
      } catch (err) {
        console.error('Failed to load scenario:', err);
      } finally {
        setLoading(false);
      }
    }
    loadScenario();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <PixieMascot mood="thinking" size={64} className="animate-pulse" />
        <p className="text-sm font-semibold text-slate-500">Loading Scenario Lab case...</p>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Scenario Not Found</h2>
        <Link href="/interview" className="mt-4 inline-block text-indigo-600 font-bold">
          ← Return to Dojo
        </Link>
      </div>
    );
  }

  const handleStepSubmit = () => {
    if (selectedOption === null) return;
    setIsStepSubmitted(true);
    if (selectedOption === scenario.steps[currentStep].answer) {
      setStepScore((prev) => prev + 1);
    }
  };

  const handleNextStep = () => {
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      setSelectedOption(null);
      setIsStepSubmitted(false);
    } else {
      setIsFinalStage(true);
    }
  };

  const handleEvaluateFinal = async () => {
    if (!finalAnswer.trim() || evaluating) return;
    setEvaluating(true);

    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'evaluate',
          question: scenario.finalQuestion,
          answer: finalAnswer.trim(),
          keyPoints: scenario.keyPoints,
        }),
      });

      const data = await res.json();
      setAiEvaluation(data);
      setIsFinished(true);

      // Award XP
      await awardLocalXP(60, 12, 'scenario_lab', scenario.slug);

      if (profile?.id) {
        await supabase.from('interview_attempts').insert({
          user_id: profile.id,
          question_slug: scenario.slug,
          mode: 'scenario',
          answer_text: finalAnswer.trim(),
          score: data.total || 14,
          ai_graded: !data.isFallback,
        });
      }

      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } catch (err) {
      console.error('Failed to evaluate final answer:', err);
      setIsFinished(true);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/interview"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit Scenario</span>
        </Link>
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200">
          Case Study Lab • {scenario.tier}
        </span>
      </div>

      {/* Case Brief & Data Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
          {scenario.title}
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          {scenario.story}
        </p>

        {/* Data Table */}
        {scenario.data?.table && (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 my-4">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-heading">
                <tr>
                  {scenario.data.table[0].map((h, i) => (
                    <th key={i} className="p-3 font-bold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {scenario.data.table.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="p-3 text-slate-700 dark:text-slate-300 font-medium">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Phase */}
      {!isFinalStage ? (
        /* Decision Steps */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <span>Decision Step {currentStep + 1} of {scenario.steps.length}</span>
            <span className="text-slate-400">Score: {stepScore}</span>
          </div>

          <h3 className="font-heading font-bold text-base sm:text-lg text-slate-800 dark:text-slate-100">
            {scenario.steps[currentStep].prompt}
          </h3>

          <div className="space-y-3 pt-2">
            {scenario.steps[currentStep].options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              let style = 'border-slate-200 dark:border-slate-700 hover:border-indigo-400';

              if (isStepSubmitted) {
                if (idx === scenario.steps[currentStep].answer) {
                  style = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                } else if (isSelected) {
                  style = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                }
              } else if (isSelected) {
                style = 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold';
              }

              return (
                <button
                  key={idx}
                  disabled={isStepSubmitted}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 text-xs sm:text-sm font-medium flex items-center justify-between transition-all ${style}`}
                >
                  <span>{opt}</span>
                  {isStepSubmitted && idx === scenario.steps[currentStep].answer && (
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  )}
                  {isStepSubmitted && isSelected && idx !== scenario.steps[currentStep].answer && (
                    <XCircle size={18} className="text-rose-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {isStepSubmitted && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <span className="font-bold block mb-1">Strategic Rationale:</span>
              <p>{scenario.steps[currentStep].explain}</p>
            </div>
          )}

          <div className="flex justify-end pt-2">
            {!isStepSubmitted ? (
              <button
                disabled={selectedOption === null}
                onClick={handleStepSubmit}
                className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-heading font-bold text-sm shadow-md"
              >
                Confirm Decision
              </button>
            ) : (
              <button
                onClick={handleNextStep}
                className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md flex items-center gap-1.5"
              >
                <span>{currentStep === scenario.steps.length - 1 ? 'Go to Final Client Question' : 'Next Step'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      ) : !isFinished ? (
        /* Final Client Communication Task */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider">
            <Sparkles size={14} className="text-amber-500" />
            <span>Final Interview Question</span>
          </div>

          <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">
            {scenario.finalQuestion}
          </h3>

          <textarea
            rows={5}
            value={finalAnswer}
            onChange={(e) => setFinalAnswer(e.target.value)}
            placeholder="Type your response to the client here (keep it clear, calm, and action-oriented)..."
            className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
          />

          <div className="flex justify-end pt-2">
            <button
              onClick={handleEvaluateFinal}
              disabled={!finalAnswer.trim() || evaluating}
              className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-heading font-bold text-sm shadow-md"
            >
              {evaluating ? 'Grading Response...' : 'Submit Response for Evaluation'}
            </button>
          </div>
        </div>
      ) : (
        /* Final Scenario Scorecard */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-6 animate-fadeIn">
          <div className="text-center space-y-2">
            <PixieMascot mood="celebrating" size={80} className="mx-auto" />
            <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              Case Study Solved!
            </h2>
            <p className="text-xs text-slate-500">
              Decision steps passed: {stepScore} / {scenario.steps.length}
            </p>
          </div>

          {/* Model Answer comparison */}
          <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              Agency Benchmark Response:
            </span>
            <p className="text-sm text-indigo-950 dark:text-indigo-100 leading-relaxed font-medium">
              "{scenario.modelAnswer}"
            </p>
          </div>

          {/* Evaluation breakdown if available */}
          {aiEvaluation && (
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Clarity</span>
                  <span className="font-bold text-indigo-600 text-base">{aiEvaluation.scores?.clarity ?? 4}/5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Structure</span>
                  <span className="font-bold text-indigo-600 text-base">{aiEvaluation.scores?.structure ?? 4}/5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Numbers</span>
                  <span className="font-bold text-indigo-600 text-base">{aiEvaluation.scores?.numbers ?? 4}/5</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border text-xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Business</span>
                  <span className="font-bold text-indigo-600 text-base">{aiEvaluation.scores?.business ?? 4}/5</span>
                </div>
              </div>

              {aiEvaluation.one_tip && (
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-xs text-amber-900 dark:text-amber-200 border border-amber-200">
                  <span className="font-bold">Coach Tip: </span>
                  {aiEvaluation.one_tip}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/interview"
              className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md"
            >
              Back to Dojo Hub
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

