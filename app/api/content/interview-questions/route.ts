import { NextRequest, NextResponse } from 'next/server';
import { getInterviewQuestions } from '@/lib/content/loader';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tier = searchParams.get('tier') || undefined;
  const questions = getInterviewQuestions(tier);
  return NextResponse.json(questions);
}
