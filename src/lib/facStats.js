import { createClient } from '@supabase/supabase-js';

/* Agrégat par faculté : nombre d'inscrits et confirmations de barème (profile.baremeVote).
   Parcourt les comptes via l'API admin, en cache mémoire une heure (serveur uniquement). */
let cache = { at: 0, byFac: null };
const HOUR = 3600000;

export async function facStatsAll() {
  if (cache.byFac && Date.now() - cache.at < HOUR) return cache.byFac;
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
  const byFac = {};
  for (let page = 1; page < 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 500 });
    if (error) throw new Error(error.message);
    for (const u of data.users) {
      const p = u.user_metadata?.profile; if (!p?.fac) continue;
      const f = (byFac[p.fac] ||= { students: 0, votes: {} });
      f.students += 1;
      const v = p.baremeVote;
      if (v?.fac === p.fac && v.bareme) f.votes[v.bareme] = (f.votes[v.bareme] || 0) + 1;
    }
    if (data.users.length < 500) break;
  }
  cache = { at: Date.now(), byFac };
  return byFac;
}

export async function facStats(facId) {
  const all = await facStatsAll();
  return all[facId] || { students: 0, votes: {} };
}
