import { useState } from "react";

interface Paseo {
  id: number;
  mascota: string;
  ubicacion: string;
  duracion: string;
  precio: string;
  imagen: string;
}

interface Historial {
  fecha: string;
  hora: string;
  mascota: string;
  estado: string;
}

interface User {
  nombre: string;
  paseosCompletados: number;
}

function DashboardPaseador() {
  const [selectedPaseo, setSelectedPaseo] = useState<Paseo | null>(null);

  const user: User = {
    nombre: "Carlos",
    paseosCompletados: 2,
  };

  const solicitudes: Paseo[] = [
    {
      id: 1,
      mascota: "Firulais",
      ubicacion: "Huechuraba",
      duracion: "30 minutos",
      precio: "5000",
      imagen: "/src/assets/img/perro-3.webp",
    },
    {
      id: 2,
      mascota: "Tito",
      ubicacion: "Colina",
      duracion: "60 minutos",
      precio: "10000",
      imagen: "/src/assets/img/perro-2.webp",
    },
    {
      id: 3,
      mascota: "Chispa",
      ubicacion: "Conchalí",
      duracion: "120 minutos",
      precio: "20000",
      imagen: "/src/assets/img/perro-3.webp",
    },
  ];

  const historial: Historial[] = [
    {
      fecha: "15 de Mayo",
      hora: "10:00 AM",
      mascota: "Firulais",
      estado: "Completado",
    },
    {
      fecha: "12 de Mayo",
      hora: "3:00 PM",
      mascota: "Tito",
      estado: "Completado",
    },
  ];

  const handleConfirm = () => {
    if (selectedPaseo) {
      alert(`Te has postulado al paseo con ${selectedPaseo.mascota}`);
      setSelectedPaseo(null);
    }
  };

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Hola, Paseador {user.nombre}!
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Bienvenid@ a tu panel de control. Aquí puedes gestionar tus paseos y
          hacer que las mascotas disfruten de un paseo seguro y agradable.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <article className="p-6 card-neumorphism">
          <p className="text-gray-600">Paseos Completados</p>
          <p className="text-3xl md:text-4xl font-extrabold mt-1">
            {user.paseosCompletados}
          </p>
        </article>

        <article className="p-6 card-neumorphism">
          <p className="text-gray-600">Paseo Activo</p>
          <p className="text-2xl md:text-3xl font-extrabold mt-1">
            {solicitudes[0].duracion}
          </p>
          <p className="text-gray-600 mt-2">Mascota</p>
          <p className="text-2xl md:text-3xl font-extrabold">
            {solicitudes[0].mascota}
          </p>
        </article>

        <article className="p-6 card-neumorphism md:col-span-2">
          <h2 className="text-xl md:text-2xl font-bold">Historial de Paseos</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Hora</th>
                  <th className="px-6 py-3 text-left">Mascota</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {historial.map((paseo, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">{paseo.fecha}</td>
                    <td className="px-6 py-4">{paseo.hora}</td>
                    <td className="px-6 py-4">{paseo.mascota}</td>
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
        </article>
      </section>

      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Solicitudes de Paseos
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {solicitudes.map((s) => (
            <div
              key={s.id}
              className="flex flex-col rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow overflow-hidden"
            >
              <img
                src={s.imagen}
                alt={`Foto de ${s.mascota}`}
                className="w-full h-48 object-cover"
              />
              <div className="flex flex-col flex-1 p-5">
                <h3 className="text-xl font-bold mb-2">{s.mascota}</h3>
                <p className="text-gray-600 mb-1">
                  <strong>Ubicación:</strong> {s.ubicacion}
                </p>
                <p className="text-gray-600 mb-1">
                  <strong>Duración:</strong> {s.duracion}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Precio: $</strong> {s.precio}
                </p>
                <button
                  onClick={() => setSelectedPaseo(s)}
                  className="mt-auto bg-prussian-blue border-2 border-cyan-900 text-white font-semibold px-4 py-2 rounded-lg shadow-md shadow-prussian-blue/50 hover:bg-prussian-blue/80 active:scale-95 transition-transform"
                >
                  Postularme
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedPaseo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-prussian-blue">
              ¿Estás seguro?
            </h3>
            <p className="text-gray-700 mb-2">
              Vas a postularte al paseo de{" "}
              <strong>{selectedPaseo?.mascota}</strong>
            </p>
            <ul className="text-gray-600 mb-6">
              <li>
                <strong>Ubicación:</strong> {selectedPaseo?.ubicacion}
              </li>
              <li>
                <strong>Duración:</strong> {selectedPaseo?.duracion}
              </li>
              <li>
                <strong>Precio:</strong> ${selectedPaseo?.precio}
              </li>
            </ul>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setSelectedPaseo(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg bg-prussian-blue text-white font-semibold shadow hover:bg-prussian-blue/80"
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

export default DashboardPaseador;