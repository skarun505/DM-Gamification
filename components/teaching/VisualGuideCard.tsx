'use client';

import React, { useState } from 'react';
import { TeachingConcept } from '@/lib/content/teaching-concepts';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Layers,
  Users,
  Target,
  DollarSign,
  HelpCircle,
  Eye,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface VisualGuideCardProps {
  concept: TeachingConcept;
  onProceedToQuiz: () => void;
  onProceedToLearn?: () => void;
  isPeekModal?: boolean;
  onClosePeek?: () => void;
}

export function VisualGuideCard({
  concept,
  onProceedToQuiz,
  onProceedToLearn,
  isPeekModal = false,
  onClosePeek,
}: VisualGuideCardProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <div className={`space-y-6 ${isPeekModal ? 'p-1 sm:p-2' : 'animate-fadeIn'}`}>
      {/* Step Flow Ribbon (When inline in lesson) */}
      {!isPeekModal && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-heading font-extrabold text-xs flex items-center justify-center">
              1
            </span>
            <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
              Step 1: Visual Concept Guide
            </span>
          </div>

          <div className="h-0.5 w-12 sm:w-24 bg-indigo-200 dark:bg-indigo-800" />

          <div className="flex items-center gap-2 opacity-60">
            <span className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-heading font-extrabold text-xs flex items-center justify-center">
              2
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              Step 2: Read & Quiz
            </span>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700">
        {/* Unit Info Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white font-heading font-extrabold text-base flex items-center justify-center shrink-0 shadow-md">
            #{concept.unitNumber}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Visual Concept Breakdown
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {concept.tier} Tier
              </span>
            </div>
            <h2 className="font-heading font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-slate-100 mt-0.5">
              {concept.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {concept.subtitle}
            </p>
          </div>
        </div>

        {/* DYNAMIC GRAPHICAL VISUALIZATION */}
        <div className="my-6 p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-indigo-50/70 via-slate-50 to-amber-50/40 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900 border border-indigo-100 dark:border-slate-700 shadow-inner">
          {/* 1. FUNNEL FLOW */}
          {concept.visualType === 'funnel' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  Chronological Customer Journey (Top ➔ Bottom)
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Customers must flow through each step before buying. Click any stage to inspect!
                </p>
              </div>

              <div className="space-y-2.5 max-w-md mx-auto pt-2">
                {[
                  {
                    step: 1,
                    stage: 'Top of Funnel (TOFU)',
                    title: '1. Ad Impression / View',
                    desc: 'User scrolls Instagram / Facebook and catches your video hook.',
                    icon: '👁️',
                    color: 'from-blue-600 to-indigo-600',
                    width: 'w-full',
                  },
                  {
                    step: 2,
                    stage: 'Middle of Funnel (MOFU)',
                    title: '2. Link Click & Page View',
                    desc: 'User clicks CTA button and lands on your service page or menu.',
                    icon: '👆',
                    color: 'from-indigo-600 to-purple-600',
                    width: 'w-[88%]',
                  },
                  {
                    step: 3,
                    stage: 'Bottom of Funnel (BOFU)',
                    title: '3. Form Fill / Lead Submission',
                    desc: 'User selects date, enters phone/email, and clicks "Book Now".',
                    icon: '📝',
                    color: 'from-purple-600 to-amber-600',
                    width: 'w-[75%]',
                  },
                  {
                    step: 4,
                    stage: 'Retention / Value',
                    title: '4. Purchase & Payment',
                    desc: 'Customer arrives at venue or pays invoice. Conversion complete!',
                    icon: '⭐',
                    color: 'from-amber-600 to-emerald-600',
                    width: 'w-[62%]',
                  },
                ].map((st, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      onClick={() => setActiveTab(i)}
                      className={`${st.width} p-3 sm:p-3.5 rounded-2xl bg-gradient-to-r ${st.color} text-white shadow-md flex items-center justify-between cursor-pointer transition-all hover:scale-102 active:scale-98`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-base sm:text-lg shrink-0">{st.icon}</span>
                        <div className="min-w-0 text-left">
                          <span className="font-heading font-extrabold text-xs sm:text-sm block truncate">
                            {st.title}
                          </span>
                          <span className="text-[10px] text-white/80 block truncate">
                            {st.desc}
                          </span>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 shrink-0">
                        {st.stage}
                      </span>
                    </div>
                    {i < 3 && <div className="w-0.5 h-2.5 bg-indigo-300 dark:bg-slate-700 my-0.5" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. HIERARCHY ARCHITECTURE */}
          {concept.visualType === 'hierarchy' && (
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  The 3-Tier Campaign Hierarchy
                </span>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Every ad platform organizes your account in this nested structure:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-md text-center flex flex-col justify-between">
                  <div>
                    <span className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center font-heading font-bold text-xs">
                      L1
                    </span>
                    <h4 className="font-heading font-extrabold text-base">Campaign</h4>
                    <p className="text-[11px] text-indigo-100 mt-1 leading-relaxed">
                      Defines <strong>Goal / Objective</strong> (Leads, Sales, Traffic).
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] font-bold uppercase bg-white/20 py-1 rounded-xl">
                    1 Goal per Campaign
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-purple-600 text-white shadow-md text-center flex flex-col justify-between">
                  <div>
                    <span className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center font-heading font-bold text-xs">
                      L2
                    </span>
                    <h4 className="font-heading font-extrabold text-base">Ad Set</h4>
                    <p className="text-[11px] text-purple-100 mt-1 leading-relaxed">
                      Defines <strong>Audience, Budget, Schedule & Placements</strong>.
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] font-bold uppercase bg-white/20 py-1 rounded-xl">
                    Targeting Lives Here
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-amber-600 text-white shadow-md text-center flex flex-col justify-between">
                  <div>
                    <span className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center font-heading font-bold text-xs">
                      L3
                    </span>
                    <h4 className="font-heading font-extrabold text-base">Ad Creative</h4>
                    <p className="text-[11px] text-amber-100 mt-1 leading-relaxed">
                      Defines <strong>Visual Media, Hook, Text, CTA Button & URL</strong>.
                    </p>
                  </div>
                  <span className="mt-3 text-[10px] font-bold uppercase bg-white/20 py-1 rounded-xl">
                    What People See
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. AUCTION FORMULA */}
          {concept.visualType === 'auction' && (
            <div className="text-center space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                The Meta Auction Total Value Formula
              </span>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-900 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-heading font-extrabold shadow-sm">
                <span className="px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Total Value Score
                </span>
                <span>=</span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Advertiser Bid
                </span>
                <span>×</span>
                <span className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Estimated Action Rate
                </span>
                <span>+</span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Ad Quality & Relevance
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto font-medium leading-relaxed">
                💡 <strong>Marketer Secret:</strong> High ad creative quality & positive user feedback reduce your CPM drastically! You don't need the biggest budget to win ad auctions.
              </p>
            </div>
          )}

          {/* 4. PERFORMANCE METRICS FORMULAS */}
          {concept.visualType === 'metrics' && (
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block text-center">
                Master Performance Formulas
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-indigo-600 font-bold block mb-1">CTR (Click-Through Rate)</span>
                  <code className="text-[11px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded block mb-1">
                    (Total Clicks ÷ Impressions) × 100
                  </code>
                  <span className="text-[11px] text-slate-500">Benchmark: &gt; 1.5% is good</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-emerald-600 font-bold block mb-1">CPA / CPL (Cost Per Acquisition)</span>
                  <code className="text-[11px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded block mb-1">
                    Total Spend ÷ Total Conversions
                  </code>
                  <span className="text-[11px] text-slate-500">Lower is always better</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-amber-600 font-bold block mb-1">ROAS (Return on Ad Spend)</span>
                  <code className="text-[11px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded block mb-1">
                    Revenue Generated ÷ Ad Spend
                  </code>
                  <span className="text-[11px] text-slate-500">Example: ₹30,000 ÷ ₹10,000 = 3.0x</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-rose-600 font-bold block mb-1">CPM (Cost per 1,000 Views)</span>
                  <code className="text-[11px] bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded block mb-1">
                    (Total Spend ÷ Impressions) × 1000
                  </code>
                  <span className="text-[11px] text-slate-500">Measures platform inventory cost</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. AUDIENCES TEMPERATURE */}
          {concept.visualType === 'audiences' && (
            <div className="space-y-3 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Audience Hierarchy & Temperature
              </span>
              <div className="flex flex-col items-center gap-2 max-w-md mx-auto pt-1">
                <div className="w-full p-3 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 text-xs font-bold flex justify-between items-center shadow-xs">
                  <span>🔵 Cold Broad Audience</span>
                  <span className="text-[10px] opacity-80">Demographics (City, Age, Gender)</span>
                </div>
                <div className="w-[88%] p-3 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 text-xs font-bold flex justify-between items-center shadow-xs">
                  <span>🟣 Interest Targeting</span>
                  <span className="text-[10px] opacity-80">Specific affinities (Gym, Tech)</span>
                </div>
                <div className="w-[75%] p-3 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 text-xs font-bold flex justify-between items-center shadow-xs">
                  <span>🟡 Lookalike (LAL 1%)</span>
                  <span className="text-[10px] opacity-80">Top 1% similar to past buyers</span>
                </div>
                <div className="w-[62%] p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold flex justify-between items-center shadow-xs">
                  <span>🔴 Warm Retargeting</span>
                  <span className="text-[10px] opacity-80">Website visitors / Add-to-cart</span>
                </div>
              </div>
            </div>
          )}

          {/* 6. SCALING STAIRCASE */}
          {concept.visualType === 'scaling' && (
            <div className="space-y-3 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                The Safe 20% Budget Staircase
              </span>
              <div className="flex items-end justify-center gap-2.5 h-32 pt-2">
                <div className="w-16 sm:w-20 h-14 bg-indigo-200 dark:bg-indigo-950 rounded-t-xl flex flex-col justify-end p-1.5 text-[10px] font-bold text-indigo-900 dark:text-indigo-200">
                  <span>Day 1</span>
                  <span>₹1,000</span>
                </div>
                <div className="w-16 sm:w-20 h-20 bg-indigo-300 dark:bg-indigo-900 rounded-t-xl flex flex-col justify-end p-1.5 text-[10px] font-bold text-indigo-900 dark:text-indigo-200">
                  <span>Day 3</span>
                  <span>₹1,200</span>
                </div>
                <div className="w-16 sm:w-20 h-26 bg-indigo-500 text-white rounded-t-xl flex flex-col justify-end p-1.5 text-[10px] font-bold shadow-md">
                  <span>Day 5</span>
                  <span>₹1,440</span>
                </div>
                <div className="w-16 sm:w-20 h-32 bg-emerald-500 text-white rounded-t-xl flex flex-col justify-end p-1.5 text-[10px] font-bold shadow-md">
                  <span>Day 7</span>
                  <span>₹1,728</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-sm mx-auto pt-1">
                Never double budgets overnight! Increase spend by 15-20% every 48-72 hours to prevent resetting Meta machine learning into Learning Limited.
              </p>
            </div>
          )}
        </div>

        {/* KEY CONCEPT TAKEAWAY */}
        <div className="mb-4 p-4 rounded-2xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200 font-heading font-bold text-xs sm:text-sm mb-1">
            <CheckCircle2 size={16} className="text-indigo-600 dark:text-indigo-400" />
            <span>Marketer Rule of Thumb:</span>
          </div>
          <p className="text-xs sm:text-sm text-indigo-950 dark:text-indigo-200 leading-relaxed font-medium">
            {concept.keyTakeaway}
          </p>
        </div>

        {/* SECRET QUIZ CLUE */}
        <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-heading font-bold text-xs sm:text-sm mb-1">
            <Sparkles size={16} className="text-amber-500" />
            <span>Secret Quiz Clue:</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-300 leading-relaxed font-medium">
            {concept.quizAnswerTeaser}
          </p>
        </div>

        {/* Action Controls */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isPeekModal ? (
            <button
              onClick={onClosePeek}
              className="w-full py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md"
            >
              ← Back to Quiz Question
            </button>
          ) : (
            <>
              {onProceedToLearn && (
                <button
                  type="button"
                  onClick={onProceedToLearn}
                  className="w-full sm:w-auto py-3 px-5 rounded-2xl border border-slate-300 dark:border-slate-700 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  📖 Read Lesson First
                </button>
              )}

              <button
                type="button"
                onClick={onProceedToQuiz}
                className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-sm sm:text-base shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Ready! Start Quiz & Win XP</span>
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

