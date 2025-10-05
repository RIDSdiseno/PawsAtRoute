import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Secret } from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

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
export const registerUser = async(req:Request,res:Response)=>{
  try{
    const { rut, nombre, apellido, telefono,comuna,correo, clave, rol } = req.body;

    //validaciones basicas
    if(!rut||!nombre || !apellido || !telefono || !comuna|| !correo || !clave || !rol){
      return res.status(400).json({ error: "Todos los campos son obligatorios"})
    }

    //Se normaliza el correo
    const emailNorm = String(correo).trim().toLowerCase();
    const existing = await prisma.usuario.findUnique({ where: {correo: emailNorm}});
    if(existing) return res.status(409).json({ error: "Usuario ya existe" });

    const passwordHash = await bcrypt.hash(clave,10);
    const newUser = await prisma.usuario.create({
      data:{
        rut,
        nombre,
        apellido,
        telefono,
        comuna,
        correo: emailNorm,
        passwordHash,
        rol,
      },
      select: {idUsuario:true,nombre:true,correo:true},
    });
    return res.status(201).json({ user:newUser });
  } catch(error){
    console.error("Register error", error);
    return res.status(500).json({error: "Error interno" });
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

    await prisma.$transaction(async (tx) => {
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

// --- SMTP TRANSPORT (Gmail STARTTLS + timeouts)
async function sendRecoveryEmail(correo: string, code: number) {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    console.warn("[DEV] EMAIL_USER/PASS no seteados. Simulando envío. Código:", code, "->", correo);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,        // STARTTLS
    auth: { user, pass }, // App Password (no la password normal)
    pool: true,
    maxConnections: 2,
    maxMessages: 50,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });

  // Opcional: verificar conexión
  try {
    await transporter.verify();
  } catch (e) {
    console.warn("SMTP verify falló (continuo e intento mandar igual):", e);
  }

  await transporter.sendMail({
    from: `"Paws At Route" <${user}>`,
    to: correo,
    subject: "Recuperación de contraseña - Código de verificación",
    text: `Tu código de verificación es: ${code}. Es válido por 10 minutos.`,
  });
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

    // RESPONDE YA (no bloquees por SMTP)
    res.status(200).json({ message: "Código generado. Revisa tu correo." });

    // Envío en background con timeout de seguridad
    (async () => {
      try {
        const hardTimeout = new Promise((_, rej) =>
          setTimeout(() => rej(new Error("SMTP hard timeout")), 20000)
        );
        await Promise.race([sendRecoveryEmail(correo, code), hardTimeout]);
        console.log("Email de recuperación enviado a:", correo);
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