import { useState } from "react";

function NuevoPaseo() {
  const [duracion, setDuracion] = useState<number>(0);
  const [cantidad, setCantidad] = useState<number>(1);
  const [metodoPago, setMetodoPago] = useState<string>("");
  const [mascotas, setMascotas] = useState<
    { nombre: string; foto: string | null }[]
  >([{ nombre: "", foto: null }]);

  const TARIFA_POR_BLOQUE = 5000;
  const BLOQUE_MINUTOS = 30;

  const DURACIONES = [
    { label: "30 minutos", value: 30 },
    { label: "1 hora", value: 60 },
    { label: "1 hora 30 minutos", value: 90 },
    { label: "2 horas", value: 120 },
  ];

  const handleCantidadChange = (num: number) => {
    setCantidad(num);
    setMascotas((prev) => {
      const nuevos = [...prev];
      while (nuevos.length < num) nuevos.push({ nombre: "", foto: null });
      return nuevos.slice(0, num);
    });
  };

  const handleMascotaChange = (
    index: number,
    field: "nombre" | "foto",
    value: string | null
  ) => {
    const nuevas = [...mascotas];
    if (field === "nombre") nuevas[index].nombre = value || "";
    if (field === "foto") nuevas[index].foto = value;
    setMascotas(nuevas);
  };

  const bloques = Math.ceil(duracion / BLOQUE_MINUTOS);
  const precio = Math.min(bloques * TARIFA_POR_BLOQUE, 20000);

  return (
    <section className="min-h-screen text-prussian-blue font-nunito p-4 sm:p-6 lg:p-8 my-6">
      <header className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold">
          Publica tu paseo!
        </h1>
        <p className="mt-2">Aquí puedes personalizar tu solicitud.</p>
      </header>

      <section className="max-w-md mx-auto gap-4 md:gap-6 mb-10 flex flex-col justify-center">
        <form
          action="/panel-dueño"
          className="flex flex-col gap-4 rounded-xl bg-white border border-gray-200 p-6 shadow-lg"
        >
          <h1 className="font-bebas text-2xl text-center">
            Solicitud de Paseo
          </h1>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-semibold">Cantidad de mascotas</legend>
            <div className="flex gap-4">
              {[1, 2, 3].map((num) => (
                <label key={num} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="cantidad"
                    value={num}
                    checked={cantidad === num}
                    onChange={() => handleCantidadChange(num)}
                    className="peer cursor-pointer"
                    required
                  />
                  {num}
                </label>
              ))}
            </div>
          </fieldset>

          {mascotas.map((mascota, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 bg-gray-50 flex flex-col gap-3"
            >
              <label>
                <p className="font-semibold">
                  Nombre de la mascota {index + 1}
                </p>
                <input
                  type="text"
                  value={mascota.nombre}
                  onChange={(e) =>
                    handleMascotaChange(index, "nombre", e.target.value)
                  }
                  placeholder="Firulais"
                  required
                  className="w-full p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                />
              </label>

              <label>
                <p className="font-semibold">Foto de la mascota</p>
                <input
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) =>
                    handleMascotaChange(
                      index,
                      "foto",
                      e.target.files?.[0]
                        ? URL.createObjectURL(e.target.files[0])
                        : null
                    )
                  }
                  className="peer w-full"
                />
                {mascota.foto && (
                  <img
                    src={mascota.foto}
                    alt={`Mascota ${index + 1}`}
                    loading="lazy"
                    className="size-24 object-cover rounded-full mt-2 shadow-lg border border-gray-300"
                  />
                )}
              </label>
            </div>
          ))}

          <fieldset className="flex flex-col gap-2">
            <legend className="font-semibold">Duración del paseo</legend>
            <div className="flex flex-col gap-2">
              {DURACIONES.map((op) => (
                <label key={op.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="duracion"
                    value={op.value}
                    checked={duracion === op.value}
                    onChange={() => setDuracion(op.value)}
                    className="peer cursor-pointer"
                    required
                  />
                  {op.label}
                </label>
              ))}
            </div>
          </fieldset>

          <label className="flex flex-col gap-1" htmlFor="ubicacion">
            <p className="font-semibold">Ubicación</p>
            <input
              className="p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
              type="text"
              required
              id="ubicacion"
              minLength={10}
              maxLength={30}
            />
            <p className="invisible text-xs text-red-500 peer-invalid:visible">
              Por favor, ingresa calle y número del domicilio.
            </p>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3332.2920752049267!2d-70.6781852!3d-33.36344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662c7025c925e0f%3A0x7f2f6a657c08d14a!2sDuoc%20UC%3A%20Sede%20Plaza%20Norte!5e0!3m2!1ses!2scl!4v1758849954330!5m2!1ses!2scl"
              className="w-full h-48 rounded-lg shadow-lg border-2 border-gray-300"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </label>

          <fieldset className="flex flex-col gap-2">
            <legend className="font-semibold">Método de pago</legend>
            <div className="flex gap-4">
              {["Transbank", "Efectivo"].map((op) => (
                <label key={op} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="metodoPago"
                    value={op}
                    checked={metodoPago === op}
                    onChange={() => setMetodoPago(op)}
                    className="peer cursor-pointer"
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
              Se cobra $5.000 por cada 30 minutos (máx. $20.000).
            </p>
          </div>

          <button
            type="submit"
            disabled={!duracion || !metodoPago}
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
