import type { NextFunction, Request, Response } from 'express';

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error('[ERROR]', JSON.stringify(err));
  const status = err.status || 500;
  res.status(status).json({ ok: false, message: err.message || 'Error interno', details: err.details });
}

// Si usas TypeScript, puedes tipar err como 'any' o crear una interfaz personalizada para errores
// export interface CustomError extends Error {
//   status?: number;
//   details?: any;
// }