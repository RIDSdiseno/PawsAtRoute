import { Router } from "express";
import { login, registerUser, refresh, getProfile, logout, sendVerificationCode, verifyCode, resetPassword } from "../controllers/auth.controller";
import { authGuard } from "../middlewares/auth.middleware";
import multer from "multer";


const r = Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, "uploads/"),
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, unique + "-" + file.originalname);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

const maybeUpload = (
  req: import("express").Request,
  res: import("express").Response,
  next: import("express").NextFunction
) => {
  if (req.is("multipart/form-data")) {
    return upload.fields([
      { name: "carnet", maxCount: 1 },
      { name: "antecedentes", maxCount: 1 },
    ])(req, res, next);
  }
  return next();
};


r.get("/health", (_req, res) => res.json({ ok: true, service: "API Paws", ts: Date.now() }));
r.post("/login",login);

r.post("/register", maybeUpload, registerUser);

r.post("/logout",authGuard,logout);
r.get("/profile", authGuard, getProfile);


r.post("/send-code",sendVerificationCode);
r.post("/verify-code",verifyCode);
r.put("/reset-password",resetPassword);



export default r;