import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'content', 'interview', 'checklist.json');
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({});
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return NextResponse.json(data);
}
