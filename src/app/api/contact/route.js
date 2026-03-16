import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, category, subject, message } = await request.json();

    if (!email || !subject || !message) {
      return Response.json({ error: 'Email, sujet et message requis.' }, { status: 400 });
    }

    // Décoder le mot de passe (stocké en base64 pour éviter les problèmes de caractères spéciaux)
    const smtpPassword = process.env.SMTP_PASSWORD_B64
      ? Buffer.from(process.env.SMTP_PASSWORD_B64, 'base64').toString('utf-8')
      : process.env.SMTP_PASSWORD;

    // Vérifier que les variables SMTP sont configurées
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !smtpPassword) {
      console.error('Variables SMTP manquantes:', {
        host: !!process.env.SMTP_HOST,
        port: !!process.env.SMTP_PORT,
        user: !!process.env.SMTP_USER,
        pass: !!(process.env.SMTP_PASSWORD_B64 || process.env.SMTP_PASSWORD),
      });
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
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.sendMail({
      from: `"Prepa PASS/LAS" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `[${category || 'Contact'}] ${subject}`,
      text: `De : ${email}\nCategorie : ${category || 'Non specifiee'}\n\nSujet : ${subject}\n\nMessage :\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1f2937; border-bottom: 2px solid #6366f1; padding-bottom: 8px;">Nouveau message de contact</h2>
          <p><strong>De :</strong> ${email}</p>
          <p><strong>Categorie :</strong> ${category || 'Non specifiee'}</p>
          <p><strong>Sujet :</strong> ${subject}</p>
          <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin-top: 12px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erreur envoi email:', error.message, error.code);
    return Response.json(
      { error: `Erreur d'envoi: ${error.message || 'Erreur inconnue'}` },
      { status: 500 }
    );
  }
}
