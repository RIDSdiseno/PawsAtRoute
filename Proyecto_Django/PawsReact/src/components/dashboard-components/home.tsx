import { Link } from "react-router-dom";

function Home() {
  // Datos de ejemplo (deberían venir de la base de datos)
  const user = {
    nombre: "María",
    paseosCompletados: 5,
  };

  const proximoPaseo = {
    hora: "10:00 AM - 11:30 AM",
    paseador: "Carlos",
  };

  const historial = [
    {
      fecha: "15 de Mayo",
      hora: "10:00 AM",
      paseador: "Carlos",
      estado: "Completado",
    },
    {
      fecha: "12 de Mayo",
      hora: "3:00 PM",
      paseador: "Ana",
      estado: "Completado",
    },
    {
      fecha: "10 de Mayo",
      hora: "11:00 AM",
      paseador: "Carlos",
      estado: "Completado",
    },
  ];

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <header className="mb-10 text-pretty md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Hola, {user.nombre}!
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Bienvenid@ a tu panel de control. Aquí puedes gestionar tus paseos y
          conectar con paseadores de confianza.
        </p>
      </header>

      {/* Métricas */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
        <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600">Paseos Completados</p>
          <p className="text-3xl md:text-4xl font-extrabold">
            {user.paseosCompletados}
          </p>
        </article>

        <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
          <p className="text-gray-600">Nuevo Paseo</p>
          <p className="text-2xl md:text-3xl font-extrabold">
            {proximoPaseo.hora}
          </p>
          <p className="text-gray-600 mt-2">Paseador</p>
          <p className="text-2xl md:text-3xl font-extrabold">
            {proximoPaseo.paseador}
          </p>
          <div className="py-4 flex">
            <Link
              to="/postulantes"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50"
            >
              Ver Postulantes
            </Link>
          </div>
        </article>
      </section>

      {/* Historial */}
      <section className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
        <h2 className="px-6 pt-6 text-xl md:text-2xl font-bold">
          Historial de Paseos Recientes
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Hora</th>
                <th className="px-6 py-3 text-left">Paseador</th>
                <th className="px-6 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {historial.map((paseo, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">{paseo.fecha}</td>
                  <td className="px-6 py-4">{paseo.hora}</td>
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

        {/* Acción */}
        <div className="px-6 py-6 flex">
          <Link
            to="/nuevo-paseo"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50"
          >
            Solicitar Nuevo Paseo
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
