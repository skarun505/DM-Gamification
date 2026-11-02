import { NextRequest, NextResponse } from 'next/server';

export function GET(req: NextRequest) {
  const url = new URL('/icon.svg', req.url);
  return NextResponse.redirect(url, 307);
}
