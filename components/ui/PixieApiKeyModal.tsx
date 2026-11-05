'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, ExternalLink, Check, Sparkles, ShieldCheck } from 'lucide-react';

interface PixieApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export function PixieApiKeyModal({ isOpen, onClose, onKeySaved }: PixieApiKeyModalProps) {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem('adquest_user_gemini_key') || '';
      setApiKey(existing);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (typeof window !== 'undefined') {
      if (trimmed) {
        localStorage.setItem('adquest_user_gemini_key', trimmed);
      } else {
        localStorage.removeItem('adquest_user_gemini_key');
      }
    }
    setSaved(true);
    onKeySaved(trimmed);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('adquest_user_gemini_key');
    }
    onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-indigo-100 dark:border-slate-800 text-slate-800 dark:text-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Key size={20} />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base leading-tight">
              Pixie AI Brain Settings
            </h3>
            <p className="text-xs text-slate-400">Personalize your 1-on-1 AI Mentor</p>
          </div>
        </div>

        <div className="space-y-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700/60 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-indigo-700 dark:text-indigo-300">
              <Sparkles size={14} />
              <span>Unlock Unlimited Live Gemini AI Intelligence</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              By default, Pixie uses our built-in performance marketing knowledge engine. For full ChatGPT / Claude-grade answers on anything, you can connect your free Google Gemini key!
            </p>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline pt-0.5"
            >
              <span>Get a Free Gemini Key (100% Free Forever)</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div>
            <label className="block font-bold text-[11px] uppercase tracking-wider text-slate-500 mb-1.5">
              Google Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1.5">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span>Key is stored securely in your browser only. Never shared.</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            {apiKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-rose-500 hover:underline font-semibold"
              >
                Remove Key
              </button>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md flex items-center gap-1.5 transition-all"
              >
                {saved ? (
                  <>
                    <Check size={14} />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save Settings</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

