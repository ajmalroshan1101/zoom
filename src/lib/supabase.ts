import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Server-side client with service role
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Client-side client with anon key
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface User {
  id: string;
  zoom_user_id: string;
  email: string;
  display_name: string;
  profile_picture: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  role: 'user' | 'admin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  user_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}