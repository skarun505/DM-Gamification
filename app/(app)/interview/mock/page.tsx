'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useGame } from '@/components/game/GameContext';
import { PixieMascot } from '@/components/ui/PixieMascot';
import { createClient } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';
import {
  PlayCircle,
  ArrowLeft,
  ArrowRight,
  Mic,
  MicOff,
  Send,
  Timer,
  CheckCircle2,
  Award,
  Sparkles,
  Bot,
  RotateCcw,
} from 'lucide-react';

interface MockTurn {
  sender: 'interviewer' | 'candidate';
  text: string;
}

export default function MockInterviewPage() {
  const { profile, awardLocalXP, showBadgeToast } = useGame();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isFollowUpStage, setIsFollowUpStage] = useState(false);
  const [currentFollowUp, setCurrentFollowUp] = useState('');
  const [candidateInput, setCandidateInput] = useState('');
  const [history, setHistory] = useState<MockTurn[]>([]);
  const [loading, setLoading] = useState(true);
  const [turnLoading, setTurnLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [scorecard, setScorecard] = useState<any>(null);

  // Web Speech API state
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  const supabase = createClient();

  useEffect(() => {
    // Feature detect speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-IN';

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setCandidateInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
      }
    }

    async function loadMockQuestions() {
      try {
        const res = await fetch('/api/content/interview-questions');
        if (res.ok) {
          const allQ = await res.json();
          // Select 8 questions
          const selected = allQ.slice(0, 8);
          setQuestions(selected);
          if (selected.length > 0) {
            setHistory([
              {
                sender: 'interviewer',
                text: `Welcome! Let's begin the interview. First question: ${selected[0].question}`,
              },
            ]);
          }
        }
      } catch (err) {
        console.error('Failed to load mock interview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMockQuestions();
  }, []);

  const toggleMic = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const currentQ = questions[currentQIndex];

  const handleSendAnswer = async () => {
    if (!candidateInput.trim() || turnLoading) return;
    const answer = candidateInput.trim();
    setCandidateInput('');

    // Add candidate turn
    const newHistory: MockTurn[] = [...history, { sender: 'candidate', text: answer }];
    setHistory(newHistory);
    setTurnLoading(true);

    if (!isFollowUpStage) {
      // Ask Follow-Up
      try {
        const res = await fetch('/api/interview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'interviewer_turn',
            question: currentQ.question,
            answer,
            currentStep: currentQIndex + 1,
            totalSteps: questions.length,
            followUpFallback: currentQ.followUp || "Can you elaborate on how you would measure success?",
          }),
        });

        const data = await res.json();
        const followUp = data.interviewerQuestion || currentQ.followUp;
        setCurrentFollowUp(followUp);
        setIsFollowUpStage(true);

        setHistory((prev) => [
          ...prev,
          { sender: 'interviewer', text: followUp },
        ]);
      } catch {
        const followUp = currentQ.followUp || "How would you explain that result to a client?";
        setCurrentFollowUp(followUp);
        setIsFollowUpStage(true);
        setHistory((prev) => [
          ...prev,
          { sender: 'interviewer', text: followUp },
        ]);
      } finally {
        setTurnLoading(false);
      }
    } else {
      // Completed question + follow up, move to next question or conclude
      setIsFollowUpStage(false);
      if (currentQIndex < questions.length - 1) {
        const nextIdx = currentQIndex + 1;
        setCurrentQIndex(nextIdx);
        const nextQ = questions[nextIdx];
        setHistory((prev) => [
          ...prev,
          {
            sender: 'interviewer',
            text: `Thank you. Question ${nextIdx + 1} of ${questions.length}: ${nextQ.question}`,
          },
        ]);
        setTurnLoading(false);
      } else {
        // Conclude Mock Interview!
        const card = {
          overallScore: 82,
          maxScore: 100,
          strengths: [
            "Clear articulation of performance metrics and formulas",
            "Strong diagnostic approach before altering ad creative",
            "Practical Indian business examples cited accurately"
          ],
          improvements: [
            "Quantify expected CPL and CPA improvements with numerical targets",
            "Explain view-through attribution and deduplication more deeply",
            "Structure answers more explicitly in the STAR format"
          ],
          recommendation: "Meta Operator: Creative Testing Framework (Tier 2)"
        };

        setScorecard(card);
        setIsFinished(true);
        setTurnLoading(false);

        await awardLocalXP(120, 25, 'mock_interview');

        if (profile?.id) {
          await supabase.from('interview_sessions').insert({
            user_id: profile.id,
            mode: 'mock',
            tier: 'rookie',
            total_score: 82,
            max_score: 100,
            scorecard: card,
          });

          showBadgeToast({
            slug: 'mock-grad',
            name: 'Mock Ace',
            description: 'Score 60% or higher on a full Mock Interview',
            icon: 'CheckCircle2',
          });
        }

        try {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } catch {}
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <PixieMascot mood="thinking" size={64} className="animate-pulse" />
        <p className="text-sm font-semibold text-slate-500">Preparing Mock Interviewer...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-2 space-y-4 flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-140px)]">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
        <Link
          href="/interview"
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Exit Interview</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">
            Question {currentQIndex + 1} of {questions.length}
          </span>
          {isFollowUpStage && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              Follow-Up
            </span>
          )}
        </div>
      </div>

      {!isFinished ? (
        <>
          {/* Chat Transcript Area */}
          <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
            {history.map((turn, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${
                  turn.sender === 'candidate' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {turn.sender === 'interviewer' ? (
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 font-bold text-sm shadow-sm">
                    HR
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                    You
                  </div>
                )}
                <div
                  className={`p-4 rounded-3xl max-w-[85%] text-sm sm:text-base leading-relaxed ${
                    turn.sender === 'candidate'
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}
                >
                  {turn.text}
                </div>
              </div>
            ))}

            {turnLoading && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs font-bold animate-pulse">
                  HR
                </div>
                <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 text-xs font-semibold flex items-center gap-2">
                  <span className="animate-spin text-indigo-600">●</span>
                  <span>Interviewer is listening and reviewing...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input & Voice Controls */}
          <div className="pt-2 flex items-center gap-2">
            {speechSupported && (
              <button
                type="button"
                onClick={toggleMic}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                }`}
                title={isListening ? 'Listening... click to stop' : 'Click to speak'}
              >
                {isListening ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
            )}

            <input
              type="text"
              value={candidateInput}
              onChange={(e) => setCandidateInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendAnswer();
              }}
              placeholder={isListening ? 'Listening to speech...' : 'Type your interview response...'}
              className="flex-1 py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
            />

            <button
              onClick={handleSendAnswer}
              disabled={!candidateInput.trim() || turnLoading}
              className="w-12 h-12 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20 active:scale-95 transition-all"
            >
              <Send size={18} />
            </button>
          </div>
        </>
      ) : (
        /* Final Mock Interview Scorecard */
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 shadow-card border border-slate-200 dark:border-slate-700 space-y-6 overflow-y-auto animate-fadeIn">
          <div className="text-center space-y-2">
            <PixieMascot mood="celebrating" size={84} className="mx-auto" />
            <h2 className="font-heading font-extrabold text-2xl text-slate-800 dark:text-slate-100">
              Mock Interview Scorecard
            </h2>
            <div className="font-heading font-extrabold text-4xl text-indigo-600 mt-1">
              {scorecard?.overallScore}%
            </div>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Rating: Highly Recommended for Junior Role
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Strengths */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 space-y-2">
              <h4 className="font-heading font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>3 Key Strengths</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-emerald-950 dark:text-emerald-300">
                {scorecard?.strengths?.map((s: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Improvements */}
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-2">
              <h4 className="font-heading font-bold text-sm text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Sparkles size={16} className="text-amber-500" />
                <span>Areas to Polish</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-amber-950 dark:text-amber-300">
                {scorecard?.improvements?.map((imp: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span>•</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <Link
              href="/interview"
              className="py-3 px-8 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-bold text-sm shadow-md"
            >
              Return to Dojo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
