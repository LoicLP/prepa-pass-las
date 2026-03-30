import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) return NextResponse.json({ ok: false }, { status: 500 });

    // 1. Vérifier le token JWT de l'utilisateur
    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
    const token = authHeader.slice(7);

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    // 2. Valider le token et récupérer l'utilisateur réel
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    // 3. S'assurer que l'utilisateur ne peut mettre à jour QUE son propre profil
    const { userId, displayName, avgScore, sessionCount } = await request.json();
    if (user.id !== userId) {
      return NextResponse.json({ ok: false }, { status: 403 });
    }

    // 4. Upsert sécurisé
    await supabaseAdmin.from('user_profiles').upsert({
      id: user.id,
      ...(displayName ? { display_name: displayName } : {}),
      avg_score: avgScore ?? 0,
      session_count: sessionCount ?? 0,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
