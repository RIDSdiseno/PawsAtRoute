// src/services/auth.ts
export type Usuario = {
  idUsuario: number;
  nombre?: string;
  correo?: string;
  rol?: string; // "DUEÑO" | "PASEADOR"
  [k: string]: any;
};

const KEYS = {
  logged: "isLoggedIn",
  token: "token",
  user: "usuario",
  userId: "usuarioId",
  role: "role",
} as const;

// Helpers internos: leer de sessionStorage primero y luego localStorage
const getFromBoth = (key: string): string | null =>
  sessionStorage.getItem(key) ?? localStorage.getItem(key);

const removeFromBoth = (key: string) => {
  sessionStorage.removeItem(key);
  localStorage.removeItem(key);
};

export const Auth = {
  /** ¿está logueado? (lee ambos) */
  isLoggedIn: (): boolean => getFromBoth(KEYS.logged) === "true",

  /**
   * Guardar sesión
   * - remember = true  -> localStorage
   * - remember = false -> sessionStorage (se borra al cerrar la pestaña)
   */
  login: (token: string, user: Usuario, remember: boolean = false) => {
    const store = remember ? localStorage : sessionStorage;

    // Limpia claves previas en ambos para evitar inconsistencias
    removeFromBoth(KEYS.logged);
    removeFromBoth(KEYS.token);
    removeFromBoth(KEYS.userId);
    removeFromBoth(KEYS.user);
    removeFromBoth(KEYS.role);

    store.setItem(KEYS.logged, "true");
    store.setItem(KEYS.token, token);
    store.setItem(KEYS.userId, String(user.idUsuario ?? ""));
    store.setItem(KEYS.user, JSON.stringify(user));
    if (user.rol) store.setItem(KEYS.role, user.rol);
  },

  /** opcional: setear/actualizar rol explícitamente (persiste donde esté la sesión) */
  setRole: (rol: string) => {
    const prefersSession = sessionStorage.getItem(KEYS.logged) === "true";
    const store = prefersSession ? sessionStorage : localStorage;
    store.setItem(KEYS.role, rol);
  },

  /** getters (leen ambos) */
  getToken: (): string | null => getFromBoth(KEYS.token),
  getUserId: (): string | null => getFromBoth(KEYS.userId),
  getUser: (): Usuario | null => {
    const raw = getFromBoth(KEYS.user);
    try { return raw ? (JSON.parse(raw) as Usuario) : null; } catch { return null; }
  },
  getRole: (): string => getFromBoth(KEYS.role) ?? (Auth.getUser()?.rol ?? ""),

  /** logout: borra en ambos para garantizar limpieza */
  logout: () => {
    removeFromBoth(KEYS.logged);
    removeFromBoth(KEYS.token);
    removeFromBoth(KEYS.userId);
    removeFromBoth(KEYS.user);
    removeFromBoth(KEYS.role);
  },
};
