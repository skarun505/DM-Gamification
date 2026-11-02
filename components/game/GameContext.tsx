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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [unreadNotesCount, setUnreadNotesCount] = useState(0);
  const [activeBadgeToast, setActiveBadgeToast] = useState<Badge | null>(null);

  const supabase = createClient();

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // Fetch profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setProfile(data as Profile);
      } else {
        // If profile was just created or trigger delayed, fallback
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
      }

      // Fetch unread mentor notes
      const { count } = await supabase
        .from('mentor_notes')
        .select('*', { count: 'exact', head: true })
        .eq('to_user', user.id)
        .eq('read', false);

      setUnreadNotesCount(count || 0);
    } catch (err) {
      console.error('Error fetching game profile:', err);
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
          return {
            ...prev,
            xp: prev.xp + xp,
            coins: prev.coins + coins,
          };
        });
      }
    } catch (err) {
      console.warn('award_xp RPC fallback:', err);
      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          xp: prev.xp + xp,
          coins: prev.coins + coins,
        };
      });
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

