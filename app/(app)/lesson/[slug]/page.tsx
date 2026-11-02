'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Lesson, Block, QuizQuestion } from '@/lib/content/schema';
import { useGame } from '@/components/game/GameContext';
import { XP_REWARDS } from '@/lib/game/xp';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { createClient } from '@/lib/supabase/client';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  BookOpen,
  MessageCircle,
  Eye,
  AlertTriangle,
  Calculator,
} from 'lucide-react';
import { ALL_TEACHING_CONCEPTS, TeachingConcept } from '@/lib/content/teaching-concepts';
import { VisualGuideCard } from '@/components/teaching/VisualGuideCard';
import { FormulaCalculatorModal } from '@/components/ui/FormulaCalculatorModal';
import { soundFx } from '@/lib/sound/audio';
import { saveMistakeToNotebook } from '@/lib/storage/mistake-notebook';

export default function LessonPlayerPage() {
  const params = useParams();
  const rawSlug = (params?.slug as string) || '';
  const slug = rawSlug ? decodeURIComponent(rawSlug).toLowerCase().trim().replace(/[\s_]+/g, '-') : '';
  const router = useRouter();
  const { profile, awardLocalXP, showBadgeToast } = useGame();
  const supabase = createClient();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'learn' | 'quiz' | 'result' | 'mastery_failed'>('learn');
  const [isVisualPeekOpen, setIsVisualPeekOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // 2-Attempt per question state & 30% error rule tracking
  const [attemptCount, setAttemptCount] = useState<number>(1);
  const [failedQuestionIndices, setFailedQuestionIndices] = useState<Set<number>>(new Set());
  const [attemptFeedback, setAttemptFeedback] = useState<string | null>(null);

  // Order question drag/sort state
  const [userOrder, setUserOrder] = useState<number[]>([]);

  useEffect(() => {
    const q = lesson?.quiz[currentQuizIndex];
    if (q && q.type === 'order' && q.items) {
      const len = q.items.length;
      let init = Array.from({ length: len }, (_, i) => i);
      if (len > 1) {
        init = [...init].reverse();
      }
      setUserOrder(init);
      setSelectedAnswer(init);
    } else {
      setUserOrder([]);
    }
  }, [currentQuizIndex, lesson]);

  const handleMoveOrderItem = (fromIndex: number, toIndex: number, baseOrder?: number[]) => {
    if (isAnswerSubmitted) return;
    const current = userOrder.length > 0 ? userOrder : (baseOrder || []);
    if (toIndex < 0 || toIndex >= current.length) return;
    const next = [...current];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setUserOrder(next);
    setSelectedAnswer(next);
  };

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        setLoading(true);
        const res = await fetch(`/api/content/lesson?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data);
          setMode('learn');
          setCurrentQuizIndex(0);
          setSelectedAnswer(null);
          setIsAnswerSubmitted(false);
          setIsVisualPeekOpen(false);
          setAttemptCount(1);
          setFailedQuestionIndices(new Set());
          setAttemptFeedback(null);
          setShowHint(false);
          setScore(0);
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
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
        <p className="text-sm font-semibold text-slate-500">Preparing your lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Lesson Not Found</h2>
        <Link href="/map" className="mt-4 inline-block text-indigo-600 font-bold">
          ← Return to Map
        </Link>
      </div>
    );
  }

  const activeConcept: TeachingConcept = (slug && ALL_TEACHING_CONCEPTS[slug]) || {
    id: `tc-${slug || 'default'}`,
    lessonSlug: slug || '',
    unitNumber: 1,
    title: lesson.title,
    subtitle: 'Visual Strategy & Practical Framework',
    tier: 'rookie',
    keyTakeaway: 'Master the fundamental ad structures, audience rules, and tracking events before allocating live ad spend.',
    visualType: 'funnel',
    quizAnswerTeaser: 'Pay close attention to campaign objectives and hierarchy rules in the quiz!',
  };

  const nextConcept = lesson.next && ALL_TEACHING_CONCEPTS[lesson.next];

  const progressPercent =
    mode === 'learn'
      ? 35
      : mode === 'quiz'
      ? 35 + Math.round(((currentQuizIndex + 1) / lesson.quiz.length) * 65)
      : 100;

  const currentQuestion: QuizQuestion | undefined = lesson.quiz[currentQuizIndex];

  // SUBMIT HANDLER WITH 2 CHANCES PER WRONG ANSWER
  const handleQuizSubmit = async () => {
    if (selectedAnswer === null || !currentQuestion) return;

    let correct = false;
    if (currentQuestion.type === 'tf') {
      correct = selectedAnswer === currentQuestion.answer;
    } else if (currentQuestion.type === 'order') {
      const itemsList = currentQuestion.items || [];
      const activeOrder =
        userOrder.length === itemsList.length
          ? userOrder
          : Array.from({ length: itemsList.length }, (_, i) => i).reverse();
      const targetAns = currentQuestion.answer as number[];
      correct =
        Array.isArray(activeOrder) &&
        activeOrder.length === targetAns.length &&
        activeOrder.every((val, idx) => val === targetAns[idx]);
    } else {
      correct = selectedAnswer === currentQuestion.answer;
    }

    if (correct) {
      soundFx.playCorrect();
      setIsAnswerCorrect(true);
      setIsAnswerSubmitted(true);
      setScore((prev) => prev + 1);
      setAttemptFeedback(
        attemptCount === 1
          ? '🎉 Correct on first attempt! Great performance marketing instinct.'
          : '✅ Correct on second chance! Good job identifying and correcting the mistake.'
      );
    } else {
      soundFx.playRetry();

      // Auto-save to smart mistake notebook for easy targeted review
      if (currentQuestion) {
        saveMistakeToNotebook({
          lessonSlug: lesson.slug,
          lessonTitle: lesson.title,
          questionIndex: currentQuizIndex,
          question: currentQuestion.q,
          options: currentQuestion.options,
          type: currentQuestion.type,
          answer: currentQuestion.answer,
          explain: currentQuestion.explain,
          hint: currentQuestion.hint,
        });
      }

      if (attemptCount === 1) {
        // CHANCE 1 FAILED: Grant Attempt 2!
        setAttemptCount(2);
        setShowHint(true);
        setAttemptFeedback(
          '⚠️ Not quite right! You have 1 attempt remaining. Review the clue below, adjust your selection, and check again.'
        );
      } else {
        // CHANCE 2 FAILED: 2 attempts exhausted, reveal answer and log failure!
        setIsAnswerCorrect(false);
        setIsAnswerSubmitted(true);
        setFailedQuestionIndices((prev) => {
          const next = new Set(prev);
          next.add(currentQuizIndex);
          return next;
        });
        setAttemptFeedback('❌ 2 attempts used. Here is the correct answer and mentor explanation:');
      }
    }
  };

  // NEXT QUESTION OR RESULT WITH 30% ERROR MASTERY RULE
  const handleNextQuizQuestion = async () => {
    if (!lesson) return;

    if (currentQuizIndex < lesson.quiz.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
      setAttemptCount(1);
      setAttemptFeedback(null);
    } else {
      // Quiz complete!
      const totalQuestions = lesson.quiz.length;
      const totalFailed = failedQuestionIndices.size;
      const failureRate = (totalFailed / totalQuestions) * 100;

      // 30% ERROR RULE: If >30% of answers are wrong, must restart from scratch!
      if (failureRate > 30) {
        soundFx.playRetry();
        setMode('mastery_failed');
        return;
      }

      // PASSED WITH >= 70% ACCURACY!
      soundFx.playVictory();
      const finalScore = score;
      const isPerfect = finalScore === totalQuestions;

      let xpGained = XP_REWARDS.LESSON_COMPLETE.xp + finalScore * XP_REWARDS.QUIZ_CORRECT_ANSWER.xp;
      let coinsGained = XP_REWARDS.LESSON_COMPLETE.coins + finalScore * XP_REWARDS.QUIZ_CORRECT_ANSWER.coins;

      if (isPerfect) {
        xpGained += XP_REWARDS.QUIZ_PERFECT_BONUS.xp;
        coinsGained += XP_REWARDS.QUIZ_PERFECT_BONUS.coins;
      }

      setEarnedXP(xpGained);
      setEarnedCoins(coinsGained);
      setMode('result');

      // Award XP in DB & local game state
      await awardLocalXP(xpGained, coinsGained, 'lesson', lesson.slug);

      try {
        const stored = JSON.parse(localStorage.getItem('adquest_completed_slugs') || '[]');
        if (!stored.includes(lesson.slug)) {
          stored.push(lesson.slug);
          localStorage.setItem('adquest_completed_slugs', JSON.stringify(stored));
        }
      } catch (e) {}

      // Record lesson progress
      if (profile?.id) {
        await supabase.from('lesson_progress').upsert(
          {
            user_id: profile.id,
            lesson_slug: lesson.slug,
            status: 'completed',
            best_quiz_score: finalScore,
            completed_at: new Date().toISOString(),
          },
          { onConflict: 'user_id,lesson_slug' }
        );

        // Check first lesson badge
        const { count } = await supabase
          .from('lesson_progress')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id)
          .eq('status', 'completed');

        if (count === 1) {
          showBadgeToast({
            slug: 'first-lesson',
            name: 'First Step',
            description: 'Finish any lesson in the curriculum',
            icon: 'Footprints',
          });
        }
      }

      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B'],
        });
      } catch {}
    }
  };

  const handleRestartFromScratch = () => {
    setMode('learn');
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setAttemptCount(1);
    setFailedQuestionIndices(new Set());
    setAttemptFeedback(null);
    setShowHint(false);
    setScore(0);
  };

  return (
    <div className="max-w-2xl mx-auto py-2 px-1">
      {/* Top Header / Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2">
          <Link
            href="/map"
            className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Learning Map</span>
          </Link>
          <div className="text-center font-heading text-sm text-slate-800 dark:text-slate-100 truncate px-2 max-w-[200px] sm:max-w-xs">
            {lesson.title}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="flex items-center gap-1 text-amber-700 dark:text-amber-300 hover:text-amber-800 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
              title="Open Performance Calculator & Formula Sheet"
            >
              <Calculator size={13} />
              <span className="hidden sm:inline">Calculator</span>
            </button>
            {mode === 'quiz' && (
              <button
                type="button"
                onClick={() => setIsVisualPeekOpen(true)}
                className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full text-xs font-bold transition-colors"
                title="View Visual Guide"
              >
                <Eye size={13} />
                <span>Peek Diagram</span>
              </button>
            )}
            <Link
              href={`/tutor?lesson=${lesson.slug}`}
              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full text-xs font-bold"
            >
              <MessageCircle size={14} />
              <span>Ask Pixie</span>
            </Link>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* COMBINED UNIFIED MODE: LEARN (Visual Guide + Lesson Blocks in ONE view) */}
      {mode === 'learn' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-heading font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md">
                #{activeConcept.unitNumber}
              </span>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                  Unified Study Guide
                </span>
                <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-slate-100">
                  {lesson.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{activeConcept.subtitle}</p>
              </div>
            </div>

            {/* Visual Guide Graphic Embedded */}
            <VisualGuideCard
              concept={activeConcept}
              isPeekModal={true}
              onProceedToQuiz={() => {
                setMode('quiz');
                setCurrentQuizIndex(0);
                setSelectedAnswer(null);
                setIsAnswerSubmitted(false);
                setAttemptCount(1);
                setFailedQuestionIndices(new Set());
              }}
            />

            {/* Lesson Knowledge Blocks */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
              <h3 className="font-heading font-extrabold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                <span>Lesson Core Principles & Practical Application:</span>
              </h3>

              <div className="space-y-3.5">
                {lesson.blocks.map((block: Block, bIdx: number) => (
                  <div
                    key={bIdx}
                    className="rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-4 sm:p-5 bg-slate-50/70 dark:bg-slate-900/40"
                  >
                    {block.type === 'pixie' && (
                      <div className="flex items-start gap-3">
                        <PixieMascot mood="happy" size={42} className="shrink-0" />
                        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                          {block.text}
                        </div>
                      </div>
                    )}
                    {block.type === 'text' && (
                      <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-medium leading-relaxed">
                        {block.text}
                      </p>
                    )}
                    {block.type === 'analogy' && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-heading font-bold text-xs sm:text-sm">
                          <Sparkles size={15} />
                          <span>{block.title}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                          {block.text}
                        </p>
                      </div>
                    )}
                    {block.type === 'compare' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200">
                          <h5 className="font-bold text-xs text-slate-700 mb-1">{block.left.title}</h5>
                          <ul className="text-xs space-y-1 text-slate-500">
                            {block.left.points.map((pt, i) => (
                              <li key={i}>• {pt}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="p-3 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                          <h5 className="font-bold text-xs text-indigo-700 dark:text-indigo-300 mb-1">
                            {block.right.title}
                          </h5>
                          <ul className="text-xs space-y-1 text-indigo-900 dark:text-indigo-200">
                            {block.right.points.map((pt, i) => (
                              <li key={i}>✓ {pt}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                    {block.type === 'steps' && (
                      <div className="space-y-1.5">
                        <h5 className="font-bold text-xs text-slate-700 dark:text-slate-200 mb-1">
                          {block.title}
                        </h5>
                        {block.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-semibold">
                            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] shrink-0">
                              {i + 1}
                            </span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {block.type === 'tip' && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-medium">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Pro Tip:</strong> {block.text}
                        </span>
                      </div>
                    )}
                    {block.type === 'warning' && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-rose-900 dark:text-rose-200 font-medium">
                        <XCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Warning:</strong> {block.text}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Direct CTA to Quiz */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('quiz');
                  setCurrentQuizIndex(0);
                  setSelectedAnswer(null);
                  setIsAnswerSubmitted(false);
                  setAttemptCount(1);
                  setFailedQuestionIndices(new Set());
                }}
                className="w-full py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>🚀 I Have Studied — Start Quiz & Win XP ➔</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode: QUIZ */}
      {mode === 'quiz' && currentQuestion && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700">
            {/* Header info */}
            <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
              <span>
                Quiz Question {currentQuizIndex + 1} of {lesson.quiz.length}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                    attemptCount === 1
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  Attempt {attemptCount} of 2
                </span>
                <span className="text-slate-400">Score: {score}</span>
              </div>
            </div>

            <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-800 dark:text-slate-100 mb-6">
              {currentQuestion.q}
            </h3>

            {/* MCQ Options */}
            {(currentQuestion.type === 'mcq' || !currentQuestion.type) && (
              <div className="space-y-3">
                {currentQuestion.options?.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  let btnColor = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300';

                  if (isAnswerSubmitted) {
                    if (idx === currentQuestion.answer) {
                      btnColor =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                    } else if (isSelected) {
                      btnColor =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    btnColor =
                      'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200';
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full text-left p-4 rounded-2xl border-2 font-medium text-sm sm:text-base flex items-center justify-between transition-all ${btnColor}`}
                    >
                      <span>{opt}</span>
                      {isAnswerSubmitted && idx === currentQuestion.answer && (
                        <CheckCircle2 size={18} className="text-emerald-600" />
                      )}
                      {isAnswerSubmitted && isSelected && idx !== currentQuestion.answer && (
                        <XCircle size={18} className="text-rose-600" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* True / False Options */}
            {currentQuestion.type === 'tf' && (
              <div className="grid grid-cols-2 gap-4">
                {[true, false].map((val) => {
                  const isSelected = selectedAnswer === val;
                  let btnColor = 'border-slate-200 dark:border-slate-700';

                  if (isAnswerSubmitted) {
                    if (val === currentQuestion.answer) {
                      btnColor =
                        'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900';
                    } else if (isSelected) {
                      btnColor =
                        'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900';
                    }
                  } else if (isSelected) {
                    btnColor = 'border-indigo-600 bg-indigo-50 text-indigo-900';
                  }

                  return (
                    <button
                      key={String(val)}
                      disabled={isAnswerSubmitted}
                      onClick={() => setSelectedAnswer(val)}
                      className={`py-4 rounded-2xl border-2 font-heading font-bold text-center text-lg capitalize transition-all ${btnColor}`}
                    >
                      {String(val)}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Order / Sequence Question */}
            {currentQuestion.type === 'order' && currentQuestion.items && (() => {
              const itemsList = currentQuestion.items || [];
              const activeOrder =
                userOrder.length === itemsList.length
                  ? userOrder
                  : Array.from({ length: itemsList.length }, (_, i) => i).reverse();

              return (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500 font-semibold mb-2">
                    Use the arrows (↑ / ↓) to arrange the steps into the correct chronological order from first to last:
                  </p>
                  {activeOrder.map((itemOriginalIndex, displayPos) => {
                    const itemText = itemsList[itemOriginalIndex];
                    let cardStyle =
                      'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800';

                    if (isAnswerSubmitted) {
                      const targetAns = (currentQuestion.answer as number[]) || [];
                      const correctAtPos = targetAns[displayPos] === itemOriginalIndex;
                      if (correctAtPos) {
                        cardStyle =
                          'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                      } else {
                        cardStyle =
                          'border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
                      }
                    }

                    return (
                      <div
                        key={itemOriginalIndex}
                        className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border-2 transition-all ${cardStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-heading font-extrabold text-xs flex items-center justify-center shrink-0">
                            {displayPos + 1}
                          </span>
                          <span className="text-sm sm:text-base font-medium text-slate-800 dark:text-slate-100">
                            {itemText}
                          </span>
                        </div>

                        {!isAnswerSubmitted && (
                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <button
                              type="button"
                              disabled={displayPos === 0}
                              onClick={() => handleMoveOrderItem(displayPos, displayPos - 1, activeOrder)}
                              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-600 dark:text-slate-200 hover:text-indigo-600 disabled:opacity-25 flex items-center justify-center transition-colors active:scale-95"
                              title="Move up"
                            >
                              <ArrowUp size={16} />
                            </button>
                            <button
                              type="button"
                              disabled={displayPos === activeOrder.length - 1}
                              onClick={() => handleMoveOrderItem(displayPos, displayPos + 1, activeOrder)}
                              className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-600 dark:text-slate-200 hover:text-indigo-600 disabled:opacity-25 flex items-center justify-center transition-colors active:scale-95"
                              title="Move down"
                            >
                              <ArrowDown size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            {/* Attempt 2 Chance Banner */}
            {attemptCount === 2 && !isAnswerSubmitted && (
              <div className="mt-5 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-2.5 animate-fadeIn">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-heading font-extrabold block mb-0.5">
                    First attempt was incorrect!
                  </span>
                  <span>
                    You have 1 attempt remaining to correct your answer. Review the hint below, adjust your choice, and click Check Answer!
                  </span>
                </div>
              </div>
            )}

            {/* Explanation / Result Box */}
            {isAnswerSubmitted && (
              <div
                className={`mt-6 p-4 rounded-2xl text-sm leading-relaxed ${
                  isAnswerCorrect
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-200'
                }`}
              >
                <div className="font-bold mb-1">
                  {isAnswerCorrect
                    ? attemptCount === 1
                      ? '🎉 Correct on First Try!'
                      : '✅ Correct on Second Chance!'
                    : '❌ 2 Attempts Used — Correct Answer & Explanation:'}
                </div>
                <p>{currentQuestion.explain}</p>
              </div>
            )}

            {/* Hint Reveal */}
            {!isAnswerSubmitted && currentQuestion.hint && (
              <div className="mt-4">
                {showHint ? (
                  <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300">
                    💡 {currentQuestion.hint}
                  </p>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <HelpCircle size={14} />
                    <span>Need a hint?</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quiz Action Buttons */}
          <div className="flex justify-end">
            {!isAnswerSubmitted ? (
              <button
                disabled={currentQuestion.type === 'order' ? false : selectedAnswer === null}
                onClick={handleQuizSubmit}
                className="py-3 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-heading font-bold text-sm shadow-md transition-all active:scale-98"
              >
                {attemptCount === 1 ? 'Check Answer' : 'Check Attempt 2 of 2 ➔'}
              </button>
            ) : (
              <button
                onClick={handleNextQuizQuestion}
                className="py-3 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>{currentQuizIndex === lesson.quiz.length - 1 ? 'See Results' : 'Next Question'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mode: MASTERY FAILED (30% Error Threshold Rule) */}
      {mode === 'mastery_failed' && (
        <div className="space-y-6 text-center animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-card border-2 border-rose-200 dark:border-rose-900/60">
            <PixieMascot mood="thinking" size={84} className="mx-auto mb-4" />
            <div className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 font-extrabold text-xs uppercase tracking-wider mb-2">
              Mastery Standard: 70%+ Required
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              Lesson Mastery Not Met
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              You had <span className="font-extrabold text-rose-600">{failedQuestionIndices.size} incorrect</span> out of {lesson.quiz.length} questions ({Math.round((failedQuestionIndices.size / lesson.quiz.length) * 100)}% error rate).
            </p>
            <div className="my-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 max-w-md mx-auto text-left leading-relaxed">
              💡 <strong>AdQuest Mastery Rule:</strong> Performance media buying requires high precision. When more than 30% of answers are missed after 2 attempts, you must review the study guide and restart this lesson from scratch to ensure solid fundamentals!
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <button
                onClick={handleRestartFromScratch}
                className="py-3.5 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-sm shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} />
                <span>Restart Lesson from Scratch</span>
              </button>

              <Link
                href="/map"
                className="py-3.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-heading font-bold text-sm text-center"
              >
                Return to Learning Map
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Mode: RESULT (Mastery Passed) */}
      {mode === 'result' && (
        <div className="space-y-6 text-center animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-card border border-slate-200 dark:border-slate-700">
            <PixieMascot mood="celebrating" size={84} className="mx-auto mb-4" />
            <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              Lesson Mastered!
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              You scored {score} / {lesson.quiz.length} on the quiz (passed the 70%+ mastery standard)
            </p>

            {/* Rewards Card */}
            <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-indigo-50 dark:from-slate-900 dark:to-slate-900 border border-amber-200 dark:border-slate-700 flex justify-around">
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 font-bold uppercase">XP Earned</span>
                <span className="font-heading font-extrabold text-2xl text-amber-600">
                  +{earnedXP} XP
                </span>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex flex-col items-center">
                <span className="text-xs text-slate-500 font-bold uppercase">AdCoins</span>
                <span className="font-heading font-extrabold text-2xl text-amber-600">
                  +{earnedCoins}
                </span>
              </div>
            </div>

            {/* Lesson Recap */}
            <div className="text-left bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 mb-6">
              <h4 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <BookOpen size={16} />
                <span>Key Takeaways:</span>
              </h4>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                {lesson.recap.map((r, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRestartFromScratch}
                className="py-3 px-5 rounded-2xl border border-slate-300 dark:border-slate-700 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                <RotateCcw size={16} />
                <span>Review Lesson</span>
              </button>

              <button
                onClick={() => {
                  if (lesson.next?.startsWith('sim-')) {
                    router.push(`/sim/${lesson.next}`);
                  } else if (lesson.next) {
                    router.push(`/lesson/${lesson.next}`);
                  } else {
                    router.push('/map');
                  }
                }}
                className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-base shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2"
              >
                <span>
                  {lesson.next?.startsWith('sim-')
                    ? 'Next: Practice Simulator ➔'
                    : nextConcept
                    ? `Next: Unit ${nextConcept.unitNumber} ➔`
                    : lesson.next
                    ? 'Next Unit ➔'
                    : 'Complete Tier ➔'}
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Guide Peek Modal */}
      {isVisualPeekOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
            <VisualGuideCard
              concept={activeConcept}
              isPeekModal={true}
              onClosePeek={() => setIsVisualPeekOpen(false)}
              onProceedToQuiz={() => setIsVisualPeekOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Live Performance Formula & Calculator Modal */}
      <FormulaCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
