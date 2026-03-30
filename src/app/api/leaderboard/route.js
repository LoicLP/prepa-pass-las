import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ users: [] });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('id, display_name, avg_score, session_count')
    .gt('session_count', 0); // uniquement les utilisateurs ayant fait au moins 1 QCM

  if (error) {
    console.error('[leaderboard] Erreur Supabase:', error.message);
    return NextResponse.json({ users: [] });
  }

  return NextResponse.json({ users: data || [] });
}
