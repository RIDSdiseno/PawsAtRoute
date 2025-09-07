import { useState } from "react";
import Navbar from "../landing-components/navbar";
import Footer from "../landing-components/footer";

function RecuperarClave() {
  const [step, setStep] = useState<"email" | "codigo" | "reset">("email");
  const [codigo, setCodigo] = useState("");

  const handleSendCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("codigo");
    setCodigo("");
  };

  const handleVerifyCode = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStep("reset");
  };

  return (
    <>
      <Navbar />
      <section className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-prussian-blue py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
          Recupera tu contraseña
        </h1>
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-gray-300 p-8">
          {step === "email" && (
            <>
              <p className="text-center text-gray-600 mb-8">
                Ingresa tu correo y te enviaremos un código para restablecer tu
                contraseña.
              </p>
              <form onSubmit={handleSendCode} className="flex flex-col gap-4">
                <div>
                  <label htmlFor="correo" className="font-semibold">
                    Correo
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@gmail.com"
                    required
                    id="correo"
                    className="w-full p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  />
                  <p className="invisible text-xs text-red-500 peer-invalid:visible">
                    Por favor, ingresa un correo válido.
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-green text-white rounded-full p-3 hover:bg-blue-green/90 font-semibold border-2 border-cyan-600 shadow-md shadow-blue-green/50"
                >
                  Enviar código de recuperación
                </button>
              </form>
            </>
          )}

          {step === "codigo" && (
            <>
              <p className="text-center text-gray-600 mb-8">
                Ingresa el código de 6 dígitos que enviamos a tu correo.
              </p>
              <form onSubmit={handleVerifyCode} className="flex flex-col gap-6">
                <div>
                  <input
                    type="text"
                    placeholder="_ _ _ _ _ _"
                    required
                    maxLength={6}
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full p-3 text-center tracking-[1.5em] border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-green invalid:border-red-500 invalid:text-red-500"
                  />
                  <p className="mt-2 invisible text-sm text-red-500 peer-invalid:visible">
                    Por favor, ingresa el código de 6 dígitos.
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-green text-white rounded-full p-3 hover:bg-blue-green/90 font-semibold border-2 border-cyan-600 shadow-md shadow-blue-green/50"
                >
                  Verificar código
                </button>
              </form>
            </>
          )}

          {step === "reset" && (
            <>
              <p className="text-center text-gray-600 mb-8">
                Ingresa tu nueva contraseña.
              </p>
              <form action="/login" className="flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="nuevaClave"
                    className="block font-semibold mb-1"
                  >
                    Nueva contraseña
                  </label>
                  <input
                    type="password"
                    id="nuevaClave"
                    required
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="repetirClave"
                    className="block font-semibold mb-1"
                  >
                    Repetir contraseña
                  </label>
                  <input
                    type="password"
                    id="repetirClave"
                    required
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-green text-white rounded-full p-3 hover:bg-blue-green/90 font-semibold border-2 border-cyan-600 shadow-md shadow-blue-green/50 transition-transform hover:scale-105"
                >
                  Restablecer contraseña
                </button>
              </form>
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

export default RecuperarClave;