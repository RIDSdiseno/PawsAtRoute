// lib/mailer.ts
import nodemailer, { Transporter } from "nodemailer";

const FROM_EMAIL = process.env.FROM_EMAIL || "Paws At Route <soporte@tu-dominio.com>";

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,                     // p.ej. smtp.gmail.com
    port: Number(process.env.SMTP_PORT || 587),       // 465=secure true, 587=secure false
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER!,                   // tu correo SMTP
      pass: process.env.SMTP_PASS!,                   // App Password si Gmail
    },
    // Opcional si tu servidor exige STARTTLS estricto:
    requireTLS: String(process.env.SMTP_REQUIRE_TLS || "false") === "true",
    // ⚠️ Solo para entornos con certificados corporativos (evitar en prod):
    // tls: { rejectUnauthorized: false },
  });

  // (Opcional) Verifica conexión al arrancar:
  transporter.verify().then(
    () => console.log("[MAIL] SMTP listo"),
    (e) => console.warn("[MAIL] SMTP verify falló:", e?.message || e)
  );

  return transporter;
}

export async function sendEmail(opts: { to: string; subject: string; text?: string; html?: string }) {
  const t = getTransporter();
  await t.sendMail({
    from: FROM_EMAIL,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
