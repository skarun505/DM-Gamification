'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { getLessonBySlug } from '@/lib/content/loader';
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
  Trophy,
  RotateCcw,
  BookOpen,
  MessageCircle,
} from 'lucide-react';

export default function LessonPlayerPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { profile, awardLocalXP, showBadgeToast } = useGame();
  const supabase = createClient();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [mode, setMode] = useState<'learn' | 'quiz' | 'result'>('learn');

  // Quiz state
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [earnedXP, setEarnedXP] = useState(0);
  const [earnedCoins, setEarnedCoins] = useState(0);
  const [showHint, setShowHint] = useState(false);

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

  const handleMoveOrderItem = (fromIndex: number, toIndex: number) => {
    if (isAnswerSubmitted || toIndex < 0 || toIndex >= userOrder.length) return;
    const next = [...userOrder];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    setUserOrder(next);
    setSelectedAnswer(next);
  };

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/content/lesson?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setLesson(data);
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mode === 'learn' && lesson) {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          if (currentBlockIndex < lesson.blocks.length - 1) {
            setCurrentBlockIndex((prev) => prev + 1);
          } else {
            setMode('quiz');
          }
        } else if (e.key === 'ArrowLeft' && currentBlockIndex > 0) {
          setCurrentBlockIndex((prev) => prev - 1);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, currentBlockIndex, lesson]);

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

  const currentBlock: Block = lesson.blocks[currentBlockIndex];
  const progressPercent =
    mode === 'learn'
      ? Math.round(((currentBlockIndex + 1) / lesson.blocks.length) * 100)
      : 100;

  const currentQuestion: QuizQuestion | undefined = lesson.quiz[currentQuizIndex];

  const handleNextBlock = () => {
    if (currentBlockIndex < lesson.blocks.length - 1) {
      setCurrentBlockIndex((prev) => prev + 1);
    } else {
      setMode('quiz');
      setCurrentQuizIndex(0);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    }
  };

  const handlePrevBlock = () => {
    if (currentBlockIndex > 0) {
      setCurrentBlockIndex((prev) => prev - 1);
    }
  };

  const handleQuizSubmit = async () => {
    if (selectedAnswer === null || !currentQuestion) return;

    let correct = false;
    if (currentQuestion.type === 'tf') {
      correct = selectedAnswer === currentQuestion.answer;
    } else if (currentQuestion.type === 'order') {
      const targetAns = currentQuestion.answer as number[];
      correct =
        Array.isArray(userOrder) &&
        userOrder.length === targetAns.length &&
        userOrder.every((val, idx) => val === targetAns[idx]);
    } else {
      correct = selectedAnswer === currentQuestion.answer;
    }

    setIsAnswerCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = async () => {
    if (!lesson) return;

    if (currentQuizIndex < lesson.quiz.length - 1) {
      setCurrentQuizIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
      setShowHint(false);
    } else {
      // Quiz complete! Calculate rewards
      const finalScore = isAnswerCorrect ? score + 1 : score;
      const totalQuestions = lesson.quiz.length;
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
            <span>Map</span>
          </Link>
          <div className="text-center font-heading text-sm text-slate-800 dark:text-slate-100">
            {lesson.title}
          </div>
          <Link
            href={`/tutor?lesson=${lesson.slug}`}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-full text-xs font-bold"
          >
            <MessageCircle size={14} />
            <span>Ask Pixie</span>
          </Link>
        </div>

        {/* Bar */}
        <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mode: LEARN */}
      {mode === 'learn' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Card Frame */}
          <div className="min-h-[300px] flex flex-col justify-center bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 dark:border-slate-700">
            {/* Block Content Rendering */}
            {currentBlock.type === 'pixie' && (
              <div className="flex items-start gap-4">
                <PixieMascot mood="happy" size={54} />
                <div className="flex-1 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 rounded-2xl p-4 text-slate-800 dark:text-slate-100 font-medium text-base sm:text-lg leading-relaxed">
                  {currentBlock.text}
                </div>
              </div>
            )}

            {currentBlock.type === 'text' && (
              <div className="text-slate-800 dark:text-slate-100 text-lg sm:text-xl font-medium leading-relaxed">
                {currentBlock.text}
              </div>
            )}

            {currentBlock.type === 'analogy' && (
              <div className="bg-amber-50/70 dark:bg-amber-950/30 border-2 border-amber-300 dark:border-amber-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-heading font-bold text-base mb-2">
                  <Sparkles size={18} />
                  <span>{currentBlock.title}</span>
                </div>
                <p className="text-slate-700 dark:text-slate-200 text-base sm:text-lg leading-relaxed">
                  {currentBlock.text}
                </p>
              </div>
            )}

            {currentBlock.type === 'compare' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                  <h4 className="font-heading font-bold text-sm text-slate-700 dark:text-slate-300 mb-2">
                    {currentBlock.left.title}
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                    {currentBlock.left.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-slate-400">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-indigo-50/80 dark:bg-indigo-950/40 rounded-2xl p-4 border border-indigo-200 dark:border-indigo-800">
                  <h4 className="font-heading font-bold text-sm text-indigo-700 dark:text-indigo-300 mb-2">
                    {currentBlock.right.title}
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200">
                    {currentBlock.right.points.map((pt, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-indigo-500 font-bold">✓</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {currentBlock.type === 'steps' && (
              <div className="space-y-3">
                <h4 className="font-heading font-bold text-base text-slate-800 dark:text-slate-100">
                  {currentBlock.title}
                </h4>
                <div className="space-y-2">
                  {currentBlock.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 text-sm font-semibold"
                    >
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentBlock.type === 'table' && (
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-heading">
                    <tr>
                      {currentBlock.headers.map((h, i) => (
                        <th key={i} className="p-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {currentBlock.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3 text-slate-600 dark:text-slate-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {currentBlock.type === 'tip' && (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle2 size={22} className="text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base text-emerald-900 dark:text-emerald-200 font-medium">
                  <span className="font-bold">Pro Tip: </span>
                  {currentBlock.text}
                </div>
              </div>
            )}

            {currentBlock.type === 'warning' && (
              <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-800 rounded-2xl p-4 flex items-start gap-3">
                <XCircle size={22} className="text-rose-600 shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base text-rose-900 dark:text-rose-200 font-medium">
                  <span className="font-bold">Warning: </span>
                  {currentBlock.text}
                </div>
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handlePrevBlock}
              disabled={currentBlockIndex === 0}
              className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-sm font-semibold disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Previous
            </button>

            <span className="text-xs text-slate-400">
              {currentBlockIndex + 1} / {lesson.blocks.length}
            </span>

            <button
              onClick={handleNextBlock}
              className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold font-heading text-sm flex items-center gap-1.5 shadow-md shadow-indigo-500/20 active:scale-98 transition-all"
            >
              <span>{currentBlockIndex === lesson.blocks.length - 1 ? 'Start Quiz' : 'Next'}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Mode: QUIZ */}
      {mode === 'quiz' && currentQuestion && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between text-xs font-bold text-indigo-600 uppercase tracking-wider mb-3">
              <span>Quiz Question {currentQuizIndex + 1} of {lesson.quiz.length}</span>
              <span className="text-slate-400">Score: {score}</span>
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
                      btnColor = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                    } else if (isSelected) {
                      btnColor = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    btnColor = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200';
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
                      btnColor = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900';
                    } else if (isSelected) {
                      btnColor = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900';
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
            {currentQuestion.type === 'order' && currentQuestion.items && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-semibold mb-2">
                  Use the arrows (↑ / ↓) to arrange the steps into the correct chronological order from first to last:
                </p>
                {userOrder.map((itemOriginalIndex, displayPos) => {
                  const itemText = currentQuestion.items![itemOriginalIndex];
                  let cardStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800';

                  if (isAnswerSubmitted) {
                    const correctAtPos = (currentQuestion.answer as number[])[displayPos] === itemOriginalIndex;
                    if (correctAtPos) {
                      cardStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                    } else {
                      cardStyle = 'border-rose-400 bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200';
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
                            onClick={() => handleMoveOrderItem(displayPos, displayPos - 1)}
                            className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-slate-600 dark:text-slate-200 hover:text-indigo-600 disabled:opacity-25 flex items-center justify-center transition-colors active:scale-95"
                            title="Move up"
                          >
                            <ArrowUp size={16} />
                          </button>
                          <button
                            type="button"
                            disabled={displayPos === userOrder.length - 1}
                            onClick={() => handleMoveOrderItem(displayPos, displayPos + 1)}
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
            )}

            {/* Explanation / Hint Box */}
            {isAnswerSubmitted && (
              <div className={`mt-6 p-4 rounded-2xl text-sm leading-relaxed ${
                isAnswerCorrect
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200'
                  : 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-200'
              }`}>
                <div className="font-bold mb-1">
                  {isAnswerCorrect ? '🎉 Correct!' : '💡 Learning Moment:'}
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
                disabled={selectedAnswer === null}
                onClick={handleQuizSubmit}
                className="py-3 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-heading font-bold text-sm shadow-md transition-all"
              >
                Check Answer
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

      {/* Mode: RESULT */}
      {mode === 'result' && (
        <div className="space-y-6 text-center animate-fadeIn">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-card border border-slate-200 dark:border-slate-700">
            <PixieMascot mood="celebrating" size={84} className="mx-auto mb-4" />
            <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              Lesson Complete!
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              You scored {score} / {lesson.quiz.length} on the quiz
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
                onClick={() => {
                  setMode('learn');
                  setCurrentBlockIndex(0);
                  setScore(0);
                }}
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
                <span>Continue Next</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
