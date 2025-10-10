import type { Request, Response } from "express";
import { EstadoPaseo, PrismaClient, Rol } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import crypto from "crypto";
import { google } from "googleapis";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Resend } from "resend";
import { uploadBufferToCloudinary } from "../lib/cloudinary";


dotenv.config();
const codes = new Map();

const prisma = new PrismaClient
/* =========================
   CONFIG / CONSTANTES
========================= */

// JWT para Access Token (corto)
const JWT_SECRET: Secret = process.env.JWT_SECRET ?? "dev_secret"; // cambia en prod
const ACCESS_EXPIRES_SEC = Number(process.env.JWT_ACCESS_EXPIRES_SECONDS ?? 15 * 60); // 15 min

// Refresh Token (cookie) duración
const REFRESH_DAYS = Number(process.env.REFRESH_DAYS ?? 7);                   // sin "recordarme"
const REFRESH_REMEMBER_DAYS = Number(process.env.REFRESH_REMEMBER_DAYS ?? 60); // con "recordarme"

// Cookies (ajusta en prod)
const COOKIE_SECURE = String(process.env.COOKIE_SECURE ?? "false") === "true";
const COOKIE_SAMESITE = (process.env.COOKIE_SAMESITE as "lax" | "strict" | "none") ?? "lax";
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;
// muy importante si tus rutas están bajo /api/auth
const COOKIE_PATH = process.env.COOKIE_PATH ?? "/api/auth";


/* =========================
   TIPOS
========================= */
type JwtPayload = {
  id: number;
  email: string;       // derivado de nivel
  nombreUsuario: string;
  rol:Rol;
};


/* =========================
   HELPERS
========================= */

// Access Token (JWT)
function signAccessToken(payload: JwtPayload, expiresInSec = ACCESS_EXPIRES_SEC) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSec });
}

// Refresh Token aleatorio + hash SHA-256 (se guarda sólo el hash)
function generateRT(): string {
  return crypto.randomBytes(64).toString("base64url");
}
function hashRT(rt: string): string {
  return crypto.createHash("sha256").update(rt).digest("hex");
}

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function parseRemember(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true";
  return false;
}

function setRefreshCookie(res: Response, rt: string, days: number) {
  const maxAge = days * 24 * 60 * 60 * 1000;
  res.cookie("rt", rt, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    domain: COOKIE_DOMAIN,
    maxAge,
    path: COOKIE_PATH, // <- clave para que el navegador/cliente la envíe a /api/auth/*
  });
}
function clearRefreshCookie(res: Response) {
  res.clearCookie("rt", {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: COOKIE_SAMESITE,
    domain: COOKIE_DOMAIN,
    path: COOKIE_PATH,
  });
}



/* =========================
   CONTROLADORES
========================= */

//POST Auth/register
export const registerUser = async (req: Request, res: Response) => {
  try {
    console.log("[register] isMultipart?", req.is("multipart/form-data"));
    console.log("[register] body keys:", Object.keys(req.body || {}));
    console.log("[register] files:", (req as any).files);

    const {
      rut,
      nombre,
      apellido,
      telefono,
      comuna,
      correo,
      clave,
      rol,
    } = req.body;

    const files = (req as any).files as
      | {
          carnet?: Express.Multer.File[];
          antecedentes?: Express.Multer.File[];
        }
      | undefined;

    if (!rut || !nombre || !apellido || !telefono || !comuna || !correo || !clave || !rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const emailNorm = String(correo).trim().toLowerCase();

    let carnetIdentidad: string | null = null;
    let antecedentes: string | null = null;

    // Validación archivos SOLO para PASEADOR
    if (rol === "PASEADOR") {
      const carnetFile = files?.carnet?.[0];
      const antecedentesFile = files?.antecedentes?.[0];

      if (!carnetFile || !antecedentesFile) {
        return res.status(400).json({
          error: "Para rol PASEADOR es obligatorio adjuntar 'carnet' y 'antecedentes'.",
        });
      }

      // Subir a Cloudinary SOLO si hay archivos
      const carnetRes = await uploadBufferToCloudinary(
        carnetFile.buffer,
        "paws/uploads/carnet",
        carnetFile.originalname,
        carnetFile.mimetype
      );
      const antecedentesRes = await uploadBufferToCloudinary(
        antecedentesFile.buffer,
        "paws/uploads/antecedentes",
        antecedentesFile.originalname,
        antecedentesFile.mimetype
      );

      carnetIdentidad = carnetRes.secure_url;
      antecedentes = antecedentesRes.secure_url;
    }

    // ¿ya existe?
    const existing = await prisma.usuario.findUnique({
      where: { correo: emailNorm },
    });
    if (existing) return res.status(409).json({ error: "Usuario ya existe" });

    const passwordHash = await bcrypt.hash(String(clave), 10);

    const newUser = await prisma.usuario.create({
      data: {
        rut,
        nombre,
        apellido,
        telefono,
        comuna,
        correo: emailNorm,
        passwordHash,
        rol, // ojo con acentos si usas enum en DB
        carnetIdentidad,
        antecedentes,
      },
      select: {
        idUsuario: true,
        nombre: true,
        correo: true,
        rol: true,
        carnetIdentidad: true,
        antecedentes: true,
      },
    });

    return res.status(201).json({ user: newUser });
  } catch (error) {
    console.error("Register error", error);
    return res.status(500).json({ error: "Error interno" });
  }
};


// POST Auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, remember } = req.body as {
      email?: string;
      password?: string;
      remember?: boolean;
    };

    if (!email || !password) {
      return res.status(400).json({ error: "Correo y contraseña son obligatorios" });
    }

    const emailNorm = email.trim().toLowerCase();
    const user = await prisma.usuario.findUnique({
      where: { correo: emailNorm },
      select: {
        idUsuario: true,
        nombre: true,
        correo: true,
        passwordHash: true,
        rol:true,
      },
    });

    if (!user) {
      // Dummy compare para timing safe
      await bcrypt.compare(password, "$2b$10$invalidinvalidinvalidinvalidinv12345678901234567890");
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Credenciales inválidas" });

    // 1) Access Token (corto)
    const at = signAccessToken({
      id: user.idUsuario,
      email: user.correo,
      nombreUsuario: user.nombre,
      rol: user.rol
    });
    

    // 2) Refresh Token (cookie httpOnly) + registro en DB
    const rememberFlag = Boolean(remember);
    const days = rememberFlag ? REFRESH_REMEMBER_DAYS : REFRESH_DAYS;

    const rt = generateRT();         // valor que va a cookie
    const rtDigest = hashRT(rt);     // hash que guardamos en DB

    // userAgent / ip como string | null (no undefined)
    const userAgent: string | null = req.get("user-agent") ?? null;
    const ip: string | null = (req.ip ?? req.socket?.remoteAddress ?? null) as string | null;

    await prisma.refreshToken.create({
      data: {
        userId: user.idUsuario,
        rtHash: rtDigest,
        expiresAt: addDays(days),
        userAgent, // string | null
        ip,        // string | null
      },
    });

    // Setear cookie httpOnly
    setRefreshCookie(res, rt, days);

    const { passwordHash, ...safeUser } = user;
    console.log(user)
    console.log(at)
    return res.json({ token: at, user: { ...safeUser }, remember: rememberFlag });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const rt = (req as any).cookies?.rt as string | undefined;
    if (rt) {
      const digest = hashRT(rt);
      const row = await prisma.refreshToken.findFirst({ where: { rtHash: digest } });
      if (row && !row.revokedAt) {
        await prisma.refreshToken.update({
          where: { id: row.id },
          data: { revokedAt: new Date() },
        });
      }
    }
    clearRefreshCookie(res);
    return res.json({ ok: true });
  } catch (error) {
    console.error("logout error:", error);
    return res.status(500).json({ error: "Error interno" });
  }
};


// POST /auth/refresh
// Valida por COOKIE httpOnly `rt`, rota el RT y devuelve nuevo Access Token
export const refresh = async (req: Request, res: Response) => {
  try {
    const rt = (req as any).cookies?.rt as string | undefined;
    if (!rt) return res.status(401).json({ error: "Sin refresh token" });

    const digest = hashRT(rt);
    const row = await prisma.refreshToken.findFirst({
      where: { rtHash: digest },
      include: { user: true },
    });

    if (!row) {
      clearRefreshCookie(res);
      return res.status(401).json({ error: "Refresh inválido" });
    }

    if (row.revokedAt) {
      await prisma.refreshToken.updateMany({
        where: { userId: row.userId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
      clearRefreshCookie(res);
      return res.status(401).json({ error: "Refresh revocado" });
    }

    if (row.expiresAt.getTime() <= Date.now()) {
      clearRefreshCookie(res);
      return res.status(401).json({ error: "Refresh expirado" });
    }

    if (!row.user) {
      await prisma.refreshToken.update({
        where: { id: row.id },
        data: { revokedAt: new Date() },
      });
      clearRefreshCookie(res);
      return res.status(403).json({ error: "Usuario deshabilitado" });
    }

    const rememberParam = parseRemember(req.query.remember);
    const days = rememberParam ? REFRESH_REMEMBER_DAYS : REFRESH_DAYS;

    // ROTACIÓN: revocar actual y emitir nuevo
    const newRt = generateRT();
    const newDigest = hashRT(newRt);

    // userAgent / ip como string | null
    const ua: string | null = req.get("user-agent") ?? null;
    const ipAddr: string | null = (req.ip ?? req.socket?.remoteAddress ?? null) as string | null;

    await prisma.$transaction(async (tx: any) => {
      await tx.refreshToken.update({
        where: { id: row.id },
        data: { revokedAt: new Date() },
      });
      await tx.refreshToken.create({
        data: {
          userId: row.userId,
          rtHash: newDigest,
          expiresAt: addDays(days),
          userAgent: ua,   // string | null
          ip: ipAddr,      // string | null
          replacedByTokenId: row.id,
        },
      });
    });

    setRefreshCookie(res, newRt, days);

    const at = signAccessToken({
      id: row.user.idUsuario,
      email: row.user.correo,
      nombreUsuario: row.user.nombre,
      rol: row.user.rol
    });

    return res.json({ token: at, remember: rememberParam });
  } catch (e) {
    console.error("refresh error:", e);
    clearRefreshCookie(res);
    return res.status(401).json({ error: "Refresh inválido" });
  }
};

// controllers/authController.ts (continuación)


export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autorizado" });

    const user = await prisma.usuario.findUnique({
      where: { idUsuario: req.user.id },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        rut: true,
        telefono: true,
        correo: true,
        rol:true
      },
    });

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.json(user);
  } catch (error) {
    console.error("Error en /auth/profile", error);
    res.status(500).json({ error: "Error interno" });
  }
};


// Map en memoria: clave SIEMPRE normalizada
const verificationCodes = new Map<string, { code: number; expires: number }>();

// helper: normalizar correo
const norm = (v: string) => String(v || "").trim().toLowerCase();
const clean = (v?: string) => (v ?? "").replace(/^[\'"]|[\'"]$/g, "").trim();

// === ENV ===
const GMAIL_CLIENT_ID     = clean(process.env.GMAIL_CLIENT_ID);
const GMAIL_CLIENT_SECRET = clean(process.env.GMAIL_CLIENT_SECRET);
const GMAIL_REDIRECT_URI  = clean(process.env.GMAIL_REDIRECT_URI || "https://developers.google.com/oauthplayground");
const GMAIL_REFRESH_TOKEN = clean(process.env.GMAIL_REFRESH_TOKEN);
const FROM_EMAIL          = clean(process.env.FROM_EMAIL || "soporte.pawsatroute@gmail.com");

// Cliente OAuth2
function makeOAuth2Client() {
  const oAuth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    GMAIL_REDIRECT_URI
  );
  if (GMAIL_REFRESH_TOKEN) {
    oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
  }
  return oAuth2Client;
}
function b64url(input: string | Buffer) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}


// RFC 2047 para headers con UTF-8 (Subject, etc.)
function encodeHeaderUTF8(s: string) {
  return `=?UTF-8?B?${Buffer.from(s, "utf8").toString("base64")}?=`;
}

function buildRawMessage({
  from,
  to,
  subject,
  text,
  replyTo,
}: {
  from: string;
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}) {
  const CRLF = "\r\n";

  const headers =
    `From: ${from}${CRLF}` +
    `To: ${to}${CRLF}` +
    `Subject: ${encodeHeaderUTF8(subject)}${CRLF}` +  // <— asunto UTF-8 correcto
    `MIME-Version: 1.0${CRLF}` +
    `Content-Type: text/plain; charset="UTF-8"${CRLF}` +
    `Content-Transfer-Encoding: base64${CRLF}` +
    (replyTo ? `Reply-To: ${replyTo}${CRLF}` : "") +
    CRLF;

  const bodyB64 = Buffer.from(text, "utf8").toString("base64"); // <— cuerpo UTF-8

  return b64url(headers + bodyB64); // <— lo mismo que hacías, pero correctamente codificado
}


// === ENVÍO POR GMAIL API (HTTPS), sin Nodemailer ni SMTP ===
export async function sendRecoveryEmail(correo: string, code: number) {
  if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !FROM_EMAIL) {
    console.warn("[GMAIL] Faltan env vars OAuth2. Simulando envío.", { correo, code });
    return;
  }

  const auth = makeOAuth2Client();
  const gmail = google.gmail({ version: "v1", auth });

  const raw = buildRawMessage({
    from: `Paws At Route <${FROM_EMAIL}>`, // puede ser "Nombre <cuenta@gmail.com>"
    to: correo,
    subject: "Recuperación de contraseña - Código de verificación",
    text: `Tu código de verificación es: ${code}. Es válido por 10 minutos.`,
    // replyTo: FROM_EMAIL, // opcional
  });

  const res = await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw },
  });

  console.log("[GMAIL] enviado OK, messageId:", res.data.id);
}

// --- 1) Enviar código
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const raw = req.body?.correo;
    if (!raw) return res.status(400).json({ message: "Correo requerido" });

    const correo = norm(raw);

    // Generar y guardar (10 min)
    const code = Math.floor(100000 + Math.random() * 900000);
    verificationCodes.set(correo, { code, expires: Date.now() + 10 * 60 * 1000 });

    // Responder de inmediato
    res.status(200).json({ message: "Código generado. Revisa tu correo." });

    // Enviar en background
    (async () => {
      try {
        console.log("[AUTH] Generando código para:", correo);
        await sendRecoveryEmail(correo, code);
        console.log("[AUTH] Email disparado a:", correo);
      } catch (err) {
        console.error("sendRecoveryEmail error:", err);
      }
    })();
  } catch (error) {
    console.error("sendVerificationCode error:", error);
    if (!res.headersSent) res.status(500).json({ message: "Error al generar código" });
  }
};


// --- 2) Verificar código
export const verifyCode = (req: Request, res: Response) => {
  const correo = norm(req.body?.correo);
  const codigo = Number(req.body?.codigo);

  if (!correo || !codigo) return res.status(400).json({ message: "Datos requeridos" });

  const record = verificationCodes.get(correo);
  if (!record) return res.status(400).json({ message: "Código no encontrado" });
  if (Date.now() > record.expires) {
    verificationCodes.delete(correo);
    return res.status(400).json({ message: "Código expirado" });
  }
  if (record.code !== codigo) return res.status(400).json({ message: "Código incorrecto" });

  return res.json({ message: "Código verificado" });
};

// --- 3) Reset password
export const resetPassword = async (req: Request, res: Response) => {
  const correo = norm(req.body?.correo);
  const nuevaClave = String(req.body?.nuevaClave || "");

  if (!correo || !nuevaClave) {
    return res.status(400).json({ error: "Correo y nueva clave son obligatorios" });
  }

  try {
    const user = await prisma.usuario.findUnique({ where: { correo } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const newPasswordHash = await bcrypt.hash(nuevaClave, 10);

    await prisma.usuario.update({
      where: { correo },
      data: { passwordHash: newPasswordHash },
    });

    // Limpia el código temporal usando la MISMA clave normalizada
    verificationCodes.delete(correo);

    // Invalidar RT activos (opcional)
    await prisma.refreshToken.updateMany({
      where: { userId: user.idUsuario, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error);
    return res.status(500).json({ error: "Error interno" });
  }
};
/** Util: combina una fecha (YYYY-MM-DD) con una hora (HH:mm[:ss]) a un Date */
function combineDateTime(fechaISO: string | Date, horaISO: string | Date) {
  const d = new Date(fechaISO);
  const h = new Date(horaISO);
  const out = new Date(d);
  out.setHours(h.getHours(), h.getMinutes(), h.getSeconds(), 0);
  return out;
}
function addMinutes(base: Date, minutes: number) {
  return new Date(base.getTime() + minutes * 60 * 1000);
}

/** POST /paseos (solo DUEÑO) */
export const crearPaseo = async (req: Request, res: Response) => {
  try {
    const { mascotaId, fecha, hora, duracion, lugarEncuentro, notas } = req.body;
    console.log(req.body);
    console.log(req.user);
    // userId desde el token (ajusta según tu middleware)
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    if (req.user.rol !== "DUEÑO") {
      return res.status(403).json({ error: "Solo DUEÑO puede crear paseos" });
  }
    const authUserId = Number(req.user.id);
    
    // Validaciones básicas
    if (![mascotaId, fecha, hora, duracion, lugarEncuentro].every(Boolean)) {
      return res.status(400).json({ error: "Campos obligatorios: mascotaId, fecha, hora, duracion, lugarEncuentro" });
    }
    const mascotaIdInt = Number(mascotaId);
    const duracionInt = Number(duracion);
    if (Number.isNaN(mascotaIdInt) || Number.isNaN(duracionInt)) {
      return res.status(400).json({ error: "mascotaId y duracion deben ser números válidos" });
    }

    // Traer mascota y verificar dueño
    const mascota = await prisma.mascota.findUnique({
      where: { idMascota: mascotaIdInt },
      select: { idMascota: true, usuarioId: true },
    });
    if (!mascota) return res.status(404).json({ error: "Mascota no encontrada" });
    if (Number(mascota.usuarioId) !== authUserId) {
  return res.status(403).json({ error: "No puedes crear paseos para mascotas de otro dueño" });
}

    // Normalizar fecha/hora
    const fechaDate = new Date(`${fecha}T00:00:00.000Z`);
    const horaDate  = new Date(`${fecha}T${hora}:00.000Z`);
    if (Number.isNaN(fechaDate.getTime()) || Number.isNaN(horaDate.getTime())) {
      return res.status(400).json({ error: "Formato de fecha/hora inválido. Usa fecha='YYYY-MM-DD' y hora='HH:mm'." });
    }

    // Crear paseo: paseadorId queda null, estado PENDIENTE
    const paseo = await prisma.paseo.create({
      data: {
        mascotaId: mascota.idMascota,
        duenioId: mascota.usuarioId,      // inferido de la mascota
        // paseadorId: null 
        fecha: fechaDate,
        hora: horaDate,
        duracion: duracionInt,
        lugarEncuentro: String(lugarEncuentro),
        estado: "PENDIENTE",
        ...(notas ? { notas: String(notas) } : {}),
      },
      select: {
        idPaseo: true, mascotaId: true, duenioId: true, paseadorId: true,
        fecha: true, hora: true, duracion: true, lugarEncuentro: true, estado: true, notas: true
      },
    });

    return res.status(201).json({ paseo });
  } catch (error: any) {
    console.error("[crearPaseo] Error:", error);
    return res.status(500).json({ error: `Error interno al crear el paseo: ${error.message || error}` });
  }
};


/** GET /api/paseos */
export const listPaseos = async (req: Request, res: Response) => {
  try {
    const estado = req.query.estado as EstadoPaseo | undefined;
    const mias = String(req.query.mias || "false") === "true";
    const disponibles = String(req.query.disponibles || "false") === "true";

    const desde = req.query.desde ? new Date(String(req.query.desde)) : undefined;
    const hasta = req.query.hasta ? new Date(String(req.query.hasta)) : undefined;

    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const where: any = {};

    if (estado) where.estado = estado;

    if (desde || hasta) {
      where.fecha = {};
      if (desde) where.fecha.gte = desde;
      if (hasta) where.fecha.lte = hasta;
    }

    if (disponibles) {
      // Paseos sin asignar (nuestro placeholder 0)
      where.paseadorId = 0;
      where.estado = "PENDIENTE";
    }

    if (mias && req.user) {
      if (req.user.rol === "DUEÑO") {
        where.duenioId = req.user.id;
      } else if (req.user.rol === "PASEADOR") {
        where.paseadorId = req.user.id;
      }
    }

    const [items, total] = await Promise.all([
      prisma.paseo.findMany({
        where,
        orderBy: [{ fecha: "asc" }, { hora: "asc" }],
        skip,
        take,
        select: {
          idPaseo: true,
          mascotaId: true,
          duenioId: true,
          paseadorId: true,
          fecha: true,
          hora: true,
          duracion: true,
          lugarEncuentro: true,
          estado: true,
          notas: true,
          mascota: { select: { nombre: true, especie: true, raza: true } },
        },
      }),
      prisma.paseo.count({ where }),
    ]);

    return res.json({
      page,
      pageSize,
      total,
      items,
    });
  } catch (e) {
    console.error("listPaseos error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
};

/** POST /api/paseos/:id/accept  (solo PASEADOR) */
export const acceptPaseo = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    if (req.user.rol !== "PASEADOR") {
      return res.status(403).json({ error: "Solo PASEADOR puede aceptar paseos" });
    }

    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Id de paseo inválido" });

    // Leer paseo actual
    const paseo = await prisma.paseo.findUnique({
      where: { idPaseo: id },
      select: {
        idPaseo: true,
        estado: true,
        paseadorId: true,
        fecha: true,
        hora: true,
        duracion: true,
      },
    });

    if (!paseo) return res.status(404).json({ error: "Paseo no encontrado" });
    if (paseo.estado !== "PENDIENTE") {
      return res.status(409).json({ error: "El paseo ya no está disponible" });
    }
    if (paseo.paseadorId != null) {
  return res.status(409).json({ error: "El paseo ya fue asignado" });
}

    // Chequeo de solapamiento con otros paseos del paseador
    const start = combineDateTime(paseo.fecha, paseo.hora);
    const end = addMinutes(start, paseo.duracion);

    // Traer paseos del paseador el mismo día en estados críticos
    const sameDayStart = new Date(paseo.fecha);
    sameDayStart.setHours(0, 0, 0, 0);
    const sameDayEnd = new Date(paseo.fecha);
    sameDayEnd.setHours(23, 59, 59, 999);

    const posiblesConflictos = await prisma.paseo.findMany({
      where: {
        paseadorId: req.user.id,
        estado: { in: ["ACEPTADO", "EN_CURSO"] },
        fecha: { gte: sameDayStart, lte: sameDayEnd },
      },
      select: { fecha: true, hora: true, duracion: true, idPaseo: true },
    });

    const overlap = posiblesConflictos.some((p) => {
      const s = combineDateTime(p.fecha, p.hora);
      const e = addMinutes(s, p.duracion);
      return s < end && start < e; // solape si rangos se cruzan
    });

    if (overlap) {
      return res.status(409).json({ error: "Tienes un paseo que se solapa en ese horario" });
    }

    // Concurrencia: aceptar solo si sigue PENDIENTE y paseadorId=0
   const updated = await prisma.paseo.updateMany({
  where: { idPaseo: id, estado: "PENDIENTE", paseadorId: null },
  data : { estado: "ACEPTADO", paseadorId: req.user.id },
});

    if (updated.count === 0) {
      return res.status(409).json({ error: "Otro paseador tomó este paseo" });
    }

    const result = await prisma.paseo.findUnique({
      where: { idPaseo: id },
      select: {
        idPaseo: true,
        mascotaId: true,
        duenioId: true,
        paseadorId: true,
        fecha: true,
        hora: true,
        duracion: true,
        lugarEncuentro: true,
        estado: true,
        notas: true,
      },
    });

    return res.json({ paseo: result });
  } catch (e) {
    console.error("acceptPaseo error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const createMascota = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    if (req.user.rol !== "DUEÑO") {
      return res.status(403).json({ error: "Solo usuarios con rol DUEÑO pueden crear mascotas" });
    }

    const nombre = String(req.body?.nombre ?? "").trim();
    const especie = String(req.body?.especie ?? "").trim();
    const raza = String(req.body?.raza ?? "").trim();
    const edadNum = Number(req.body?.edad);

    if (!nombre || !especie || !raza || Number.isNaN(edadNum)) {
      return res.status(400).json({ error: "nombre, especie, raza y edad son obligatorios" });
    }
    if (edadNum < 0) {
      return res.status(400).json({ error: "edad debe ser >= 0" });
    }

    try {
      const mascota = await prisma.$transaction(async (tx) => {
        const count = await tx.mascota.count({ where: { usuarioId: req.user!.id } });
        if (count >= 3) {
          // Lanzamos un error controlado para cortar la transacción
          const err = new Error("LIMITE_MASCOTAS");
          // @ts-expect-error mark
          err.code = "LIMITE_MASCOTAS";
          throw err;
        }

        return tx.mascota.create({
          data: {
            usuarioId: req.user!.id,
            nombre,
            especie,
            raza,
            edad: edadNum,
          },
          select: {
            idMascota: true,
            usuarioId: true,
            nombre: true,
            especie: true,
            raza: true,
            edad: true,
          },
        });
      });

      return res.status(201).json({ mascota });
    } catch (e: any) {
      if (e?.code === "LIMITE_MASCOTAS") {
        return res.status(409).json({ error: "Has alcanzado el máximo de 3 mascotas por usuario" });
      }
      throw e;
    }
  } catch (error) {
    console.error("createMascota error:", error);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const getMisMascotas = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    if (req.user.rol !== "DUEÑO") {
      return res.status(403).json({ error: "Solo DUEÑO puede ver sus mascotas" });
    }

    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize || 20)));
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.mascota.findMany({
        where: { usuarioId: req.user.id },
        select: { idMascota: true, nombre: true, especie: true, raza: true, edad: true },
        orderBy: { idMascota: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.mascota.count({ where: { usuarioId: req.user.id } }),
    ]);

    return res.json({ page, pageSize, total, items });
  } catch (error) {
    console.error("getMisMascotas error:", error);
    return res.status(500).json({ error: "Error interno" });
  }
};


/** GET /api/usuarios/:duenioId/mascotas  (solo el propio dueño) */
export const getMascotasByDuenio = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autorizado" });

    const duenioId = Number(req.params.duenioId);
    if (!duenioId) return res.status(400).json({ error: "duenioId inválido" });

    // Solo el dueño puede leer sus propias mascotas
    if (req.user.rol !== "DUEÑO" || req.user.id !== duenioId) {
      return res.status(403).json({ error: "No tienes permiso para ver estas mascotas" });
    }

    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize || 20)));
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.mascota.findMany({
        where: { usuarioId: duenioId },
        select: { idMascota: true, nombre: true, especie: true, raza: true, edad: true },
        orderBy: { idMascota: "asc" },
        skip,
        take: pageSize,
      }),
      prisma.mascota.count({ where: { usuarioId: duenioId } }),
    ]);

    return res.json({ page, pageSize, total, items });
  } catch (error) {
    console.error("getMascotasByDuenio error:", error);
    return res.status(500).json({ error: "Error interno" });
  }
};
