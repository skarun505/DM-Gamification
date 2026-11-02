'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }

      router.push('/home');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 rounded-3xl shadow-card border border-slate-200/80 dark:border-slate-700/80 p-6 sm:p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <PixieMascot size={72} mood="happy" />
          <h1 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100 mt-3">
            Welcome back!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Ready to master performance marketing?
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 text-xs dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white font-bold font-heading text-base flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                <span>Continue Playing</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* 1-Tap Quick Credentials for Testing */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-700/80">
          <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center justify-between">
            <span>⚡ Quick Login Credentials:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('deepana@adquest.com');
                setPassword('password123');
              }}
              className="p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/70 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-left transition-all group"
            >
              <span className="block text-xs font-bold text-indigo-700 dark:text-indigo-300">
                👩‍💻 Deepana
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                deepana@adquest.com
              </span>
              <span className="block text-[10px] text-indigo-500 dark:text-indigo-400 font-mono mt-0.5">
                Pass: password123
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('learner@adquest.com');
                setPassword('password123');
              }}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-all"
            >
              <span className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                🚀 Learner
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 truncate">
                learner@adquest.com
              </span>
              <span className="block text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                Pass: password123
              </span>
            </button>
          </div>
        </div>

        <div className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          New to AdQuest?{' '}
          <Link
            href="/signup"
            className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
          >
            Create your account
          </Link>
        </div>
      </div>
    </div>
  );
}

