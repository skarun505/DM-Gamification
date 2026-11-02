import { NextRequest, NextResponse } from 'next/server';
import { getBossBattle } from '@/lib/content/loader';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
  }

  const boss = getBossBattle(slug);
  if (!boss) {
    return NextResponse.json({ error: 'Boss battle not found' }, { status: 404 });
  }

  return NextResponse.json(boss);
}
