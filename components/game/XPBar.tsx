'use client';

import React from 'react';
import { getLevelInfo } from '@/lib/game/levels';
import { Zap } from 'lucide-react';

interface XPBarProps {
  xp: number;
  showDetails?: boolean;
  className?: string;
}

export function XPBar({ xp, showDetails = true, className = '' }: XPBarProps) {
  const { level, title, progressPercent, xpNeededForNext, currentLevelXP, nextLevelXP } =
    getLevelInfo(xp);

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {showDetails && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold dark:bg-indigo-900/60 dark:text-indigo-300">
              {level}
            </span>
            <span className="font-heading text-indigo-600 dark:text-indigo-400 font-bold">
              Level {level} · {title}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-[11px]">
            <Zap size={12} className="text-amber-500 fill-amber-500" />
            <span>{xp} XP</span>
            <span className="text-slate-400">({xpNeededForNext} to L{level + 1})</span>
          </div>
        </div>
      )}

      {/* Progress Track */}
      <div className="w-full bg-slate-200/80 dark:bg-slate-700/80 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
        <div
          className="bg-gradient-to-r from-amber-400 via-amber-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

