function Pasos() {
  return (
    <>
      {/* Sección principal */}
      <section id="pasos" className="min-h-screen bg-prussian-blue">
        <div className="overflow-hidden">
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-gray-50 w-[125%] h-[75px]"
          >
            <path d="M60 120L0 0h120L60 120zm120 0L120 0h120l-60 120zm120 0L240 0h120l-60 120zm120 0L360 0h120l-60 120zm120 0L480 0h120l-60 120zm120 0L600 0h120l-60 120zm120 0L720 0h120l-60 120zm120 0L840 0h120l-60 120zm120 0L960 0h120l-60 120zm120 0L1080 0h120l-60 120z" />
          </svg>
        </div>
        <div className="text-selective-yellow p-4 max-w-6xl mx-auto py-24">
          <div className="flex flex-col mb-16">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
              Cómo funciona
            </h1>
            <p className="text-xl">Pasos para realizar un paseo exitoso.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
              <figure>
                <img
                  src="/src/assets/img/publicar.webp"
                  alt="Publicar un paseo"
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="flex flex-col p-6 text-prussian-blue">
                <div className="text-2xl font-bold pb-4">Publicar</div>
                <div className="text-lg">
                  Selecciona tus preferencias, como duración, precio y
                  ubicación.
                </div>
              </div>
            </div>
            {/* Card 2 */}
            <div className="flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
              <figure>
                <img
                  src="/src/assets/img/postular.webp"
                  alt="Paseadores postulan"
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="flex flex-col p-6 text-prussian-blue">
                <div className="text-2xl font-bold pb-4">
                  Paseadores postulan
                </div>
                <div className="text-lg">
                  Paseadores interesados envían sus propuestas y perfiles.
                </div>
              </div>
            </div>
            {/* Card 3 */}
            <div className="flex flex-col rounded-2xl bg-white shadow-xl overflow-hidden">
              <figure>
                <img
                  src="/src/assets/img/paseo.webp"
                  alt="Elige y relájate"
                  className="w-full h-48 object-cover"
                />
              </figure>
              <div className="flex flex-col p-6 text-prussian-blue">
                <div className="text-2xl font-bold pb-4">Elije y relájate</div>
                <div className="text-lg">
                  Selecciona al paseador ideal y relájate.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Pasos;
