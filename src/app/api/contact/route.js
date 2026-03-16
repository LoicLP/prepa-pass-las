import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email, category, subject, message } = await request.json();

    if (!email || !subject || !message) {
      return Response.json({ error: 'Email, sujet et message requis.' }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
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
    console.error('Erreur envoi email:', error);
    return Response.json({ error: "Erreur lors de l'envoi du message." }, { status: 500 });
  }
}
