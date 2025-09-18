import { useState } from "react";

function NuevoPaseo() {
  const [inicio, setInicio] = useState<string>("");
  const [termino, setTermino] = useState<string>("");
  const [error, setError] = useState("");
  const [cantidad, setCantidad] = useState<number>(1);
  const [mascotas, setMascotas] = useState<
    { nombre: string; foto: string | null }[]
  >([{ nombre: "", foto: null }]);

  // Tarifa por minuto
  const TARIFA_POR_MINUTO = 250;

  // Calcula diferencia en minutos
  const calcularDiferencia = (hora1: string, hora2: string) => {
    const [h1, m1] = hora1.split(":").map(Number);
    const [h2, m2] = hora2.split(":").map(Number);
    return Math.abs(h2 * 60 + m2 - (h1 * 60 + m1));
  };

  // Maneja cambios en los inputs de tiempo
  const handleChange = (value: string, type: "inicio" | "termino") => {
    if (type === "inicio") {
      setInicio(value);
      if (termino && calcularDiferencia(value, termino) > 120) {
        setError("La diferencia no puede ser mayor a 2 horas.");
      } else setError("");
    } else {
      setTermino(value);
      if (inicio && calcularDiferencia(inicio, value) > 120) {
        setError("La diferencia no puede ser mayor a 2 horas.");
      } else setError("");
    }
  };

  // Maneja cambios en cantidad de mascotas
  const handleCantidadChange = (num: number) => {
    setCantidad(num);
    setMascotas((prev) => {
      const nuevos = [...prev];
      while (nuevos.length < num) nuevos.push({ nombre: "", foto: null });
      return nuevos.slice(0, num);
    });
  };

  // Maneja cambios en nombre/foto
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

  // Esta constante calcula el precio, decidí que la duración máxima del paseo sea de 2 horas y como precio máxmimo se cobra $30.000, lo que da una tarifa por minuto de $250.
  const minutos =
    inicio && termino && !error ? calcularDiferencia(inicio, termino) : 0;
  const precio = minutos * TARIFA_POR_MINUTO;

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
          action="/home"
          className="flex flex-col gap-4 rounded-xl bg-white border border-gray-200 p-6 shadow-lg"
        >
          <h1 className="font-bebas text-2xl text-center">
            Solicitud de Paseo
          </h1>

          {/* Cantidad de mascotas con radio */}
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
            <p className="invisible text-xs text-red-500 peer-invalid:visible">
              Selecciona una cantidad de mascotas.
            </p>
          </fieldset>

          {/* Inputs dinámicos de acuerdo a la cantidad de mascotas */}
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
                  className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  El nombre es obligatorio.
                </p>
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
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  La foto es obligatoria.
                </p>
                {mascota.foto && (
                  <img
                    src={mascota.foto}
                    alt={`Mascota ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-full mt-2"
                  />
                )}
              </label>
            </div>
          ))}

          {/* Horario */}
          <label className="flex flex-col gap-3">
            <p className="font-semibold">Horario del paseo</p>
            <div className="flex gap-4">
              <input
                type="time"
                required
                value={inicio}
                onChange={(e) => handleChange(e.target.value, "inicio")}
                className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
              />
              <input
                type="time"
                required
                value={termino}
                onChange={(e) => handleChange(e.target.value, "termino")}
                className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
              />
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
          </label>

          {/* Ubicación */}
          <label htmlFor="ubicacion">
            <p className="font-semibold">Ubicación</p>
            <select
              id="ubicacion"
              required
              className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
            >
              <option value="">Seleccione una ubicación</option>
              <option value="Alhué">Alhué</option>
              <option value="Buin">Buin</option>
              <option value="Calera de Tango">Calera de Tango</option>
              <option value="Cerrillos">Cerrillos</option>
              <option value="Cerro Navia">Cerro Navia</option>
              <option value="Colina">Colina</option>
              <option value="Conchalí">Conchalí</option>
              <option value="Curacaví">Curacaví</option>
              <option value="El Bosque">El Bosque</option>
              <option value="El Monte">El Monte</option>
              <option value="Estación Central">Estación Central</option>
              <option value="Huechuraba">Huechuraba</option>
              <option value="Independencia">Independencia</option>
              <option value="Isla de Maipo">Isla de Maipo</option>
              <option value="La Cisterna">La Cisterna</option>
              <option value="La Florida">La Florida</option>
              <option value="La Granja">La Granja</option>
              <option value="La Pintana">La Pintana</option>
              <option value="La Reina">La Reina</option>
              <option value="Lampa">Lampa</option>
              <option value="Las Condes">Las Condes</option>
              <option value="Lo Barnechea">Lo Barnechea</option>
              <option value="Lo Espejo">Lo Espejo</option>
              <option value="Lo Prado">Lo Prado</option>
              <option value="Macul">Macul</option>
              <option value="Maipú">Maipú</option>
              <option value="María Pinto">María Pinto</option>
              <option value="Ñuñoa">Ñuñoa</option>
              <option value="Padre Hurtado">Padre Hurtado</option>
              <option value="Paine">Paine</option>
              <option value="Pedro Aguirre Cerda">Pedro Aguirre Cerda</option>
              <option value="Peñalolén">Peñalolén</option>
              <option value="Pirque">Pirque</option>
              <option value="Providencia">Providencia</option>
              <option value="Pudahuel">Pudahuel</option>
              <option value="Puente Alto">Puente Alto</option>
              <option value="Quilicura">Quilicura</option>
              <option value="Quinta Normal">Quinta Normal</option>
              <option value="Recoleta">Recoleta</option>
              <option value="Renca">Renca</option>
              <option value="San Bernardo">San Bernardo</option>
              <option value="San Joaquín">San Joaquín</option>
              <option value="San José de Maipo">San José de Maipo</option>
              <option value="San Miguel">San Miguel</option>
              <option value="San Ramón">San Ramón</option>
              <option value="Santiago">Santiago</option>
              <option value="Talagante">Talagante</option>
              <option value="Tiltil">Tiltil</option>
              <option value="Vitacura">Vitacura</option>
            </select>
            <p className="invisible text-xs text-red-500 peer-invalid:visible">
              Selecciona una ubicación.
            </p>
          </label>

          {/* Precio calculado */}
          <div className="border-t pt-4">
            <p className="font-semibold">Precio estimado</p>
            <p className="text-lg font-bold text-green-700">
              {precio > 0 ? `$${precio.toLocaleString("es-CL")}` : "--"}
            </p>
            <p className="text-xs text-gray-500">
              Se cobra $250 por minuto (máx. $30.000).
            </p>
          </div>

          {/* Botón publicar */}
          <button
            type="submit"
            disabled={!inicio || !termino || !!error}
            className="bg-prussian-blue text-white font-semibold rounded-full p-2 hover:bg-prussian-blue/80 -ml-2 border-2 border-cyan-900 shadow-lg shadow-prussian-blue/50 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </form>
      </section>
    </section>
  );
}

export default NuevoPaseo;