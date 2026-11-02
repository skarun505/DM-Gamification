import React from 'react';
import { GameProvider } from '@/components/game/GameContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { BottomNav } from '@/components/layout/BottomNav';
import { ActiveBadgeToastWrapper } from '@/components/game/ActiveBadgeToastWrapper';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <GameProvider>
      <div className="flex min-h-screen bg-[#FAF8F5] dark:bg-slate-900 text-slate-800 dark:text-slate-100">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Navbar />
          <main className="flex-1 pb-20 md:pb-8 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
          <BottomNav />
          <ActiveBadgeToastWrapper />
        </div>
      </div>
    </GameProvider>
  );
}
