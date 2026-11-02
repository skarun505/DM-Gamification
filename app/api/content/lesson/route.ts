import { NextRequest, NextResponse } from 'next/server';
import { getLessonBySlug } from '@/lib/content/loader';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
  }

  const lesson = getLessonBySlug(slug);
  if (!lesson) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  return NextResponse.json(lesson);
}

