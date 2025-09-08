import { useState } from "react";
import Footer from "../landing-components/footer";
import Navbar from "../landing-components/navbar";

function NuevoPaseo() {
  const [inicio, setInicio] = useState<string>("");
  const [termino, setTermino] = useState<string>("");
  const [error, setError] = useState("");

  const calcularDiferencia = (hora1: string, hora2: string) => {
    const [h1, m1] = hora1.split(":").map(Number);
    const [h2, m2] = hora2.split(":").map(Number);

    // Convertimos a minutos
    const minutos1 = h1 * 60 + m1;
    const minutos2 = h2 * 60 + m2;

    return Math.abs(minutos2 - minutos1) / 60; // diferencia en horas
  };

  const handleChange = (value: string, type: "inicio" | "termino") => {
    if (type === "inicio") {
      setInicio(value);
      if (termino && calcularDiferencia(value, termino) > 2) {
        setError(
          "La diferencia entre inicio y término no puede ser mayor a 2 horas."
        );
      } else {
        setError("");
      }
    } else {
      setTermino(value);
      if (inicio && calcularDiferencia(inicio, value) > 2) {
        setError(
          "La diferencia entre inicio y término no puede ser mayor a 2 horas."
        );
      } else {
        setError("");
      }
    }
  };
  return (
    <>
      <Navbar />
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
            <label htmlFor="cantidad">
              <p className="font-semibold">Cantidad de mascotas</p>
              <input
                className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                type="number"
                name="cantidad"
                id="cantidad"
                placeholder="1"
                required
                min={1}
                max={3}
              />
              <p className="invisible text-xs text-red-500 peer-invalid:visible">
                Se admiten hasta 3 mascotas.
              </p>
            </label>
            <label htmlFor="tamaño">
              <p>Tamaño de la(s) mascota(s)</p>
              <select
                className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                name="tamaño"
                id="tamaño"
                required
              >
                <option value="">Seleccione un tamaño</option>
                <option value="pequeño">Pequeño</option>
                <option value="mediano">Mediano</option>
                <option value="grande">Grande</option>
              </select>
              <p className="invisible text-xs text-red-500 peer-invalid:visible">
                Selecciona un tamaño.
              </p>
            </label>
            <label className="flex flex-col gap-3">
              <p className="font-semibold">Horario del paseo</p>
              <div className="flex gap-4">
                <input
                  className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                  type="time"
                  name="hora-inicio"
                  id="hora-inicio"
                  required
                  value={inicio}
                  onChange={(e) => handleChange(e.target.value, "inicio")}
                />
                <input
                  className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                  type="time"
                  name="hora-termino"
                  id="hora-termino"
                  required
                  value={termino}
                  onChange={(e) => handleChange(e.target.value, "termino")}
                />
              </div>
              {error && <p className="text-xs text-red-500">{error}</p>}
            </label>
            <label htmlFor="ubicacion">
              <p className="font-semibold">Ubicación</p>
              <select
                className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                name="ubicacion"
                id="ubicacion"
                required
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
            <label htmlFor="precio">
              <p className="font-semibold">Precio (CLP)</p>
              <input
                className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
                type="number"
                name="precio"
                id="precio"
                placeholder="10000"
                required
                min={1000}
                max={15000}
                maxLength={5}
              />
              <p className="invisible text-xs text-red-500 peer-invalid:visible">
                Rango de precios admitidos: 1000 - 15000 CLP
              </p>
            </label>
            <button
              className="bg-prussian-blue text-white font-semibold rounded-full p-2 cursor-pointer hover:bg-prussian-blue/80 -ml-2 border-2 border-cyan-900 shadow-lg shadow-prussian-blue/50"
              type="submit"
            >
              Publicar
            </button>
          </form>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default NuevoPaseo;
