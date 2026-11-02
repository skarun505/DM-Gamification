'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PixieMascot } from '@/components/ui/PixieMascot';
import {
  X,
  Play,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Layers,
  Users,
  Target,
  DollarSign,
  HelpCircle,
  Eye,
  Award,
} from 'lucide-react';

export interface TeachingConcept {
  id: string;
  lessonSlug: string;
  unitNumber: number;
  title: string;
  subtitle: string;
  tier: 'rookie' | 'operator' | 'strategist';
  keyTakeaway: string;
  visualType: 'funnel' | 'hierarchy' | 'auction' | 'metrics' | 'audiences' | 'scaling';
  visualData: {
    steps?: { label: string; sub: string; icon: string }[];
    equation?: { left: string; op: string; right: string; result: string };
    cards?: { title: string; desc: string; highlight: string }[];
  };
  quizAnswerTeaser: string;
}

interface TeachingConceptViewerProps {
  concept: TeachingConcept;
  isOpen: boolean;
  onClose: () => void;
  onProceedToLesson: (lessonSlug: string) => void;
}

export function TeachingConceptViewer({
  concept,
  isOpen,
  onClose,
  onProceedToLesson,
}: TeachingConceptViewerProps) {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-auto flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-heading font-extrabold text-sm flex items-center justify-center shrink-0">
            #{concept.unitNumber}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Visual Concept Guide
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                {concept.tier}
              </span>
            </div>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-slate-100">
              {concept.title}
            </h3>
          </div>
        </div>

        {/* Core Teaching Graphic Representation */}
        <div className="my-3 p-5 rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-amber-50/50 dark:from-slate-800/80 dark:via-slate-900 dark:to-slate-800/60 border border-indigo-100 dark:border-slate-700 shadow-inner">
          {/* VISUAL 1: Interactive Funnel Animator */}
          {concept.visualType === 'funnel' && (
            <div className="space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block text-center">
                Visual Funnel Flow (Top ➔ Bottom)
              </span>

              <div className="space-y-2.5 max-w-md mx-auto">
                {[
                  { stage: '1. Top of Funnel (TOFU)', text: 'See Ad on Instagram Feed', icon: '👁️', color: 'from-blue-500 to-indigo-500', width: 'w-full' },
                  { stage: '2. Middle of Funnel (MOFU)', text: 'Click Ad to View Service Menu', icon: '👆', color: 'from-indigo-500 to-purple-500', width: 'w-[85%]' },
                  { stage: '3. Bottom of Funnel (BOFU)', text: 'Fill & Submit Appointment Booking Form', icon: '📝', color: 'from-purple-500 to-amber-500', width: 'w-[70%]' },
                  { stage: '4. Conversion / Retention', text: 'Visit Salon & Pay for Service', icon: '⭐', color: 'from-amber-500 to-emerald-500', width: 'w-[55%]' },
                ].map((st, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className={`${st.width} p-3 rounded-2xl bg-gradient-to-r ${st.color} text-white shadow-sm flex items-center justify-between text-xs font-bold transition-all hover:scale-102`}>
                      <span className="flex items-center gap-2">
                        <span>{st.icon}</span>
                        <span>{st.text}</span>
                      </span>
                      <span className="opacity-80 text-[10px]">{st.stage}</span>
                    </div>
                    {i < 3 && <div className="w-0.5 h-2 bg-indigo-300 dark:bg-slate-700 my-0.5" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VISUAL 2: 3-Level Campaign Hierarchy */}
          {concept.visualType === 'hierarchy' && (
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block text-center">
                The 3-Level Campaign Architecture
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-md text-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center font-bold text-xs">
                    L1
                  </div>
                  <h4 className="font-heading font-extrabold text-sm">Campaign</h4>
                  <p className="text-[11px] text-indigo-100 mt-1">Defines ONLY the Objective (Leads vs Sales)</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-600 text-white shadow-md text-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center font-bold text-xs">
                    L2
                  </div>
                  <h4 className="font-heading font-extrabold text-sm">Ad Set</h4>
                  <p className="text-[11px] text-purple-100 mt-1">Audience, Daily Budget, Placements & Schedule</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-600 text-white shadow-md text-center">
                  <div className="w-8 h-8 rounded-full bg-white/20 mx-auto mb-2 flex items-center justify-center font-bold text-xs">
                    L3
                  </div>
                  <h4 className="font-heading font-extrabold text-sm">Ad Creative</h4>
                  <p className="text-[11px] text-amber-100 mt-1">Video, Hook, Copy, Headline & Destination URL</p>
                </div>
              </div>
            </div>
          )}

          {/* VISUAL 3: Meta Auction Equation */}
          {concept.visualType === 'auction' && (
            <div className="text-center space-y-4">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                The Total Value Auction Formula
              </span>
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-900 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base font-heading font-extrabold">
                <span className="px-3 py-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  Total Value
                </span>
                <span>=</span>
                <span className="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  Bid
                </span>
                <span>×</span>
                <span className="px-3 py-1.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                  Est. Action Rate
                </span>
                <span>+</span>
                <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  Ad Quality
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto font-medium">
                💡 High Ad Quality beats huge competitor budgets! When users engage positively, Meta discounts your CPM.
              </p>
            </div>
          )}

          {/* VISUAL 4: Metric Formulas */}
          {concept.visualType === 'metrics' && (
            <div className="space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block text-center">
                Master Performance Formulas
              </span>
              <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-indigo-600 font-bold block mb-0.5">CTR (Click-Through)</span>
                  <code>(Clicks ÷ Impressions) × 100</code>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-emerald-600 font-bold block mb-0.5">CPL (Cost Per Lead)</span>
                  <code>Spend ÷ Total Leads</code>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-amber-600 font-bold block mb-0.5">ROAS (Return on Spend)</span>
                  <code>Revenue Generated ÷ Ad Spend</code>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-rose-600 font-bold block mb-0.5">CPM (Cost per 1k views)</span>
                  <code>(Spend ÷ Impressions) × 1000</code>
                </div>
              </div>
            </div>
          )}

          {/* VISUAL 5: Audiences Concentric Circles */}
          {concept.visualType === 'audiences' && (
            <div className="space-y-3 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Audience Hierarchy & Temperature
              </span>
              <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
                <div className="w-full p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 text-xs font-bold flex justify-between">
                  <span>🔵 Cold Broad Audience</span>
                  <span>Age, City, Gender (No Interests)</span>
                </div>
                <div className="w-[85%] p-2.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-200 text-xs font-bold flex justify-between">
                  <span>🟣 Interest Stack</span>
                  <span>Specific hobbies (e.g. Yoga, Gym)</span>
                </div>
                <div className="w-[70%] p-2.5 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-900 dark:text-purple-200 text-xs font-bold flex justify-between">
                  <span>🟡 Lookalike Audience</span>
                  <span>1% Most similar to past customers</span>
                </div>
                <div className="w-[55%] p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 text-xs font-bold flex justify-between">
                  <span>🔴 Warm Retargeting</span>
                  <span>Added to Cart (Last 14 Days)</span>
                </div>
              </div>
            </div>
          )}

          {/* VISUAL 6: Scaling Protocol */}
          {concept.visualType === 'scaling' && (
            <div className="space-y-3 text-center">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                The Safe 20% Budget Staircase
              </span>
              <div className="flex items-end justify-center gap-2 h-28 pt-2">
                <div className="w-16 h-12 bg-indigo-200 dark:bg-indigo-950 rounded-t-lg flex flex-col justify-end p-1 text-[10px] font-bold">
                  Day 1: ₹1,000
                </div>
                <div className="w-16 h-16 bg-indigo-300 dark:bg-indigo-900 rounded-t-lg flex flex-col justify-end p-1 text-[10px] font-bold">
                  Day 3: ₹1,200
                </div>
                <div className="w-16 h-20 bg-indigo-500 text-white rounded-t-lg flex flex-col justify-end p-1 text-[10px] font-bold">
                  Day 5: ₹1,440
                </div>
                <div className="w-16 h-24 bg-emerald-500 text-white rounded-t-lg flex flex-col justify-end p-1 text-[10px] font-bold">
                  Day 7: ₹1,728
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium max-w-sm mx-auto">
                Scale budget by at most 15-20% every 48-72 hours so Meta's auction algorithm preserves CPA without resetting into Learning Limited.
              </p>
            </div>
          )}
        </div>

        {/* Secret Quiz Teaser / Answer Guide */}
        <div className="my-2 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-heading font-bold text-xs sm:text-sm mb-1">
            <Sparkles size={16} className="text-amber-500" />
            <span>Quiz Secret Revealed:</span>
          </div>
          <p className="text-xs text-amber-950 dark:text-amber-300 leading-relaxed font-medium">
            {concept.quizAnswerTeaser}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            Review Later
          </button>

          <button
            onClick={() => onProceedToLesson(concept.lessonSlug)}
            className="flex-1 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-extrabold text-xs sm:text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>I Understand — Take Lesson & Quiz ➔</span>
          </button>
        </div>
      </div>
    </div>
  );
}
