import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [modal, setModal] = useState<null | "iniciar" | "finalizar" | "pagar">(
    null
  );

  const user = {
    nombre: "María",
    paseosCompletados: 2,
  };

  const proximoPaseo = {
    duracion: "1 hora 30 minutos",
    paseador: "Carlos",
  };

  const historial = [
    {
      fecha: "15 de Mayo",
      duracion: "1 hora",
      paseador: "Carlos",
      estado: "Completado",
    },
    {
      fecha: "12 de Mayo",
      duracion: "30 minutos",
      paseador: "Ana",
      estado: "Completado",
    },
  ];

  const abrirModal = (accion: "iniciar" | "finalizar" | "pagar") => {
    setModal(accion);
  };

  const cerrarModal = () => {
    setModal(null);
  };

  const confirmarAccion = () => {
    if (modal === "iniciar") {
      console.log("Paseo iniciado");
    }
    if (modal === "finalizar") {
      console.log("Paseo finalizado");
    }
    if (modal === "pagar") {
      console.log("Pago realizado");
    }
    cerrarModal();
  };

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-pretty md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Hola, {user.nombre}!
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Bienvenid@ a tu panel de control. Aquí puedes gestionar tus paseos y
          conectar con paseadores de confianza.
        </p>
      </header>

      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
        <article className="p-6 card-neumorphism">
          <p className="text-gray-600">Paseos Completados</p>
          <p className="text-3xl md:text-4xl font-extrabold">
            {user.paseosCompletados}
          </p>
        </article>

        <article className="p-6 card-neumorphism">
          <p className="text-gray-600">Nuevo Paseo</p>
          <p className="text-2xl md:text-3xl font-extrabold">
            {proximoPaseo.duracion}
          </p>
          <p className="text-gray-600 mt-2">Paseador</p>
          <p className="text-2xl md:text-3xl font-extrabold">
            {proximoPaseo.paseador}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/postulantes"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg active:scale-95 transition-all duration-200"
            >
              Ver Postulantes
            </Link>
            <button
              onClick={() => abrirModal("iniciar")}
              className="rounded-full px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg active:scale-95 transition-all duration-200"
            >
              Iniciar
            </button>
            <button
              onClick={() => abrirModal("finalizar")}
              className="rounded-full px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-lg active:scale-95 transition-all duration-200"
            >
              Finalizar
            </button>
            <button
              onClick={() => abrirModal("pagar")}
              className="rounded-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg active:scale-95 transition-all duration-200"
            >
              Pagar
            </button>
          </div>
        </article>
      </section>

      <section className="max-w-6xl mx-auto p-6 card-neumorphism overflow-hidden">
        <h2 className="px-6 pt-6 text-xl md:text-2xl font-bold">
          Historial de Paseos Recientes
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Duración</th>
                <th className="px-6 py-3 text-left">Paseador</th>
                <th className="px-6 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historial.map((paseo, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">{paseo.fecha}</td>
                  <td className="px-6 py-4">{paseo.duracion}</td>
                  <td className="px-6 py-4">{paseo.paseador}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-4 py-1 bg-emerald-50 text-emerald-700 font-semibold">
                      {paseo.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-6 flex">
          <Link
            to="/nuevo-paseo"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50 active:scale-95 transition-all duration-200"
          >
            Solicitar Nuevo Paseo
          </Link>
        </div>
      </section>

      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 text-center">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {modal === "iniciar" && "¿Estás seguro de iniciar el paseo?"}
              {modal === "finalizar" && "¿Estás seguro de finalizar el paseo?"}
              {modal === "pagar" && "¿Deseas confirmar el pago?"}
            </h2>
            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={cerrarModal}
                className="px-4 py-2 rounded-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarAccion}
                className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
