import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PIXIE_SYSTEM_PROMPT } from '@/lib/tutor/prompt';
import { getFallbackReply } from '@/lib/tutor/fallback';
import { getTodayIST } from '@/lib/game/streak';

const DAILY_LIMIT = 30;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, context } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const today = getTodayIST();

    // Check usage count for today
    const { data: usageRow } = await supabase
      .from('tutor_usage')
      .select('count')
      .eq('user_id', user.id)
      .eq('day', today)
      .maybeSingle();

    const currentCount = usageRow?.count || 0;
    if (currentCount >= DAILY_LIMIT) {
      return NextResponse.json({
        reply: `You've used all ${DAILY_LIMIT} AI questions for today! Here's a quick tip from Pixie: ${getFallbackReply(message)}`,
        remaining: 0,
        isFallback: true,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: getFallbackReply(message),
        remaining: DAILY_LIMIT - currentCount,
        isFallback: true,
      });
    }

    let reply = '';
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
        systemInstruction: PIXIE_SYSTEM_PROMPT,
      });

      const promptContext = context
        ? `\nCurrent context: ${JSON.stringify(context)}`
        : '';
      const prompt = `${promptContext}\nLearner question: ${message}`;

      const res = await model.generateContent(prompt);
      reply = res.response.text();
    } catch (apiErr: any) {
      console.warn('Gemini API call failed, falling back:', apiErr?.message);
      reply = getFallbackReply(message);
    }

    // Increment usage
    await supabase.from('tutor_usage').upsert(
      {
        user_id: user.id,
        day: today,
        count: currentCount + 1,
      },
      { onConflict: 'user_id,day' }
    );

    return NextResponse.json({
      reply,
      remaining: DAILY_LIMIT - (currentCount + 1),
      isFallback: false,
    });
  } catch (err: any) {
    console.error('Tutor route error:', err);
    return NextResponse.json(
      { reply: getFallbackReply('help'), isFallback: true },
      { status: 200 }
    );
  }
}
