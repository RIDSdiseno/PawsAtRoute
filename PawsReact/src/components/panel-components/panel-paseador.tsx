import { useEffect, useMemo, useState } from "react";
import { getProfile, listPaseosDisponibles, listMisPaseosComoPaseador, aceptarPaseo, type Paseo } from "../../api/api";

type User = {
  idUsuario: number;
  nombre: string;
  apellido: string;
  rol: string; // "PASEADOR"
};

function combinarFechaHora(fISO: string, hISO: string) {
  const f = new Date(fISO);
  const h = new Date(hISO);
  return new Date(f.getFullYear(), f.getMonth(), f.getDate(), h.getHours(), h.getMinutes(), h.getSeconds(), h.getMilliseconds());
}

function durPretty(mins: number) {
  return mins >= 60 ? `${Math.floor(mins/60)}h ${mins % 60 ? `${mins%60}m` : ""}`.trim() : `${mins}m`;
}

function DashboardPaseador() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [disponibles, setDisponibles] = useState<(Paseo & { mascota: { nombre: string; especie: string; raza: string }})[]>([]);
  const [misPaseos, setMisPaseos] = useState<(Paseo & { mascota: { nombre: string; especie: string; raza: string }})[]>([]);
  const [tomando, setTomando] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // cargar perfil + listas
  useEffect(() => {
    (async () => {
      try {
        const profile = await getProfile();
        setUser({ idUsuario: profile.idUsuario, nombre: profile.nombre, apellido: profile.apellido, rol: profile.rol });

        const [disp, mias] = await Promise.all([
          listPaseosDisponibles({ page: 1, pageSize: 30 }),
          listMisPaseosComoPaseador({ page: 1, pageSize: 30 }),
        ]);
        setDisponibles(disp.items);
        setMisPaseos(mias.items);
      } catch (e: any) {
        console.error("Error cargando panel paseador:", e);
        setErrorMsg(e?.response?.data?.error ?? "No se pudieron cargar los datos");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // paseo activo = primero ACEPATADO/EN_CURSO futuro más cercano
  const paseoActivo = useMemo(() => {
    return misPaseos
      .filter(p => p.estado === "ACEPTADO" || p.estado === "EN_CURSO")
      .map(p => ({ ...p, when: combinarFechaHora(p.fecha, p.hora) }))
      .sort((a, b) => a.when.getTime() - b.when.getTime())[0] || null;
  }, [misPaseos]);

  // historial = FINALIZADO más recientes
  const historial = useMemo(() => {
    return misPaseos
      .filter(p => p.estado === "FINALIZADO")
      .map(p => ({ ...p, when: combinarFechaHora(p.fecha, p.hora) }))
      .sort((a, b) => b.when.getTime() - a.when.getTime())
      .slice(0, 10);
  }, [misPaseos]);

  async function onTomarPaseo(idPaseo: number) {
    try {
      setTomando(idPaseo);
      setErrorMsg(null);
      await aceptarPaseo(idPaseo);

      // refrescar listas: el paseo sale de "disponibles" y entra en "mis paseos"
      const [disp, mias] = await Promise.all([
        listPaseosDisponibles({ page: 1, pageSize: 30 }),
        listMisPaseosComoPaseador({ page: 1, pageSize: 30 }),
      ]);
      setDisponibles(disp.items);
      setMisPaseos(mias.items);
    } catch (e: any) {
      console.error("Aceptar paseo error:", e);
      alert(e?.response?.data?.error ?? "No se pudo tomar el paseo (puede que otro paseador lo haya tomado)");
    } finally {
      setTomando(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-prussian-blue">
        <p className="text-lg font-semibold">Cargando…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Hola, Paseador {user?.nombre} {user?.apellido}!
        </h1>
        {errorMsg && <p className="text-red-600 mt-2">{errorMsg}</p>}
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Gestiona tus paseos y toma nuevas solicitudes disponibles.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {/* Paseo activo */}
        <article className="animate-fade-in-up animate-delay-400 p-6 card-neumorphism">
          <p className="text-gray-600 text-xl md:text-2xl font-bold">Paseo Activo</p>
          {paseoActivo ? (
            <div className="mt-3 space-y-2">
              <p className="text-gray-600"><strong>Mascota:</strong> {paseoActivo.mascota?.nombre ?? "-"}</p>
              <p className="text-gray-600"><strong>Duración:</strong> {durPretty(paseoActivo.duracion)}</p>
              <p className="text-gray-600"><strong>Ubicación:</strong> {paseoActivo.lugarEncuentro}</p>
              <p className="text-gray-600"><strong>Fecha:</strong> {paseoActivo.when.toLocaleDateString()}</p>
              <p className="text-gray-600"><strong>Hora:</strong> {paseoActivo.when.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</p>
              <p className="text-gray-600"><strong>Estado:</strong> {paseoActivo.estado}</p>
            </div>
          ) : (
            <p className="mt-3 text-gray-600">No tienes un paseo activo.</p>
          )}
        </article>

        {/* Resumen completados */}
        <article className="animate-fade-in-up animate-delay-200 p-6 card-neumorphism">
          <p className="text-gray-600">Paseos Completados</p>
          <p className="text-3xl md:text-4xl font-extrabold mt-1">
            {misPaseos.filter(p => p.estado === "FINALIZADO").length}
          </p>
        </article>

        {/* Historial */}
        <article className="animate-fade-in-up animate-delay-700 p-6 card-neumorphism md:col-span-2">
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
                {historial.length === 0 ? (
                  <tr><td className="px-6 py-4" colSpan={4}>Aún no tienes historial.</td></tr>
                ) : (
                  historial.map((p) => {
                    const when = combinarFechaHora(p.fecha, p.hora);
                    return (
                      <tr key={p.idPaseo}>
                        <td className="px-6 py-4">{when.toLocaleDateString()}</td>
                        <td className="px-6 py-4">{when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td>
                        <td className="px-6 py-4">{p.mascota?.nombre ?? "-"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex rounded-full px-4 py-1 bg-emerald-50 text-emerald-700 font-semibold">
                            {p.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* Paseos disponibles */}
      <section>
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Paseos Publicados (Disponibles)</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in-up animate-delay-800">
          {disponibles.length === 0 ? (
            <p className="text-gray-600">No hay paseos disponibles por ahora.</p>
          ) : (
            disponibles.map((s) => {
              const when = combinarFechaHora(s.fecha, s.hora);
              return (
                <div
                  key={s.idPaseo}
                  className="flex flex-col rounded-2xl bg-white border border-gray-200 shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="flex flex-col flex-1 p-5">
                    <h3 className="text-xl font-bold mb-2">{s.mascota?.nombre ?? "Mascota"}</h3>
                    <p className="text-gray-600"><strong>Fecha:</strong> {when.toLocaleDateString()}</p>
                    <p className="text-gray-600"><strong>Hora:</strong> {when.toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}</p>
                    <p className="text-gray-600"><strong>Duración:</strong> {durPretty(s.duracion)}</p>
                    <p className="text-gray-600"><strong>Ubicación:</strong> {s.lugarEncuentro}</p>
                    <p className="text-gray-600 mb-4"><strong>Estado:</strong> {s.estado}</p>
                    <button
                      disabled={tomando === s.idPaseo}
                      onClick={() => onTomarPaseo(s.idPaseo)}
                      className="mt-auto bg-prussian-blue border-2 border-cyan-900 text-white font-semibold px-4 py-2 rounded-lg shadow-md shadow-prussian-blue/50 hover:bg-prussian-blue/80 active:scale-95 transition-transform disabled:opacity-60"
                    >
                      {tomando === s.idPaseo ? "Tomando…" : "Tomar paseo"}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </main>
  );
}

export default DashboardPaseador;
