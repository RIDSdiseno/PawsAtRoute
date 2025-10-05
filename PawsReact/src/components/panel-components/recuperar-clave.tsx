import { useState } from "react";
import { sendVerificationCode, verifyCode, resetPassword } from "../../api/api"; // importa tus funciones reales

function RecuperarClave() {
  const [step, setStep] = useState<"email" | "codigo" | "reset">("email");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [repetirClave, setRepetirClave] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);
    try {
      await sendVerificationCode(correo);
      setMensaje("Código enviado. Revisa tu correo.");
      setStep("codigo");
      setCodigo("");
    } catch (error) {
      setMensaje("Error enviando código. Verifica tu correo e intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);
    try {
      await verifyCode(correo, Number(codigo));
      setMensaje("Código verificado. Ahora ingresa tu nueva contraseña.");
      setStep("reset");
      setNuevaClave("");
      setRepetirClave("");
    } catch (error) {
      setMensaje("Código incorrecto o expirado.");
    } finally {
      setCargando(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);

    if (nuevaClave !== repetirClave) {
      setMensaje("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    try {
      await resetPassword(correo, nuevaClave);
      setMensaje("Contraseña actualizada exitosamente. Ya puedes iniciar sesión.");
      setStep("email");
      setCorreo("");
      setCodigo("");
      setNuevaClave("");
      setRepetirClave("");
    } catch (error) {
      setMensaje("Error al actualizar contraseña. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-prussian-blue py-12 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Recupera tu contraseña
      </h1>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-gray-300 p-8">
        {mensaje && (
          <p className="mb-4 text-center text-red-600 font-semibold">{mensaje}</p>
        )}

        {step === "email" && (
          <form onSubmit={handleSendCode} className="flex flex-col gap-4">
            <p className="text-center text-gray-600 mb-8">
              Ingresa tu correo y te enviaremos un código para restablecer tu contraseña.
            </p>
            <div>
              <label htmlFor="correo" className="font-semibold">
                Correo
              </label>
              <input
                type="email"
                placeholder="ejemplo@gmail.com"
                required
                id="correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                disabled={cargando}
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-green text-white rounded-full py-2 px-4 hover:bg-blue-green/90 font-semibold border border-cyan-600 shadow-lg shadow-blue-green/50 disabled:opacity-50"
            >
              {cargando ? "Enviando..." : "Enviar código de recuperación"}
            </button>
          </form>
        )}

        {step === "codigo" && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-6">
            <p className="text-center text-gray-600 mb-8">
              Ingresa el código de 6 dígitos que enviamos a tu correo.
            </p>
            <input
              type="text"
              placeholder="_ _ _ _ _ _"
              required
              maxLength={6}
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              className="w-full p-3 text-center tracking-[1.5em] border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-green invalid:border-red-500 invalid:text-red-500"
              disabled={cargando}
            />
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-green text-white rounded-full p-3 hover:bg-blue-green/90 font-semibold border-2 border-cyan-600 shadow-md shadow-blue-green/50 disabled:opacity-50"
            >
              {cargando ? "Verificando..." : "Verificar código"}
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-6">
            <p className="text-center text-gray-600 mb-8">
              Ingresa tu nueva contraseña.
            </p>
            <div>
              <label htmlFor="nuevaClave" className="block font-semibold mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="nuevaClave"
                required
                value={nuevaClave}
                onChange={(e) => setNuevaClave(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={cargando}
              />
            </div>
            <div>
              <label htmlFor="repetirClave" className="block font-semibold mb-1">
                Repetir contraseña
              </label>
              <input
                type="password"
                id="repetirClave"
                required
                value={repetirClave}
                onChange={(e) => setRepetirClave(e.target.value)}
                className="w-full p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                disabled={cargando}
              />
            </div>
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-green text-white rounded-full p-3 hover:bg-blue-green/90 font-semibold border-2 border-cyan-600 shadow-md shadow-blue-green/50 transition-transform hover:scale-105 disabled:opacity-50"
            >
              {cargando ? "Actualizando..." : "Restablecer contraseña"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default RecuperarClave;
