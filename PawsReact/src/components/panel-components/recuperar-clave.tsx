import { useMemo, useState } from "react";
import { sendVerificationCode, verifyCode, resetPassword } from "../../api/api";

function RecuperarClave() {
  const [step, setStep] = useState<"email" | "codigo" | "reset">("email");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaClave, setNuevaClave] = useState("");
  const [repetirClave, setRepetirClave] = useState("");
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  // Cooldown para reenvío
  const [resendCooldown, setResendCooldown] = useState(0);
  const [timerId, setTimerId] = useState<number | null>(null);

  // Detección de proveedor de correo para link directo
  const providerLink = useMemo(() => {
    const domain = correo.split("@")[1]?.toLowerCase() || "";
    if (domain.includes("gmail")) return "https://mail.google.com";
    if (domain.includes("outlook") || domain.includes("hotmail") || domain.includes("live")) return "https://outlook.live.com";
    if (domain.includes("yahoo")) return "https://mail.yahoo.com";
    return null;
  }, [correo]);

  const startCooldown = (seconds = 30) => {
    setResendCooldown(seconds);
    const id = window.setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) {
          if (timerId) window.clearInterval(timerId);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    setTimerId(id);
  };

  const handleSendCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);
    try {
      await sendVerificationCode(correo);
      setMensaje("Código enviado. Revisa tu correo.");
      setStep("codigo");
      setCodigo("");
      startCooldown(30);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error enviando código. Verifica tu correo e intenta de nuevo.";
      setMensaje(msg);
    } finally {
      setCargando(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || !correo) return;
    setMensaje(null);
    setCargando(true);
    try {
      await sendVerificationCode(correo);
      setMensaje("Te reenviamos un nuevo código.");
      startCooldown(30);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "No pudimos reenviar el código. Intenta más tarde.";
      setMensaje(msg);
    } finally {
      setCargando(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);

    const clean = codigo.replace(/\D/g, "");
    if (clean.length !== 6) {
      setCargando(false);
      setMensaje("El código debe tener 6 dígitos.");
      return;
    }

    try {
      await verifyCode(correo, Number(clean));
      setMensaje("Código verificado. Ahora ingresa tu nueva contraseña.");
      setStep("reset");
      setNuevaClave("");
      setRepetirClave("");
    } catch (error: any) {
      setMensaje(
        error?.name === "CanceledError"
          ? "Se canceló por demora. Inténtalo otra vez."
          : "Código incorrecto o expirado."
      );
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
      <div className="animate-blurred-fade-in animate-delay-200 w-full max-w-md bg-white rounded-xl shadow-lg border-2 border-gray-300 p-8">
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
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <p className="text-center text-gray-600">
              Enviamos un código a <span className="font-semibold">{correo}</span>
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

            <div className="text-sm text-center text-gray-600 space-y-2 mt-2">
              <p>¿No te llegó?</p>
              <div className="text-xs flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cargando || resendCooldown > 0}
                  className="disabled:opacity-50"
                >
                  Reenviar código {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setStep("email")}
                  className="hover:underline "
                >
                  Cambiar correo
                </button>
                {providerLink && (
                  <>
                    <span>·</span>
                    <a href={providerLink} target="_blank" className="hover:underline">
                      Abrir mi correo
                    </a>
                  </>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Revisa también tu carpeta de spam/promociones.
              </p>
            </div>
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
