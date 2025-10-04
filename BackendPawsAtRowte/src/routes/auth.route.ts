import { Router } from "express";
import { login, registerUser, refresh, getProfile, logout } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/auth.middleware";

const r = Router();

r.get("/health", (_req, res) => res.json({ ok: true, service: "API Movil", ts: Date.now() }));

r.post("/register",registerUser)
r.post("/login",login)
r.post("/refresh",authGuard,refresh)
r.post("/logout",authGuard,logout)
r.get("/profile", authGuard, getProfile);
export default r;