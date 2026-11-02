'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PixieMascot } from '@/components/ui/PixieMascot';
import {
  FileText,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Linkedin,
  Search,
  Printer,
  Copy,
} from 'lucide-react';

export default function ChecklistKitPage() {
  const [copied, setCopied] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/content/interview-checklist');
        if (res.ok) {
          const kit = await res.json();
          setData(kit);
        }
      } catch (err) {
        console.error('Failed to load checklist kit:', err);
      }
    }
    load();
  }, []);

  const copyLinkedIn = () => {
    if (!data?.linkedInTemplates?.headline) return;
    navigator.clipboard.writeText(
      `${data.linkedInTemplates.headline}\n\n${data.linkedInTemplates.about}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/interview"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Interview Dojo</span>
        </Link>
        <Link
          href="/interview/portfolio"
          className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1.5 rounded-full hover:bg-indigo-100"
        >
          <Printer size={14} />
          <span>Printable Case Study Portfolio →</span>
        </Link>
      </div>

      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
          Interview-Ready Kit & Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Actionable frameworks, resume rules, and research tactics for performance marketing interviews in India.
        </p>
      </div>

      {/* Resume Do's and Don'ts */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <FileText size={20} className="text-indigo-600" />
          <span>Resume Guidelines for Freshers & Juniors</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Do's */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
            <h4 className="font-heading font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-emerald-600" />
              <span>Resume Do's</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-300">
              {data?.resumeDoAndDonts?.dos?.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 space-y-2">
            <h4 className="font-heading font-bold text-sm text-rose-900 dark:text-rose-200 flex items-center gap-1.5">
              <XCircle size={16} className="text-rose-600" />
              <span>Resume Don'ts</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-rose-950 dark:text-rose-300">
              {data?.resumeDoAndDonts?.donts?.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-rose-600 font-bold">✗</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Meta Ad Library Research Secret */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <Search size={20} className="text-amber-500" />
          <span>The Meta Ad Library Research Secret</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Before stepping into any agency interview, search the hiring agency's top clients on Meta Ad Library (facebook.com/ads/library).
        </p>
        <div className="space-y-2">
          {data?.adLibraryResearch?.map((step: string, idx: number) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 font-medium"
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      {/* LinkedIn Bio & Headline Templates */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Linkedin size={20} className="text-blue-600" />
            <span>LinkedIn Profile Copy</span>
          </h3>
          <button
            onClick={copyLinkedIn}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100"
          >
            <Copy size={13} />
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
              Headline Template
            </span>
            <p className="font-semibold text-slate-800 dark:text-slate-200">
              {data?.linkedInTemplates?.headline}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="font-bold text-slate-400 uppercase text-[10px] block mb-1">
              About Section Summary
            </span>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {data?.linkedInTemplates?.about}
            </p>
          </div>
        </div>
      </div>

      {/* Questions to Ask Interviewer */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <HelpCircle size={20} className="text-emerald-600" />
          <span>High-Impact Questions to Ask the Interviewer</span>
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
          {data?.questionsToAskInterviewer?.map((q: string, idx: number) => (
            <li
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium"
            >
              {q}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
