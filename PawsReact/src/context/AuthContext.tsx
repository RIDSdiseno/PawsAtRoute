// context/auth.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getProfile } from "../api/api";

interface User { rol: "ADMIN" | "PASEADOR" | "DUEÑO"; nombre: string; apellido: string; }

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
  isReady: boolean;                 // 👈 NUEVO
}

interface AuthProviderProps { children: ReactNode; }

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser]   = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);              

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (localStorage.getItem("access_token")) {
          const profile = await getProfile();
          setUser(profile);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsReady(true);                                
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
