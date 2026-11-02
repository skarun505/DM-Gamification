import { NextResponse } from 'next/server';
import { getGlossary } from '@/lib/content/loader';

export async function GET() {
  const glossary = getGlossary();
  return NextResponse.json(glossary);
}

