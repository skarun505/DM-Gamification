'use client';

import React, { useState, useEffect } from 'react';
import { useGame } from '@/components/game/GameContext';
import { createClient } from '@/lib/supabase/client';
import { PixieMascot } from '@/components/ui/PixieMascot';
import {
  ShieldCheck,
  Send,
  Share2,
  Users,
  Award,
  Flame,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

export default function AdminPage() {
  const { profile } = useGame();
  const [learners, setLearners] = useState<any[]>([]);
  const [selectedLearner, setSelectedLearner] = useState<string>('');
  const [noteTitle, setNoteTitle] = useState('');
  const [noteBody, setNoteBody] = useState('');
  const [noteKind, setNoteKind] = useState<'note' | 'challenge' | 'cheer'>('cheer');
  const [xpReward, setXpReward] = useState(25);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadAdminData() {
      if (profile?.role !== 'admin') {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('xp', { ascending: false });

        if (data) {
          setLearners(data);
          if (data.length > 0) setSelectedLearner(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load admin profiles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [profile?.role]);

  if (profile?.role !== 'admin') {
    return (
      <div className="text-center py-16 space-y-3">
        <PixieMascot mood="thinking" size={64} className="mx-auto" />
        <h2 className="font-heading font-bold text-xl text-slate-800 dark:text-slate-100">
          Admin Area Restricted
        </h2>
        <p className="text-xs text-slate-400">
          Only the first registered mentor account has access to this portal.
        </p>
      </div>
    );
  }

  const handleSendNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLearner || !noteTitle.trim() || !noteBody.trim()) return;

    try {
      const { error } = await supabase.from('mentor_notes').insert({
        to_user: selectedLearner,
        title: noteTitle.trim(),
        body: noteBody.trim(),
        kind: noteKind,
        xp_reward: noteKind === 'challenge' ? xpReward : 0,
        read: false,
        claimed: false,
      });

      if (!error) {
        setSentSuccess(true);
        setNoteTitle('');
        setNoteBody('');
        setTimeout(() => setSentSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Failed to send note:', err);
    }
  };

  const generateWhatsAppSummary = (learner: any) => {
    const text = `🚀 *AdQuest Weekly Learning Update for ${learner.display_name}* 🚀\n\n` +
      `🔥 *Current Streak:* ${learner.streak} Days\n` +
      `⚡ *Total XP:* ${learner.xp} XP\n` +
      `🪙 *AdCoins Balance:* ${learner.coins}\n` +
      `🏆 *Role:* Performance Marketing Intern\n\n` +
      `Great progress this week! Keep crushing your simulator challenges on AdQuest! 🦊✨`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
          <ShieldCheck size={26} />
        </div>
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
            Mentor & Admin Command Center
          </h1>
          <p className="text-xs text-slate-400">
            Track learner progress, send cheers & challenges, and export WhatsApp reports.
          </p>
        </div>
      </div>

      {/* Learners Overview Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users size={20} className="text-indigo-600" />
            <span>Learners Registered</span>
          </h3>
          <span className="text-xs font-bold text-slate-400">{learners.length} Students</span>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 font-heading">
              <tr>
                <th className="p-3">Learner</th>
                <th className="p-3">Role</th>
                <th className="p-3">XP</th>
                <th className="p-3">Streak</th>
                <th className="p-3">Last Active</th>
                <th className="p-3">WhatsApp Report</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {learners.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-100">
                    {l.display_name}
                  </td>
                  <td className="p-3 capitalize text-xs text-slate-400">{l.role}</td>
                  <td className="p-3 font-semibold text-amber-600">{l.xp} XP</td>
                  <td className="p-3 text-rose-600 font-bold">{l.streak} 🔥</td>
                  <td className="p-3 text-xs text-slate-400">{l.last_active_date || 'Never'}</td>
                  <td className="p-3">
                    <button
                      onClick={() => generateWhatsAppSummary(l)}
                      className="py-1.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                    >
                      <Share2 size={13} />
                      <span>Send Summary</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Mentor Note Form */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <MessageSquare size={20} className="text-indigo-600" />
          <span>Send Mentor Note / Bonus Challenge</span>
        </h3>

        {sentSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold">
            ✓ Note sent successfully to learner inbox!
          </div>
        )}

        <form onSubmit={handleSendNote} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Recipient
              </label>
              <select
                value={selectedLearner}
                onChange={(e) => setSelectedLearner(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
              >
                {learners.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.display_name} ({l.xp} XP)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Kind of Message
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['cheer', 'challenge', 'note'] as const).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setNoteKind(k)}
                    className={`py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                      noteKind === k
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300'
                        : 'border-slate-200 text-slate-600 dark:border-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Title
            </label>
            <input
              type="text"
              required
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="e.g. Awesome score on Boss 1!"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Message Body
            </label>
            <textarea
              required
              rows={3}
              value={noteBody}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Keep up the great momentum! Try the new creative testing simulator next."
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm"
            />
          </div>

          {noteKind === 'challenge' && (
            <div>
              <label className="block text-xs font-bold text-amber-600 uppercase mb-1">
                Bonus XP Reward on Claim
              </label>
              <input
                type="number"
                min={10}
                max={200}
                step={5}
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-40 p-2.5 rounded-xl border border-amber-300 bg-amber-50/50 text-sm font-bold text-amber-800"
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md flex items-center gap-2"
            >
              <Send size={16} />
              <span>Deliver Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
