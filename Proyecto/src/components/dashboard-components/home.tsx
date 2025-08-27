import { Link } from "react-router-dom";

function Home() {
  return (
    <section className="relative min-h-screen text-prussian-blue font-nunito p-4 sm:p-6 lg:p-8">
      <div className="fixed inset-0 z-[-2] bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Perfil y Nuevo Paseo */}
        <div className="lg:col-span-1 flex flex-col gap-8">
          {/* Perfil */}
          <div className="rounded-xl bg-white p-6">
            <h2 className="font-bebas text-2xl mb-4">Perfil: Dueño</h2>
            <div className="space-y-2">
              <p>
                <strong>Nombre:</strong>
              </p>
              <p>
                <strong>Apellido:</strong>
              </p>
              <p>
                <strong>Correo:</strong>
              </p>
            </div>
            <button className="mt-4 w-full bg-prussian-blue text-white rounded-md p-2 cursor-pointer hover:bg-prussian-blue/80 transition-colors">
              Editar
            </button>
          </div>

          {/* Nuevo Paseo */}
          <div className="rounded-xl bg-white p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors duration-300">
            <Link to="/nuevo-paseo">
              <p className="text-ut-orange font-bebas text-8xl">+</p>
              <p className="font-bebas text-2xl mt-2">Nuevo paseo</p>
            </Link>
          </div>
        </div>

        {/* Columna Derecha: Paseos */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="rounded-xl bg-white p-6">
            <h2 className="font-bebas text-2xl mb-4">Paseo publicado</h2>
            <div className="overflow-x-auto rounded-t-xl">
              <table className="w-full text-left border-collapse ">
                <thead>
                  <tr className="bg-gray-200 ">
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Fecha
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Hora
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Teléfono
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="flex flex-col gap-2 mt-4">
                <p className="font-bebas text-xl mb-2">Estados del paseo</p>
                <div className="flex gap-2">
                  <button className="bg-yellow-500 text-white rounded-md p-2 cursor-no-drop text-sm flex-1">
                    Publicado
                  </button>
                  <button className="bg-green-500 text-white rounded-md p-2 cursor-no-drop text-sm flex-1">
                    En progreso
                  </button>
                  <button className="bg-red-500 text-white rounded-md p-2 cursor-no-drop text-sm flex-1">
                    Finalizado
                  </button>
                </div>
              </div>
            </div>
            <p className="font-bebas text-xl mt-4">Paseadores candidatos</p>
            <div className="overflow-x-auto rounded-t-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Nombre
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Apellido
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Correo
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Telefono
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Calificacion
                    </th>
                  </tr>
                </thead>
                <tbody className="text-center text-sm font-semibold tracking-wide divide-y">
                  <tr className="p-3">
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      X
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-xl bg-white p-6">
            <h2 className="font-bebas text-2xl mb-4">Historial de paseos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Fecha
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Hora
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Paseador
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Teléfono
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-center">
                      Precio
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      25/08/2025
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      12:00 - 14:00
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      Mario
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      123456789
                    </td>
                    <td className="p-3 text-sm text-gray-700 text-center whitespace-nowrap">
                      $10.000 CLP
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Home;
