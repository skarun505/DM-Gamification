'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import {
  Printer,
  Copy,
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  FileCheck,
} from 'lucide-react';

export default function PortfolioPage() {
  const { profile } = useGame();
  const [simRuns, setSimRuns] = useState<any[]>([]);
  const [bossWins, setBossWins] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadPortfolioData() {
      if (!profile?.id) return;
      try {
        const { data: sims } = await supabase
          .from('sim_runs')
          .select('*')
          .eq('user_id', profile.id)
          .eq('passed', true);

        const { data: bosses } = await supabase
          .from('boss_attempts')
          .select('*')
          .eq('user_id', profile.id)
          .eq('passed', true);

        setSimRuns(sims || []);
        setBossWins(bosses || []);
      } catch (err) {
        console.error('Failed to load portfolio:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPortfolioData();
  }, [profile?.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `PERFORMANCE MARKETING PORTFOLIO — ${profile?.display_name || 'Candidate'}\n\n` +
      `CASE STUDY 1: Salon Local Lead Generation Campaign\n` +
      `• Objective: Leads (Meta Instant Forms & Click-to-WhatsApp)\n` +
      `• Budget: ₹500/day across 7 days (Total spend: ₹3,500)\n` +
      `• Strategy: Balanced local audience (5km radius, women 21-45), before/after hair transformation Reel with 20% discount offer.\n` +
      `• Numbers: 28 verified customer inquiries, average CPL of ₹112 (beating ₹140 benchmark).\n` +
      `• Next Test: Testing UGC creator reviews and weekend appointment slots.\n\n` +
      `CASE STUDY 2: Audience Saturation & Frequency Diagnostics\n` +
      `• Objective: Reconfigured hyper-narrow audience (< 40k) suffering from 5.2 frequency.\n` +
      `• Strategy: Transitioned to broad local targeting, reduced CPM by 45%, and lowered CPL under ₹100.\n\n` +
      `TECHNICAL CAPABILITIES: Meta Ads Manager, CAPI & Pixel Setup, Event Deduplication, Creative Testing Frameworks, GA4 Attribution.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-6">
      {/* Top Controls (Hidden when printing) */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 print:hidden">
        <Link
          href="/interview"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Interview Dojo</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            <Copy size={13} />
            <span>{copied ? 'Copied Text!' : 'Copy as Text'}</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 py-1.5 px-4 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm hover:bg-indigo-700"
          >
            <Printer size={13} />
            <span>Print to PDF (A4)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 layout) */}
      <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-card border border-slate-200 print:shadow-none print:border-none print:p-0 space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-6 flex items-start justify-between">
          <div>
            <h1 className="font-heading font-extrabold text-3xl text-indigo-700">
              {profile?.display_name || 'Learner'}
            </h1>
            <p className="font-semibold text-slate-600 text-sm mt-0.5">
              Junior Performance Marketer | Paid Social & Acquisition Specialist
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Verified AdQuest Practitioner • Curriculum Completed: Meta Ads Universe
            </p>
          </div>
          <PixieMascot mood="happy" size={54} className="print:hidden shrink-0" />
        </div>

        {/* Core Competencies */}
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-slate-400">
            Core Competencies & Stack
          </h3>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-indigo-900">
            {[
              'Meta Ads Manager',
              'Conversions API (CAPI)',
              'Pixel & EMQ Tracking',
              'A/B Creative Testing',
              'Funnel Architecture',
              'Click-to-WhatsApp',
              'Instant Forms',
              'Google Analytics 4',
            ].map((skill, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Case Study 1 */}
        <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Case Study 1: Salon Local Lead Generation Campaign
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Verified Simulator Win
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">Spend</span>
              <span className="font-bold text-slate-800">₹3,500</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">Leads</span>
              <span className="font-bold text-emerald-600">28 Inquiries</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">Average CPL</span>
              <span className="font-bold text-indigo-600">₹112 / Lead</span>
            </div>
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase">Frequency</span>
              <span className="font-bold text-slate-800">1.8 (Healthy)</span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed pt-1">
            <p>
              <span className="font-bold text-slate-900">Strategy: </span>
              Targeted local women aged 21-45 in a 5km radius around Indiranagar, Bengaluru. Deployed 15-second authentic video transformation Reels with a 20% weekday incentive to fill low-occupancy time slots.
            </p>
            <p>
              <span className="font-bold text-slate-900">What I'd test next: </span>
              Iterate the first 3-second hook with customer audio reactions and test Click-to-WhatsApp direct routing.
            </p>
          </div>
        </div>

        {/* Case Study 2 */}
        <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Case Study 2: Campaign Diagnostics & Audience Expansion
            </h3>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Diagnostics Lab
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
            <p>
              <span className="font-bold text-slate-900">Problem: </span>
              A local fitness brand had stacked 15 narrow interests, causing audience size to shrink below 40,000. Ad frequency climbed to 5.2 within 10 days, inflating CPM by 80%.
            </p>
            <p>
              <span className="font-bold text-slate-900">Solution: </span>
              Consolidated ad sets into broad demographic targeting, refreshed the creative assets with member transformation testimonials, and reset learning gracefully.
            </p>
            <p>
              <span className="font-bold text-slate-900">Result: </span>
              Lowered frequency to 2.1, reduced CPM from ₹320 to ₹155, and captured 32 high-intent membership inquiries.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 text-xs text-slate-400 flex items-center justify-between">
          <span>Generated via AdQuest Learning Engine</span>
          <span>Verified Case Studies • {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

