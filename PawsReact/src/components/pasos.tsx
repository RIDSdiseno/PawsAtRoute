function Pasos() {
  return (
    <>
      <main id="pasos" className="min-h-screen bg-prussian-blue">
        <div className="overflow-hidden">
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-gray-50 w-[125%] h-[75px]"
          >
            <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z" />
          </svg>
        </div>
        <section className="text-selective-yellow p-4 max-w-6xl mx-auto py-24">
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
                  src="/img/publicar.webp"
                  decoding="async"
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
                  src="/img/postular.webp"
                  decoding="async"
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
                  src="/img/paseo.webp"
                  decoding="async"
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
        </section>
      </main>
    </>
  );
}

export default Pasos;
