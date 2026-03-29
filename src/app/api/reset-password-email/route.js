import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > 60 * 60 * 1000) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  return entry.count > 3;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return Response.json({ error: 'Trop de requêtes. Réessayez dans une heure.' }, { status: 429 });
    }

    const origin = request.headers.get('origin');
    const allowedOrigins = [
      'https://prepa-pass-las.fr',
      'https://www.prepa-pass-las.fr',
      'https://prepa-pass-las-kappa.vercel.app',
      'http://localhost:3000',
    ];
    if (origin && !allowedOrigins.includes(origin)) {
      return Response.json({ error: 'Requête non autorisée.' }, { status: 403 });
    }

    const { email } = await request.json();
    if (!email || !isValidEmail(email)) {
      return Response.json({ error: 'Email invalide.' }, { status: 400 });
    }

    // Vérifier les variables d'environnement
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceRoleKey) {
      console.error('[reset-password-email] Variables Supabase manquantes');
      return Response.json({ error: 'Configuration manquante.' }, { status: 500 });
    }

    // Générer le lien de réinitialisation via l'admin API
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const redirectTo = `${origin || 'https://prepa-pass-las-kappa.vercel.app'}/reset-password`;

    const { data, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo },
    });

    if (linkError) {
      console.error('[reset-password-email] Erreur generateLink:', linkError.message);
      // Répondre succès quand même pour ne pas révéler si l'email existe
      return Response.json({ success: true });
    }

    const resetLink = data?.properties?.action_link;
    if (!resetLink) {
      console.error('[reset-password-email] Pas de lien généré');
      return Response.json({ success: true });
    }

    // Envoyer l'email brandé avec le lien
    const smtpPassword = process.env.SMTP_PASSWORD_B64
      ? Buffer.from(process.env.SMTP_PASSWORD_B64, 'base64').toString('utf-8')
      : process.env.SMTP_PASSWORD;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !smtpPassword) {
      console.error('[reset-password-email] Variables SMTP manquantes');
      return Response.json({ success: false }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: smtpPassword },
    });

    await transporter.sendMail({
      from: `"Prépa PASS/LAS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      text: `Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe Prépa PASS/LAS.\n\nCliquez sur ce lien pour choisir un nouveau mot de passe (valable 1 heure) :\n${resetLink}\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email.\n\nL'équipe Prépa PASS/LAS`,
      html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f0f4ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4ff;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 4px 24px rgba(79,70,229,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#4f46e5 100%);padding:40px 32px;text-align:center;">
              <div style="width:64px;height:64px;background:rgba(255,255,255,0.15);border-radius:18px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <span style="font-size:32px;">🔐</span>
              </div>
              <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Prépa <span style="color:#a5b4fc;">PASS/LAS</span></h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(199,210,254,0.8);">Votre réussite en santé</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1e1b4b;">Réinitialiser votre mot de passe</h2>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                Nous avons reçu une demande de réinitialisation du mot de passe pour votre compte. Cliquez sur le bouton ci-dessous pour choisir un nouveau mot de passe.
              </p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td align="center">
                    <a href="${resetLink}"
                       style="display:inline-block;padding:14px 36px;background:#4f46e5;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;letter-spacing:-0.2px;">
                      Réinitialiser mon mot de passe →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:13px;color:#9ca3af;line-height:1.5;text-align:center;">
                Ce lien est valable pendant <strong style="color:#6b7280;">1 heure</strong>.
              </p>

              <!-- Warning box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
                <tr>
                  <td style="padding:14px;background:#fef9c3;border:1px solid #fde047;border-radius:12px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:18px;vertical-align:top;padding-right:10px;">⚠️</td>
                        <td style="font-size:13px;color:#854d0e;line-height:1.5;">
                          Si vous n'avez pas demandé cette réinitialisation, ignorez cet email. Votre mot de passe restera inchangé.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0;font-size:12px;color:#d1d5db;line-height:1.5;">
                Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :<br/>
                <span style="color:#9ca3af;word-break:break-all;">${resetLink}</span>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f3f4f6;text-align:center;">
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                Des questions ? <a href="mailto:support@prepa-pass-las.fr" style="color:#6366f1;text-decoration:none;">support@prepa-pass-las.fr</a>
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#e5e7eb;">
                © ${new Date().getFullYear()} Prépa PASS/LAS · LP Labs
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('[reset-password-email] Erreur:', error.message, error.code);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
