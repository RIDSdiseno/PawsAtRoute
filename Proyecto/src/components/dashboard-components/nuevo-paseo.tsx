function NuevoPaseo() {
  return (
    <section className="flex justify-center items-center h-screen tracking-wide text-prussian-blue font-nunito">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <form
        action="/home"
        className="flex flex-col gap-4 rounded-xl bg-white p-6"
      >
        <h1 className="font-bebas text-2xl text-center">Solicitud de Paseo</h1>
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
            max={5}
          />
        </label>
        <label htmlFor="hora">
          <p className="font-semibold">Duración (horas)</p>
          <input
            className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
            type="number"
            name="hora"
            id="hora"
            placeholder="1"
            required
            min={1}
            max={3}
          />
        </label>
        <label htmlFor="minutos">
          <p className="font-semibold">Duración (minutos)</p>
          <input
            className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
            type="number"
            name="minutos"
            id="minutos"
            placeholder="0"
            required
            min={0}
            max={59}
          />
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
        </label>
        <label htmlFor="telefono">
          <p className="font-semibold">Teléfono</p>
          <input
            className="w-full p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
            type="tel"
            name="telefono"
            id="telefono"
            placeholder="123456789"
            required
          />
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
            max={100000}
          />
        </label>
        <button
          className="bg-prussian-blue text-blanco rounded-md p-2 cursor-pointer hover:bg-prussian-blue/80 -ml-2"
          type="submit"
        >
          Publicar
        </button>
      </form>
    </section>
  );
}

export default NuevoPaseo;
