import { useState } from "react";
import { Link } from "react-router-dom";

function Register() {
  const [userType, setUserType] = useState("");

  return (
    <>
      <section className="flex flex-col justify-center items-center min-h-screen text-prussian-blue py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          ¡Únete a <strong className="font-coffeecake">Paws At Route</strong>!
        </h1>
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border-2 border-gray-300 flex flex-col md:flex-row overflow-hidden">
          <div className="hidden md:flex w-1/2 bg-prussian-blue items-center justify-center p-4">
            <img
              src="/src/assets/img/perros jugando 2.webp"
              alt="Perros jugando"
              className="object-cover w-full h-full max-h-[350px] drop-shadow-lg"
            />
          </div>
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
            <form action="/login" className="flex flex-col gap-3">
              <h2 className="text-3xl text-center mb-2">Registro</h2>

              <div className="flex justify-around gap-4">
                <label className="flex-1">
                  <input
                    type="radio"
                    required
                    name="userType"
                    value="dueño"
                    checked={userType === "dueño"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer font-semibold peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue">
                    Dueño
                  </div>
                </label>
                <label className="flex-1">
                  <input
                    type="radio"
                    required
                    name="userType"
                    value="paseador"
                    checked={userType === "paseador"}
                    onChange={(e) => setUserType(e.target.value)}
                    className="sr-only peer"
                  />
                  <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer font-semibold peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue">
                    Paseador
                  </div>
                </label>
              </div>

              <label className="flex flex-col gap-1" htmlFor="nombre">
                <p className="font-semibold">Nombre</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  type="text"
                  required
                  id="nombre"
                  minLength={3}
                  maxLength={15}
                  placeholder="Ej: María"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un nombre.
                </p>
              </label>

              <label className="flex flex-col gap-1" htmlFor="apellido">
                <p className="font-semibold">Apellido</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  type="text"
                  required
                  id="apellido"
                  minLength={3}
                  maxLength={15}
                  placeholder="Ej: Pérez"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un apellido.
                </p>
              </label>

              <label className="flex flex-col gap-1" htmlFor="telefono">
                <p className="font-semibold">Teléfono</p>
                <input
                  className="peer p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  type="tel"
                  required
                  id="telefono"
                  name="telefono"
                  minLength={9}
                  maxLength={12}
                  pattern="^[0-9]{9,12}$"
                  placeholder="Ej: 987654321"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un teléfono válido (solo números, 9 a 12
                  dígitos).
                </p>
              </label>

              <label className="flex flex-col gap-1" htmlFor="correo">
                <p className="font-semibold">Correo</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  type="email"
                  required
                  id="correo"
                  minLength={10}
                  maxLength={30}
                  placeholder="Ej: maria.perez@gmail.com"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa un correo válido.
                </p>
              </label>

              <label className="flex flex-col gap-1" htmlFor="contraseña">
                <p className="font-semibold">Contraseña</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  type="password"
                  required
                  id="contraseña"
                  minLength={10}
                  maxLength={30}
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, ingresa una contraseña segura.
                </p>
              </label>

              {userType === "paseador" && (
                <>
                  <label className="flex flex-col gap-1" htmlFor="carnet">
                    <p className="font-semibold">Carnet de identidad</p>
                    <input
                      type="file"
                      required
                      id="carnet"
                      accept="image/*,.pdf"
                      className="p-2 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                  </label>

                  <label className="flex flex-col gap-1" htmlFor="antecedentes">
                    <p className="font-semibold">Antecedentes penales</p>
                    <input
                      type="file"
                      required
                      id="antecedentes"
                      accept="image/*,.pdf"
                      className="p-2 border-2 border-gray-300 rounded-lg cursor-pointer"
                    />
                  </label>
                </>
              )}

              <button
                type="submit"
                className="bg-prussian-blue text-white rounded-full p-4 hover:bg-prussian-blue/80 border-2 border-cyan-900 shadow-lg shadow-prussian-blue/50 font-semibold mt-2"
              >
                Registrarse
              </button>

              <p className="text-center flex justify-center gap-2">
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
    </>
  );
}

export default Register;
