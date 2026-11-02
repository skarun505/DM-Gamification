'use client';

import React from 'react';
import { Coins } from 'lucide-react';

interface CoinBadgeProps {
  coins: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CoinBadge({ coins, className = '', size = 'md' }: CoinBadgeProps) {
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

  return (
    <div
      title={`${coins} AdCoins. Spend in the Shop!`}
      className={`inline-flex items-center rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/60 shadow-sm ${sizeClasses} ${className}`}
    >
      <Coins size={iconSizes} className="text-amber-500 fill-amber-500 shrink-0" />
      <span>{coins}</span>
    </div>
  );
}

