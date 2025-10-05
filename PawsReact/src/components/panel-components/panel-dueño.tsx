import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../api/api.ts";

function Home() {
  const [user, setUser] = useState<null | {
    idUsuario: number;
    nombre: string;
    apellido: string;
    rut: string;
    telefono: string;
    correo: string;
    rol: string;
  }>(null);

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-pretty md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Hola, {user ? `${user.nombre} ${user.apellido}` : "Cargando..."}!
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
            2 {/* Hardcoded por ahora */}
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
              className="inline-flex items-center justify-center rounded-full py-2 px-4 bg-prussian-blue hover:bg-prussian-blue/80 border border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50 active:scale-90 transition-all duration-100"
            >
              Ver Postulantes
            </Link>
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
            className="inline-flex items-center justify-center rounded-full py-2 px-4 bg-prussian-blue hover:bg-prussian-blue/80 border border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50 active:scale-90 transition-all duration-100"
          >
            Nuevo Paseo
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;