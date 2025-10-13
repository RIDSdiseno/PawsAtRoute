import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile, listPaseos, type PaseoListItem } from "../../api/api";
import type { EstadoPaseo } from "../../api/api";
type User = {
  idUsuario: number;
  nombre: string;
  apellido: string;
  rut: string;
  telefono: string;
  correo: string;
  rol: string; // "DUENO" | "PASEADOR"
};

function combinarFechaHora(fISO: string, hISO: string) {
  const f = new Date(fISO);
  const h = new Date(hISO);
  return new Date(
    f.getFullYear(), f.getMonth(), f.getDate(),
    h.getHours(), h.getMinutes(), h.getSeconds(), h.getMilliseconds()
  );
}

function prettyEstado(e: EstadoPaseo):string {
  switch (e) {
    case "PENDIENTE":  return "Pendiente";
    case "ACEPTADO":   return "Aceptado";
    case "EN_CURSO":   return "En curso";
    case "FINALIZADO": return "Completado";
    case "CANCELADO":  return "Cancelado";
    default: return e;
  }
}

function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [paseos, setPaseos] = useState<PaseoListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setUser(profile);

        const res = await listPaseos({
          mias: true,
          page: 1,
          pageSize: 20,
        });
        setPaseos(res.items);
      } catch (error) {
        console.error("Error cargando Home:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const proximo = useMemo(() => {
    const futuros = paseos
      .map(p => ({ ...p, when: combinarFechaHora(p.fecha, p.hora) }))
      .filter(p => p.when.getTime() > Date.now() && p.estado !== "CANCELADO")
      .sort((a, b) => a.when.getTime() - b.when.getTime());
    return futuros[0] || null;
  }, [paseos]);

  const completados = useMemo(
    () => paseos.filter(p => p.estado === "FINALIZADO").length,
    [paseos]
  );

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
        <article className="animate-fade-in-up animate-delay-200 p-6 card-neumorphism">
          <p className="text-gray-600">Paseos Completados</p>
          <p className="text-3xl md:text-4xl font-extrabold">
            {loading ? "…" : completados}
          </p>
        </article>

        <article className="animate-fade-in-up animate-delay-400 p-6 card-neumorphism">
          <p className="text-gray-600">Próximo Paseo</p>
          {loading ? (
            <p className="text-2xl md:text-3xl font-extrabold">…</p>
          ) : proximo ? (
            <>
              <p className="text-sm text-gray-600 mt-1">
                {proximo.when.toLocaleDateString()} —{" "}
                {proximo.when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p>
              <p className="text-gray-600 mt-2">Paseador</p>
              <p className="text-2xl md:text-3xl font-extrabold">
                {proximo.paseadorId ? "Asignado" : "Sin asignar"}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/postulantes"
                  className="inline-flex items-center justify-center rounded-full py-2 px-4 bg-prussian-blue hover:bg-prussian-blue/80 border border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50 active:scale-90 transition-all duration-100"
                >
                  Ver Postulantes
                </Link>
              </div>
            </>
          ) : (
            <p className="text-2xl md:text-3xl font-extrabold">No hay próximos</p>
          )}
        </article>
      </section>

      <section className="max-w-6xl mx-auto p-6 card-neumorphism overflow-hidden animate-fade-in-up animate-delay-700">
        <h2 className="px-6 pt-6 text-xl md:text-2xl font-bold">
          Historial de Paseos Recientes
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 text-left">Fecha</th>
                <th className="px-6 py-3 text-left">Hora</th>
                <th className="px-6 py-3 text-left">Mascota</th>
                <th className="px-6 py-3 text-left">Duración</th>
                <th className="px-6 py-3 text-left">Paseador</th>
                <th className="px-6 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td className="px-6 py-4" colSpan={6}>Cargando…</td></tr>
              ) : paseos.length === 0 ? (
                <tr><td className="px-6 py-4" colSpan={6}>Aún no tienes paseos.</td></tr>
              ) : (
                paseos
                  .slice()
                  .sort((a, b) => {
                    const A = combinarFechaHora(a.fecha, a.hora).getTime();
                    const B = combinarFechaHora(b.fecha, b.hora).getTime();
                    return B - A; // recientes primero
                  })
                  .map((p) => {
                    const when = combinarFechaHora(p.fecha, p.hora);
                    const dur = p.duracion >= 60
                      ? `${Math.floor(p.duracion / 60)}h ${p.duracion % 60 ? `${p.duracion % 60}m` : ""}`.trim()
                      : `${p.duracion}m`;
                    return (
                      <tr key={p.idPaseo}>
                        <td className="px-6 py-4">{when.toLocaleDateString()}</td>
                        <td className="px-6 py-4">{when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="px-6 py-4">{p.mascota?.nombre ?? "-"}</td>
                        <td className="px-6 py-4">{dur}</td>
                        <td className="px-6 py-4">{p.paseadorId ? "Asignado" : "Sin asignar"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full px-4 py-1 bg-emerald-50 text-emerald-700 font-semibold">
                            {prettyEstado(p.estado)}
                          </span>
                        </td>
                      </tr>
                    );
                  })
              )}
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
