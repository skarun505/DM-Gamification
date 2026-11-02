import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  INTERVIEWER_SYSTEM_PROMPT,
  EVALUATE_SYSTEM_PROMPT,
} from '@/lib/interview/prompt';
import { getTodayIST } from '@/lib/game/streak';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { action, question, answer, keyPoints, history, currentStep, totalSteps } = body;
    const today = getTodayIST();

    // Fetch usage
    const { data: usageRow } = await supabase
      .from('interview_usage')
      .select('ai_count, mock_count')
      .eq('user_id', user.id)
      .eq('day', today)
      .maybeSingle();

    const aiCount = usageRow?.ai_count || 0;
    const mockCount = usageRow?.mock_count || 0;

    const apiKey = process.env.GEMINI_API_KEY;

    if (action === 'evaluate') {
      if (aiCount >= 15 || !apiKey) {
        // Fallback rule-based evaluation
        const hitPoints: string[] = [];
        const missedPoints: string[] = [];
        const lowerAnswer = (answer || '').toLowerCase();

        (keyPoints || []).forEach((pt: string) => {
          const keywords = pt
            .toLowerCase()
            .split(' ')
            .filter((w) => w.length > 4);
          const matched = keywords.some((k) => lowerAnswer.includes(k));
          if (matched) hitPoints.push(pt);
          else missedPoints.push(pt);
        });

        const ratio = keyPoints?.length ? hitPoints.length / keyPoints.length : 0.5;
        const total = Math.round(ratio * 20);

        return NextResponse.json({
          scores: {
            clarity: Math.min(5, Math.ceil(total / 4)),
            structure: Math.min(5, Math.floor(total / 4)),
            numbers: Math.min(5, Math.floor(total / 4)),
            business: Math.min(5, Math.ceil(total / 4)),
          },
          total,
          hit_points: hitPoints,
          missed_points: missedPoints,
          better_answer:
            "Good start! Make sure to always cite the specific metric formula, diagnose tracking before touching ads, and end with the next test step.",
          one_tip: "Lead with the metric name and definition before giving your recommendations.",
          isFallback: true,
        });
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
          systemInstruction: EVALUATE_SYSTEM_PROMPT,
          generationConfig: { responseMimeType: 'application/json' },
        });

        const prompt = `Question: "${question}"\nKey Points Required: ${JSON.stringify(
          keyPoints
        )}\nLearner's Answer: "${answer}"`;

        const res = await model.generateContent(prompt);
        const evaluation = JSON.parse(res.response.text());

        // Update usage
        await supabase.from('interview_usage').upsert(
          {
            user_id: user.id,
            day: today,
            ai_count: aiCount + 1,
            mock_count: mockCount,
          },
          { onConflict: 'user_id,day' }
        );

        return NextResponse.json(evaluation);
      } catch (err: any) {
        console.warn('Evaluation AI failed:', err?.message);
        return NextResponse.json({
          scores: { clarity: 3, structure: 3, numbers: 3, business: 3 },
          total: 12,
          hit_points: keyPoints?.slice(0, 2) || [],
          missed_points: keyPoints?.slice(2) || [],
          better_answer: "Solid effort! Keep testing creative angles and reviewing your ROAS daily.",
          one_tip: "Frame your answer in Situation-Task-Action-Result format.",
          isFallback: true,
        });
      }
    }

    if (action === 'interviewer_turn') {
      if (mockCount >= 3 || !apiKey) {
        return NextResponse.json({
          interviewerQuestion: body.followUpFallback || "Can you elaborate on how you would measure success?",
          isFallback: true,
        });
      }

      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
          systemInstruction: INTERVIEWER_SYSTEM_PROMPT,
        });

        const prompt = `Current step: ${currentStep}/${totalSteps}\nInterview Question: ${question}\nCandidate Answer: ${answer}\n\nAsk a probing follow-up under 35 words.`;
        const res = await model.generateContent(prompt);
        const followUp = res.response.text().trim();

        return NextResponse.json({ interviewerQuestion: followUp });
      } catch (err: any) {
        return NextResponse.json({
          interviewerQuestion: body.followUpFallback || "How would you explain that result to a client?",
          isFallback: true,
        });
      }
    }

    if (action === 'scorecard') {
      // Mock interview completed
      await supabase.from('interview_usage').upsert(
        {
          user_id: user.id,
          day: today,
          ai_count: aiCount,
          mock_count: mockCount + 1,
        },
        { onConflict: 'user_id,day' }
      );

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    console.error('Interview API error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
