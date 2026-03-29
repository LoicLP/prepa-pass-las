import nodemailer from 'nodemailer';

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

    const { email } = await request.json();
    if (!email) {
      return Response.json({ error: 'Email manquant.' }, { status: 400 });
    }

    const smtpPassword = process.env.SMTP_PASSWORD_B64
      ? Buffer.from(process.env.SMTP_PASSWORD_B64, 'base64').toString('utf-8')
      : process.env.SMTP_PASSWORD;

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !smtpPassword) {
      console.error('[reset-password-email] Variables SMTP manquantes:', {
        host: !!process.env.SMTP_HOST,
        user: !!process.env.SMTP_USER,
        pass: !!smtpPassword,
      });
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
      text: `Bonjour,\n\nNous avons reçu une demande de réinitialisation de mot de passe pour votre compte Prépa PASS/LAS.\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet email — votre mot de passe restera inchangé.\n\nUn lien de réinitialisation vous a été envoyé dans un email séparé. Il est valable 1 heure.\n\nL'équipe Prépa PASS/LAS`,
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
              <h2 style="margin:0 0 8px;font-size:20px;font-weight:800;color:#1e1b4b;">Réinitialisation du mot de passe</h2>
              <p style="margin:0 0 20px;font-size:15px;color:#6b7280;line-height:1.6;">
                Nous avons reçu une demande de réinitialisation du mot de passe pour le compte associé à <strong style="color:#1e1b4b;">${email}</strong>.
              </p>

              <!-- Info box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                <tr>
                  <td style="padding:16px;background:#fef9c3;border:1px solid #fde047;border-radius:14px;">
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:20px;vertical-align:top;padding-right:10px;">⚠️</td>
                        <td style="font-size:13px;color:#854d0e;line-height:1.5;">
                          Si vous n'êtes <strong>pas à l'origine de cette demande</strong>, ignorez cet email. Votre mot de passe restera inchangé.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-size:14px;color:#9ca3af;line-height:1.6;">
                Un lien de réinitialisation a été envoyé à votre adresse email. Il est valable pendant <strong style="color:#6b7280;">1 heure</strong>. Après avoir cliqué sur ce lien, vous pourrez choisir un nouveau mot de passe.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #f3f4f6;margin:0 0 20px;" />

              <p style="margin:0;font-size:13px;color:#9ca3af;line-height:1.5;">
                Vous avez un problème ? Contactez-nous à
                <a href="mailto:support@prepa-pass-las.fr" style="color:#6366f1;text-decoration:none;"> support@prepa-pass-las.fr</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #f3f4f6;text-align:center;">
              <p style="margin:0;font-size:11px;color:#e5e7eb;">
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
    console.error('[reset-password-email] Erreur:', error.message, error.code, error.response);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
