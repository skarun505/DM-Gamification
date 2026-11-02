'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from './PixieMascot';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Minimize2,
  HelpCircle,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'pixie';
  text: string;
}

export function PixieFloatingBubble() {
  const pathname = usePathname();
  const { profile } = useGame();
  const learnerName = profile?.display_name || 'Deepana';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'pixie',
      text: `Hey ${learnerName}! 👋 I'm Pixie, your personal 1-on-1 performance ads mentor. Stuck on a question, campaign strategy, or math formula? Ask me anything!`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(50);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when profile loads
  useEffect(() => {
    if (profile?.display_name) {
      setMessages((prev) => {
        if (prev.length === 1 && prev[0].id === 'init') {
          return [
            {
              id: 'init',
              sender: 'pixie',
              text: `Hey ${profile.display_name}! 👋 I'm Pixie, your personal 1-on-1 performance ads mentor. Stuck on a question, campaign strategy, or math formula? Ask me anything!`,
            },
          ];
        }
        return prev;
      });
    }
  }, [profile?.display_name]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  // Don't show floating bubble on the full /tutor page
  if (pathname === '/tutor') {
    return null;
  }

  const quickPrompts = [
    "Give me a hint for this question",
    "Explain CPM & CPL in simple terms",
    "How to fix high frequency fatigue?",
    "When to use Broad vs Retargeting?",
  ];

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
    };

    const currentHistory = [...messages, userMsg];
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          learnerName,
          context: {
            page: pathname,
            learnerName,
            xp: profile?.xp ?? 0,
            streak: profile?.streak ?? 1,
            role: profile?.role ?? 'learner',
          },
          history: currentHistory.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'pixie',
            text: data.reply,
          },
        ]);
        if (typeof data.remaining === 'number') {
          setRemaining(data.remaining);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'pixie',
            text: `Hey ${learnerName}! 🦊 Great campaigns test one variable at a time (hooks, audiences, or offers). Are you reviewing creative fatigue or optimizing targeting?`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'pixie',
          text: `Hey ${learnerName}! 🦊 Looks like our connection blinked, but here's a golden rule: If CPM is high, widen your audience. If CTR is low, change the 3-second hook!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Bubble */}
      {!isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 flex items-center gap-2 group">
          <div className="hidden sm:block bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold font-heading px-3 py-1.5 rounded-full shadow-lg border border-indigo-100 dark:border-slate-700 transition-all group-hover:scale-105">
            Stuck? Ask Pixie! 🦊
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 via-indigo-500 to-amber-400 p-0.5 shadow-xl hover:shadow-indigo-500/30 transition-all hover:scale-110 active:scale-95 flex items-center justify-center relative"
            title="Ask Pixie AI Tutor"
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
              <PixieMascot mood="happy" size={38} />
            </div>
            {/* Pulsing notification dot */}
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
          </button>
        </div>
      )}

      {/* Slide-out / Floating Pop-up Modal */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-2 sm:right-6 z-50 w-[95vw] sm:w-[380px] max-h-[580px] h-[80vh] sm:h-[540px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-700 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-4 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 p-1 flex items-center justify-center shrink-0">
                <PixieMascot mood="happy" size={30} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  <span>Pixie • 1-on-1 Mentor</span>
                  <Sparkles size={13} className="text-amber-300" />
                </h3>
                <span className="text-[11px] text-indigo-200">
                  Dedicated to {learnerName} • {remaining} questions today
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-indigo-50/70 dark:bg-slate-800/80 px-3 py-2 border-b border-indigo-100 dark:border-slate-700/60 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-slate-600 hover:bg-indigo-100 transition-colors shadow-xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm">
            {messages.map((m) => {
              const isPixie = m.sender === 'pixie';
              return (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${isPixie ? 'justify-start' : 'justify-end'}`}
                >
                  {isPixie && (
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot size={15} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 leading-relaxed font-medium text-xs sm:text-sm ${
                      isPixie
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs'
                    }`}
                  >
                    {m.text}
                  </div>

                  {!isPixie && (
                    <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <User size={14} />
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold p-2">
                <Loader2 size={15} className="animate-spin" />
                <span>Pixie is thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or request a hint..."
              className="flex-1 py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-9 h-9 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 transition-colors shadow-sm"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

