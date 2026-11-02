'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { createClient } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  Star,
  Save,
  Trash2,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface StarStory {
  id: string;
  title: string;
  situation: string;
  task: string;
  action: string;
  result: string;
}

export default function StarBuilderPage() {
  const { profile, awardLocalXP, showBadgeToast } = useGame();
  const [stories, setStories] = useState<StarStory[]>([]);
  const [title, setTitle] = useState('');
  const [situation, setSituation] = useState('');
  const [task, setTask] = useState('');
  const [action, setAction] = useState('');
  const [result, setResult] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStories() {
      if (!profile?.id) return;
      try {
        const { data } = await supabase
          .from('star_stories')
          .select('*')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false });

        setStories(data || []);
      } catch (err) {
        console.error('Failed to load STAR stories:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStories();
  }, [profile?.id]);

  const handleSaveStory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id || !title.trim() || !action.trim() || !result.trim()) return;

    try {
      const { data, error } = await supabase
        .from('star_stories')
        .insert({
          user_id: profile.id,
          title: title.trim(),
          situation: situation.trim(),
          task: task.trim(),
          action: action.trim(),
          result: result.trim(),
        })
        .select()
        .single();

      if (!error && data) {
        const newStories = [data, ...stories];
        setStories(newStories);
        setTitle('');
        setSituation('');
        setTask('');
        setAction('');
        setResult('');
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);

        await awardLocalXP(40, 5, 'star_story_saved');

        if (newStories.length >= 3) {
          showBadgeToast({
            slug: 'star-shiner',
            name: 'STAR Shiner',
            description: 'Craft and save 3 personal STAR interview stories',
            icon: 'Sparkle',
          });
        }

        try {
          confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
        } catch {}
      }
    } catch (err) {
      console.error('Failed to save story:', err);
    }
  };

  const handleDeleteStory = async (id: string) => {
    try {
      await supabase.from('star_stories').delete().eq('id', id);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error('Failed to delete story:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-2 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/interview"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Interview Dojo</span>
        </Link>
        <span className="text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-3 py-1 rounded-full border border-purple-200">
          {stories.length} / 3 Stories Saved
        </span>
      </div>

      {/* Guide Banner */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-card flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl">STAR Story Builder</h2>
          <p className="text-xs sm:text-sm text-purple-100 mt-1 max-w-lg">
            Turn your AdQuest simulator achievements and case studies into structured, interview-ready stories using the Situation, Task, Action, Result framework.
          </p>
        </div>
        <PixieMascot mood="happy" size={68} />
      </div>

      {/* 4-Box Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-5">
        <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100">
          Craft a New Story
        </h3>

        {savedSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
            🎉 Story saved to your interview portfolio! (+40 XP awarded)
          </div>
        )}

        <form onSubmit={handleSaveStory} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Story Title / Topic
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Scaling salon appointments while cutting CPL in half"
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">
                S — Situation
              </label>
              <textarea
                rows={3}
                value={situation}
                onChange={(e) => setSituation(e.target.value)}
                placeholder="What was the business context or challenge?"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">
                T — Task
              </label>
              <textarea
                rows={3}
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="What was your specific goal or KPI target?"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">
                A — Action
              </label>
              <textarea
                rows={3}
                required
                value={action}
                onChange={(e) => setAction(e.target.value)}
                placeholder="What physical changes did you make in Ads Manager?"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-indigo-600 uppercase mb-1">
                R — Result
              </label>
              <textarea
                rows={3}
                required
                value={result}
                onChange={(e) => setResult(e.target.value)}
                placeholder="What was the measurable outcome? (State numbers!)"
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Save size={16} />
              <span>Save STAR Story</span>
            </button>
          </div>
        </form>
      </div>

      {/* Saved Stories List */}
      {stories.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading font-extrabold text-xl text-slate-800 dark:text-slate-100">
            My Saved Interview Stories ({stories.length})
          </h3>
          <div className="space-y-4">
            {stories.map((s) => (
              <div
                key={s.id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border border-slate-200 dark:border-slate-700 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-heading font-bold text-base text-slate-800 dark:text-slate-100">
                    {s.title}
                  </h4>
                  <button
                    onClick={() => handleDeleteStory(s.id)}
                    className="text-slate-400 hover:text-rose-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="font-bold text-indigo-600 block mb-0.5">Situation:</span>
                    <p>{s.situation}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="font-bold text-indigo-600 block mb-0.5">Task:</span>
                    <p>{s.task}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="font-bold text-indigo-600 block mb-0.5">Action:</span>
                    <p>{s.action}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60">
                    <span className="font-bold text-emerald-600 block mb-0.5">Result:</span>
                    <p>{s.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
