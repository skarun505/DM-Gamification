'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Badge } from '@/lib/game/badges';

export interface Profile {
  id: string;
  display_name: string;
  role: 'learner' | 'admin';
  avatar: string;
  xp: number;
  coins: number;
  streak: number;
  best_streak: number;
  streak_freezes: number;
  last_active_date: string | null;
}

interface GameContextType {
  profile: Profile | null;
  loading: boolean;
  unreadNotesCount: number;
  activeBadgeToast: Badge | null;
  showBadgeToast: (badge: Badge) => void;
  closeBadgeToast: () => void;
  awardLocalXP: (xp: number, coins: number, source: string, ref?: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
  resetAccountData: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const CURRENT_RESET_VERSION = 'v2_deepana_fresh_reset';

export function GameProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotesCount, setUnreadNotesCount] = useState(0);
  const [activeBadgeToast, setActiveBadgeToast] = useState<Badge | null>(null);

  const supabase = createClient();

  // One-time automatic clean reset for brand new account experience
  const checkVersionReset = () => {
    if (typeof window === 'undefined') return;
    try {
      const storedVersion = localStorage.getItem('adquest_account_reset_version');
      if (storedVersion !== CURRENT_RESET_VERSION) {
        localStorage.removeItem('adquest_completed_slugs');
        localStorage.removeItem('adquest_mistake_notebook');
        localStorage.removeItem('adquest_tour_completed');
        localStorage.removeItem('adquest_pixie_chat_Deepana');
        localStorage.removeItem('adquest_pixie_tutor_chat_Deepana');

        let displayName = 'Deepana';
        try {
          const raw = localStorage.getItem('adquest_active_user');
          if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed.display_name) displayName = parsed.display_name;
          }
        } catch {}

        const cleanUser = {
          id: 'learner-deepana-1',
          display_name: displayName,
          role: 'learner',
          avatar: 'rocket',
          xp: 0,
          coins: 0,
          streak: 1,
          best_streak: 1,
          streak_freezes: 0,
          last_active_date: null,
        };
        localStorage.setItem('adquest_active_user', JSON.stringify(cleanUser));
        localStorage.setItem('adquest_account_reset_version', CURRENT_RESET_VERSION);
      }
    } catch (e) {
      console.warn('Version check error:', e);
    }
  };

  const fetchProfile = async () => {
    checkVersionReset();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // Fetch profile
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (data) {
          setProfile(data as Profile);
          setLoading(false);
          return;
        } else {
          setProfile({
            id: user.id,
            display_name: user.email?.split('@')[0] || 'Learner',
            role: 'learner',
            avatar: 'rocket',
            xp: 0,
            coins: 0,
            streak: 1,
            best_streak: 1,
            streak_freezes: 0,
            last_active_date: null,
          });
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Supabase offline or unreachable, using local session:', err);
    }

    // Resilient local session fallback
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem('adquest_active_user') : null;
      if (raw) {
        const stored = JSON.parse(raw);
        setProfile({
          id: stored.id || 'learner-deepana-1',
          display_name: stored.display_name || 'Deepana',
          role: stored.role || 'learner',
          avatar: 'rocket',
          xp: stored.xp ?? 0,
          coins: stored.coins ?? 0,
          streak: stored.streak ?? 1,
          best_streak: stored.best_streak ?? 1,
          streak_freezes: stored.streak_freezes ?? 0,
          last_active_date: null,
        });
      } else {
        // Default clean Deepana profile for brand-new learner
        setProfile({
          id: 'learner-deepana-1',
          display_name: 'Deepana',
          role: 'learner',
          avatar: 'rocket',
          xp: 0,
          coins: 0,
          streak: 1,
          best_streak: 1,
          streak_freezes: 0,
          last_active_date: null,
        });
      }
    } catch (e) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const awardLocalXP = async (xp: number, coins: number, source: string, ref?: string) => {
    try {
      const { data, error } = await supabase.rpc('award_xp', {
        p_source: source,
        p_ref: ref || '',
        p_xp: xp,
        p_coins: coins,
      });

      if (!error && data) {
        setProfile(data as Profile);
      } else {
        // Fallback optimistic update if offline/mock
        setProfile((prev) => {
          if (!prev) return null;
          const updated = {
            ...prev,
            xp: prev.xp + xp,
            coins: prev.coins + coins,
          };
          try {
            localStorage.setItem('adquest_active_user', JSON.stringify(updated));
          } catch (e) {}
          return updated;
        });
      }
    } catch (err) {
      console.warn('award_xp RPC fallback:', err);
      setProfile((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          xp: prev.xp + xp,
          coins: prev.coins + coins,
        };
        try {
          localStorage.setItem('adquest_active_user', JSON.stringify(updated));
        } catch (e) {}
        return updated;
      });
    }
  };

  const resetAccountData = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adquest_completed_slugs');
        localStorage.removeItem('adquest_mistake_notebook');
        localStorage.removeItem('adquest_tour_completed');
        if (profile?.display_name) {
          localStorage.removeItem(`adquest_pixie_chat_${profile.display_name}`);
          localStorage.removeItem(`adquest_pixie_tutor_chat_${profile.display_name}`);
        }
        localStorage.removeItem('adquest_pixie_chat_Deepana');
        localStorage.removeItem('adquest_pixie_tutor_chat_Deepana');
        localStorage.setItem('adquest_account_reset_version', CURRENT_RESET_VERSION);

        const cleanUser: Profile = {
          id: profile?.id || 'learner-deepana-1',
          display_name: profile?.display_name || 'Deepana',
          role: profile?.role || 'learner',
          avatar: 'rocket',
          xp: 0,
          coins: 0,
          streak: 1,
          best_streak: 1,
          streak_freezes: 0,
          last_active_date: null,
        };

        localStorage.setItem('adquest_active_user', JSON.stringify(cleanUser));
        setProfile(cleanUser);
      }

      // If Supabase is connected, call server API or reset tables
      try {
        await fetch('/api/user/reset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: profile?.id }),
        });
      } catch (e) {
        console.warn('Server reset API call ignored:', e);
      }
    } catch (err) {
      console.error('Failed to reset account:', err);
    }
  };

  const showBadgeToast = (badge: Badge) => {
    setActiveBadgeToast(badge);
  };

  const closeBadgeToast = () => {
    setActiveBadgeToast(null);
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        loading,
        unreadNotesCount,
        activeBadgeToast,
        showBadgeToast,
        closeBadgeToast,
        awardLocalXP,
        refreshProfile: fetchProfile,
        resetAccountData,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
