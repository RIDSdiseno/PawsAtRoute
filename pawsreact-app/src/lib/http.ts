import axios, { AxiosError } from "axios";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import { storage } from "./storage";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://pawsatroute.onrender.com/api";

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false, // tus APIs normales van sin cookies
  // timeout: 12000,  // si quieres activar timeout
});

// token en memoria + persistencia con storage
let accessToken: string | null;
(async () => {
  accessToken = (await storage.get("access_token")) || null;
})();

api.interceptors.request.use((config) => {
  if (accessToken && config.headers) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest =
      error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;
      try {
        // tu refresh usa cookie httpOnly → sólo en esa llamada usa withCredentials: true
        const res = await axios.post(
          `${BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        accessToken = res.data.token;
        await storage.set("access_token", accessToken!);

        if (originalRequest?.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return api(originalRequest!);
      } catch (refreshError) {
        // limpieza de sesión
        accessToken = null;
        await storage.remove("access_token");
        // aquí NO uses window.location en app nativa;
        // deja que la UI redirija (ej: setAuth(null) y navigate('/login'))
      }
    }
    return Promise.reject(error);
  }
);

export default api;
