// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { storage } from "../lib/storage"; // Preferences/localStorage wrapper
import { login as apiLogin, logout as apiLogout, getProfile } from "../services/api";

type User = { idUsuario: number; nombre: string; correo: string; rol: "DUEÑO" | "PASEADOR" | string };

type AuthCtx = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, pass: string, remember?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
};

const Ctx = createContext<AuthCtx>({} as any);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  (async () => {
    setLoading(true);
    try {
      const token = await storage.get("access_token");
      if (token) {
        try {
          const me = await getProfile();
          setUser(me);
        } catch {
          await storage.remove("access_token");
          setUser(null);
        }
      }
    } finally {
      setLoading(false);  // <- nunca lo omitas
    }
  })();
}, []);

  const signIn = async (email: string, pass: string, remember = false) => {
  try {
    await apiLogin(email, pass, remember);      // guarda token
    const me = await getProfile();              // trae perfil + rol
    setUser(me);
    await storage.set("is_logged_in", "1");
  } catch (e) {
    await storage.remove("access_token");
    await storage.remove("is_logged_in");
    setUser(null);
    throw e; // para que la UI muestre error
  }
};

  const signOut = async () => {
    await apiLogout();
    await storage.remove("is_logged_in");
    await storage.remove("access_token");
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, isAuthenticated: !!user, loading, signIn, signOut }}>
      {children}
    </Ctx.Provider>
  );
}
