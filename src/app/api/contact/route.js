import nodemailer from 'nodemailer';

// Simple in-memory rate limiter (per IP, 3 emails per 15 min)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 min
const RATE_LIMIT_MAX = 3;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  if (now - entry.start > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// Sanitize string to prevent HTML injection in emails
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

// Strip newlines from subject to prevent header injection
function sanitizeSubject(str) {
  return String(str).replace(/[\r\n]/g, ' ').trim();
}

export async function POST(request) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return Response.json({ error: 'Trop de messages envoyés. Veuillez réessayer dans quelques minutes.' }, { status: 429 });
    }

    // Origin check (basic CSRF protection)
    const origin = request.headers.get('origin');
    const allowedOrigins = ['https://prepa-pass-las.fr', 'https://www.prepa-pass-las.fr', 'https://prepa-las.fr', 'https://www.prepa-las.fr', 'https://prepa-pass.fr', 'https://www.prepa-pass.fr', 'https://prepa-pass-las-kappa.vercel.app', 'http://localhost:3000'];
    if (origin && !allowedOrigins.includes(origin)) {
      return Response.json({ error: 'Requête non autorisée.' }, { status: 403 });
    }

    const body = await request.json();
    const { email, category, subject, message } = body;

    // Validation
    if (!email || !subject || !message) {
      return Response.json({ error: 'Email, sujet et message requis.' }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return Response.json({ error: 'Adresse email invalide.' }, { status: 400 });
    }

    if (subject.length > 200) {
      return Response.json({ error: 'Le sujet est trop long (200 caractères max).' }, { status: 400 });
    }

    if (message.length > 5000) {
      return Response.json({ error: 'Le message est trop long (5000 caractères max).' }, { status: 400 });
    }

    // Sanitize inputs
    const safeEmail = escapeHtml(email);
    const safeCategory = escapeHtml(category || 'Non specifiee');
    const safeSubject = sanitizeSubject(subject);
    const safeMessage = escapeHtml(message);

    // Décoder le mot de passe (stocké en base64 pour éviter les problèmes de caractères spéciaux)
    const smtpPassword = process.env.SMTP_PASSWORD_B64
      ? Buffer.from(process.env.SMTP_PASSWORD_B64, 'base64').toString('utf-8')
      : process.env.SMTP_PASSWORD;

    // Vérifier que les variables SMTP sont configurées
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !smtpPassword) {
      console.error('Variables SMTP manquantes');
      return Response.json({ error: 'Configuration email manquante sur le serveur.' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: smtpPassword,
      },
    });

    await transporter.sendMail({
      from: `"Prepa PASS/LAS" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `[${escapeHtml(sanitizeSubject(category || 'Contact'))}] ${safeSubject}`,
      text: `De : ${email}\nCategorie : ${category || 'Non specifiee'}\n\nSujet : ${safeSubject}\n\nMessage :\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">Nouveau message de contact</h2>
          <p><strong>De :</strong> ${safeEmail}</p>
          <p><strong>Categorie :</strong> ${safeCategory}</p>
          <p><strong>Sujet :</strong> ${escapeHtml(safeSubject)}</p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 12px;">
            <p style="margin: 0; white-space: pre-wrap;">${safeMessage}</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erreur envoi email:', error.message, error.code);
    return Response.json({ error: "Une erreur est survenue. Veuillez réessayer." }, { status: 500 });
  }
}
