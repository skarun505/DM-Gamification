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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, context, history, learnerName } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Identify user (prioritize client-sent learner name to avoid network blocking)
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
      } catch (authErr) {
        // Fallback to activeName
      }
    }

    const today = getTodayIST();
    const apiKey = process.env.GEMINI_API_KEY;

    // Build personal system instruction
    const systemPrompt = getPixieSystemPrompt(
      activeName,
      typeof context === 'object' ? JSON.stringify(context, null, 2) : context
    );

    let reply = '';
    let generatedSuccess = false;

    if (apiKey) {
      const candidateModels = [
        'gemini-2.5-flash',
        'gemini-flash-latest',
        'gemini-2.5-flash-lite',
      ];

      const genAI = new GoogleGenerativeAI(apiKey);
      const formattedHistory = Array.isArray(history) ? sanitizeHistory(history) : [];

      for (const modelName of candidateModels) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: systemPrompt,
          });

          if (formattedHistory.length > 0) {
            const chat = model.startChat({
              history: formattedHistory,
            });
            const res = await chat.sendMessage(message);
            reply = res.response.text();
          } else {
            const res = await model.generateContent(message);
            reply = res.response.text();
          }

          if (reply && reply.trim().length > 0) {
            generatedSuccess = true;
            break;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed, trying next:`, err?.message);
        }
      }
    }

    if (!generatedSuccess || !reply) {
      // Use Pixie's specialized mathematical and diagram knowledge engine
      reply = generateExpertReply(message, activeName, history);
    }

    return NextResponse.json({
      reply,
      remaining: DAILY_LIMIT,
      isFallback: !generatedSuccess,
    });
  } catch (err: any) {
    console.error('Tutor route error:', err);
    return NextResponse.json(
      {
        reply: generateExpertReply('help', 'Deepana'),
        isFallback: true,
      },
      { status: 200 }
    );
  }
}
