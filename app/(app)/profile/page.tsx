'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/components/game/GameContext';
import { ALL_BADGES, Badge } from '@/lib/game/badges';
import { getLevelInfo } from '@/lib/game/levels';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { StreakFlame } from '@/components/game/StreakFlame';
import { CoinBadge } from '@/components/game/CoinBadge';
import { createClient } from '@/lib/supabase/client';
import { CertificateModal, CertificateData } from '@/components/certificate/CertificateModal';
import {
  Award,
  Lock,
  ShoppingBag,
  Flame,
  Shield,
  Sparkles,
  Zap,
  CheckCircle2,
  Printer,
  FileCheck,
} from 'lucide-react';

export default function ProfilePage() {
  const { profile, refreshProfile } = useGame();
  const [earnedBadges, setEarnedBadges] = useState<Map<string, string>>(new Map());
  const [completedBosses, setCompletedBosses] = useState<Set<string>>(new Set());
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null);
  const [shopMsg, setShopMsg] = useState('');
  const supabase = createClient();

  useEffect(() => {
    async function loadUserData() {
      if (!profile?.id) return;
      try {
        const { data: bData } = await supabase
          .from('user_badges')
          .select('badge_slug, earned_at')
          .eq('user_id', profile.id);

        const bMap = new Map<string, string>();
        bData?.forEach((b) => bMap.set(b.badge_slug, b.earned_at));
        setEarnedBadges(bMap);

        const { data: bossData } = await supabase
          .from('boss_attempts')
          .select('boss_slug')
          .eq('user_id', profile.id)
          .eq('passed', true);

        const bSet = new Set<string>();
        bossData?.forEach((b) => bSet.add(b.boss_slug));
        setCompletedBosses(bSet);
      } catch (err) {
        console.error('Failed to load profile data:', err);
      }
    }
    loadUserData();
  }, [profile?.id]);

  const { level, title, progressPercent, currentLevelXP, nextLevelXP } = getLevelInfo(
    profile?.xp ?? 0
  );

  const buyStreakFreeze = async () => {
    if (!profile) return;
    if (profile.coins < 50) {
      setShopMsg('Not enough AdCoins! Complete lessons or quizzes to earn more.');
      return;
    }
    if (profile.streak_freezes >= 2) {
      setShopMsg('You already have maximum 2 Streak Freezes stored!');
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          coins: profile.coins - 50,
          streak_freezes: profile.streak_freezes + 1,
        })
        .eq('id', profile.id);

      if (!error) {
        setShopMsg('🎉 Streak Freeze purchased! Your streak is protected.');
        await refreshProfile();
      }
    } catch (err) {
      console.error('Error buying freeze:', err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Profile Header Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
        <div className="relative">
          <PixieMascot mood="happy" size={96} />
          <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-bold text-xs shadow-md">
            Lvl {level}
          </span>
        </div>

        <div className="flex-1 space-y-1">
          <h1 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            {profile?.display_name || 'Learner'}
          </h1>
          <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {title}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <StreakFlame streak={profile?.streak ?? 1} size="md" />
            <CoinBadge coins={profile?.coins ?? 0} size="md" />
            <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-700/60 px-3 py-1 rounded-full">
              {profile?.xp ?? 0} Total XP
            </span>
          </div>
        </div>
      </div>

      {/* Coin Shop */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-500" />
            <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
              AdCoins Shop
            </h3>
          </div>
          <CoinBadge coins={profile?.coins ?? 0} size="sm" />
        </div>

        {shopMsg && (
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
            {shopMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Item 1: Streak Freeze */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xl shrink-0">
                🧊
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-100">
                  Streak Freeze
                </h4>
                <p className="text-xs text-slate-400">
                  Protects your streak if you miss 1 day (Have: {profile?.streak_freezes ?? 0}/2)
                </p>
              </div>
            </div>
            <button
              onClick={buyStreakFreeze}
              className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 shadow-sm"
            >
              50 Coins
            </button>
          </div>

          {/* Item 2: Hint Token */}
          <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold text-xl shrink-0">
                💡
              </div>
              <div>
                <h4 className="font-heading font-bold text-sm text-slate-800 dark:text-slate-100">
                  Pixie Hint Token
                </h4>
                <p className="text-xs text-slate-400">
                  Instant guidance during Boss Battles and Sims
                </p>
              </div>
            </div>
            <button
              disabled
              className="py-2 px-3 rounded-xl bg-slate-200 text-slate-500 text-xs font-bold shrink-0"
            >
              Active
            </button>
          </div>
        </div>
      </div>

      {/* Official E-Certificates of Mastery */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <FileCheck size={22} className="text-amber-500" />
            <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
              Official E-Certificates
            </h3>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-3 py-1 rounded-full border border-amber-200">
            Print & Share
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              tier: 'rookie' as const,
              name: 'Tier 1: Rookie Media Buyer',
              title: 'Certified Performance Marketing Associate (Rookie)',
              slug: 'boss-rookie-launch-day',
              skills: ['Auction Dynamics', 'Campaign Architecture', 'Funnel Stages', 'Creative Hooks', 'Metrics 101'],
              unlocked: completedBosses.has('boss-rookie-launch-day') || (profile?.xp ?? 0) >= 100,
            },
            {
              tier: 'operator' as const,
              name: 'Tier 2: Meta Ads Operator',
              title: 'Certified Meta Ads Performance Operator',
              slug: 'boss-operator-expensive-leads',
              skills: ['Pixel & CAPI', 'Cost Controls', 'Learning Phase', 'A/B Testing Sandbox', 'Custom Audiences'],
              unlocked: completedBosses.has('boss-operator-expensive-leads'),
            },
            {
              tier: 'strategist' as const,
              name: 'Tier 3: Master Strategist',
              title: 'Master Performance Marketing Strategist',
              slug: 'boss-strategist-scale-or-kill',
              skills: ['Full-Funnel Scaling', 'Advantage+ Shopping', 'Incrementality', 'Account Audits', 'CEO Reporting'],
              unlocked: completedBosses.has('boss-strategist-scale-or-kill'),
            },
          ].map((cert) => (
            <div
              key={cert.tier}
              className={`p-5 rounded-2xl border-2 flex flex-col justify-between transition-all ${
                cert.unlocked
                  ? 'border-amber-400/80 bg-gradient-to-b from-amber-50/40 to-white dark:from-slate-800 dark:to-slate-900 shadow-sm'
                  : 'border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    cert.unlocked ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {cert.unlocked ? <Award size={18} /> : <Lock size={15} />}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    {cert.tier.toUpperCase()}
                  </span>
                </div>
                <h4 className="font-heading font-extrabold text-sm text-slate-800 dark:text-slate-100">
                  {cert.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {cert.unlocked
                    ? 'Verified by AdQuest Mentorship Board. Ready to print or export as PDF.'
                    : `Conquer ${cert.slug.replace(/-/g, ' ')} to unlock this diploma.`}
                </p>
              </div>

              <div className="pt-4">
                {cert.unlocked ? (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCert({
                        tier: cert.tier,
                        tierName: cert.tier.toUpperCase(),
                        certificateTitle: cert.title,
                        recipientName: profile?.display_name || 'Deepana',
                        issueDate: new Intl.DateTimeFormat('en-IN', {
                          dateStyle: 'long',
                          timeZone: 'Asia/Kolkata',
                        }).format(new Date()),
                        credentialId: `ADQ-${cert.tier.toUpperCase()}-${(profile?.id || 'USER').substring(0, 6).toUpperCase()}-IN`,
                        skills: cert.skills,
                      })
                    }
                    className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <Printer size={14} />
                    <span>View & Print Certificate</span>
                  </button>
                ) : (
                  <div className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-center text-xs font-semibold">
                    Locked (Beat Boss)
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2">
            <Award size={20} className="text-indigo-600" />
            <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
              Badges & Achievements
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {earnedBadges.size} / {ALL_BADGES.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {ALL_BADGES.map((badge) => {
            const isEarned = earnedBadges.has(badge.slug);

            return (
              <div
                key={badge.slug}
                className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all ${
                  isEarned
                    ? 'border-amber-300 bg-amber-50/50 dark:bg-amber-950/20 text-slate-800 dark:text-slate-100 shadow-sm'
                    : 'border-slate-200 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 text-slate-400 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                    isEarned
                      ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/60'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                  }`}
                >
                  {isEarned ? <Award size={24} /> : <Lock size={20} />}
                </div>
                <h4 className="font-heading font-bold text-xs sm:text-sm line-clamp-1">
                  {badge.name}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          data={selectedCert}
        />
      )}
    </div>
  );
}

