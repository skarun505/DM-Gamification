import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { InterviewScenarioSchema } from '@/lib/content/schema';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'Slug parameter is required' }, { status: 400 });
  }

  const filePath = path.join(process.cwd(), 'content', 'interview', 'scenarios', `${slug}.json`);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Scenario not found' }, { status: 404 });
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return NextResponse.json(InterviewScenarioSchema.parse(data));
}

