import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdmin } from '@/src/lib/auth';
import { supabaseAdmin } from '@/src/lib/supabase';

export async function GET() {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: users, error } = await supabaseAdmin
    .from('users')
    .select('id, email, display_name, profile_picture, role, is_active, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(users);
}

export async function PATCH(request: NextRequest) {
  const admin = await isAdmin();

  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { userId, role, is_active } = await request.json();

  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ role, is_active, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}