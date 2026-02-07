import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { supabaseAdmin, User } from './supabase';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);
const SESSION_COOKIE = 'session_token';

export const createSession = async (userId: string) => {
  // Create session token
  const sessionToken = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(JWT_SECRET);

  // Calculate expiration date
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  // Save session to database
  await supabaseAdmin.from('sessions').insert({
    user_id: userId,
    session_token: sessionToken,
    expires_at: expiresAt.toISOString(),
  });

  return sessionToken;
};

export const setSessionCookie = async (sessionToken: string) => {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
};

export const getSession = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

    if (!sessionToken) return null;

    // Verify JWT
    const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
    
    // Check session in database
    const { data: session } = await supabaseAdmin
      .from('sessions')
      .select('*, users(*)')
      .eq('session_token', sessionToken)
      .single();

    if (!session || new Date(session.expires_at) < new Date()) {
      return null;
    }

    return session.users as User;
  } catch (error) {
    return null;
  }
};

export const deleteSession = async () => {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionToken) {
    await supabaseAdmin
      .from('sessions')
      .delete()
      .eq('session_token', sessionToken);
    
    cookieStore.delete(SESSION_COOKIE);
  }
};

export const isAdmin = async (): Promise<boolean> => {
  const user = await getSession();
  return user?.role === 'admin';
};