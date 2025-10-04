import { Router } from "express";
import { login, registerUser, refresh, getProfile, logout, sendVerificationCode, verifyCode, resetPassword } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/auth.middleware";

const r = Router();

r.get("/health", (_req, res) => res.json({ ok: true, service: "API Paws", ts: Date.now() }));

r.post("/register",registerUser);
r.post("/login",login);
r.post("/refresh",authGuard,refresh);
r.post("/logout",authGuard,logout);
r.get("/profile", authGuard, getProfile);


r.post("/send-code",sendVerificationCode);
r.post("/verify-code",verifyCode);
r.put("/reset-password",resetPassword);



export default r;