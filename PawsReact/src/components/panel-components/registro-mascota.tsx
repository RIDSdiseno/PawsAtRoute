function RegistroMascota() {
  return (
    <>
      <main className="min-h-screen  mx-auto text-prussian-blue font-nunito p-4 sm:p-6 lg:p-8 my-6">
        <header className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl md:text-5xl font-bold">
            Registro de Mascota
          </h1>
          <p className="text-lg">
            Aquí puedes registrar tu mascota para que pueda ser paseada.
          </p>
        </header>
        <section className="max-w-6xl mx-auto gap-4 md:gap-6 mb-10 grid grid-cols-1 md:grid-cols-2">
          <article>
            <form
              className="flex flex-col gap-4 rounded-xl bg-white border border-gray-200 p-6 shadow-lg"
              action="/registro-mascota"
            >
              <h1 className="font-bebas text-2xl text-center">
                Registro de Mascota
              </h1>
              <fieldset className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
                <legend className="font-semibold text-center">
                  Información de la mascota
                </legend>
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
                    pattern="^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$"
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
                  >
                    <option value="">Seleccione una especie</option>
                    <option value="canino">Canino</option>
                    <option value="felino">Felino</option>
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
                  >
                    <option value="">Seleccione una raza</option>

                    <optgroup label="🐶 Caninos">
                      <option value="labrador">Labrador Retriever</option>
                      <option value="golden_retriever">Golden Retriever</option>
                      <option value="pastor_aleman">Pastor Alemán</option>
                      <option value="beagle">Beagle</option>
                      <option value="poodle">Poodle</option>
                      <option value="rottweiler">Rottweiler</option>
                      <option value="bulldog_frances">Bulldog Francés</option>
                      <option value="bulldog_ingles">Bulldog Inglés</option>
                      <option value="chihuahua">Chihuahua</option>
                      <option value="doberman">Dóberman</option>
                      <option value="boxer">Bóxer</option>
                      <option value="dalmata">Dálmata</option>
                      <option value="husky_siberiano">Husky Siberiano</option>
                      <option value="pastor_australiano">
                        Pastor Australiano
                      </option>
                      <option value="cocker_spaniel">Cocker Spaniel</option>
                      <option value="pitbull">Pitbull</option>
                      <option value="shih_tzu">Shih Tzu</option>
                      <option value="schnauzer">Schnauzer</option>
                      <option value="mestizo_perro">Mestizo / Criollo</option>
                    </optgroup>

                    <optgroup label="🐱 Felinos">
                      <option value="siames">Siamés</option>
                      <option value="persa">Persa</option>
                      <option value="maine_coon">Maine Coon</option>
                      <option value="angora">Angora</option>
                      <option value="british_shorthair">
                        British Shorthair
                      </option>
                      <option value="bengala">Bengala</option>
                      <option value="ragdoll">Ragdoll</option>
                      <option value="abisinio">Abisinio</option>
                      <option value="azul_ruso">Azul Ruso</option>
                      <option value="sphynx">Sphynx (sin pelo)</option>
                      <option value="himalayo">Himalayo</option>
                      <option value="americano_de_pelo_corto">
                        Americano de Pelo Corto
                      </option>
                      <option value="bombay">Bombay</option>
                      <option value="mestizo_gato">Mestizo / Común</option>
                    </optgroup>
                  </select>

                  <p className="invisible text-xs text-red-500 peer-invalid:visible">
                    Por favor, seleccione una raza.
                  </p>
                </label>

                <fieldset className="flex flex-col gap-2 border rounded-lg p-4 bg-gray-50">
                  <legend className="font-semibold text-center">Edad</legend>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edad"
                      value="-1"
                      required
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>Menor de 1 año</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edad"
                      value="1-2"
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>1 a 2 años</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edad"
                      value="3-5"
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>3 a 5 años</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edad"
                      value="6-9"
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>6 a 9 años</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="edad"
                      value="10+"
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>10 años o más</span>
                  </label>

                  <p className="text-xs text-red-500 hidden peer-invalid:block">
                    Por favor, seleccione una edad.
                  </p>
                </fieldset>
              </fieldset>
              <button
                className="cursor-pointer bg-prussian-blue/80 text-white rounded-lg py-2 px-4 hover:bg-prussian-blue border border-cyan-900 shadow-lg shadow-prussian-blue/50 font-semibold mt-2 active:scale-90 transition-all duration-100"
                type="submit"
              >
                Registrar
              </button>
            </form>
          </article>
          <article className="flex flex-col gap-6 rounded-2xl bg-white border border-gray-200 p-6 shadow-xl">
            <h1 className="text-3xl font-bold text-center text-prussian-blue">
              Mascotas Registradas
            </h1>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse rounded-lg overflow-hidden text-center">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-200 text-prussian-blue">
                    <th className="py-3 px-4 font-semibold text-sm md:text-base border-b border-gray-300">
                      Nombre
                    </th>
                    <th className="py-3 px-4 font-semibold text-sm md:text-base border-b border-gray-300">
                      Especie
                    </th>
                    <th className="py-3 px-4 font-semibold text-sm md:text-base border-b border-gray-300">
                      Raza
                    </th>
                    <th className="py-3 px-4 font-semibold text-sm md:text-base border-b border-gray-300">
                      Edad
                    </th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  <tr className="hover:bg-blue-50 transition-colors duration-200">
                    <td className="py-3 px-4 border-b border-gray-200">
                      Firulais
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      Canino
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      Labrador Retriever
                    </td>
                    <td className="py-3 px-4 border-b border-gray-200">
                      1 a 2 años
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </main>
    </>
  );
}

export default RegistroMascota;
