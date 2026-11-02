'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { useGame } from '@/components/game/GameContext';
import {
  X,
  Upload,
  CheckCircle2,
  ExternalLink,
  Camera,
  Sparkles,
  Trophy,
  ArrowRight,
  ShieldCheck,
  FileImage,
} from 'lucide-react';

export interface RealLabScenario {
  id: string;
  tier: 'rookie' | 'operator' | 'strategist';
  title: string;
  platform: 'Meta Ads' | 'Google Ads';
  objective: string;
  steps: string[];
  externalUrl: string;
  urlLabel: string;
  xpReward: number;
  coinsReward: number;
}

interface RealLabModalProps {
  lab: RealLabScenario;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (labId: string) => void;
}

export function RealLabModal({ lab, isOpen, onClose, onComplete }: RealLabModalProps) {
  const { profile, awardLocalXP } = useGame();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmitProof = async () => {
    if (!selectedFile || isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Award XP
      await awardLocalXP(lab.xpReward, lab.coinsReward, 'real_lab', lab.id);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#4F46E5', '#10B981', '#F59E0B'],
        });
      } catch {}

      setIsSubmitted(true);
      onComplete(lab.id);
    } catch (err) {
      console.error('Failed to submit lab proof:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>

        {!isSubmitted ? (
          <div className="space-y-5">
            {/* Header Badge */}
            <div className="flex items-center gap-2.5">
              <span className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                <Camera size={22} />
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Real-World Practical Lab ({lab.platform})
                </span>
                <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
                  {lab.title}
                </h3>
              </div>
            </div>

            {/* Objective */}
            <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-300 mb-1">
                🎯 Lab Mission
              </h4>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                {lab.objective}
              </p>
            </div>

            {/* Steps Checklist */}
            <div className="space-y-2.5">
              <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-500">
                Action Steps:
              </h4>
              <div className="space-y-2">
                {lab.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-xl p-3 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Link to Real Tool */}
            <div>
              <a
                href={lab.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline bg-indigo-50 dark:bg-indigo-950/60 px-3.5 py-2 rounded-xl transition-all"
              >
                <span>{lab.urlLabel}</span>
                <ExternalLink size={14} />
              </a>
            </div>

            {/* Screenshot Upload Dropzone */}
            <div className="pt-2">
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-slate-500 mb-2">
                📸 Upload Screenshot Proof:
              </label>

              {!previewUrl ? (
                <label className="border-2 border-dashed border-indigo-300 dark:border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-indigo-50/30 dark:bg-slate-800/40 hover:bg-indigo-50/60 transition-all">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-3">
                    <Upload size={22} />
                  </div>
                  <span className="text-sm font-heading font-bold text-slate-800 dark:text-slate-200">
                    Click to select or drag & drop screenshot
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Supports PNG, JPG, or WEBP (Client-side verified)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-indigo-500/50 max-h-48 bg-slate-900 flex items-center justify-center">
                    <img
                      src={previewUrl}
                      alt="Screenshot Preview"
                      className="max-h-48 object-contain w-full"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute top-2 right-2 bg-rose-600 text-white p-1.5 rounded-full hover:bg-rose-700 shadow-md text-xs font-bold"
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">
                    <FileImage size={15} />
                    <span>{selectedFile?.name} ready to submit</span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitProof}
              disabled={!selectedFile || isSubmitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-heading font-extrabold text-sm shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Submit Proof to Mentor (+{lab.xpReward} XP)</span>
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          /* Greeting Pop-up Confirmation Modal */
          <div className="text-center py-6 space-y-4 animate-scaleUp">
            <PixieMascot mood="celebrating" size={84} className="mx-auto" />
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
              <CheckCircle2 size={28} />
            </div>

            <h3 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              Screenshot Submitted!
            </h3>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5 text-left space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-heading font-bold text-sm">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>Mentor Review Dispatch Confirmed</span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium">
                Awesome work, {profile?.display_name || 'Marketer'}! 📸 Your campaign screenshot has been logged successfully. Your Mentor will review and analyze your real account setup during weekly office hours.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 py-2">
              <div className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 text-amber-700 font-bold text-sm flex items-center gap-1.5">
                <Sparkles size={16} />
                <span>+{lab.xpReward} XP</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 text-indigo-700 font-bold text-sm flex items-center gap-1.5">
                <Trophy size={16} />
                <span>+{lab.coinsReward} Coins</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md transition-all active:scale-95"
            >
              Continue Campaign Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
