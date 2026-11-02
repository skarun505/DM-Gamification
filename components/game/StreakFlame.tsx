'use client';

import React from 'react';
import { Flame } from 'lucide-react';

interface StreakFlameProps {
  streak: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakFlame({ streak, className = '', size = 'md' }: StreakFlameProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3.5 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  }[size];

  const isLit = streak > 0;

  return (
    <div
      title={`${streak} day streak! Keep it going.`}
      className={`inline-flex items-center rounded-full font-bold transition-all shadow-sm ${
        isLit
          ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/60'
          : 'bg-slate-100 text-slate-400 border border-slate-200 dark:bg-slate-800 dark:text-slate-500'
      } ${sizeClasses} ${className}`}
    >
      <Flame
        size={iconSizes}
        className={`shrink-0 ${isLit ? 'fill-rose-500 text-rose-500 animate-pulse' : ''}`}
      />
      <span>{streak}</span>
    </div>
  );
}

