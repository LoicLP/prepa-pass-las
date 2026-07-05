import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Supprime définitivement le compte de l'utilisateur authentifié (auth + profil).
export async function POST(request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Configuration serveur manquante.' }, { status: 500 });
  }

  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Non authentifié.' }, { status: 401 });
  }
  const token = authHeader.slice(7);

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Identifier l'appelant à partir de son token (empêche de supprimer un autre compte)
  const { data: { user }, error: authError } = await admin.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Session invalide.' }, { status: 401 });
  }

  // Supprimer les données de profil puis le compte auth
  await admin.from('user_profiles').delete().eq('id', user.id);
  const { error: delError } = await admin.auth.admin.deleteUser(user.id);
  if (delError) {
    return NextResponse.json({ error: delError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
