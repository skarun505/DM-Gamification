import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPixieSystemPrompt } from '@/lib/tutor/prompt';
import { generateExpertReply } from '@/lib/tutor/expert-engine';
import { getTodayIST } from '@/lib/game/streak';

const DAILY_LIMIT = 50;

function sanitizeHistory(rawHistory: any[]) {
  const sanitized: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];
  let expectedRole: 'user' | 'model' = 'user';

  for (const item of rawHistory) {
    const role = (item.sender === 'user' || item.role === 'user') ? 'user' : 'model';
    const text = item.text || (item.parts && item.parts[0]?.text) || '';
    if (text.trim() && role === expectedRole) {
      sanitized.push({
        role,
        parts: [{ text: text.trim() }],
      });
      expectedRole = role === 'user' ? 'model' : 'user';
    }
  }

  // Ensure history ends with 'model' so that chat.sendMessage(message) follows as 'user'
  while (sanitized.length > 0 && sanitized[sanitized.length - 1].role !== 'model') {
    sanitized.pop();
  }

  return sanitized;
}

/**
 * Attempts to fetch a response from the free Pollinations AI endpoint
 * with a quick timeout.
 */
async function tryPollinations(prompt: string, systemPrompt: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const encodedPrompt = encodeURIComponent(prompt);
    const encodedSystem = encodeURIComponent(systemPrompt);
    const url = `https://text.pollinations.ai/${encodedPrompt}?system=${encodedSystem}&seed=${Date.now()}`;

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AdQuest/1.0' },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const text = await res.text();

    if (
      !text ||
      text.includes('Free limit reached') ||
      text.includes('<!DOCTYPE html>') ||
      text.trim().length < 15
    ) {
      return null;
    }

    return text.trim();
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context, history, learnerName, apiKey: bodyKey } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Prioritize user-provided key from header or body, then env
    const headerKey = req.headers.get('x-gemini-key');
    const activeApiKey = (headerKey && headerKey.trim()) || (bodyKey && bodyKey.trim()) || process.env.GEMINI_API_KEY || '';

    // Identify user
    let activeName = (learnerName && typeof learnerName === 'string' && learnerName.trim())
      ? learnerName.trim()
      : 'Deepana';

    if (!learnerName) {
      try {
        const supabase = await createClient();
        const authPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise<any>((_, reject) =>
          setTimeout(() => reject(new Error('auth_timeout')), 500)
        );
        const { data } = await Promise.race([authPromise, timeoutPromise]);
        if (data?.user?.user_metadata?.display_name) {
          activeName = data.user.user_metadata.display_name;
        }
      } catch {
        // Fallback to activeName
      }
    }

    // Build personal system instruction
    const systemPrompt = getPixieSystemPrompt(
      activeName,
      typeof context === 'object' ? JSON.stringify(context, null, 2) : context
    );

    let reply = '';
    let provider = 'offline';

    // 1. Try Google Gemini if API key is present
    if (activeApiKey) {
      const candidateModels = [
        'gemini-1.5-flash',
        'gemini-2.0-flash',
        'gemini-2.5-flash',
        'gemini-flash-latest',
      ];

      const genAI = new GoogleGenerativeAI(activeApiKey);
      const formattedHistory = Array.isArray(history) ? sanitizeHistory(history) : [];

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
          });

          if (formattedHistory.length > 0) {
            const chat = model.startChat({ history: formattedHistory });
            const res = await chat.sendMessage(message);
            reply = res.response.text();
          } else {
            const res = await model.generateContent(message);
            reply = res.response.text();
          }

          if (reply && reply.trim().length > 0) {
            provider = 'gemini';
            break;
          }
        } catch (err: any) {
          console.warn(`Gemini model ${modelName} failed:`, err?.message);
        }
      }
    }

    // 2. Try Pollinations if Gemini was not available or failed
    if (!reply) {
      const pollinationsReply = await tryPollinations(message, systemPrompt);
      if (pollinationsReply) {
        reply = pollinationsReply;
        provider = 'pollinations';
      }
    }

    // 3. Fall back to our extensive, personalized domain knowledge engine
    if (!reply) {
      reply = generateExpertReply(message, activeName, history);
      provider = 'pixie_offline';
    }

    return NextResponse.json({
      reply,
      remaining: DAILY_LIMIT,
      isFallback: provider === 'pixie_offline',
      provider,
    });
  } catch (err: any) {
    console.error('Tutor route error:', err);
    return NextResponse.json(
      {
        reply: generateExpertReply('help', 'Deepana'),
        isFallback: true,
        provider: 'pixie_offline',
      },
      { status: 200 }
    );
  }
}
