'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { FormattedChatText } from '@/components/ui/FormattedChatText';
import { PixieApiKeyModal } from '@/components/ui/PixieApiKeyModal';
import { generateExpertReply } from '@/lib/tutor/expert-engine';
import { Send, Sparkles, Settings, RotateCcw } from 'lucide-react';

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

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userApiKey, setUserApiKey] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [remaining, setRemaining] = useState(50);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const storageKey = `adquest_pixie_tutor_chat_${learnerName}`;

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
          id: 'welcome',
          sender: 'pixie',
          text: lessonContext
            ? `Hey ${learnerName}! 👋 I see you are working on "${lessonContext}". What can I break down, calculate, or solve for you?`
            : `Hey ${learnerName}! 🦊 I'm Pixie, your personal 1-on-1 performance ads mentor. Ask me anything about scaling Meta ads, diagnosing bidding auctions, or landing your next client!`,
        },
      ]);
    }
  }, [learnerName, lessonContext, storageKey]);

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
          message: textToSend.trim(),
          learnerName,
          apiKey: userApiKey,
          context: lessonContext ? { lessonSlug: lessonContext } : undefined,
          history: currentHistory.slice(-8).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const pixieReply: ChatMessage = {
          id: String(Date.now() + 1),
          sender: 'pixie',
          text: data.reply || "I'm thinking! Try asking again in a moment.",
          isFallback: data.isFallback,
        };

        setMessages((prev) => [...prev, pixieReply]);
        if (data.remaining !== undefined) setRemaining(data.remaining);
      } else {
        const fallbackReply = generateExpertReply(textToSend, learnerName, currentHistory);
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'pixie',
            text: fallbackReply,
            isFallback: true,
          },
        ]);
      }
    } catch {
      const fallbackReply = generateExpertReply(textToSend, learnerName, currentHistory);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          sender: 'pixie',
          text: fallbackReply,
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
            <p className="text-xs text-slate-400">
              Dedicated 1-on-1 Mentor for {learnerName} • {userApiKey ? '⚡ Gemini AI Active' : '🦊 AI Mentor'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="New Chat / Clear History"
          >
            <RotateCcw size={15} />
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
            title="AI Settings"
          >
            <Settings size={15} />
          </button>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            {remaining}/50 today
          </span>
        </div>
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
              <FormattedChatText text={m.text} isUser={m.sender === 'user'} />
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

      {/* Starter Quick Chips */}
      {messages.length <= 2 && (
        <div className="py-2 flex flex-wrap gap-2">
          {starterQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-full transition-colors border border-slate-200/50 dark:border-slate-700 font-medium"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Pixie anything about media buying, formulas, or client problems..."
            className="flex-1 bg-transparent px-3 py-2 text-sm focus:outline-hidden text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Settings Modal */}
      <PixieApiKeyModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onKeySaved={(k) => setUserApiKey(k)}
      />
    </div>
  );
}

export default function TutorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading Pixie Tutor...</div>}>
      <TutorContent />
    </Suspense>
  );
}
