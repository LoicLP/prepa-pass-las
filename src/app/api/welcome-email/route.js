import nodemailer from 'nodemailer';

// Simple rate limiter : 1 email de bienvenue par IP par heure
const rateLimitMap = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > 60 * 60 * 1000) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  return entry.count > 2;
}

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return Response.json({ error: 'Trop de requêtes.' }, { status: 429 });
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

    const { name, email } = await request.json();
    if (!name || !email) {
      return Response.json({ error: 'Paramètres manquants.' }, { status: 400 });
    }

    const smtpPassword = process.env.SMTP_PASSWORD_B64
      ? Buffer.from(process.env.SMTP_PASSWORD_B64, 'base64').toString('utf-8')
      : process.env.SMTP_PASSWORD;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !smtpPassword) {
      return Response.json({ error: 'Configuration email manquante.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: smtpPassword },
    });

    const firstName = name.split(' ')[0];

    await transporter.sendMail({
      from: `"Prépa PASS/LAS" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Bienvenue sur Prépa PASS/LAS, ${firstName} ! 🎓`,
      text: `Bonjour ${firstName},\n\nBienvenue sur Prépa PASS/LAS !\n\nTon compte est maintenant actif. Tu peux accéder à tous tes outils de révision : QCM, fiches de cours et mode examen.\n\nCommence ta préparation → https://prepa-pass-las.fr/dashboard\n\nBonne chance pour ta préparation !\n\nL'équipe Prépa PASS/LAS`,
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
                <span style="font-size:32px;">🎓</span>
              </div>
              <h1 style="margin:0;font-size:26px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">Prépa <span style="color:#a5b4fc;">PASS/LAS</span></h1>
              <p style="margin:6px 0 0;font-size:13px;color:rgba(199,210,254,0.8);">Votre réussite en santé</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <h2 style="margin:0 0 8px;font-size:22px;font-weight:800;color:#1e1b4b;">Bienvenue, ${firstName} ! 👋</h2>
              <p style="margin:0 0 24px;font-size:15px;color:#6b7280;line-height:1.6;">
                Ton compte est actif. Tu as maintenant accès à tous tes outils de révision pour préparer ton concours PASS/LAS.
              </p>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="padding:12px;background:#f0f4ff;border-radius:14px;margin-bottom:8px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;height:40px;background:#e0e7ff;border-radius:10px;text-align:center;vertical-align:middle;font-size:20px;">📝</td>
                        <td style="padding-left:12px;">
                          <div style="font-size:14px;font-weight:700;color:#1e1b4b;">QCM illimités</div>
                          <div style="font-size:12px;color:#9ca3af;margin-top:2px;">Entraîne-toi sur toutes les matières</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:#f0f4ff;border-radius:14px;margin-bottom:8px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;height:40px;background:#e0e7ff;border-radius:10px;text-align:center;vertical-align:middle;font-size:20px;">📚</td>
                        <td style="padding-left:12px;">
                          <div style="font-size:14px;font-weight:700;color:#1e1b4b;">Fiches de révision</div>
                          <div style="font-size:12px;color:#9ca3af;margin-top:2px;">Anatomie, chimie, biocell et plus</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr><td style="height:8px;"></td></tr>
                <tr>
                  <td style="padding:12px;background:#f0f4ff;border-radius:14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width:40px;height:40px;background:#e0e7ff;border-radius:10px;text-align:center;vertical-align:middle;font-size:20px;">🏆</td>
                        <td style="padding-left:12px;">
                          <div style="font-size:14px;font-weight:700;color:#1e1b4b;">Mode Examen</div>
                          <div style="font-size:12px;color:#9ca3af;margin-top:2px;">Simule les conditions du concours</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://prepa-pass-las.fr/dashboard"
                       style="display:inline-block;padding:14px 36px;background:#4f46e5;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;border-radius:14px;letter-spacing:-0.2px;">
                      Accéder à mon tableau de bord →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f3f4f6;text-align:center;">
              <p style="margin:0;font-size:12px;color:#d1d5db;">
                Des questions ? Contacte-nous à
                <a href="mailto:support@prepa-pass-las.fr" style="color:#6366f1;text-decoration:none;"> support@prepa-pass-las.fr</a>
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
    console.error('Erreur email de bienvenue:', error.message);
    // Ne pas bloquer l'inscription si l'email échoue
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
