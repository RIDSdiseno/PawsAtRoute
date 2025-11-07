// utils/estadoPaseo.ts
export type Estado = "PENDIENTE"|"ACEPTADO"|"EN_CURSO"|"FINALIZADO"|"CANCELADO";

export const estadoLabel: Record<Estado, string> = {
  PENDIENTE:  "Pendiente",
  ACEPTADO:   "Aceptado",
  EN_CURSO:   "En curso",
  FINALIZADO: "Finalizado",
  CANCELADO:  "Cancelado",
};

export const estadoColor: Record<Estado,
  "medium"|"warning"|"success"|"tertiary"|"danger"> = {
  PENDIENTE:  "medium",
  ACEPTADO:   "tertiary",
  EN_CURSO:   "warning",
  FINALIZADO: "success",
  CANCELADO:  "danger",
};
