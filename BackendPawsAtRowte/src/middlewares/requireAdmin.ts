// middlewares/requireAdmin.ts
import { Request, Response, NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as { id: number; rol: string } | undefined;
  if (!user) return res.status(401).json({ error: "No autenticado" });
  if (user.rol !== "ADMIN") return res.status(403).json({ error: "Requiere rol ADMIN" });
  next();
}
