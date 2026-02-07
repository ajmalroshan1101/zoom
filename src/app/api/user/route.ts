import { NextResponse } from 'next/server';
import { getSession } from '@/src/lib/auth';
import { getZoomMeetings } from '@/src/lib/zoom';

export async function GET() {
  const user = await getSession();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    display_name: user.display_name,
    profile_picture: user.profile_picture,
    role: user.role,
  });
}