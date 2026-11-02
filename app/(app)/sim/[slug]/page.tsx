'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  runSimulation,
  evaluateSimPass,
  SimScenario,
  SimInputs,
  SimResults,
} from '@/lib/sim/engine';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { createClient } from '@/lib/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Info,
  DollarSign,
  TrendingUp,
  Sliders,
} from 'lucide-react';

export default function SimPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const { profile, awardLocalXP, showBadgeToast } = useGame();
  const supabase = createClient();

  const [scenario, setScenario] = useState<SimScenario | null>(null);
  const [loading, setLoading] = useState(true);

  // Form Inputs
  const [objective, setObjective] = useState<'awareness' | 'traffic' | 'leads' | 'sales'>('leads');
  const [dailyBudget, setDailyBudget] = useState(500);
  const [days, setDays] = useState(7);
  const [audienceSize, setAudienceSize] = useState<'narrow' | 'balanced' | 'broad'>('balanced');
  const [audienceType, setAudienceType] = useState<'interests' | 'lookalike' | 'retargeting' | 'broad'>('interests');
  const [selectedCreativeId, setSelectedCreativeId] = useState('b');
  const [placements, setPlacements] = useState<'auto' | 'manual'>('auto');
  const [pixelInstalled, setPixelInstalled] = useState(true);

  // Simulation execution state
  const [results, setResults] = useState<SimResults | null>(null);
  const [passEvaluation, setPassEvaluation] = useState<{ passed: boolean; failures: string[] } | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    async function load() {
      if (!slug) return;
      try {
        const res = await fetch(`/api/content/sim?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setScenario(data);
          if (data.creativeOptions?.length) {
            setSelectedCreativeId(data.creativeOptions[0].id);
          }
          if (data.fixed?.pixelInstalled !== undefined) {
            setPixelInstalled(data.fixed.pixelInstalled);
          }
        }
      } catch (err) {
        console.error('Failed to load sim scenario:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  const handleRunSimulation = async () => {
    if (!scenario) return;
    setIsRunning(true);

    const chosenCreative =
      scenario.creativeOptions.find((c) => c.id === selectedCreativeId) ||
      scenario.creativeOptions[0];

    const inputs: SimInputs = {
      objective,
      dailyBudget,
      days,
      audience: { size: audienceSize, type: audienceType },
      creative: chosenCreative,
      placements,
      pixelInstalled,
    };

    // Small delay to simulate computation
    setTimeout(async () => {
      const res = runSimulation(inputs, scenario.fixed, 42);
      const evalPass = evaluateSimPass(res, scenario.pass.all);

      setResults(res);
      setPassEvaluation(evalPass);
      setIsRunning(false);

      if (evalPass.passed) {
        try {
          confetti({
            particleCount: 90,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#4F46E5', '#10B981', '#F59E0B'],
          });
        } catch {}

        await awardLocalXP(scenario.xp || 50, 10, 'sim', scenario.slug);

        if (profile?.id) {
          await supabase.from('sim_runs').insert({
            user_id: profile.id,
            task_slug: scenario.slug,
            inputs,
            results: res,
            passed: true,
          });

          // Check Sim badges
          if (scenario.slug.includes('salon')) {
            showBadgeToast({
              slug: 'budget-boss',
              name: 'Budget Boss',
              description: 'Pass any budget simulator task on your first attempt',
              icon: 'CircleDollarSign',
            });
          }
        }
      }
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <PixieMascot mood="thinking" size={64} className="animate-pulse" />
        <p className="text-sm font-semibold text-slate-500">Loading Ads Simulator...</p>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold">Simulator Challenge Not Found</h2>
        <Link href="/map" className="mt-4 inline-block text-indigo-600 font-bold">
          ← Return to Map
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/map"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Campaign Map</span>
        </Link>
        <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-3 py-1 rounded-full border border-amber-200 dark:border-amber-900">
          Earn +{scenario.xp} XP
        </span>
      </div>

      {/* Brief Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            {scenario.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            {scenario.brief}
          </p>
        </div>
        <PixieMascot mood="happy" size={60} />
      </div>

      {/* Main 2-Column Split: Config Left, Results Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Simplified Ads Manager Controls (7 cols) */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border border-slate-200 dark:border-slate-700 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-700 font-heading font-bold text-base text-slate-800 dark:text-slate-100">
            <Sliders size={18} className="text-indigo-600" />
            <span>Ads Manager Setup</span>
          </div>

          {/* Objective */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Campaign Objective
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(['leads', 'sales', 'traffic', 'awareness'] as const).map((obj) => (
                <button
                  key={obj}
                  type="button"
                  onClick={() => setObjective(obj)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                    objective === obj
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                  Daily Budget
                </label>
                <span className="text-xs font-bold text-indigo-600">₹{dailyBudget}</span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={100}
                value={dailyBudget}
                onChange={(e) => setDailyBudget(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                  Schedule
                </label>
                <span className="text-xs font-bold text-indigo-600">{days} Days</span>
              </div>
              <input
                type="range"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Audience Size */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Audience Size (Targeting)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['narrow', 'balanced', 'broad'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setAudienceSize(sz)}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold capitalize transition-all ${
                    audienceSize === sz
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                      : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                  }`}
                >
                  {sz === 'narrow' ? 'Narrow (<100k)' : sz === 'balanced' ? 'Balanced (500k)' : 'Broad (3M+)'}
                </button>
              ))}
            </div>
          </div>

          {/* Creative Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Choose Creative Asset
            </label>
            <div className="space-y-2">
              {scenario.creativeOptions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCreativeId(c.id)}
                  className={`w-full text-left p-3 rounded-2xl border text-xs sm:text-sm font-medium transition-all ${
                    selectedCreativeId === c.id
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-950 dark:bg-indigo-950/60 dark:text-indigo-200 font-bold'
                      : 'border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Placements */}
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-2">
              Placements
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPlacements('auto')}
                className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  placements === 'auto'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                Advantage+ (Auto 8% cheaper)
              </button>
              <button
                type="button"
                onClick={() => setPlacements('manual')}
                className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                  placements === 'manual'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                    : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                }`}
              >
                Manual Placements
              </button>
            </div>
          </div>

          {/* Run Button */}
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-heading font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            <Play size={18} className="fill-white" />
            <span>{isRunning ? 'Simulating Auctions...' : `Run Campaign for ${days} Days`}</span>
          </button>
        </div>

        {/* Right: Results, Chart & Pixie Feedback (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {results ? (
            <div className="space-y-6 animate-fadeIn">
              {/* Pass / Fail Banner */}
              <div
                className={`p-5 rounded-3xl border-2 flex items-start gap-4 ${
                  passEvaluation?.passed
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-200'
                    : 'bg-rose-50 border-rose-300 text-rose-950 dark:bg-rose-950/40 dark:text-rose-200'
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {passEvaluation?.passed ? (
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  ) : (
                    <AlertTriangle size={32} className="text-rose-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-heading font-extrabold text-lg">
                    {passEvaluation?.passed ? '🎉 Challenge Passed!' : 'Need Adjustment!'}
                  </h3>
                  <p className="text-xs sm:text-sm mt-1 leading-relaxed">
                    {passEvaluation?.passed
                      ? 'Outstanding work! Your configuration delivered high conversion efficiency and beat the benchmark criteria.'
                      : passEvaluation?.failures.join(' • ')}
                  </p>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Total Spend</span>
                  <div className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 mt-0.5">
                    ₹{results.totalSpend}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Conversions</span>
                  <div className="font-heading font-bold text-lg text-emerald-600 mt-0.5">
                    {results.totalConversions}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Cost / Lead (CPL)</span>
                  <div className="font-heading font-bold text-lg text-indigo-600 mt-0.5">
                    ₹{results.cpl}
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shadow-sm">
                  <span className="text-[10px] font-bold uppercase text-slate-400">Frequency</span>
                  <div className="font-heading font-bold text-lg text-slate-800 dark:text-slate-100 mt-0.5">
                    {results.frequency}
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-card">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  Daily Conversions Delivery
                </div>
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.daily}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="conversions"
                        stroke="#4F46E5"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pixie Commentary */}
              <div className="p-5 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-2">
                <div className="flex items-center gap-2 font-heading font-bold text-indigo-900 dark:text-indigo-200 text-sm">
                  <Sparkles size={16} className="text-amber-500" />
                  <span>Pixie's Auction Analysis</span>
                </div>
                <ul className="space-y-1.5 text-xs text-indigo-950 dark:text-indigo-300">
                  {results.pixieCommentary.map((note, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span>•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center text-slate-400">
              <PixieMascot mood="thinking" size={72} className="mb-3 opacity-70" />
              <p className="font-heading font-bold text-base text-slate-600 dark:text-slate-300">
                Simulator Ready
              </p>
              <p className="text-xs max-w-xs mt-1">
                Configure your campaign parameters on the left and tap 'Run Campaign' to test against the auction engine!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
