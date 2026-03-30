import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) return NextResponse.json({ users: [] });

  // Vérifier que l'appelant est authentifié
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ users: [] }, { status: 401 });
  }
  const token = authHeader.slice(7);

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ users: [] }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('id, display_name, avg_score, session_count')
    .gt('session_count', 0);

  if (error) {
    console.error('[leaderboard] Erreur Supabase:', error.message);
    return NextResponse.json({ users: [] });
  }

  return NextResponse.json({ users: data || [] });
}
