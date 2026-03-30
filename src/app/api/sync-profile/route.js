import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userId, displayName, avgScore, sessionCount } = await request.json();
    if (!userId) return NextResponse.json({ ok: false });

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) return NextResponse.json({ ok: false });

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    await supabaseAdmin.from('user_profiles').upsert({
      id: userId,
      ...(displayName ? { display_name: displayName } : {}),
      avg_score: avgScore ?? 0,
      session_count: sessionCount ?? 0,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
