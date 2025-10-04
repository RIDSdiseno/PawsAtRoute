export const Rol = {
  PASEADOR: "PASEADOR",
  DUEÑO: "DUEÑO",
} as const;

export type Rol = typeof Rol[keyof typeof Rol];
