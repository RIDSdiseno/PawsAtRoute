// helpers/email.ts (o al inicio del mismo controller)
import { sendEmail } from "../lib/mailer";

async function sendPaseadorAprobadoEmail(to: string, nombre: string) {
  const subject = "✅ Tu cuenta de Paws At Route ha sido aprobada";
  const text = `Hola ${nombre},

¡Buenas noticias! Tu cuenta de Paws At Route fue aprobada y ya puedes iniciar sesión para comenzar a tomar paseos.

Ingresa a la app, completa (si corresponde) tu perfil y revisa los paseos disponibles.

— Equipo Paws At Route`;

  const html = `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;line-height:1.5;color:#0b3a53">
    <h2>¡Tu cuenta fue aprobada! ✅</h2>
    <p>Hola <strong>${nombre}</strong>,</p>
    <p>¡Buenas noticias! Tu cuenta de <strong>Paws At Route</strong> fue aprobada y ya puedes iniciar sesión para comenzar a tomar paseos.</p>
    <p>Ingresa a la app, completa (si corresponde) tu perfil y revisa los paseos disponibles.</p>
    <p style="margin-top:16px">— Equipo Paws At Route</p>
  </div>`;
  // No interrumpas el flujo si falla el mail
  try {
    await sendEmail({ to, subject, text, html });
  } catch (e) {
    console.error("[MAIL][APROBADO] No se pudo enviar notificación:", e);
  }
}
