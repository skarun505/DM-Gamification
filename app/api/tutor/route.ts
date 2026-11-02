import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPixieSystemPrompt } from '@/lib/tutor/prompt';
import { getFallbackReply } from '@/lib/tutor/fallback';
import { getTodayIST } from '@/lib/game/streak';

const DAILY_LIMIT = 50;

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
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyCi3jANH0tcC1Mn1UjctrcLchgevVK-xbg';

    if (!apiKey) {
      return NextResponse.json({
        reply: `Hey ${activeName}! 🦊 ${getFallbackReply(message)}`,
        remaining: DAILY_LIMIT,
        isFallback: true,
      });
    }

    // Build personal system instruction
    const systemPrompt = getPixieSystemPrompt(
      activeName,
      typeof context === 'object' ? JSON.stringify(context, null, 2) : context
    );

    let reply = '';
    const candidateModels = [
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.5-flash-lite',
    ];

    const genAI = new GoogleGenerativeAI(apiKey);

    // Multi-turn history formatting
    const formattedHistory: { role: string; parts: { text: string }[] }[] = [];
    if (Array.isArray(history)) {
      for (const item of history.slice(-6)) {
        if (item.text && item.sender) {
          formattedHistory.push({
            role: item.sender === 'user' ? 'user' : 'model',
            parts: [{ text: item.text }],
          });
        }
      }
    }

    // Try generation with fallback models
    let generatedSuccess = false;
    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: systemPrompt,
        });

        // Use multi-turn chat if history exists
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

    if (!generatedSuccess || !reply) {
      // Personalized fallback if all API calls fail
      reply = `Hey ${activeName}! 🦊 ${getFallbackReply(message)}`;
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
        reply: `Hey there! 🦊 I'm Pixie, your performance ads mentor. I had a quick hiccup, but remember: in digital advertising, test your creative hook first whenever CTR is low!`,
        isFallback: true,
      },
      { status: 200 }
    );
  }
}
