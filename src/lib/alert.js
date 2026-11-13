import { createClient } from '@supabase/supabase-js';
import { sendMail, layout, esc } from '@/lib/mailer';

/* Alerte par e-mail à l'administrateur quand un service critique tombe (ex. génération IA).
   Au plus une alerte par `key` toutes les 6 heures : l'horodatage du dernier envoi est stocké
   dans app_metadata.alerts du compte de test interne (pas de table dédiée à créer).
   Destinataire : ALERT_EMAIL, sinon la boîte support (SMTP_USER). Ne lève jamais d'erreur. */
const HOLDER = 'ca9c49c1-f92a-4ae8-a12f-2250f182d289'; // test.local@prepa-pass-las.fr
const COOLDOWN = 6 * 3600 * 1000;
let lastInMemory = {}; // évite un aller-retour Supabase à chaque échec sur une même instance

export async function alertAdmin(key, { subject, lines = [] }) {
  try {
    const now = Date.now();
    if (lastInMemory[key] && now - lastInMemory[key] < COOLDOWN) return false;
    const to = (process.env.ALERT_EMAIL || process.env.SMTP_USER || '').trim();
    if (!to || !process.env.SUPABASE_SERVICE_ROLE_KEY) return false;
    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });
    const { data } = await admin.auth.admin.getUserById(HOLDER);
    const meta = data?.user?.app_metadata || {};
    const last = meta.alerts?.[key] ? new Date(meta.alerts[key]).getTime() : 0;
    if (now - last < COOLDOWN) { lastInMemory[key] = last; return false; }
    lastInMemory[key] = now;
    if (data?.user) await admin.auth.admin.updateUserById(HOLDER, { app_metadata: { ...meta, alerts: { ...(meta.alerts || {}), [key]: new Date(now).toISOString() } } });
    await sendMail({ to, subject: `[Alerte Prépa PASS/LAS] ${subject}`, html: layout({ title: 'Alerte technique', emoji: '🚨', paragraphs: lines.map((l) => esc(l)), footnote: 'Une seule alerte par incident toutes les 6 heures.', unsub: 'Alerte automatique du site prepa-pass-las.fr' }) });
    return true;
  } catch (e) {
    console.error('[alertAdmin]', e?.message);
    return false;
  }
}
