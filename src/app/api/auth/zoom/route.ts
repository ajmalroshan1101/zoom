import { NextResponse } from 'next/server';
import { getZoomAuthUrl } from '@/src/lib/zoom';

export async function GET() {
  const authUrl = getZoomAuthUrl();
  return NextResponse.redirect(authUrl);
}