import { NextResponse } from 'next/server';
import { getDailyQuestions } from '@/lib/content/loader';

export async function GET() {
  const questions = getDailyQuestions();
  return NextResponse.json(questions);
}
