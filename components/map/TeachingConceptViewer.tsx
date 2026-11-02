'use client';

import React from 'react';
import { TeachingConcept } from '@/lib/content/teaching-concepts';
import { VisualGuideCard } from '@/components/teaching/VisualGuideCard';
import { X } from 'lucide-react';

interface TeachingConceptViewerProps {
  concept: TeachingConcept;
  isOpen: boolean;
  onClose: () => void;
  onProceedToLesson: (lessonSlug: string) => void;
}

export function TeachingConceptViewer({
  concept,
  isOpen,
  onClose,
  onProceedToLesson,
}: TeachingConceptViewerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        <VisualGuideCard
          concept={concept}
          isPeekModal={false}
          onProceedToQuiz={() => onProceedToLesson(concept.lessonSlug)}
          onProceedToLearn={() => onProceedToLesson(concept.lessonSlug)}
        />
      </div>
    </div>
  );
}
