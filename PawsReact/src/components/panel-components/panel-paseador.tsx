import { useEffect, useState } from "react";
import { getProfile } from "../../api/api";

interface Paseo {
  id: number;
  dueno: string;
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
  apellido: string;
  paseosCompletados: number;
}

function DashboardPaseador() {
  const [selectedPaseo, setSelectedPaseo] = useState<Paseo | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<null | "iniciar" | "finalizar" | "pagar">(
    null
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        console.log("Perfil cargado:", profile);

        setUser({
          nombre: profile.nombre,
          apellido: profile.apellido,
          paseosCompletados: profile.paseos?.length || 0, // ajusta según cómo viene el backend
        });
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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

  const solicitudes: Paseo[] = [
    {
      id: 1,
      dueno: "Andrea",
      mascota: "Firulais",
      ubicacion: "Psj. Water seven 2500, Huechuraba",
      duracion: "30 minutos",
      precio: "5000",
      imagen: "/img/perro-3.webp",
    },
    {
      id: 2,
      dueno: "Martín",
      mascota: "Tito",
      ubicacion: "Psj. Wano 2323, Colina",
      duracion: "60 minutos",
      precio: "10000",
      imagen: "/img/perro-2.webp",
    },
    {
      id: 3,
      dueno: "Fernanda",
      mascota: "Chispa",
      ubicacion: "Psj. Dressrosa 1244, Conchalí",
      duracion: "120 minutos",
      precio: "20000",
      imagen: "/img/perro-3.webp",
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

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-prussian-blue">
        <p className="text-lg font-semibold">Cargando perfil...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Hola, Paseador {user?.nombre} {user?.apellido}!
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
            {user?.paseosCompletados}
          </p>
        </article>

        <article className="p-6 card-neumorphism">
          <p className="text-gray-600 text-xl md:text-2xl font-bold">
            Paseo Activo
          </p>
          <div className="mt-3 space-y-2">
            <p className="text-gray-600">
              <strong>Dueño:</strong> {solicitudes[0].dueno}
            </p>
            <p className="text-gray-600">
              <strong>Mascota:</strong> {solicitudes[0].mascota}
            </p>
            <p className="text-gray-600">
              <strong>Duración:</strong> {solicitudes[0].duracion}
            </p>
            <p className="text-gray-600">
              <strong>Ubicación:</strong> {solicitudes[0].ubicacion}
            </p>
            <p className="text-gray-600">
              <strong>Precio:</strong> ${solicitudes[0].precio}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => abrirModal("iniciar")}
              className="cursor-pointer rounded-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg active:scale-90 transition-all duration-100"
            >
              Iniciar
            </button>
            <button
              onClick={() => abrirModal("finalizar")}
              className="cursor-pointer rounded-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow-lg active:scale-90 transition-all duration-100"
            >
              Finalizar
            </button>
            <button
              onClick={() => abrirModal("pagar")}
              className="cursor-pointer rounded-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg active:scale-90 transition-all duration-100"
            >
              Pagar
            </button>
          </div>
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
          Paseos Publicados
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
                  <strong>Dueño:</strong> {s.dueno}
                </p>
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
              <strong>{selectedPaseo.mascota}</strong>
            </p>
            <ul className="text-gray-600 mb-6">
              <li>
                <strong>Dueño:</strong> {selectedPaseo.dueno}
              </li>
              <li>
                <strong>Ubicación:</strong> {selectedPaseo.ubicacion}
              </li>
              <li>
                <strong>Duración:</strong> {selectedPaseo.duracion}
              </li>
              <li>
                <strong>Precio:</strong> ${selectedPaseo.precio}
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

export default DashboardPaseador;