'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { XPBar } from '@/components/game/XPBar';
import { createClient } from '@/lib/supabase/client';
import {
  Home,
  Map,
  Briefcase,
  MessageCircle,
  BookOpen,
  Calendar,
  User,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useGame();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { href: '/home', label: 'Home Dashboard', icon: Home },
    { href: '/map', label: 'Learning Map', icon: Map },
    { href: '/interview', label: 'Interview Dojo', icon: Briefcase },
    { href: '/tutor', label: 'Ask Pixie (AI)', icon: MessageCircle },
    { href: '/daily', label: 'Daily Challenge', icon: Calendar },
    { href: '/glossary', label: 'Ads Glossary', icon: BookOpen },
    { href: '/profile', label: 'My Profile & Badges', icon: User },
  ];

  if (profile?.role === 'admin') {
    navItems.push({ href: '/admin', label: 'Mentor Portal', icon: ShieldCheck });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 sticky top-0 h-screen overflow-y-auto z-30">
      {/* Brand */}
      <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
        <PixieMascot size={42} mood="happy" />
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-indigo-600 dark:text-indigo-400 leading-tight">
            AdQuest
          </h1>
          <p className="text-xs text-slate-400 font-medium">Performance Marketing</p>
        </div>
      </div>

      {/* Mini Profile / XP */}
      <div className="py-4 border-b border-slate-100 dark:border-slate-800">
        <XPBar xp={profile?.xp ?? 0} />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-bold dark:bg-indigo-950/60 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={19} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info & Sign out */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex flex-col truncate pr-2">
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
            {profile?.display_name || 'Learner'}
          </span>
          <span className="text-xs text-slate-400 capitalize">
            {profile?.role === 'admin' ? 'Mentor (Admin)' : 'Learner'}
          </span>
        </div>
        <button
          onClick={handleLogout}
          title="Sign out"
          className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}

