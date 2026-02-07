import { NextResponse } from 'next/server';
import { deleteSession } from '@/src/lib/auth';

export async function POST() {
  await deleteSession();
  return NextResponse.json({ success: true });
}

export async function GET() {
  await deleteSession();
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
}