// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getProfile, logout as apiLogout } from "../api/api.ts";

interface User {
  rol: string;
  nombre: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  const logout = async () => {
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
