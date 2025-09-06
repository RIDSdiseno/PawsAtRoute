import { Link } from "react-router-dom";
import Navbar from "../landing-components/navbar";
import Footer from "../landing-components/footer";

function Login() {
  return (
    <>
      <Navbar />
      <section className="flex flex-col justify-center items-center min-h-screen text-prussian-blue py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          ¡Bienvenido de nuevo!
        </h1>
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border-2 border-gray-300 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-1/2 p-8">
            <form action="/home" className="flex flex-col gap-4">
              <p className="text-3xl text-center">Inicia Sesión</p>
              <label className="flex flex-col gap-2" htmlFor="correo">
                <p className="font-semibold">Correo</p>
                <input
                  type="email"
                  placeholder="ejemplo@gmail.com"
                  required
                  name="correo"
                  id="correo"
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un correo válido.
                </p>
              </label>

              <label className="flex flex-col gap-2" htmlFor="contraseña">
                <p className="font-semibold">Contraseña</p>
                <input
                  type="password"
                  placeholder="********"
                  required
                  name="contraseña"
                  id="contraseña"
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa una contraseña segura.
                </p>
              </label>

              <button className="bg-blue-green text-white rounded-full p-4 cursor-pointer hover:bg-blue-green/80 font-semibold border-2 border-cyan-600 shadow-lg shadow-blue-green/50">
                Iniciar Sesión
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
              src="/src/assets/img/perros jugando 1.webp"
              alt="Perros jugando"
              className="object-cover w-full h-full max-h-[450px] drop-shadow-lg"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Login;