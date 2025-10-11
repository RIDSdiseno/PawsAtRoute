// src/routes/auth.route.ts
import fs from "fs";
import path from "path";
import multer from "multer";
import { RequestHandler, Router } from "express";
import {
  login, registerUser, refresh, getProfile, logout,
  sendVerificationCode, verifyCode, resetPassword,
  //acceptPaseo,
  // listPaseos,
  createMascota,
  getMisMascotas,
  getMascotasByDuenio,
  crearPaseo
} from "../controllers/auth.controller";
import { authGuard } from "../middlewares/auth.middleware";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Si viene multipart -> procesa archivos, si no, deja pasar
const maybeUpload: RequestHandler = (req, res, next) => {
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

r.post("/paseos",authGuard,crearPaseo);
//r.get("/listpaseos",authGuard,listPaseos);
//r.post("/paseos/:id/accept",authGuard,acceptPaseo)

r.post("/crearmascotas",authGuard,createMascota);
r.get("/mismascotas",authGuard,getMisMascotas);
r.get("/dueno/:id/mascotas",authGuard,getMascotasByDuenio)


export default r;
