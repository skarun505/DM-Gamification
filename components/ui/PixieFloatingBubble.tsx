'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from './PixieMascot';
import { FormattedChatText } from './FormattedChatText';
import { PixieApiKeyModal } from './PixieApiKeyModal';
import { generateExpertReply } from '@/lib/tutor/expert-engine';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Settings,
  RotateCcw,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'pixie';
  text: string;
  provider?: string;
}

export function PixieFloatingBubble() {
  const pathname = usePathname();
  const { profile } = useGame();
  const learnerName = profile?.display_name || 'Deepana';

  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(50);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const storageKey = `adquest_pixie_chat_${learnerName}`;

  // Load API key & chat history on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('adquest_user_gemini_key') || '';
      setUserApiKey(storedKey);

      try {
        const savedChat = localStorage.getItem(storageKey);
        if (savedChat) {
          const parsed = JSON.parse(savedChat);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setMessages(parsed);
            return;
          }
        }
      } catch {
        // Fallback to init
      }

      setMessages([
        {
          id: 'init',
          sender: 'pixie',
          text: `Hey ${learnerName}! 👋 I'm Pixie, your personal 1-on-1 performance ads mentor. Stuck on an ad test, campaign strategy, or math formula? Ask me anything!`,
        },
      ]);
    }
  }, [learnerName, storageKey]);

  // Persist messages whenever updated
  useEffect(() => {
    if (typeof window !== 'undefined' && messages.length > 0) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(messages.slice(-30)));
      } catch {
        // ignore quota errors
      }
    }
  }, [messages, storageKey]);

  // Auto-scroll chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, loading]);

  if (pathname === '/tutor') {
    return null;
  }

  const handleClearChat = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
    setMessages([
      {
        id: String(Date.now()),
        sender: 'pixie',
        text: `Hey ${learnerName}! 🦊 Started a brand-new chat session! What ad challenge or question can I help you solve right now?`,
      },
    ]);
  };

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
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (userApiKey) {
        headers['x-gemini-key'] = userApiKey;
      }

      const res = await fetch('/api/tutor', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: textToSend,
          learnerName,
          apiKey: userApiKey,
          context: {
            page: pathname,
            learnerName,
            xp: profile?.xp ?? 0,
            streak: profile?.streak ?? 1,
            role: profile?.role ?? 'learner',
          },
          history: currentHistory.slice(-8).map((m) => ({
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
            provider: data.provider,
          },
        ]);
        if (typeof data.remaining === 'number') {
          setRemaining(data.remaining);
        }
      } else {
        // Fallback to our specialized domain engine
        const fallbackReply = generateExpertReply(textToSend, learnerName, currentHistory);
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'pixie',
            text: fallbackReply,
            provider: 'offline',
          },
        ]);
      }
    } catch {
      // Offline fallback: Use expert engine instead of a generic canned sentence
      const fallbackReply = generateExpertReply(textToSend, learnerName, currentHistory);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'pixie',
          text: fallbackReply,
          provider: 'offline',
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
            title="Ask Pixie AI Mentor"
          >
            <div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden">
              <PixieMascot mood="happy" size={38} />
            </div>
            <span className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse" />
          </button>
        </div>
      )}

      {/* Slide-out / Floating Pop-up Modal */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-2 sm:right-6 z-50 w-[95vw] sm:w-[400px] max-h-[600px] h-[82vh] sm:h-[560px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-indigo-100 dark:border-slate-700 flex flex-col overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-3.5 text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 p-1 flex items-center justify-center shrink-0">
                <PixieMascot mood="happy" size={28} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                  <span>Pixie • 1-on-1 Mentor</span>
                  <Sparkles size={13} className="text-amber-300" />
                </h3>
                <span className="text-[10px] text-indigo-200">
                  Dedicated to {learnerName} • {userApiKey ? '⚡ Gemini AI Active' : '🦊 AI Mentor'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="New Chat / Clear History"
              >
                <RotateCcw size={14} />
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                title="AI Settings (Add Gemini Key)"
              >
                <Settings size={14} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors ml-1"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="bg-indigo-50/70 dark:bg-slate-800/80 px-3 py-2 border-b border-indigo-100 dark:border-slate-700/60 overflow-x-auto scrollbar-none flex gap-1.5 shrink-0">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                disabled={loading}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-slate-600 hover:bg-indigo-100 dark:hover:bg-slate-600 transition-colors shadow-xs"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs sm:text-sm">
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
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed text-xs sm:text-sm ${
                      isPixie
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs'
                        : 'bg-indigo-600 text-white rounded-tr-xs'
                    }`}
                  >
                    <FormattedChatText text={m.text} isUser={!isPixie} />
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
              <div className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 font-semibold p-2">
                <Loader2 size={15} className="animate-spin" />
                <span>Pixie is formulating your answer...</span>
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
            className="p-3 border-t border-slate-200 dark:border-slate-700/60 bg-white dark:bg-slate-900 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or request a hint..."
              className="flex-1 px-3.5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:hover:bg-indigo-600 shadow-md shrink-0"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}

      {/* Settings Modal */}
      <PixieApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={(k) => setUserApiKey(k)}
      />
    </>
  );
}
