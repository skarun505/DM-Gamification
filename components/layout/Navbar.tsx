'use client';

import React from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { StreakFlame } from '@/components/game/StreakFlame';
import { CoinBadge } from '@/components/game/CoinBadge';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { Bell, Sparkles } from 'lucide-react';

export function Navbar() {
  const { profile, unreadNotesCount } = useGame();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 px-4 py-2.5 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <Link href="/home" className="flex items-center gap-2.5 group">
          <PixieMascot size={36} mood="happy" />
          <div className="flex flex-col">
            <span className="font-heading font-extrabold text-xl text-indigo-600 dark:text-indigo-400 leading-tight group-hover:scale-105 transition-transform">
              AdQuest
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-tight -mt-0.5">
              Learn ads by playing
            </span>
          </div>
        </Link>

        {/* Stats & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <StreakFlame streak={profile?.streak ?? 1} size="sm" />
          <CoinBadge coins={profile?.coins ?? 0} size="sm" />

          {/* Mentor Notes notification bell */}
          <Link
            href="/notes"
            aria-label="Mentor Notes"
            className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell size={20} />
            {unreadNotesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

