"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishPaseo = exports.startPaseo = exports.getMascotasByDuenio = exports.getMisMascotas = exports.createMascota = exports.acceptPaseo = exports.listPaseos = exports.crearPaseo = exports.resetPassword = exports.verifyCode = exports.sendVerificationCode = exports.getProfile = exports.refresh = exports.logout = exports.login = exports.registerUser = void 0;
exports.sendRecoveryEmail = sendRecoveryEmail;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const googleapis_1 = require("googleapis");
const dotenv_1 = __importDefault(require("dotenv"));
const cloudinary_1 = require("../lib/cloudinary");
dotenv_1.default.config();
const codes = new Map();
const prisma = new client_1.PrismaClient;
/* =========================
   CONFIG / CONSTANTES
========================= */
// JWT para Access Token (corto)
const JWT_SECRET = process.env.JWT_SECRET ?? "dev_secret"; // cambia en prod
const ACCESS_EXPIRES_SEC = Number(process.env.JWT_ACCESS_EXPIRES_SECONDS ?? 15 * 60); // 15 min
// Refresh Token (cookie) duración
const REFRESH_DAYS = Number(process.env.REFRESH_DAYS ?? 7); // sin "recordarme"
const REFRESH_REMEMBER_DAYS = Number(process.env.REFRESH_REMEMBER_DAYS ?? 60); // con "recordarme"
// Cookies (ajusta en prod)
const COOKIE_SECURE = String(process.env.COOKIE_SECURE ?? "false") === "true";
const COOKIE_SAMESITE = process.env.COOKIE_SAMESITE ?? "lax";
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;
// muy importante si tus rutas están bajo /api/auth
const COOKIE_PATH = process.env.COOKIE_PATH ?? "/api/auth";
/* =========================
   HELPERS
========================= */
// Access Token (JWT)
function signAccessToken(payload, expiresInSec = ACCESS_EXPIRES_SEC) {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: expiresInSec });
}
// Refresh Token aleatorio + hash SHA-256 (se guarda sólo el hash)
function generateRT() {
    return crypto_1.default.randomBytes(64).toString("base64url");
}
function hashRT(rt) {
    return crypto_1.default.createHash("sha256").update(rt).digest("hex");
}
function addDays(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d;
}
function parseRemember(v) {
    if (typeof v === "boolean")
        return v;
    if (typeof v === "string")
        return v.toLowerCase() === "true";
    return false;
}
function setRefreshCookie(res, rt, days) {
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
function clearRefreshCookie(res) {
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
const registerUser = async (req, res) => {
    try {
        console.log("[register] isMultipart?", req.is("multipart/form-data"));
        console.log("[register] body keys:", Object.keys(req.body || {}));
        console.log("[register] files:", req.files);
        const { rut, nombre, apellido, telefono, comuna, correo, clave, rol, } = req.body;
        const files = req.files;
        if (!rut || !nombre || !apellido || !telefono || !comuna || !correo || !clave || !rol) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
        const emailNorm = String(correo).trim().toLowerCase();
        let carnetIdentidad = null;
        let antecedentes = null;
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
            const carnetRes = await (0, cloudinary_1.uploadBufferToCloudinary)(carnetFile.buffer, "paws/uploads/carnet", carnetFile.originalname, carnetFile.mimetype);
            const antecedentesRes = await (0, cloudinary_1.uploadBufferToCloudinary)(antecedentesFile.buffer, "paws/uploads/antecedentes", antecedentesFile.originalname, antecedentesFile.mimetype);
            carnetIdentidad = carnetRes.secure_url;
            antecedentes = antecedentesRes.secure_url;
        }
        // ¿ya existe?
        const existing = await prisma.usuario.findUnique({
            where: { correo: emailNorm },
        });
        if (existing)
            return res.status(409).json({ error: "Usuario ya existe" });
        const passwordHash = await bcrypt_1.default.hash(String(clave), 10);
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
    }
    catch (error) {
        console.error("Register error", error);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.registerUser = registerUser;
// POST Auth/login
const login = async (req, res) => {
    try {
        const { email, password, remember } = req.body;
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
                rol: true,
            },
        });
        if (!user) {
            // Dummy compare para timing safe
            await bcrypt_1.default.compare(password, "$2b$10$invalidinvalidinvalidinvalidinv12345678901234567890");
            return res.status(401).json({ error: "Credenciales inválidas" });
        }
        const ok = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ error: "Credenciales inválidas" });
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
        const rt = generateRT(); // valor que va a cookie
        const rtDigest = hashRT(rt); // hash que guardamos en DB
        // userAgent / ip como string | null (no undefined)
        const userAgent = req.get("user-agent") ?? null;
        const ip = (req.ip ?? req.socket?.remoteAddress ?? null);
        await prisma.refreshToken.create({
            data: {
                userId: user.idUsuario,
                rtHash: rtDigest,
                expiresAt: addDays(days),
                userAgent, // string | null
                ip, // string | null
            },
        });
        // Setear cookie httpOnly
        setRefreshCookie(res, rt, days);
        const { passwordHash, ...safeUser } = user;
        console.log(user);
        console.log(at);
        return res.json({ token: at, user: { ...safeUser }, remember: rememberFlag });
    }
    catch (err) {
        console.error("login error:", err);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        const rt = req.cookies?.rt;
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
    }
    catch (error) {
        console.error("logout error:", error);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.logout = logout;
// POST /auth/refresh
// Valida por COOKIE httpOnly `rt`, rota el RT y devuelve nuevo Access Token
const refresh = async (req, res) => {
    try {
        const rt = req.cookies?.rt;
        if (!rt)
            return res.status(401).json({ error: "Sin refresh token" });
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
        const ua = req.get("user-agent") ?? null;
        const ipAddr = (req.ip ?? req.socket?.remoteAddress ?? null);
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
                    userAgent: ua, // string | null
                    ip: ipAddr, // string | null
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
    }
    catch (e) {
        console.error("refresh error:", e);
        clearRefreshCookie(res);
        return res.status(401).json({ error: "Refresh inválido" });
    }
};
exports.refresh = refresh;
// controllers/authController.ts (continuación)
const getProfile = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autorizado" });
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
                rol: true
            },
        });
        if (!user)
            return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(user);
    }
    catch (error) {
        console.error("Error en /auth/profile", error);
        res.status(500).json({ error: "Error interno" });
    }
};
exports.getProfile = getProfile;
// Map en memoria: clave SIEMPRE normalizada
const verificationCodes = new Map();
// helper: normalizar correo
const norm = (v) => String(v || "").trim().toLowerCase();
const clean = (v) => (v ?? "").replace(/^[\'"]|[\'"]$/g, "").trim();
// === ENV ===
const GMAIL_CLIENT_ID = clean(process.env.GMAIL_CLIENT_ID);
const GMAIL_CLIENT_SECRET = clean(process.env.GMAIL_CLIENT_SECRET);
const GMAIL_REDIRECT_URI = clean(process.env.GMAIL_REDIRECT_URI || "https://developers.google.com/oauthplayground");
const GMAIL_REFRESH_TOKEN = clean(process.env.GMAIL_REFRESH_TOKEN);
const FROM_EMAIL = clean(process.env.FROM_EMAIL || "soporte.pawsatroute@gmail.com");
// Cliente OAuth2
function makeOAuth2Client() {
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REDIRECT_URI);
    if (GMAIL_REFRESH_TOKEN) {
        oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
    }
    return oAuth2Client;
}
function b64url(input) {
    return Buffer.from(input)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/g, "");
}
// RFC 2047 para headers con UTF-8 (Subject, etc.)
function encodeHeaderUTF8(s) {
    return `=?UTF-8?B?${Buffer.from(s, "utf8").toString("base64")}?=`;
}
function buildRawMessage({ from, to, subject, text, replyTo, }) {
    const CRLF = "\r\n";
    const headers = `From: ${from}${CRLF}` +
        `To: ${to}${CRLF}` +
        `Subject: ${encodeHeaderUTF8(subject)}${CRLF}` + // <— asunto UTF-8 correcto
        `MIME-Version: 1.0${CRLF}` +
        `Content-Type: text/plain; charset="UTF-8"${CRLF}` +
        `Content-Transfer-Encoding: base64${CRLF}` +
        (replyTo ? `Reply-To: ${replyTo}${CRLF}` : "") +
        CRLF;
    const bodyB64 = Buffer.from(text, "utf8").toString("base64"); // <— cuerpo UTF-8
    return b64url(headers + bodyB64); // <— lo mismo que hacías, pero correctamente codificado
}
// === ENVÍO POR GMAIL API (HTTPS), sin Nodemailer ni SMTP ===
async function sendRecoveryEmail(correo, code) {
    if (!GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN || !FROM_EMAIL) {
        console.warn("[GMAIL] Faltan env vars OAuth2. Simulando envío.", { correo, code });
        return;
    }
    const auth = makeOAuth2Client();
    const gmail = googleapis_1.google.gmail({ version: "v1", auth });
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
const sendVerificationCode = async (req, res) => {
    try {
        const raw = req.body?.correo;
        if (!raw)
            return res.status(400).json({ message: "Correo requerido" });
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
            }
            catch (err) {
                console.error("sendRecoveryEmail error:", err);
            }
        })();
    }
    catch (error) {
        console.error("sendVerificationCode error:", error);
        if (!res.headersSent)
            res.status(500).json({ message: "Error al generar código" });
    }
};
exports.sendVerificationCode = sendVerificationCode;
// --- 2) Verificar código
const verifyCode = (req, res) => {
    const correo = norm(req.body?.correo);
    const codigo = Number(req.body?.codigo);
    if (!correo || !codigo)
        return res.status(400).json({ message: "Datos requeridos" });
    const record = verificationCodes.get(correo);
    if (!record)
        return res.status(400).json({ message: "Código no encontrado" });
    if (Date.now() > record.expires) {
        verificationCodes.delete(correo);
        return res.status(400).json({ message: "Código expirado" });
    }
    if (record.code !== codigo)
        return res.status(400).json({ message: "Código incorrecto" });
    return res.json({ message: "Código verificado" });
};
exports.verifyCode = verifyCode;
// --- 3) Reset password
const resetPassword = async (req, res) => {
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
        const newPasswordHash = await bcrypt_1.default.hash(nuevaClave, 10);
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
    }
    catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.resetPassword = resetPassword;
/** Util: combina una fecha (YYYY-MM-DD) con una hora (HH:mm[:ss]) a un Date */
const crearPaseo = async (req, res) => {
    console.log("[DMMF Paseo]\n", JSON.stringify(client_1.Prisma.dmmf.datamodel.models.find(m => m.name === "Paseo"), null, 2));
    try {
        const { mascotaId, // number|string
        duenioId, // number|string
        fecha, // "YYYY-MM-DD" o ISO
        hora, // "HH:mm" o ISO
        duracion, // number|string
        lugarEncuentro, notas, estado, // opcional
        paseadorId, // opcional number|string
         } = req.body;
        if (!mascotaId || !duenioId || !fecha || !hora || !duracion || !lugarEncuentro) {
            return res.status(400).json({ error: "mascotaId, duenioId, fecha, hora, duracion y lugarEncuentro son obligatorios" });
        }
        const mascotaIdInt = Number(mascotaId);
        const duenioIdInt = Number(duenioId);
        const duracionInt = Number(duracion);
        if ([mascotaIdInt, duenioIdInt, duracionInt].some(Number.isNaN)) {
            return res.status(400).json({ error: "IDs y duración deben ser números válidos" });
        }
        const fechaBase = parseFecha(fecha);
        if (!fechaBase)
            return res.status(400).json({ error: "Formato de fecha inválido" });
        const { fechaDate, horaDate } = parseFechaHora(fechaBase, hora);
        if (!horaDate)
            return res.status(400).json({ error: "Formato de hora inválido" });
        let estadoValue = client_1.EstadoPaseo.PENDIENTE;
        if (estado) {
            if (!Object.values(client_1.EstadoPaseo).includes(estado)) {
                return res.status(400).json({ error: `Estado inválido. Usa uno de: ${Object.values(client_1.EstadoPaseo).join(", ")}` });
            }
            estadoValue = estado;
        }
        const data = {
            mascota: { connect: { idMascota: mascotaIdInt } },
            duenio: { connect: { idUsuario: duenioIdInt } },
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
    }
    catch (error) {
        console.error("[crearPaseo] Error:", error);
        if (String(error?.code) === "P2003") {
            return res.status(400).json({ error: "Relación inválida: verifica que mascotaId, duenioId y paseadorId existan." });
        }
        return res.status(500).json({ error: `Error interno al crear el paseo: ${error.message || error}` });
    }
};
exports.crearPaseo = crearPaseo;
/** Helpers */
function parseFecha(input) {
    if (!input)
        return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
        const [y, m, d] = input.split("-").map(Number);
        return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
}
function parseFechaHora(fechaBase, hora) {
    if (!hora)
        return { fechaDate: fechaBase, horaDate: null };
    const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (hhmm.test(hora)) {
        const [hh, mm] = hora.split(":").map(Number);
        return { fechaDate: fechaBase, horaDate: new Date(fechaBase.getFullYear(), fechaBase.getMonth(), fechaBase.getDate(), hh, mm, 0, 0) };
    }
    const asDate = new Date(hora);
    return isNaN(asDate.getTime()) ? { fechaDate: fechaBase, horaDate: null } : { fechaDate: fechaBase, horaDate: asDate };
}
// GET /api/paseos 
const listPaseos = async (req, res) => {
    try {
        // flags
        const mias = String(req.query.mias || "false") === "true";
        const disponibles = String(req.query.disponibles || "false") === "true";
        // estado (validado contra enum)
        const estadoStr = typeof req.query.estado === "string" ? req.query.estado.toUpperCase() : undefined;
        const estado = estadoStr && Object.values(client_1.EstadoPaseo).includes(estadoStr)
            ? estadoStr
            : undefined;
        // fechas (acepta "YYYY-MM-DD" o ISO)
        const desde = toDate(String(req.query.desde || ""));
        const hasta = endOfDay(toDate(String(req.query.hasta || "")));
        // paginación
        const page = Math.max(1, Number(req.query.page || 1));
        const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize || 20)));
        const skip = (page - 1) * pageSize;
        const take = pageSize;
        // where base
        const where = {};
        if (estado)
            where.estado = estado;
        if (desde || hasta) {
            where.fecha = {};
            if (desde && !isNaN(desde.getTime()))
                where.fecha.gte = desde;
            if (hasta && !isNaN(hasta.getTime()))
                where.fecha.lte = hasta;
        }
        if (disponibles) {
            // Paseos sin paseador asignado y (por defecto) PENDIENTE
            where.paseadorId = null;
            if (!where.estado)
                where.estado = client_1.EstadoPaseo.PENDIENTE;
        }
        // Mis paseos (según rol del usuario autenticado)
        const user = req.user;
        if (mias && user) {
            if (user.rol === client_1.Rol.DUEÑO) {
                where.duenioId = user.id;
            }
            else if (user.rol === client_1.Rol.PASEADOR) {
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
                    mascota: { select: { nombre: true, especie: true, raza: true } },
                    duenio: { select: { nombre: true, apellido: true } },
                    paseador: { select: { nombre: true, apellido: true } },
                },
            }),
            prisma.paseo.count({ where }),
        ]);
        return res.json({ page, pageSize, total, items });
    }
    catch (e) {
        console.error("listPaseos error:", e);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.listPaseos = listPaseos;
/* Helpers */
function toDate(s) {
    if (!s)
        return undefined;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const [y, m, d] = s.split("-").map(Number);
        return new Date(y, m - 1, d, 0, 0, 0, 0);
    }
    const d = new Date(s);
    return isNaN(d.getTime()) ? undefined : d;
}
function endOfDay(d) {
    if (!d || isNaN(d.getTime()))
        return undefined;
    const c = new Date(d);
    c.setHours(23, 59, 59, 999);
    return c;
}
/** Helpers de tiempo */
function combineDateTime(fecha, hora) {
    // fecha y hora vienen como Date (solo fecha / solo hora en tu modelo)
    const f = new Date(fecha);
    const h = new Date(hora);
    return new Date(f.getFullYear(), f.getMonth(), f.getDate(), h.getHours(), h.getMinutes(), h.getSeconds(), h.getMilliseconds());
}
function addMinutes(d, mins) {
    return new Date(d.getTime() + mins * 60000);
}
// POST /api/auth/paseos/:id/accept  (solo PASEADOR)
const acceptPaseo = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autorizado" });
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
        if (!paseo)
            return res.status(404).json({ error: "Paseo no encontrado" });
        if (paseo.estado !== client_1.EstadoPaseo.PENDIENTE) {
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
                estado: { in: [client_1.EstadoPaseo.ACEPTADO, client_1.EstadoPaseo.EN_CURSO] },
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
            where: { idPaseo: id, estado: client_1.EstadoPaseo.PENDIENTE, paseadorId: null },
            data: { estado: client_1.EstadoPaseo.ACEPTADO, paseadorId: req.user.id },
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
    }
    catch (e) {
        console.error("acceptPaseo error:", e);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.acceptPaseo = acceptPaseo;
const createMascota = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autorizado" });
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
                const count = await tx.mascota.count({ where: { usuarioId: req.user.id } });
                if (count >= 3) {
                    // Lanzamos un error controlado para cortar la transacción
                    const err = new Error("LIMITE_MASCOTAS");
                    // @ts-expect-error mark
                    err.code = "LIMITE_MASCOTAS";
                    throw err;
                }
                return tx.mascota.create({
                    data: {
                        usuarioId: req.user.id,
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
        }
        catch (e) {
            if (e?.code === "LIMITE_MASCOTAS") {
                return res.status(409).json({ error: "Has alcanzado el máximo de 3 mascotas por usuario" });
            }
            throw e;
        }
    }
    catch (error) {
        console.error("createMascota error:", error);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.createMascota = createMascota;
const getMisMascotas = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autorizado" });
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
    }
    catch (error) {
        console.error("getMisMascotas error:", error);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.getMisMascotas = getMisMascotas;
/** GET /api/usuarios/:duenioId/mascotas  (solo el propio dueño) */
const getMascotasByDuenio = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autorizado" });
        const duenioId = Number(req.params.duenioId);
        if (!duenioId)
            return res.status(400).json({ error: "duenioId inválido" });
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
    }
    catch (error) {
        console.error("getMascotasByDuenio error:", error);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.getMascotasByDuenio = getMascotasByDuenio;
const startPaseo = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autorizado" });
        if (req.user.rol !== "PASEADOR") {
            return res.status(403).json({ error: "Solo PASEADOR puede iniciar paseos" });
        }
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id))
            return res.status(400).json({ error: "Id de paseo inválido" });
        const paseo = await prisma.paseo.findUnique({
            where: { idPaseo: id },
            select: { idPaseo: true, paseadorId: true, estado: true, fecha: true, hora: true, duracion: true },
        });
        if (!paseo)
            return res.status(404).json({ error: "Paseo no encontrado" });
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
            data: { estado: "EN_CURSO" },
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
    }
    catch (e) {
        console.error("startPaseo error:", e);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.startPaseo = startPaseo;
const finishPaseo = async (req, res) => {
    try {
        if (!req.user)
            return res.status(401).json({ error: "No autorizado" });
        if (req.user.rol !== "PASEADOR") {
            return res.status(403).json({ error: "Solo PASEADOR puede finalizar paseos" });
        }
        const id = Number(req.params.id);
        if (!id || Number.isNaN(id))
            return res.status(400).json({ error: "Id de paseo inválido" });
        const paseo = await prisma.paseo.findUnique({
            where: { idPaseo: id },
            select: { idPaseo: true, paseadorId: true, estado: true },
        });
        if (!paseo)
            return res.status(404).json({ error: "Paseo no encontrado" });
        if (paseo.paseadorId !== req.user.id) {
            return res.status(403).json({ error: "No eres el paseador asignado" });
        }
        if (paseo.estado !== "EN_CURSO") {
            return res.status(409).json({ error: "Solo se puede finalizar un paseo EN_CURSO" });
        }
        const updated = await prisma.paseo.updateMany({
            where: { idPaseo: id, paseadorId: req.user.id, estado: "EN_CURSO" },
            data: { estado: "FINALIZADO" },
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
    }
    catch (e) {
        console.error("finishPaseo error:", e);
        return res.status(500).json({ error: "Error interno" });
    }
};
exports.finishPaseo = finishPaseo;
