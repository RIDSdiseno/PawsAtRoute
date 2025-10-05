import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getProfile } from "../api/api.ts";

// Tipo del usuario, puedes ajustarlo según la estructura de tu API
interface User {
  rol: string;
  nombre: string;
}

// Definir el tipo del contexto
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
}

// Definir el tipo de las props del AuthProvider, incluyendo children
interface AuthProviderProps {
  children: ReactNode;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verifica si hay un token en el localStorage
    const fetchUser = async () => {
      if (localStorage.getItem("access_token")) {
        try {
          const profile = await getProfile();  // Aquí pides el perfil del usuario autenticado
          setUser(profile);
        } catch (error) {
          setUser(null);  // Si no se puede obtener el perfil, se limpia el estado
        }
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para acceder al contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
