import axios, { AxiosError } from "axios";
import type {AxiosInstance, InternalAxiosRequestConfig} from "axios";


const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // para enviar cookies httpOnly (refresh tokens)
});

// Guardamos accessToken en memoria (y localStorage para persistencia)
let accessToken: string | null = localStorage.getItem("access_token") || null;

api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !originalRequest?._retry // para evitar loops infinitos
    ) {
        originalRequest._retry = true;

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        accessToken = res.data.token;
        localStorage.setItem("access_token", accessToken!);

        if (originalRequest?.headers)
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

        return api(originalRequest!);
      } catch (refreshError) {
        console.error("No se pudo refrescar el token:", refreshError);
        accessToken = null;
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

interface LoginResponse {
  token: string;
  user: {
    idUsuario: number;
    nombre: string;
    correo: string;
    rol : string;
  };
  remember: boolean;
}

export const login = async (
  correo: string,
  password: string,
  remember = false
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", {
    email: correo,
    password,
    remember,
  });
  accessToken = res.data.token;
  localStorage.setItem("access_token", accessToken);
  return res.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout"); // llama a tu backend y revoca el RT

    // limpia el token de acceso local
    accessToken = null;
    localStorage.removeItem("access_token");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};


export const getProfile = async (): Promise<any> => {
  try {
    const res = await api.get("/auth/profile");
    return res.data;
  } catch (error) {
    console.error("Error en getProfile:", error);
    throw error;  // para que el catch en Navbar se active
  }
};


export const register = async (data: {
  rut: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  clave: string;
  comuna: string;
  rol: string;  // Podrías usar un tipo literal 'dueño' | 'paseador'
  carnet?: File;
  antecedentes?: File;
}) => {
  let res;

  if (data.rol === "paseador") {
    const formData = new FormData();

    // Campos básicos
    formData.append("rut", data.rut);
    formData.append("nombre", data.nombre);
    formData.append("apellido", data.apellido);
    formData.append("telefono", data.telefono);
    formData.append("correo", data.correo);
    formData.append("clave", data.clave);
    formData.append("comuna", data.comuna);  // No olvides agregar comuna también
    formData.append("rol", data.rol);

    // Archivos opcionales
    if (data.carnet) formData.append("carnet", data.carnet);
    if (data.antecedentes) formData.append("antecedentes", data.antecedentes);

    res = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } else {
    // Para dueños, envía JSON plano sin archivos
    res = await api.post("/auth/register", data);
  }

  return res.data;
};

export const sendVerificationCode = async (correo: string): Promise<{ message: string }> => {
  const res = await api.post("/auth/send-code", { correo });
  return res.data;
};

export const verifyCode = async (
  correo: string,
  codigo: number
): Promise<{ message: string }> => {
  const res = await api.post("/auth/verify-code", { correo, codigo });
  return res.data;
};

export const resetPassword = async (
  correo: string,
  nuevaClave: string
): Promise<{ message: string }> => {
  const res = await api.put("/auth/reset-password", { correo, nuevaClave });
  return res.data;
};



export default api;


