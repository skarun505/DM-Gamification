'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { StreakFlame } from '@/components/game/StreakFlame';
import { CoinBadge } from '@/components/game/CoinBadge';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { Bell, Sparkles, Volume2, VolumeX, Compass } from 'lucide-react';
import { soundFx } from '@/lib/sound/audio';

export function Navbar() {
  const { profile, unreadNotesCount } = useGame();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(soundFx.getMuted());
  }, []);

  const handleToggleSound = () => {
    const next = soundFx.toggleMute();
    setIsMuted(next);
    if (!next) {
      soundFx.playCorrect();
    }
  };

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

          {/* Beginner Tour Button */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('open-adquest-tour'))}
            aria-label="How to Play Tour"
            title="How to Play: Beginner Tour"
            className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-heading font-bold text-xs transition-all active:scale-95 border border-indigo-200/60 dark:border-indigo-800"
          >
            <Compass size={15} className="text-indigo-600 dark:text-indigo-400" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
            title={isMuted ? 'Sound FX: Off (Click to turn on)' : 'Sound FX: On (Click to mute)'}
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
          >
            {isMuted ? <VolumeX size={20} className="text-slate-400" /> : <Volume2 size={20} className="text-indigo-600" />}
          </button>

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

