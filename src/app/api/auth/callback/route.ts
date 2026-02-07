import { NextRequest, NextResponse } from 'next/server';
import { getZoomTokens, getZoomUser } from '@/src/lib/zoom';
import { supabaseAdmin } from '@/src/lib/supabase';
import { createSession, setSessionCookie } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=${error}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=no_code`
    );
  }

  try {
    // Exchange code for tokens
    const tokens = await getZoomTokens(code);
    
    // Get user info from Zoom
    const zoomUser = await getZoomUser(tokens.access_token);

    // Calculate token expiration
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setSeconds(tokenExpiresAt.getSeconds() + tokens.expires_in);

    // Check if user exists
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('zoom_user_id', zoomUser.id)
      .single();

    let userId: string;

    if (existingUser) {
      // Update existing user
      const { data: updatedUser } = await supabaseAdmin
        .from('users')
        .update({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: tokenExpiresAt.toISOString(),
          display_name: `${zoomUser.first_name} ${zoomUser.last_name}`,
          profile_picture: zoomUser.pic_url,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)
        .select()
        .single();

      userId = existingUser.id;
    } else {
      // Create new user
      const { data: newUser, error: insertError } = await supabaseAdmin
        .from('users')
        .insert({
          zoom_user_id: zoomUser.id,
          email: zoomUser.email,
          display_name: `${zoomUser.first_name} ${zoomUser.last_name}`,
          profile_picture: zoomUser.pic_url,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: tokenExpiresAt.toISOString(),
          role: 'user',
        })
        .select()
        .single();

      if (insertError) throw insertError;
      userId = newUser.id;
    }

    // Create session
    const sessionToken = await createSession(userId);
    await setSessionCookie(sessionToken);

    // Redirect based on role
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    const redirectUrl = user?.role === 'admin' ? '/admin' : '/dashboard';
    
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}${redirectUrl}`);
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/login?error=auth_failed`
    );
  }
}