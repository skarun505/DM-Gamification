'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, X } from 'lucide-react';
import { Badge } from '@/lib/game/badges';

interface BadgeToastProps {
  badge: Badge | null;
  onClose: () => void;
}

export function BadgeToast({ badge, onClose }: BadgeToastProps) {
  useEffect(() => {
    if (badge) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B', '#F43F5E'],
        });
      } catch (err) {
        // Safe in case canvas is not supported
      }
    }
  }, [badge]);

  if (!badge) return null;

  return (
    <div className="fixed top-5 right-5 left-5 md:left-auto md:w-96 z-50 animate-bounce shadow-2xl rounded-2xl bg-white dark:bg-slate-800 border-2 border-amber-400 p-4 flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0 text-amber-600 dark:text-amber-300">
        <Award size={28} className="animate-pulse" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          🎉 Badge Unlocked!
        </div>
        <div className="text-sm font-heading font-bold text-slate-800 dark:text-slate-100 truncate">
          {badge.name}
        </div>
        <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
          {badge.description}
        </div>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        aria-label="Close"
      >
        <X size={18} />
      </button>
    </div>
  );
}

