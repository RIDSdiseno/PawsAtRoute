import Navbar from "../landing-components/navbar";
import Footer from "../landing-components/footer";
import { Link } from "react-router-dom";

function Register() {
  return (
    <>
      <Navbar />
      <section className="flex flex-col justify-center items-center min-h-screen text-prussian-blue py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          ¡Bienvenido a Paws At Route!
        </h1>
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border-2 border-gray-300 flex flex-col md:flex-row overflow-hidden">
          <div className="hidden md:flex w-full md:w-1/2 bg-prussian-blue items-center justify-center p-4">
            <img
              src="/src/assets/img/perros jugando 2.webp"
              alt="Perros jugando"
              className="object-cover w-full h-full max-h-[350px] drop-shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <form action="/login" className="flex flex-col gap-3">
              <h1 className="text-3xl text-center mb-2">Registro</h1>
              <div className="flex justify-around gap-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    required
                    name="userType"
                    value="dueño"
                    className="sr-only peer"
                  />
                  <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue font-semibold peer-checked:invalid:border-red-500 peer-checked:invalid:text-red-500">
                    Dueño
                  </div>
                  <p className="invisible text-xs text-red-500 peer-invalid:visible">
                    Por favor, selecciona un tipo de usuario.
                  </p>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    required
                    name="userType"
                    value="paseador"
                    className="sr-only peer"
                  />
                  <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue font-semibold">
                    Paseador
                  </div>
                </label>
              </div>
              <label className="flex flex-col gap-1" htmlFor="nombre">
                <p className="font-semibold">Nombre</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                  type="text"
                  required
                  name="nombre"
                  id="nombre"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un nombre.
                </p>
              </label>
              <label className="flex flex-col gap-1" htmlFor="apellido">
                <p className="font-semibold">Apellido</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                  type="text"
                  required
                  name="apellido"
                  id="apellido"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un apellido.
                </p>
              </label>
              <label className="flex flex-col gap-1" htmlFor="telefono">
                <p className="font-semibold">Teléfono</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                  type="tel"
                  required
                  name="telefono"
                  id="telefono"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un teléfono.
                </p>
              </label>
              <label className="flex flex-col gap-1" htmlFor="correo">
                <p className="font-semibold">Correo</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                  type="email"
                  required
                  name="correo"
                  id="correo"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un correo válido.
                </p>
              </label>
              <label className="flex flex-col gap-1" htmlFor="contraseña">
                <p className="font-semibold">Contraseña</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                  type="password"
                  required
                  name="contraseña"
                  id="contraseña"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa una contraseña segura.
                </p>
              </label>
              <button
                type="submit"
                className="bg-prussian-blue text-white rounded-full p-4 cursor-pointer hover:bg-prussian-blue/80 border-2 border-cyan-900 shadow-lg shadow-prussian-blue/50 font-semibold mt-2"
              >
                Registrarse
              </button>
              <p className="text-center gap-2 flex justify-center">
                ¡Ya tengo cuenta!
                <Link
                  to="/login"
                  className="text-ut-orange font-semibold hover:underline"
                >
                  Inicia Sesión
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Register;