'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { Send, Sparkles, MessageCircle, AlertCircle, Bot, User, Loader2 } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'pixie';
  text: string;
  isFallback?: boolean;
}

function TutorContent() {
  const searchParams = useSearchParams();
  const lessonContext = searchParams?.get('lesson');
  const { profile } = useGame();
  const learnerName = profile?.display_name || 'Deepana';

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'pixie',
      text: lessonContext
        ? `Hey ${learnerName}! 👋 I see you are working on "${lessonContext}". What can I break down, calculate, or solve for you?`
        : `Hey ${learnerName}! 🦊 I'm Pixie, your personal 1-on-1 performance ads mentor. Ask me anything about scaling Meta ads, diagnosing bidding auctions, or landing your next client!`,
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(50);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile?.display_name) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === 'welcome') {
          return [
            {
              id: 'welcome',
              sender: 'pixie',
              text: lessonContext
                ? `Hey ${profile.display_name}! 👋 I see you are working on "${lessonContext}". What can I break down, calculate, or solve for you?`
                : `Hey ${profile.display_name}! 🦊 I'm Pixie, your personal 1-on-1 performance ads mentor. Ask me anything about scaling Meta ads, diagnosing bidding auctions, or landing your next client!`,
            },
          ];
        }
        return prev;
      });
    }
  }, [profile?.display_name, lessonContext]);

  const starterQuestions = [
    "Explain CPM like I'm 12 years old",
    "How do I fix a high CPL on a salon campaign?",
    "When should I use 'Leads' vs 'Sales' objective?",
    "What is the 3-second hook rule for Instagram Reels?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend.trim(),
    };

    const currentHistory = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          learnerName,
          context: lessonContext ? { lessonSlug: lessonContext } : undefined,
          history: currentHistory.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await res.json();
      const pixieReply: ChatMessage = {
        id: String(Date.now() + 1),
        sender: 'pixie',
        text: data.reply || "I'm thinking! Try asking again in a moment.",
        isFallback: data.isFallback,
      };

      setMessages((prev) => [...prev, pixieReply]);
      if (data.remaining !== undefined) setRemaining(data.remaining);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'pixie',
          text: `Hey ${learnerName}! 🦊 I'm thinking offline right now, but remember: test your creative hooks and review your CTR daily!`,
          isFallback: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <PixieMascot mood="happy" size={44} />
          <div>
            <h2 className="font-heading font-extrabold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <span>Ask Pixie</span>
              <Sparkles size={16} className="text-amber-500" />
            </h2>
            <p className="text-xs text-slate-400">Your AI Marketing Coach</p>
          </div>
        </div>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
          {remaining}/30 left today
        </span>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${
              m.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {m.sender === 'pixie' ? (
              <PixieMascot mood="happy" size={36} className="shrink-0" />
            ) : (
              <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                You
              </div>
            )}

            <div
              className={`p-4 rounded-3xl max-w-[85%] text-sm sm:text-base leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              {m.text}
              {m.isFallback && (
                <span className="block mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
                  ⚡ Quick Offline Hint
                </span>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <PixieMascot mood="thinking" size={36} className="animate-pulse" />
            <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-semibold flex items-center gap-2">
              <span className="animate-spin text-indigo-600">●</span>
              <span>Pixie is formulating your answer...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Starter Question Pills */}
      {messages.length <= 2 && (
        <div className="py-2 flex flex-wrap gap-2">
          {starterQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-700 dark:text-indigo-300 font-medium px-3 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-800 transition-colors"
            >
              "{q}"
            </button>
          ))}
        </div>
      )}

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-2 flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about ads, metrics, or campaigns..."
          className="flex-1 py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-slate-500">
          <Loader2 className="animate-spin text-indigo-600" size={32} />
          <p className="text-sm font-medium">Connecting to Pixie...</p>
        </div>
      }
    >
      <TutorContent />
    </Suspense>
  );
}
