"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
// Si viene multipart -> procesa archivos, si no, deja pasar
const maybeUpload = (req, res, next) => {
    if (req.is("multipart/form-data")) {
        return upload.fields([
            { name: "carnet", maxCount: 1 },
            { name: "antecedentes", maxCount: 1 },
        ])(req, res, next);
    }
    return next();
};
const r = (0, express_1.Router)();
r.get("/health", (_req, res) => res.json({ ok: true, service: "API Paws", ts: Date.now() }));
r.post("/login", auth_controller_1.login);
r.post("/register", maybeUpload, auth_controller_1.registerUser); // usa maybeUpload 
r.post("/logout", auth_middleware_1.authGuard, auth_controller_1.logout);
r.get("/profile", auth_middleware_1.authGuard, auth_controller_1.getProfile);
r.post("/send-code", auth_controller_1.sendVerificationCode);
r.post("/verify-code", auth_controller_1.verifyCode);
r.put("/reset-password", auth_controller_1.resetPassword);
r.post("/paseos", auth_middleware_1.authGuard, auth_controller_1.crearPaseo);
r.get("/listpaseos", auth_middleware_1.authGuard, auth_controller_1.listPaseos);
r.post("/paseos/:id/accept", auth_middleware_1.authGuard, auth_controller_1.acceptPaseo);
r.post("/crearmascotas", auth_middleware_1.authGuard, auth_controller_1.createMascota);
r.get("/mismascotas", auth_middleware_1.authGuard, auth_controller_1.getMisMascotas);
r.get("/dueno/:id/mascotas", auth_middleware_1.authGuard, auth_controller_1.getMascotasByDuenio);
exports.default = r;
