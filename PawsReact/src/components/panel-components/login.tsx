import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../../api/api.ts";

function Login() {

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ correo?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validarFormulario = () => {
    const nuevosErrores: { correo?: string; password?: string } = {};

    if (!correo) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = "Por favor, ingresa un correo válido.";
    } else if (correo.length < 10 || correo.length > 30) {
      nuevosErrores.correo = "El correo debe tener entre 10 y 30 caracteres.";
    }

    if (!password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{10,20}$/.test(
        password
      )
    ) {
      nuevosErrores.password =
        "La contraseña debe tener entre 10 y 20 caracteres, incluir mayúscula, minúscula, número y caracter especial.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const data = await login(correo, password);
      console.log("Usuario logueado:", data.user);
      if (data.token) {
        localStorage.setItem("access_token", data.token);
      } else if (data.token) {
        localStorage.setItem("access_token", data.token);
      }

      switch (data.user.rol) {
        case "DUEÑO":
          window.location.href = "/panel-dueño";
          break;
        case "PASEADOR":
          window.location.href = "/panel-paseador";
          break;
        default:
          window.location.href = "/";
          break;
      }
    } catch (error: any) {
      setLoginError(error?.response?.data?.error || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center min-h-screen text-prussian-blue py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
        ¡Bienvenido de nuevo!
      </h1>
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border-2 border-gray-300 flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
            <p className="text-3xl text-center">Inicia Sesión</p>

            <label className="flex flex-col gap-2" htmlFor="correo">
              <p className="font-semibold">Correo</p>
              <input
                type="email"
                placeholder="ejemplo@gmail.com"
                name="correo"
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className={`p-2 border-2 rounded-lg focus:outline-none ${
                  errors.correo
                    ? "border-red-500 text-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.correo && (
                <p className="text-xs text-red-500">{errors.correo}</p>
              )}
            </label>

            <label className="flex flex-col gap-2" htmlFor="contraseña">
              <p className="font-semibold">Contraseña</p>
              <input
                type="password"
                id="contraseña"
                placeholder="Ej: ClaveSegura1!"
                minLength={10}
                maxLength={20}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`p-2 border-2 rounded-lg focus:outline-none ${
                  errors.password
                    ? "border-red-500 text-red-500"
                    : "border-gray-300 focus:border-blue-500"
                }`}
              />
              {errors.password && (
                <ul className="text-xs text-red-500 list-disc list-inside">
                  <li>{errors.password}</li>
                </ul>
              )}
            </label>

            {loginError && (
              <p className="text-center text-red-600 font-semibold">{loginError}</p>
            )}

            <p className="text-center gap-2 flex justify-center">
              ¿Olvidaste tu contraseña?
              <Link
                to="/recuperar-clave"
                className="text-ut-orange font-semibold hover:underline"
              >
                Recupera tu contraseña
              </Link>
            </p>

            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-green text-white rounded-full py-2 px-4 cursor-pointer font-semibold border border-cyan-600 shadow-lg shadow-blue-green/50 active:scale-90 transition-all duration-100 ${
                loading ? "opacity-60 cursor-not-allowed" : "hover:bg-blue-green/80"
              }`}
            >
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </button>

            <p className="text-center gap-2 flex justify-center">
              ¿No tienes cuenta?
              <Link
                to="/register"
                className="text-ut-orange font-semibold hover:underline"
              >
                Regístrate
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:flex w-full md:w-1/2 bg-blue-green items-center justify-center p-4">
          <img
            src="/img/perros jugando 1.webp"
            alt="Perros jugando"
            loading="lazy"
            className="object-cover w-full h-full max-h-[400px] drop-shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default Login;
