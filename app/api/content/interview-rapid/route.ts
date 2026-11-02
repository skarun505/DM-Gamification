import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const contentDir = path.join(process.cwd(), 'content', 'interview');
  const files = ['rapid-rookie.json', 'rapid-operator.json', 'rapid-strategist.json'];
  const allRapid: any[] = [];

  for (const f of files) {
    const fullPath = path.join(contentDir, f);
    if (fs.existsSync(fullPath)) {
      const data = JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
      allRapid.push(...data);
    }
  }

  return NextResponse.json(allRapid);
}
