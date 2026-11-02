'use client';

import React, { useState } from 'react';
import { X, Calculator, Sparkles, Check, ArrowRight } from 'lucide-react';

interface FormulaCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FormulaCalculatorModal({ isOpen, onClose }: FormulaCalculatorModalProps) {
  // Calculator inputs
  const [spend, setSpend] = useState<string>('5000');
  const [revenue, setRevenue] = useState<string>('15000');
  const [impressions, setImpressions] = useState<string>('25000');
  const [clicks, setClicks] = useState<string>('500');
  const [conversions, setConversions] = useState<string>('25');

  if (!isOpen) return null;

  const numSpend = parseFloat(spend) || 0;
  const numRevenue = parseFloat(revenue) || 0;
  const numImpressions = parseFloat(impressions) || 0;
  const numClicks = parseFloat(clicks) || 0;
  const numConversions = parseFloat(conversions) || 0;

  const roas = numSpend > 0 ? (numRevenue / numSpend).toFixed(2) : '0.00';
  const cpa = numConversions > 0 ? (numSpend / numConversions).toFixed(2) : '0.00';
  const cpc = numClicks > 0 ? (numSpend / numClicks).toFixed(2) : '0.00';
  const ctr = numImpressions > 0 ? ((numClicks / numImpressions) * 100).toFixed(2) : '0.00';
  const cpm = numImpressions > 0 ? ((numSpend / numImpressions) * 1000).toFixed(2) : '0.00';
  const cvr = numClicks > 0 ? ((numConversions / numClicks) * 100).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Calculator size={22} />
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Media Buyer Toolkit
            </span>
            <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-slate-100">
              Performance Formulas & Live Calculator
            </h3>
          </div>
        </div>

        {/* 1. Interactive Calculator */}
        <div className="p-4 sm:p-5 rounded-3xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-heading font-extrabold text-xs uppercase tracking-wider text-indigo-950 dark:text-indigo-200 flex items-center gap-1.5">
              <Sparkles size={15} className="text-amber-500" />
              <span>Plug In Your Numbers:</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setSpend('10000');
                setRevenue('35000');
                setImpressions('50000');
                setClicks('1200');
                setConversions('70');
              }}
              className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Load E-commerce Example
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Ad Spend (₹)</label>
              <input
                type="number"
                value={spend}
                onChange={(e) => setSpend(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Revenue (₹)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Impressions</label>
              <input
                type="number"
                value={impressions}
                onChange={(e) => setImpressions(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Clicks</label>
              <input
                type="number"
                value={clicks}
                onChange={(e) => setClicks(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block mb-1">Leads / Orders</label>
              <input
                type="number"
                value={conversions}
                onChange={(e) => setConversions(e.target.value)}
                className="w-full p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold"
              />
            </div>
          </div>

          {/* Computed Results Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-indigo-100 dark:border-indigo-900/60">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center shadow-xs">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">ROAS</span>
              <span className="font-heading font-extrabold text-base text-amber-600">{roas}x</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center shadow-xs">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">CPA / CPL</span>
              <span className="font-heading font-extrabold text-base text-emerald-600">₹{cpa}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center shadow-xs">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">CTR</span>
              <span className="font-heading font-extrabold text-base text-indigo-600">{ctr}%</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center shadow-xs">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">CPC</span>
              <span className="font-heading font-extrabold text-base text-slate-700 dark:text-slate-200">₹{cpc}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center shadow-xs">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">CPM</span>
              <span className="font-heading font-extrabold text-base text-slate-700 dark:text-slate-200">₹{cpm}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-center shadow-xs">
              <span className="text-[9px] font-extrabold uppercase text-slate-400 block">CVR</span>
              <span className="font-heading font-extrabold text-base text-slate-700 dark:text-slate-200">{cvr}%</span>
            </div>
          </div>
        </div>

        {/* 2. Formula Cheat Sheet Reference */}
        <div className="space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
            Formula Reference Card:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-amber-600 block mb-0.5">ROAS (Return on Ad Spend)</span>
              <code className="text-[11px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">Revenue ÷ Spend</code>
              <p className="text-[10px] text-slate-400 mt-1">Example: ₹30k revenue ÷ ₹10k spend = 3.0x ROAS</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-emerald-600 block mb-0.5">CPA / CPL (Cost per Acquisition)</span>
              <code className="text-[11px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">Spend ÷ Conversions</code>
              <p className="text-[10px] text-slate-400 mt-1">Example: ₹5k spend ÷ 50 leads = ₹100 CPL</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-indigo-600 block mb-0.5">CTR (Click-Through Rate)</span>
              <code className="text-[11px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">(Clicks ÷ Impressions) × 100</code>
              <p className="text-[10px] text-slate-400 mt-1">Target benchmark: &gt; 1.5% is good</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-rose-600 block mb-0.5">CPM (Cost per 1k Impressions)</span>
              <code className="text-[11px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded">(Spend ÷ Impressions) × 1000</code>
              <p className="text-[10px] text-slate-400 mt-1">Measures auction competition in target audience</p>
            </div>
          </div>
        </div>

        {/* Footer Close */}
        <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-xs shadow-md"
          >
            Got it, Back to Question
          </button>
        </div>
      </div>
    </div>
  );
}

