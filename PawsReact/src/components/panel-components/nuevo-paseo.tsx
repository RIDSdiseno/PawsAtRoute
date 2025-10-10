import { useEffect, useMemo, useState } from "react";
import { createPaseo, listMisMascotas, type Mascota } from "../../api/api.ts";

function NuevoPaseo() {
  const [duracion, setDuracion] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<string>("");
  const [mascotasSeleccionadas, setMascotasSeleccionadas] = useState<number[]>([]);
  const [misMascotas, setMisMascotas] = useState<Mascota[]>([]);
  const [loadingMascotas, setLoadingMascotas] = useState(true);

  const [fecha, setFecha] = useState<string>("");     // YYYY-MM-DD
  const [horaLocal, setHoraLocal] = useState<string>(""); // HH:mm
  const [ubicacion, setUbicacion] = useState<string>("");

  const [publicando, setPublicando] = useState(false);

  const TARIFA_BASE = 10000;
  const TARIFA_EXTRA = 5000;
  const BLOQUE_MINUTOS = 30;
  const PRECIO_MAXIMO = 25000;

  const DURACIONES = [
    { label: "30 minutos", value: 30 },
    { label: "1 hora", value: 60 },
    { label: "1 hora 30 minutos", value: 90 },
    { label: "2 horas", value: 120 },
  ];

  // Cargar mascotas del dueño autenticado
  useEffect(() => {
    (async () => {
      try {
        const res = await listMisMascotas({ pageSize: 50 });
        setMisMascotas(res.items);
      } catch (e) {
        console.error("No se pudieron cargar las mascotas", e);
      } finally {
        setLoadingMascotas(false);
      }
    })();
  }, []);

  const handleSeleccionMascota = (idMascota: number) => {
    setMascotasSeleccionadas((prev) =>
      prev.includes(idMascota)
        ? prev.filter((m) => m !== idMascota)
        : prev.length < 3
        ? [...prev, idMascota]
        : prev
    );
  };

  // Precio por paseo (se cobra por mascota porque creamos 1 paseo por cada una)
  const precio = useMemo(() => {
    if (!duracion) return 0;
    const bloques = duracion / BLOQUE_MINUTOS;
    const p = TARIFA_BASE + Math.max(0, (bloques - 1) * TARIFA_EXTRA);
    return Math.min(p, PRECIO_MAXIMO);
  }, [duracion]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fecha || !horaLocal) return alert("Selecciona fecha y hora.");
    if (!duracion) return alert("Selecciona la duración.");
    if (!ubicacion.trim()) return alert("Ingresa la ubicación.");
    if (!metodoPago) return alert("Selecciona el método de pago.");
    if (mascotasSeleccionadas.length === 0) return alert("Selecciona al menos 1 mascota.");

    const horaISO = new Date(`${fecha}T${horaLocal}:00`).toISOString();

    setPublicando(true);
    try {
      await Promise.all(
        mascotasSeleccionadas.map((idMascota) =>
          createPaseo({
            mascotaId: idMascota,
            fecha,                 // "YYYY-MM-DD"
            hora: horaISO,         // ISO completo
            duracion,              // minutos
            lugarEncuentro: ubicacion,
            notas: `Método de pago: ${metodoPago}`,
          })
        )
      );
      alert("Paseo(s) publicado(s) correctamente");

      // Reset
      setMascotasSeleccionadas([]);
      setDuracion(0);
      setMetodoPago("");
      setFecha("");
      setHoraLocal("");
      setUbicacion("");
    } catch (err: any) {
      alert(err?.response?.data?.error ?? "No se pudo publicar el/los paseo(s)");
    } finally {
      setPublicando(false);
    }
  }

  return (
    <section className="min-h-screen text-prussian-blue font-nunito p-4 sm:p-6 lg:p-8 my-6">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-5xl font-bold">¡Publica tu paseo!</h1>
        <p className="mt-2">Aquí puedes personalizar tu solicitud.</p>
      </header>

      <section className="animate-blurred-fade-in animate-duration-200 max-w-md mx-auto gap-6 flex flex-col justify-center">
        <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-xl bg-white border border-gray-200 p-6 shadow-lg">
          <h1 className="font-bebas text-2xl text-center">Solicitud de Paseo</h1>

          {/* Mascotas del dueño */}
          <fieldset className="flex flex-col gap-4 border rounded-lg p-4 bg-gray-50">
            <legend className="font-semibold text-center">¿Qué mascota irá hoy de paseo?</legend>

            {loadingMascotas ? (
              <p className="text-center text-gray-500">Cargando mascotas…</p>
            ) : misMascotas.length === 0 ? (
              <p className="text-center text-gray-500">No tienes mascotas registradas.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {misMascotas.map((m) => (
                  <label
                    key={m.idMascota}
                    className="flex items-center gap-2 border rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={m.idMascota}
                      checked={mascotasSeleccionadas.includes(m.idMascota)}
                      onChange={() => handleSeleccionMascota(m.idMascota)}
                      className="accent-prussian-blue cursor-pointer"
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{m.nombre}</span>
                      <span className="text-sm text-gray-600">
                        {m.especie} — {m.raza}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500">Puedes seleccionar hasta 3 mascotas por paseo.</p>
          </fieldset>

          {/* Fecha y hora */}
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-800">Fecha</span>
              <input
                type="date"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
                className="p-3 border-2 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-semibold text-gray-800">Hora</span>
              <input
                type="time"
                value={horaLocal}
                onChange={(e) => setHoraLocal(e.target.value)}
                required
                className="p-3 border-2 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </label>
          </div>

          {/* Duración */}
          <fieldset className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
            <legend className="font-semibold text-center">Duración del paseo</legend>
            <div className="flex flex-col gap-2">
              {DURACIONES.map((op) => (
                <label key={op.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="duracion"
                    value={op.value}
                    checked={duracion === op.value}
                    onChange={() => setDuracion(op.value)}
                    className="peer cursor-pointer accent-prussian-blue"
                    required
                  />
                  {op.label}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Ubicación */}
          <label className="flex flex-col gap-2 w-full" htmlFor="ubicacion">
            <p className="font-semibold text-gray-800">Ubicación</p>
            <input
              className="peer w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 invalid:border-red-500 invalid:text-red-500"
              type="text"
              required
              id="ubicacion"
              minLength={10}
              maxLength={80}
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
              placeholder="Ejemplo: Av. Las Condes 1234"
            />
            <p className="invisible text-xs text-red-500 peer-invalid:visible ">
              Por favor, ingresa calle y número del domicilio.
            </p>
          </label>

          {/* Método de pago (solo lo guardamos como nota por ahora) */}
          <fieldset className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
            <legend className="font-semibold text-center">Método de pago</legend>
            <div className="flex gap-4">
              {["Transbank", "Efectivo"].map((op) => (
                <label key={op} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="metodoPago"
                    value={op}
                    checked={metodoPago === op}
                    onChange={() => setMetodoPago(op)}
                    className="peer cursor-pointer accent-prussian-blue"
                    required
                  />
                  {op}
                </label>
              ))}
            </div>
          </fieldset>

          {/* Precio */}
          <div className="border-t pt-4">
            <p className="font-semibold">Precio estimado (por mascota)</p>
            <p className="text-lg font-bold text-green-700">
              {precio > 0 ? `$${precio.toLocaleString("es-CL")}` : "--"}
            </p>
            <p className="text-xs text-gray-500">
              30 min: $10.000; cada 30 min extra: $5.000 (máx. $25.000).
            </p>
          </div>

          <button
            type="submit"
            disabled={
              mascotasSeleccionadas.length === 0 ||
              !duracion ||
              !metodoPago ||
              !fecha ||
              !horaLocal ||
              !ubicacion ||
              publicando ||
              loadingMascotas
            }
            className="bg-prussian-blue text-white font-semibold rounded-full p-2 hover:bg-prussian-blue/80 border-2 border-cyan-900 shadow-lg shadow-prussian-blue/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {publicando ? "Publicando..." : "Publicar"}
          </button>
        </form>
      </section>
    </section>
  );
}

export default NuevoPaseo;
