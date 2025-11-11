import type { Request, Response } from "express";
import { EstadoPaseo, Prisma, PrismaClient, Rol } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { uploadBufferToCloudinary } from "../lib/cloudinary";
import { gmailSendText } from "../lib/mailer";
import dns from "dns";
dns.setDefaultResultOrder("ipv4first");



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
    const {
      rut,
      nombre,
      apellido,
      telefono,
      comuna,
      correo,
      clave,
      rol,             // ← llega como string: "PASEADOR" | "DUEÑO"
    } = req.body;

    if (!rut || !nombre || !apellido || !telefono || !comuna || !correo || !clave || !rol) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const emailNorm = String(correo).trim().toLowerCase();

    const statusFlag = rol === "DUEÑO";

    // ---- archivos sólo si es PASEADOR ----
    const files = (req as any).files as
      | { carnet?: Express.Multer.File[]; antecedentes?: Express.Multer.File[] }
      | undefined;

    let carnetIdentidad: string | null = null;
    let antecedentes: string | null = null;

    if (rol === "PASEADOR") {
      const carnetFile = files?.carnet?.[0];
      const antecedentesFile = files?.antecedentes?.[0];
      if (!carnetFile || !antecedentesFile) {
        return res.status(400).json({
          error: "Para rol PASEADOR es obligatorio adjuntar 'carnet' y 'antecedentes'.",
        });
      }

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

carnetIdentidad = carnetRes.secure_url;  // termina en .pdf
antecedentes   = antecedentesRes.secure_url;
    }

    // ---- existencia ----
    const existing = await prisma.usuario.findUnique({ where: { correo: emailNorm } });
    if (existing) return res.status(409).json({ error: "Usuario ya existe" });

    const passwordHash = await bcrypt.hash(String(clave), 10);

    // ---- create con status según el rol ----
    const newUser = await prisma.usuario.create({
      data: {
        rut,
        nombre,
        apellido,
        telefono,
        comuna,
        correo: emailNorm,
        passwordHash,
        rol: rol as Rol,     // ← usa directamente "PASEADOR" | "DUEÑO"
        status: statusFlag,  // ← true si DUEÑO, false si PASEADOR
        carnetIdentidad,
        antecedentes,
      },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        rol: true,
        status: true,
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
        apellido: true,
        telefono: true,
        rut: true,
        correo: true,
        passwordHash: true,
        status: true,
        comuna: true,
        rol:true,
      },
    });

    if (!user || !user.status ) {
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
        comuna: true,
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


export async function sendRecoveryEmail(correo: string, code: number) {
  const subject = "Recuperación de contraseña - Código de verificación";
  const text = `Tu código de verificación es: ${code}. Es válido por 10 minutos.`;

  try {
    const r = await gmailSendText({ to: correo, subject, text });
    console.log("[GMAIL] enviado OK, messageId:", r.id);
  } catch (err) {
    console.error("[GMAIL] error:", err);
    // no relances si lo llamas en background
  }
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
export const crearPaseo = async (req: Request, res: Response) => {
  console.log(
  "[DMMF Paseo]\n",
  JSON.stringify(Prisma.dmmf.datamodel.models.find(m => m.name === "Paseo"), null, 2)
);
  try {
    const {
      mascotaId,        // number|string
      duenioId,         // number|string
      fecha,            // "YYYY-MM-DD" o ISO
      hora,             // "HH:mm" o ISO
      duracion,         // number|string
      lugarEncuentro,
      notas,
      estado,           // opcional
      paseadorId,       // opcional number|string
    } = req.body;

    if (!mascotaId || !duenioId || !fecha || !hora || !duracion || !lugarEncuentro) {
      return res.status(400).json({ error: "mascotaId, duenioId, fecha, hora, duracion y lugarEncuentro son obligatorios" });
    }

    const mascotaIdInt  = Number(mascotaId);
    const duenioIdInt   = Number(duenioId);
    const duracionInt   = Number(duracion);
    if ([mascotaIdInt, duenioIdInt, duracionInt].some(Number.isNaN)) {
      return res.status(400).json({ error: "IDs y duración deben ser números válidos" });
    }

    const fechaBase = parseFecha(fecha);
    if (!fechaBase) return res.status(400).json({ error: "Formato de fecha inválido" });
    const { fechaDate, horaDate } = parseFechaHora(fechaBase, hora);
    if (!horaDate) return res.status(400).json({ error: "Formato de hora inválido" });

    let estadoValue: EstadoPaseo = EstadoPaseo.PENDIENTE;
    if (estado) {
      if (!Object.values(EstadoPaseo).includes(estado as EstadoPaseo)) {
        return res.status(400).json({ error: `Estado inválido. Usa uno de: ${Object.values(EstadoPaseo).join(", ")}` });
      }
      estadoValue = estado as EstadoPaseo;
    }

    const data = {
   mascota: { connect: { idMascota: mascotaIdInt } },
  duenio:  { connect: { idUsuario: duenioIdInt } },
  ...(paseadorId ? { paseador: { connect: { idUsuario: Number(paseadorId) } } } : {}),
  fecha: fechaDate,
  hora: horaDate,
  duracion: duracionInt,
  lugarEncuentro: String(lugarEncuentro),
  estado: estadoValue,
  ...(notas ? { notas: String(notas) } : {}),
};

const paseo = await prisma.paseo.create({
  data,
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

    return res.status(201).json({ paseo });
  } catch (error: any) {
    console.error("[crearPaseo] Error:", error);
    if (String(error?.code) === "P2003") {
      return res.status(400).json({ error: "Relación inválida: verifica que mascotaId, duenioId y paseadorId existan." });
    }
    return res.status(500).json({ error: `Error interno al crear el paseo: ${error.message || error}` });
  }
};

/** Helpers */
function parseFecha(input: string): Date | null {
  if (!input) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}
function parseFechaHora(fechaBase: Date, hora: string): { fechaDate: Date; horaDate: Date | null } {
  if (!hora) return { fechaDate: fechaBase, horaDate: null };
  const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (hhmm.test(hora)) {
    const [hh, mm] = hora.split(":").map(Number);
    return { fechaDate: fechaBase, horaDate: new Date(fechaBase.getFullYear(), fechaBase.getMonth(), fechaBase.getDate(), hh, mm, 0, 0) };
  }
  const asDate = new Date(hora);
  return isNaN(asDate.getTime()) ? { fechaDate: fechaBase, horaDate: null } : { fechaDate: fechaBase, horaDate: asDate };
}

// GET /api/paseos 
export const listPaseos = async (req: Request, res: Response) => {
  try {
    // flags
    const mias         = String(req.query.mias || "false") === "true";
    const disponibles  = String(req.query.disponibles || "false") === "true";

    // estado (validado contra enum)
    const estadoStr = typeof req.query.estado === "string" ? req.query.estado.toUpperCase() : undefined;
    const estado: EstadoPaseo | undefined =
      estadoStr && (Object.values(EstadoPaseo) as string[]).includes(estadoStr)
        ? (estadoStr as EstadoPaseo)
        : undefined;

    // fechas (acepta "YYYY-MM-DD" o ISO)
    const desde = toDate(String(req.query.desde || ""));
    const hasta = endOfDay(toDate(String(req.query.hasta || "")));

    // paginación
    const page     = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
    const skip     = (page - 1) * pageSize;
    const take     = pageSize;

    // where base
    const where: any = {};

    if (estado) where.estado = estado;

    if (desde || hasta) {
      where.fecha = {};
      if (desde && !isNaN(desde.getTime())) where.fecha.gte = desde;
      if (hasta && !isNaN(hasta.getTime())) where.fecha.lte = hasta;
    }

    if (disponibles) {
      // Paseos sin paseador asignado y (por defecto) PENDIENTE
      where.paseadorId = null;
      if (!where.estado) where.estado = EstadoPaseo.PENDIENTE;
    }

    // Mis paseos (según rol del usuario autenticado)
    const user = (req as any).user as { id: number; rol: Rol } | undefined;
    if (mias && user) {
      if (user.rol === Rol.DUEÑO) {
        where.duenioId = user.id;
      } else if (user.rol === Rol.PASEADOR) {
        where.paseadorId = user.id;
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
          // datos útiles para UI
          mascota:  { select: { nombre: true, especie: true, raza: true } },
          duenio:   { select: { nombre: true, apellido: true } },
          paseador: { select: { nombre: true, apellido: true } },
        },
      }),
      prisma.paseo.count({ where }),
    ]);

    return res.json({ page, pageSize, total, items });
  } catch (e) {
    console.error("listPaseos error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
};

/* Helpers */
function toDate(s?: string) {
  if (!s) return undefined as any;
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d, 0, 0, 0, 0);
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined as any : d;
}
function endOfDay(d?: Date) {
  if (!d || isNaN(d.getTime())) return undefined as any;
  const c = new Date(d);
  c.setHours(23, 59, 59, 999);
  return c;
}
 /** Helpers de tiempo */
function combineDateTime(fecha: Date, hora: Date): Date {
  // fecha y hora vienen como Date (solo fecha / solo hora en tu modelo)
  const f = new Date(fecha);
  const h = new Date(hora);
  return new Date(
    f.getFullYear(),
    f.getMonth(),
    f.getDate(),
    h.getHours(),
    h.getMinutes(),
    h.getSeconds(),
    h.getMilliseconds()
  );
}
function addMinutes(d: Date, mins: number): Date {
  return new Date(d.getTime() + mins * 60_000);
}

// POST /api/auth/paseos/:id/accept  (solo PASEADOR)
export const acceptPaseo = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    if (req.user.rol !== "PASEADOR") {
      return res.status(403).json({ error: "Solo PASEADOR puede aceptar paseos" });
    }

    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) {
      return res.status(400).json({ error: "Id de paseo inválido" });
    }

    // 1) Leer paseo actual
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

    if (paseo.estado !== EstadoPaseo.PENDIENTE) {
      return res.status(409).json({ error: "El paseo ya no está disponible" });
    }

    if (paseo.paseadorId != null) {
      return res.status(409).json({ error: "El paseo ya fue asignado" });
    }

    // 2) Chequeo de solapamiento con otros paseos del paseador en ese día (ACEPTADO / EN_CURSO)
    const start = combineDateTime(paseo.fecha, paseo.hora);
    const end = addMinutes(start, paseo.duracion);

    const sameDayStart = new Date(paseo.fecha);
    sameDayStart.setHours(0, 0, 0, 0);

    const sameDayEnd = new Date(paseo.fecha);
    sameDayEnd.setHours(23, 59, 59, 999);

    const posiblesConflictos = await prisma.paseo.findMany({
      where: {
        paseadorId: req.user.id,
        estado: { in: [EstadoPaseo.ACEPTADO, EstadoPaseo.EN_CURSO] },
        fecha: { gte: sameDayStart, lte: sameDayEnd },
      },
      select: { idPaseo: true, fecha: true, hora: true, duracion: true },
    });

    const overlap = posiblesConflictos.some((p) => {
      const s = combineDateTime(p.fecha, p.hora);
      const e = addMinutes(s, p.duracion);
      return s < end && start < e; // Hay cruce si los rangos se pisan
    });

    if (overlap) {
      return res.status(409).json({ error: "Tienes un paseo que se solapa en ese horario" });
    }

    // 3) Concurrencia fuerte: aceptar solo si sigue PENDIENTE y sin paseador (null)
    const updated = await prisma.paseo.updateMany({
      where: { idPaseo: id, estado: EstadoPaseo.PENDIENTE, paseadorId: null },
      data:  { estado: EstadoPaseo.ACEPTADO, paseadorId: req.user.id },
    });

    if (updated.count === 0) {
      return res.status(409).json({ error: "Otro paseador tomó este paseo" });
    }

    // 4) Devolver la versión actualizada
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
        mascota: { select: { nombre: true, especie: true, raza: true } },
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

export const startPaseo = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    if (req.user.rol !== "PASEADOR") {
      return res.status(403).json({ error: "Solo PASEADOR puede iniciar paseos" });
    }

    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) return res.status(400).json({ error: "Id de paseo inválido" });

    const paseo = await prisma.paseo.findUnique({
      where: { idPaseo: id },
      select: { idPaseo: true, paseadorId: true, estado: true, fecha: true, hora: true, duracion: true },
    });
    if (!paseo) return res.status(404).json({ error: "Paseo no encontrado" });
    if (paseo.paseadorId !== req.user.id) {
      return res.status(403).json({ error: "No eres el paseador asignado" });
    }
    if (paseo.estado !== "ACEPTADO") {
      return res.status(409).json({ error: "Solo se puede iniciar un paseo en estado ACEPTADO" });
    }

    // (opcional) Validación de ventana de inicio (por ej. +/- 2h alrededor)
    // const now = new Date();
    // const start = combineDateTime(paseo.fecha, paseo.hora);
    // if (Math.abs(now.getTime() - start.getTime()) > 2 * 60 * 60 * 1000) { ... }

    const updated = await prisma.paseo.updateMany({
      where: { idPaseo: id, paseadorId: req.user.id, estado: "ACEPTADO" },
      data:  { estado: "EN_CURSO" },
    });
    if (updated.count === 0) {
      return res.status(409).json({ error: "No se pudo iniciar: el estado cambió" });
    }

    const result = await prisma.paseo.findUnique({
      where: { idPaseo: id },
      select: {
        idPaseo: true, mascotaId: true, duenioId: true, paseadorId: true,
        fecha: true, hora: true, duracion: true, lugarEncuentro: true, estado: true, notas: true,
        mascota: { select: { nombre: true, especie: true, raza: true } },
      },
    });

    return res.json({ paseo: result });
  } catch (e) {
    console.error("startPaseo error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const finishPaseo = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: "No autorizado" });
    if (req.user.rol !== "PASEADOR") {
      return res.status(403).json({ error: "Solo PASEADOR puede finalizar paseos" });
    }

    const id = Number(req.params.id);
    if (!id || Number.isNaN(id)) return res.status(400).json({ error: "Id de paseo inválido" });

    const paseo = await prisma.paseo.findUnique({
      where: { idPaseo: id },
      select: { idPaseo: true, paseadorId: true, estado: true },
    });
    if (!paseo) return res.status(404).json({ error: "Paseo no encontrado" });
    if (paseo.paseadorId !== req.user.id) {
      return res.status(403).json({ error: "No eres el paseador asignado" });
    }
    if (paseo.estado !== "EN_CURSO") {
      return res.status(409).json({ error: "Solo se puede finalizar un paseo EN_CURSO" });
    }

    const updated = await prisma.paseo.updateMany({
      where: { idPaseo: id, paseadorId: req.user.id, estado: "EN_CURSO" },
      data:  { estado: "FINALIZADO" },
    });
    if (updated.count === 0) {
      return res.status(409).json({ error: "No se pudo finalizar: el estado cambió" });
    }

    const result = await prisma.paseo.findUnique({
      where: { idPaseo: id },
      select: {
        idPaseo: true, mascotaId: true, duenioId: true, paseadorId: true,
        fecha: true, hora: true, duracion: true, lugarEncuentro: true, estado: true, notas: true,
        mascota: { select: { nombre: true, especie: true, raza: true } },
      },
    });

    return res.json({ paseo: result });
  } catch (e) {
    console.error("finishPaseo error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
};
export const listarPaseadoresPendientes = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.usuario.findMany({
      where: { rol: Rol.PASEADOR, status: false },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        carnetIdentidad: true,
        antecedentes: true,
        status: true,
        rol: true,
      },
      orderBy: { idUsuario: "desc" },
    });
    return res.json({ total: items.length, items });
  } catch (e) {
    console.error("listarPaseadoresPendientes error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
};


// --- Notificaciones por correo ---
async function notifyAprobado(to: string, nombre: string) {
  const subject = "✅ Tu cuenta de Paws At Route fue aprobada";
  const text =
`Hola ${nombre},

¡Buenas noticias! Tu cuenta de Paws At Route ha sido aprobada.
Ya puedes iniciar sesión y comenzar a tomar paseos.

— Equipo Paws At Route`;
  try { await gmailSendText({ to, subject, text }); }
  catch (e) { console.error("[MAIL][APROBADO] error:", e); }
}

async function notifyRechazado(to: string, nombre: string) {
  const subject = "❌ Revisión de cuenta en Paws At Route";
  const text =
`Hola ${nombre},

Revisamos tu solicitud y, por ahora, no ha sido aprobada.
Si crees que es un error o deseas volver a postular, responde a este correo.

— Equipo Paws At Route`;
  try { await gmailSendText({ to, subject, text }); }
  catch (e) { console.error("[MAIL][RECHAZADO] error:", e); }
}

async function notifyStatus(to: string, nombre: string, habilitado: boolean) {
  const subject = habilitado
    ? "✅ Tu cuenta ha sido habilitada"
    : "⏸️ Tu cuenta ha sido deshabilitada";
  const text = habilitado
    ? `Hola ${nombre},

Tu cuenta ha sido habilitada nuevamente. Ya puedes usar la app con normalidad.

— Equipo Paws At Route`
    : `Hola ${nombre},

Tu cuenta ha sido deshabilitada. Si necesitas más información, responde a este correo.

— Equipo Paws At Route`;
  try { await gmailSendText({ to, subject, text }); }
  catch (e) { console.error("[MAIL][STATUS] error:", e); }
}


// PUT /api/admin/paseadores/:idUsuario/aprobar
export const aprobarPaseador = async (req: Request, res: Response) => {
  const idUsuario = Number(req.params.idUsuario);
  if (!Number.isFinite(idUsuario)) return res.status(400).json({ error: "idUsuario inválido" });

  try {
    const user = await prisma.usuario.findUnique({ where: { idUsuario } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (user.rol !== Rol.PASEADOR) {
      return res.status(400).json({ error: "El usuario no es postulante a PASEADOR" });
    }
    if (user.status === true) {
      return res.status(400).json({ error: "El paseador ya está aprobado" });
    }

    const actualizado = await prisma.usuario.update({
      where: { idUsuario },
      data: { status: true },
      select: { idUsuario: true, nombre: true, apellido: true, correo: true, rol: true, status: true },
    });

    // ---- notificar en background (no bloquea la respuesta) ----
    setImmediate(() => notifyAprobado(actualizado.correo, actualizado.nombre));

    return res.json({ ok: true, usuario: actualizado });
  } catch (e) {
    console.error("aprobarPaseador error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
};

// PUT /api/admin/paseadores/:idUsuario/rechazar
export const rechazarPaseador = async (req: Request, res: Response) => {
  const idUsuario = Number(req.params.idUsuario);
  if (!Number.isFinite(idUsuario)) return res.status(400).json({ error: "idUsuario inválido" });

  const revertToDueno = Boolean((req.body ?? {}).revertToDueno);

  try {
    const user = await prisma.usuario.findUnique({ where: { idUsuario } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    if (user.rol !== Rol.PASEADOR) {
      return res.status(400).json({ error: "El usuario no es postulante a PASEADOR" });
    }

    const actualizado = await prisma.usuario.update({
      where: { idUsuario },
      data: revertToDueno ? { status: false, rol: Rol["DUEÑO"] } : { status: false },
      select: { idUsuario: true, nombre: true, apellido: true, correo: true, rol: true, status: true },
    });

    // notificar en background (opcional)
    setImmediate(() => notifyRechazado(actualizado.correo, actualizado.nombre));

    return res.json({ ok: true, usuario: actualizado });
  } catch (e) {
    console.error("rechazarPaseador error:", e);
    return res.status(500).json({ error: "Error interno" });
  }
};

export const listarUsuariosAdmin = async (req: Request, res: Response) => {
  try {
    // filtros opcionales: ?rol=PASEADOR|DUEÑO|ADMIN & ?status=true|false
    const { rol, status, page = "1", pageSize = "20", q } = req.query as {
      rol?: "PASEADOR" | "DUEÑO" | "ADMIN";
      status?: string;
      page?: string;
      pageSize?: string;
      q?: string;
    };

    const p = Math.max(parseInt(page || "1", 10), 1);
    const ps = Math.min(Math.max(parseInt(pageSize || "20", 10), 1), 100);

    const where: any = {};

    if (rol) where.rol = rol;
    if (typeof status === "string") {
      if (status === "true") where.status = true;
      if (status === "false") where.status = false;
    }

    if (q && q.trim()) {
      const s = q.trim();
      where.OR = [
        { nombre:   { contains: s, mode: "insensitive" } },
        { apellido: { contains: s, mode: "insensitive" } },
        { correo:   { contains: s, mode: "insensitive" } },
        { telefono: { contains: s, mode: "insensitive" } },
      ];
    }

    const [total, items] = await Promise.all([
      prisma.usuario.count({ where }),
      prisma.usuario.findMany({
        where,
        skip: (p - 1) * ps,
        take: ps,
        orderBy: { idUsuario: "desc" },
        select: {
          idUsuario: true,
          nombre: true,
          apellido: true,
          correo: true,
          telefono: true,
          rol: true,
          status: true,
          carnetIdentidad: true,
          antecedentes: true,
        },
      }),
    ]);

    return res.json({ total, page: p, pageSize: ps, items });
  } catch (err: any) {
    console.error("listarUsuariosAdmin error:", err);
    return res.status(500).json({ error: "No se pudo listar usuarios" });
  }
};
export const setEstadoUsuarioAdmin = async (req: Request, res: Response) => {
  try {
    const idUsuario = Number(req.params.idUsuario);
    const { status } = req.body as { status?: boolean };

    if (!idUsuario || typeof status !== "boolean") {
      return res.status(400).json({ error: "Parámetros inválidos" });
    }

    const usuario = await prisma.usuario.update({
      where: { idUsuario },
      data: { status },
      select: {
        idUsuario: true,
        nombre: true,
        apellido: true,
        correo: true,
        telefono: true,
        rol: true,
        status: true,
        carnetIdentidad: true,
        antecedentes: true,
      },
    });

    return res.json({ ok: true, usuario });
  } catch (err: any) {
    console.error("setEstadoUsuarioAdmin error:", err);
    if (err.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    return res.status(500).json({ error: "No se pudo actualizar estado" });
  }
};

