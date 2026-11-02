'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/components/game/GameContext';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import confetti from 'canvas-confetti';
import {
  Bell,
  CheckCircle2,
  Sparkles,
  Heart,
  Flag,
  Award,
} from 'lucide-react';

interface MentorNote {
  id: string;
  title: string;
  body: string;
  kind: 'note' | 'challenge' | 'cheer';
  xp_reward: number;
  read: boolean;
  claimed: boolean;
  created_at: string;
}

export default function NotesPage() {
  const { profile, awardLocalXP, showBadgeToast, refreshProfile } = useGame();
  const [notes, setNotes] = useState<MentorNote[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadNotes() {
      if (!profile?.id) return;
      try {
        const { data } = await supabase
          .from('mentor_notes')
          .select('*')
          .eq('to_user', profile.id)
          .order('created_at', { ascending: false });

        setNotes(data || []);

        // Mark all as read
        await supabase
          .from('mentor_notes')
          .update({ read: true })
          .eq('to_user', profile.id)
          .eq('read', false);
      } catch (err) {
        console.error('Failed to load mentor notes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotes();
  }, [profile?.id]);

  const handleClaim = async (note: MentorNote) => {
    if (note.claimed || note.xp_reward <= 0 || !profile) return;

    try {
      await supabase
        .from('mentor_notes')
        .update({ claimed: true })
        .eq('id', note.id);

      await awardLocalXP(note.xp_reward, 0, 'mentor_challenge', note.id);

      setNotes((prev) =>
        prev.map((n) => (n.id === note.id ? { ...n, claimed: true } : n))
      );

      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      // Check mentor fan badge (3 claimed)
      const { count } = await supabase
        .from('mentor_notes')
        .select('*', { count: 'exact', head: true })
        .eq('to_user', profile.id)
        .eq('claimed', true);

      if ((count || 0) >= 3) {
        showBadgeToast({
          slug: 'mentor-fan',
          name: "Mentor's Pick",
          description: 'Claim rewards from 3 Mentor challenges',
          icon: 'Heart',
        });
      }

      await refreshProfile();
    } catch (err) {
      console.error('Failed to claim note:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600">
          <Bell size={22} />
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            Mentor Notes & Cheers
          </h1>
          <p className="text-xs text-slate-500">
            Messages and bonus challenges from your marketing coach.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
          <PixieMascot mood="thinking" size={54} className="animate-pulse" />
          <p className="text-sm font-semibold text-slate-500">Checking your notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700 shadow-card space-y-3">
          <PixieMascot mood="happy" size={72} className="mx-auto opacity-80" />
          <h3 className="font-heading font-bold text-lg text-slate-700 dark:text-slate-200">
            No notes yet!
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your mentor will send cheers, tips, and bonus challenges here as you progress through lessons.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => {
            const isChallenge = note.kind === 'challenge';
            const isCheer = note.kind === 'cheer';

            return (
              <div
                key={note.id}
                className={`bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border space-y-3 transition-all ${
                  isChallenge
                    ? 'border-amber-300 dark:border-amber-900/60'
                    : isCheer
                    ? 'border-rose-200 dark:border-rose-900/60'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isChallenge && <Flag size={16} className="text-amber-500" />}
                    {isCheer && <Heart size={16} className="text-rose-500 fill-rose-500" />}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {note.kind}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100">
                    {note.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {note.body}
                  </p>
                </div>

                {isChallenge && note.xp_reward > 0 && (
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-700">
                    <span className="text-xs font-bold text-amber-600">
                      Reward: +{note.xp_reward} XP
                    </span>
                    {note.claimed ? (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>Claimed</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaim(note)}
                        className="py-1.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
                      >
                        Claim Reward
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
