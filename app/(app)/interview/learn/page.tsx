'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { createClient } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  CheckSquare,
  Square,
  Sparkles,
  BookOpen,
  Award,
  RotateCcw,
} from 'lucide-react';

export default function LearnCardsPage() {
  const { profile, awardLocalXP, showBadgeToast } = useGame();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userDraft, setUserDraft] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [checkedPoints, setCheckedPoints] = useState<Set<number>>(new Set());
  const [graded, setGraded] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadCards() {
      try {
        const res = await fetch('/api/content/interview-questions');
        if (res.ok) {
          const data = await res.json();
          setQuestions(data);
        }
      } catch (err) {
        console.error('Failed to load learn cards:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCards();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <PixieMascot mood="thinking" size={64} className="animate-pulse" />
        <p className="text-sm font-semibold text-slate-500">Loading Interview Cards...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  if (!currentQ) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">No questions found</h2>
        <Link href="/interview" className="mt-4 inline-block text-indigo-600 font-bold">
          ← Back to Dojo
        </Link>
      </div>
    );
  }

  const togglePoint = (idx: number) => {
    const next = new Set(checkedPoints);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setCheckedPoints(next);
  };

  const handleGradeAndSave = async (isEasy: boolean) => {
    const totalPoints = currentQ.keyPoints.length || 1;
    const hitPoints = checkedPoints.size;
    const score = Math.min(20, Math.round((hitPoints / totalPoints) * 20));

    setGraded(true);

    if (profile?.id) {
      // Award XP on first time
      const xpEarned = 5 + Math.round(score / 2);
      await awardLocalXP(xpEarned, 1, 'interview_learn', currentQ.slug);

      // Save Leitner box
      const nextBox = isEasy ? 2 : 1;
      const nextDays = isEasy ? 4 : 1;
      const nextDueDate = new Date();
      nextDueDate.setDate(nextDueDate.getDate() + nextDays);

      await supabase.from('interview_attempts').insert({
        user_id: profile.id,
        question_slug: currentQ.slug,
        mode: 'learn',
        answer_text: userDraft,
        score,
        box: nextBox,
        next_due: nextDueDate.toISOString().split('T')[0],
      });

      // Check first interview badge
      showBadgeToast({
        slug: 'interview-first',
        name: 'First Answer',
        description: 'Complete your first interview question',
        icon: 'MessageSquare',
      });
    }

    try {
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleNextCard = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setRevealed(false);
      setGraded(false);
      setUserDraft('');
      setCheckedPoints(new Set());
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/interview"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Interview Dojo</span>
        </Link>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
          Card {currentIndex + 1} of {questions.length}
        </span>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-0.5 rounded-full">
            {currentQ.levelTag} • {currentQ.tier}
          </span>
          <Link
            href={`/lesson/${currentQ.lessonSlug}`}
            className="text-xs font-semibold text-slate-400 hover:text-indigo-600 flex items-center gap-1"
          >
            <BookOpen size={12} />
            <span>Revise Lesson</span>
          </Link>
        </div>

        <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-800 dark:text-slate-100">
          {currentQ.question}
        </h2>

        {/* User Draft Area */}
        {!revealed ? (
          <div className="space-y-4 pt-2">
            <textarea
              rows={4}
              value={userDraft}
              onChange={(e) => setUserDraft(e.target.value)}
              placeholder="Think aloud or type your answer here before revealing the model response..."
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
            <button
              onClick={() => setRevealed(true)}
              className="w-full py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <Eye size={18} />
              <span>Reveal Model Answer & Rubric</span>
            </button>
          </div>
        ) : (
          /* Revealed Model Answer & Key Points Rubric */
          <div className="space-y-5 pt-2 animate-fadeIn">
            {/* Model Answer */}
            <div className="p-5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                <Sparkles size={14} className="text-amber-500" />
                <span>Model Agency Answer:</span>
              </span>
              <p className="text-sm sm:text-base text-indigo-950 dark:text-indigo-100 leading-relaxed font-medium">
                "{currentQ.modelAnswer}"
              </p>
            </div>

            {/* Key Points Checklist */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Self-Grade Rubric: Tick which points you covered
              </span>
              <div className="space-y-2">
                {currentQ.keyPoints.map((pt: string, idx: number) => {
                  const isChecked = checkedPoints.has(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => togglePoint(idx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm font-medium flex items-start gap-2.5 transition-all ${
                        isChecked
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200'
                          : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                      }`}
                    >
                      {isChecked ? (
                        <CheckSquare size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square size={18} className="text-slate-400 shrink-0 mt-0.5" />
                      )}
                      <span>{pt}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pixie Tip */}
            {currentQ.tip && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">Pixie Tip: </span>
                {currentQ.tip}
              </div>
            )}

            {/* Self-Grade Actions */}
            {!graded ? (
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleGradeAndSave(false)}
                  className="flex-1 py-3 px-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 font-bold text-xs sm:text-sm hover:bg-amber-100 transition-colors"
                >
                  Need More Practice (Repeat Soon)
                </button>
                <button
                  onClick={() => handleGradeAndSave(true)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
                >
                  Got It Down! (Next Box)
                </button>
              </div>
            ) : (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNextCard}
                  className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md flex items-center gap-2"
                >
                  <span>Next Card</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
