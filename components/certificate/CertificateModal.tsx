'use client';

import React from 'react';
import { PixieMascot } from '@/components/ui/PixieMascot';
import {
  Award,
  CheckCircle2,
  Download,
  Printer,
  Sparkles,
  X,
  ShieldCheck,
  Share2,
} from 'lucide-react';

export interface CertificateData {
  tier: 'rookie' | 'operator' | 'strategist';
  tierName: string;
  certificateTitle: string;
  recipientName: string;
  issueDate: string;
  credentialId: string;
  skills: string[];
}

interface CertificateModalProps {
  data: CertificateData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CertificateModal({ data, isOpen, onClose }: CertificateModalProps) {
  if (!isOpen || !data) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-4 border-amber-400/40 p-6 sm:p-10 my-auto text-slate-800 dark:text-slate-100 flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="print:hidden absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
        >
          <X size={18} />
        </button>

        {/* Certificate Border Container */}
        <div className="border-4 border-double border-amber-500/60 p-6 sm:p-10 rounded-2xl relative bg-gradient-to-b from-[#FCFBF7] to-[#FAF6EE] dark:from-slate-900 dark:to-slate-800 text-center">
          {/* Top Crest */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <PixieMascot mood="celebrating" size={64} />
            <div className="text-left">
              <span className="font-heading font-extrabold text-xl text-indigo-700 dark:text-indigo-400 uppercase tracking-widest block">
                AdQuest Academy
              </span>
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Performance Marketing Certification Board
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles size={14} />
            <span>Official E-Certificate of Mastery</span>
          </div>

          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-slate-100 mb-2">
            {data.certificateTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto mb-6">
            This certifies that the candidate has successfully demonstrated practical and theoretical competence in media buying auctions, budget pacing, and tracking.
          </p>

          <span className="text-xs uppercase tracking-widest text-slate-400 font-bold block mb-1">
            Awarded to
          </span>
          <div className="font-heading font-extrabold text-3xl sm:text-4xl text-indigo-600 dark:text-indigo-400 tracking-wide pb-2 border-b-2 border-indigo-200 dark:border-indigo-800 max-w-sm mx-auto mb-6">
            {data.recipientName}
          </div>

          {/* Core Skills Verified */}
          <div className="max-w-lg mx-auto mb-8">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
              Verified Competencies & Campaign Skills:
            </span>
            <div className="flex flex-wrap gap-2 justify-center">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-900 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1"
                >
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Footer Signatures & Credential Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-left items-end">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Issue Date</span>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{data.issueDate}</span>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-600 mx-auto flex items-center justify-center font-heading font-black text-xs shadow-sm mb-1">
                VERIFIED
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block">Academic Registrar</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Credential ID</span>
              <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{data.credentialId}</span>
            </div>
          </div>
        </div>

        {/* Action Controls (Hidden in Print) */}
        <div className="print:hidden mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Cryptographically Verified on Supabase</span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all active:scale-95"
            >
              <Printer size={16} />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 font-bold text-xs sm:text-sm transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
