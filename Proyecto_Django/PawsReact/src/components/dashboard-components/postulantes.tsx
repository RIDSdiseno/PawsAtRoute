import { Link } from "react-router-dom";

// Datos de ejemplo (deberían venir de la base de datos)
const postulantesData = [ // Las estrellas son dinámicas de acuerdo al valor de la variable calificacion.
  { id: 1, nombre: "Juan", telefono: "987654321", calificacion: 3 },
  { id: 2, nombre: "Maria", telefono: "912345678", calificacion: 4 },
  { id: 3, nombre: "Pedro", telefono: "976543210", calificacion: 5 },
];

// Función para renderizar estrellas
function Rating({ value }: { value: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <span
          key={star}
          className={`${
            star <= Math.floor(value) ? "text-yellow-400" : "text-gray-300"
          } text-lg`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-600">({value})</span>
    </div>
  );
}

function Postulantes() {
  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-pretty md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Postulantes</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Aquí podrás ver a los paseadores interesados en tu paseo.
        </p>
      </header>

      <section className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
        <h2 className="px-6 pt-6 text-xl md:text-2xl font-bold">Información</h2>

        {/* Responsive: tabla en desktop, tarjetas en móvil */}
        <div className="mt-4 overflow-x-auto hidden md:block">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-left">Teléfono</th>
                <th className="px-6 py-3 text-left">Calificación</th>
                <th className="px-6 py-3 text-left">Perfil</th>
                <th className="px-6 py-3 text-left">Elegir</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {postulantesData.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4">{p.nombre}</td>
                  <td className="px-6 py-4">{p.telefono}</td>
                  <td className="px-6 py-4">
                    <Rating value={p.calificacion} />
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      to="/perfil-paseador"
                      className="bg-ut-orange text-white rounded-lg px-4 py-2 hover:bg-ut-orange/80 font-semibold border-2 border-orange-500 shadow-md"
                    >
                      Ver Perfil
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <label>
                      <input
                        type="radio"
                        name="paseador"
                        value={p.id}
                        className="sr-only peer"
                      />
                      <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer font-semibold peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue">
                        Seleccionar
                      </div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista tipo tarjetas en móvil */}
        <div className="grid gap-4 p-4 md:hidden">
          {postulantesData.map((p) => (
            <div
              key={p.id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <h3 className="text-lg font-bold">{p.nombre}</h3>
              <p className="text-gray-600">📞 {p.telefono}</p>
              <Rating value={p.calificacion} />
              <div className="mt-4 flex gap-2">
                <Link
                  to="/perfil-paseador"
                  className="flex-1 text-center bg-ut-orange text-white rounded-lg px-4 py-2 hover:bg-ut-orange/80 font-semibold border-2 border-orange-500 shadow-md"
                >
                  Ver Perfil
                </Link>
                <label className="flex-1">
                  <input
                    type="radio"
                    name="paseador"
                    value={p.id}
                    className="sr-only peer"
                  />
                  <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer font-semibold peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue">
                    Seleccionar
                  </div>
                </label>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-6 flex">
          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50"
          >
            ¡Listo!
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Postulantes;
