import { useState } from "react";
import { createMascota } from "../../api/api.ts";

function RegistroMascota() {
  const [nombre, setNombre] = useState("");
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [edadGrupo, setEdadGrupo] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const edadMapToNumber = (g: string): number => {
    switch (g) {
      case "-1": return 0;
      case "1-2": return 1;
      case "3-5": return 3;
      case "6-9": return 6;
      case "10+": return 10;
      default: return NaN;
    }
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const edadNum = edadMapToNumber(edadGrupo);

    if (!nombre.trim() || !especie || !raza || Number.isNaN(edadNum)) {
      alert("Completa todos los campos correctamente.");
      return;
    }

    setSubmitting(true);
    try {
      await createMascota({
        nombre: nombre.trim(),
        especie,
        raza,
        edad: edadNum,
      });
      alert("Mascota registrada correctamente 🎉");
      // reset
      setNombre("");
      setEspecie("");
      setRaza("");
      setEdadGrupo("");
    } catch (err: any) {
      alert(err?.response?.data?.error ?? "No se pudo registrar la mascota");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen mx-auto text-prussian-blue p-4 sm:p-6 lg:p-8 my-6">
      <header className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl md:text-5xl font-bold">Registro de Mascota</h1>
        <p className="text-lg">Registra tu mascota para que pueda ser paseada.</p>
      </header>

      <section className="max-w-3xl mx-auto">
        <article className="animate-slide-in-left animate-duration-300">
          <form
            className="flex flex-col gap-4 rounded-xl bg-white border border-gray-200 p-6 shadow-lg"
            onSubmit={onSubmit}
            noValidate
          >
            <h2 className="font-bebas text-2xl text-center">Registro de Mascota</h2>

            <fieldset className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
              <legend className="font-semibold text-center">Información de la mascota</legend>

              <label className="flex flex-col gap-1" htmlFor="nombre">
                <p className="font-semibold">Nombre</p>
                <input
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  type="text"
                  required
                  id="nombre"
                  name="nombre"
                  minLength={3}
                  maxLength={15}
                  placeholder="Ej: Firulais"
                  pattern="^[A-Za-zÁÉÍÓÚÑáéíóúñ\\s]+$"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  El nombre solo puede contener letras.
                </p>
              </label>

              <label className="flex flex-col gap-1" htmlFor="especie">
                <p className="font-semibold">Especie</p>
                <select
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  required
                  id="especie"
                  name="especie"
                  value={especie}
                  onChange={(e) => setEspecie(e.target.value)}
                >
                  <option value="">Seleccione una especie</option>
                  <option value="Canino">Canino</option>
                  <option value="Felino">Felino</option>
                </select>
                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, seleccione una especie.
                </p>
              </label>

              <label className="flex flex-col gap-1" htmlFor="raza">
                <p className="font-semibold">Raza</p>
                <select
                  className="p-2 border-2 border-gray-300 rounded-lg peer focus:outline-none focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
                  required
                  id="raza"
                  name="raza"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                >
                  <option value="">Seleccione una raza</option>

                  <optgroup label="🐶 Caninos">
                    <option value="Labrador Retriever">Labrador Retriever</option>
                    <option value="Golden Retriever">Golden Retriever</option>
                    <option value="Pastor Alemán">Pastor Alemán</option>
                    <option value="Beagle">Beagle</option>
                    <option value="Poodle">Poodle</option>
                    <option value="Rottweiler">Rottweiler</option>
                    <option value="Bulldog Francés">Bulldog Francés</option>
                    <option value="Bulldog Inglés">Bulldog Inglés</option>
                    <option value="Chihuahua">Chihuahua</option>
                    <option value="Dóberman">Dóberman</option>
                    <option value="Bóxer">Bóxer</option>
                    <option value="Dálmata">Dálmata</option>
                    <option value="Husky Siberiano">Husky Siberiano</option>
                    <option value="Pastor Australiano">Pastor Australiano</option>
                    <option value="Cocker Spaniel">Cocker Spaniel</option>
                    <option value="Pitbull">Pitbull</option>
                    <option value="Shih Tzu">Shih Tzu</option>
                    <option value="Schnauzer">Schnauzer</option>
                    <option value="Mestizo / Criollo">Mestizo / Criollo</option>
                  </optgroup>

                  <optgroup label="🐱 Felinos">
                    <option value="Siamés">Siamés</option>
                    <option value="Persa">Persa</option>
                    <option value="Maine Coon">Maine Coon</option>
                    <option value="Angora">Angora</option>
                    <option value="British Shorthair">British Shorthair</option>
                    <option value="Bengala">Bengala</option>
                    <option value="Ragdoll">Ragdoll</option>
                    <option value="Abisinio">Abisinio</option>
                    <option value="Azul Ruso">Azul Ruso</option>
                    <option value="Sphynx">Sphynx (sin pelo)</option>
                    <option value="Himalayo">Himalayo</option>
                    <option value="Americano de Pelo Corto">Americano de Pelo Corto</option>
                    <option value="Bombay">Bombay</option>
                    <option value="Mestizo / Común">Mestizo / Común</option>
                  </optgroup>
                </select>

                <p className="invisible text-xs text-red-500 peer-invalid:visible">
                  Por favor, seleccione una raza.
                </p>
              </label>

              <fieldset className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
                <legend className="font-semibold text-center">Edad</legend>

                {[
                  { label: "Menor de 1 año", value: "-1" },
                  { label: "1 a 2 años", value: "1-2" },
                  { label: "3 a 5 años", value: "3-5" },
                  { label: "6 a 9 años", value: "6-9" },
                  { label: "10 años o más", value: "10+" },
                ].map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edad"
                      value={opt.value}
                      checked={edadGrupo === opt.value}
                      onChange={(e) => setEdadGrupo(e.target.value)}
                      required
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </fieldset>
            </fieldset>

            <button
              className="cursor-pointer bg-prussian-blue/80 text-white rounded-lg py-2 px-4 hover:bg-prussian-blue border border-cyan-900 shadow-lg shadow-prussian-blue/50 font-semibold mt-2 active:scale-90 transition-all duration-100 disabled:opacity-60"
              type="submit"
              disabled={submitting}
            >
              {submitting ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </article>
      </section>
    </main>
  );
}

export default RegistroMascota;
