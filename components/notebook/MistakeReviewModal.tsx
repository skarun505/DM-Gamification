'use client';

import React, { useState } from 'react';
import { MistakeItem, removeMistakeFromNotebook } from '@/lib/storage/mistake-notebook';
import { soundFx } from '@/lib/sound/audio';
import confetti from 'canvas-confetti';
import { X, CheckCircle2, RotateCcw, Sparkles, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface MistakeReviewModalProps {
  mistakes: MistakeItem[];
  isOpen: boolean;
  onClose: () => void;
  onUpdateMistakes: (updated: MistakeItem[]) => void;
}

export function MistakeReviewModal({
  mistakes,
  isOpen,
  onClose,
  onUpdateMistakes,
}: MistakeReviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<any>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  if (!isOpen) return null;

  if (mistakes.length === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
        <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center"
          >
            <X size={16} />
          </button>
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 size={30} />
          </div>
          <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-slate-100">
            Notebook is Empty! 🎉
          </h3>
          <p className="text-xs text-slate-500">
            You currently have zero weak spots recorded. Great job! As you take quizzes and boss battles, any tricky questions will auto-save here.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-heading font-bold text-xs"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const current = mistakes[currentIndex] || mistakes[0];

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    const correct = selectedAnswer === current.answer;
    setIsAnswerCorrect(correct);
    setIsAnswerSubmitted(true);

    if (correct) {
      soundFx.playCorrect();
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      } catch {}
    } else {
      soundFx.playRetry();
    }
  };

  const handleClearAndNext = () => {
    // Remove the mastered question
    const updated = removeMistakeFromNotebook(current.id);
    onUpdateMistakes(updated);

    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);

    if (currentIndex >= updated.length) {
      setCurrentIndex(Math.max(0, updated.length - 1));
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    if (currentIndex < mistakes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between pr-8">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400 block">
              Smart Mistake Notebook ({currentIndex + 1} of {mistakes.length})
            </span>
            <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-slate-100">
              {current.lessonTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => {
              const updated = removeMistakeFromNotebook(current.id);
              onUpdateMistakes(updated);
            }}
            className="text-slate-400 hover:text-rose-600 text-xs flex items-center gap-1"
            title="Remove from notebook"
          >
            <Trash2 size={14} />
            <span>Discard</span>
          </button>
        </div>

        {/* Question Text */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
          <p className="font-heading font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100">
            {current.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {current.options?.map((opt, idx) => {
            const isSelected = selectedAnswer === idx;
            let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300';

            if (isAnswerSubmitted) {
              if (idx === current.answer) {
                btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
              } else if (isSelected) {
                btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
              }
            } else if (isSelected) {
              btnStyle = 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-900 dark:text-indigo-200';
            }

            return (
              <button
                key={idx}
                disabled={isAnswerSubmitted}
                onClick={() => setSelectedAnswer(idx)}
                className={`w-full text-left p-3.5 rounded-2xl border-2 font-medium text-xs sm:text-sm flex items-center justify-between transition-all ${btnStyle}`}
              >
                <span>{opt}</span>
                {isAnswerSubmitted && idx === current.answer && (
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Explanation feedback */}
        {isAnswerSubmitted && (
          <div
            className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
              isAnswerCorrect
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200'
                : 'bg-amber-50 text-amber-900 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-200'
            }`}
          >
            <div className="font-bold mb-1">
              {isAnswerCorrect ? '🎉 Mastered!' : '💡 Mentor Explanation:'}
            </div>
            <p>{current.explain}</p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          {!isAnswerSubmitted ? (
            <button
              disabled={selectedAnswer === null}
              onClick={handleCheck}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md"
            >
              Verify Answer
            </button>
          ) : isAnswerCorrect ? (
            <button
              onClick={handleClearAndNext}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>Mastered! Remove from Notebook ➔</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md"
            >
              Next Mistake ➔
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

