// src/lib/mailer.ts
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";
import { Resend } from "resend";

const EMAIL_PROVIDER = (process.env.EMAIL_PROVIDER || "SMTP").toUpperCase(); // "SMTP" | "RESEND"
const FROM = process.env.FROM_EMAIL || "Paws At Route <noreply@tu-dominio.com>";

/** -------- SMTP transporter (opcional) -------- */
let smtpTransport: nodemailer.Transporter | null = null;
let resendClient: Resend | null = null;

function buildSmtpTransport() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT || 587);
  const secure = String(process.env.SMTP_SECURE || (port === 465 ? "true" : "false")) === "true";
  const requireTLS = String(process.env.SMTP_REQUIRE_TLS || (!secure ? "true" : "false")) === "true";

  const t = nodemailer.createTransport({
    host,
    port,
    secure,                 // 465 => true (TLS directo), 587 => false (STARTTLS)
    requireTLS,             // fuerza STARTTLS en 587
    auth: {
      user: process.env.SMTP_USER!, // Gmail: tu_cuenta@gmail.com
      pass: process.env.SMTP_PASS!, // App Password SIN espacios
    },
    connectionTimeout: 20_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
    tls: { servername: host },
    logger: true,
    debug: true,
  });

  return t;
}

if (EMAIL_PROVIDER === "SMTP") {
  smtpTransport = buildSmtpTransport();
  smtpTransport.verify().then(
    () => console.log("[MAIL] SMTP listo"),
    (e) => console.error("[MAIL] SMTP verify falló:", e?.code || e?.message || e),
  );
} else if (EMAIL_PROVIDER === "RESEND") {
  resendClient = new Resend(process.env.RESEND_API_KEY!);
}

/** -------- Tipos para forzar overload html/text (no react) -------- */
type ResendHtmlArgs = { from: string; to: string | string[]; subject: string; html: string };
type ResendTextArgs = { from: string; to: string | string[]; subject: string; text: string };

/** -------- Envío unificado -------- */
export async function sendEmail(opts: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) {
  const { to, subject, text, html } = opts;

  if (EMAIL_PROVIDER === "RESEND") {
    // Forzamos el overload de html/text para que TS no exija 'react'
    const payload: ResendHtmlArgs | ResendTextArgs = html
      ? { from: FROM, to: [to], subject, html }
      : { from: FROM, to: [to], subject, text: text ?? "" };

    const r = await resendClient!.emails.send(payload as any);
    if ((r as any).error) throw (r as any).error;
    return;
  }

  // SMTP
  if (!smtpTransport) {
    smtpTransport = buildSmtpTransport();
  }

  await smtpTransport.sendMail({
    from: FROM,
    to,
    subject,
    // manda lo que tengas (prefiere html si viene)
    html: html ?? undefined,
    text,
  });
}
