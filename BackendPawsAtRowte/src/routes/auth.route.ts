// src/routes/auth.route.ts
import fs from "fs";
import path from "path";
import multer from "multer";
import { Router } from "express";
import {
  login, registerUser, refresh, getProfile, logout,
  sendVerificationCode, verifyCode, resetPassword
} from "../controllers/auth.controller";
import { authGuard } from "../middlewares/auth.middleware";

// 1) Ruta absoluta a /uploads
const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

// 2) Crear carpeta si no existe (por si app.ts aún no la creó)
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// 3) Sanitizar nombres (evita espacios/acentos problemáticos en FS)
const sanitize = (name: string) =>
  name
    .normalize("NFKD")                    // separa acentos
    .replace(/[\u0300-\u036f]/g, "")      // quita marcas de acento
    .replace(/[^a-zA-Z0-9._-]/g, "_");    // cambia lo raro por "_"

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR), // 👈 absoluta
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safe = sanitize(file.originalname);
    cb(null, `${unique}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Si viene multipart -> procesa archivos, si no, deja pasar
const maybeUpload: import("express").RequestHandler = (req, res, next) => {
  if (req.is("multipart/form-data")) {
    return upload.fields([
      { name: "carnet", maxCount: 1 },
      { name: "antecedentes", maxCount: 1 },
    ])(req, res, next);
  }
  return next();
};

const r = Router();

r.get("/health", (_req, res) => res.json({ ok: true, service: "API Paws", ts: Date.now() }));

r.post("/login", login);
r.post("/register", maybeUpload, registerUser); // usa maybeUpload 
r.post("/logout", authGuard, logout);
r.get("/profile", authGuard, getProfile);

r.post("/send-code", sendVerificationCode);
r.post("/verify-code", verifyCode);
r.put("/reset-password", resetPassword);

export default r;
