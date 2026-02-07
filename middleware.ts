import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const publicPaths = ['/', '/login', '/api/auth/zoom', '/api/auth/callback'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow public paths
  if (publicPaths.some(p => path === p || path.startsWith('/api/auth/'))) {
    return NextResponse.next();
  }

  // Check for session cookie
  const sessionToken = request.cookies.get('session_token')?.value;

  if (!sessionToken) {
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(sessionToken, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    if (path.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/user/:path*',
    '/api/admin/:path*',
  ],
};