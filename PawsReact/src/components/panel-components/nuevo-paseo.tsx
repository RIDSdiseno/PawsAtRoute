import { useState } from "react";

function NuevoPaseo() {
  const [duracion, setDuracion] = useState<number>(0);
  const [metodoPago, setMetodoPago] = useState<string>("");
  const [mascotasSeleccionadas, setMascotasSeleccionadas] = useState<string[]>(
    []
  );

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

  const MASCOTAS_REGISTRADAS = [
    { nombre: "Firulais", especie: "Canino", raza: "Labrador Retriever" },
    { nombre: "Michi", especie: "Felino", raza: "Persa" },
    { nombre: "Rocky", especie: "Canino", raza: "Pastor Alemán" },
    { nombre: "Luna", especie: "Canino", raza: "Pug" },
  ];

  const handleSeleccionMascota = (nombre: string) => {
    setMascotasSeleccionadas((prev) =>
      prev.includes(nombre)
        ? prev.filter((m) => m !== nombre)
        : prev.length < 3
        ? [...prev, nombre]
        : prev
    );
  };

  let precio = 0;
  if (duracion > 0) {
    const bloques = duracion / BLOQUE_MINUTOS;
    precio = TARIFA_BASE + Math.max(0, (bloques - 1) * TARIFA_EXTRA);
    precio = Math.min(precio, PRECIO_MAXIMO);
  }

  return (
    <section className="min-h-screen text-prussian-blue font-nunito p-4 sm:p-6 lg:p-8 my-6">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-5xl font-bold">Publica tu paseo!</h1>
        <p className="mt-2">Aquí puedes personalizar tu solicitud.</p>
      </header>

      <section className="max-w-md mx-auto gap-6 flex flex-col justify-center">
        <form
          action="/panel-dueño"
          className="flex flex-col gap-6 rounded-xl bg-white border border-gray-200 p-6 shadow-lg"
        >
          <h1 className="font-bebas text-2xl text-center">
            Solicitud de Paseo
          </h1>

          <fieldset className="flex flex-col gap-4 border rounded-lg p-4 bg-gray-50">
            <legend className="font-semibold text-center">
              ¿Qué mascota irá hoy de paseo?
            </legend>
            <div className="flex flex-col gap-2">
              {MASCOTAS_REGISTRADAS.map((mascota) => (
                <label
                  key={mascota.nombre}
                  className="flex items-center gap-2 border rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    value={mascota.nombre}
                    checked={mascotasSeleccionadas.includes(mascota.nombre)}
                    onChange={() => handleSeleccionMascota(mascota.nombre)}
                    className="accent-prussian-blue cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{mascota.nombre}</span>
                    <span className="text-sm text-gray-600">
                      {mascota.especie} - {mascota.raza}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              Puedes seleccionar hasta 3 mascotas por paseo.
            </p>
          </fieldset>

          <fieldset className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
            <legend className="font-semibold text-center">
              Duración del paseo
            </legend>
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
                  <p className="invisible text-xs text-red-500 peer-invalid:visible ">
                    Selecciona la duración.
                  </p>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-2 w-full" htmlFor="ubicacion">
            <p className="font-semibold text-gray-800">Ubicación</p>
            <input
              className="peer w-full p-3  border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 placeholder-gray-400 invalid:border-red-500 invalid:text-red-500"
              type="text"
              required
              id="ubicacion"
              minLength={10}
              maxLength={30}
              placeholder="Ejemplo: Av. Las Condes 1234"
            />
            <p className="invisible text-xs text-red-500 peer-invalid:visible ">
              Por favor, ingresa calle y número del domicilio.
            </p>
          </label>

          <fieldset className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
            <legend className="font-semibold text-center">
              Método de pago
            </legend>
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

          <div className="border-t pt-4">
            <p className="font-semibold">Precio estimado</p>
            <p className="text-lg font-bold text-green-700">
              {precio > 0 ? `$${precio.toLocaleString("es-CL")}` : "--"}
            </p>
            <p className="text-xs text-gray-500">
              Primeros 30 minutos: $10.000. Cada 30 min extra: $5.000 (máx.
              $25.000).
            </p>
          </div>

          <button
            type="submit"
            disabled={
              mascotasSeleccionadas.length === 0 || !duracion || !metodoPago
            }
            className="bg-prussian-blue text-white font-semibold rounded-full p-2 hover:bg-prussian-blue/80 border-2 border-cyan-900 shadow-lg shadow-prussian-blue/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </form>
      </section>
    </section>
  );
}

export default NuevoPaseo;
