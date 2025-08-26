function Hero() {
  return (
    <section className="bg-selective-yellow min-h-screen flex items-center justify-center p-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 max-w-5xl">
        {/* Left Side: Title */}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-tanker text-prussian-blue antialiased tracking-wide">
            Paz para ti,
            <br />
            bienestar para tu mascota.
          </h1>
        </div>

        {/* Right Side: Cards */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="relative flex items-center space-x-6 bg-blanco rounded-lg p-4 pt-12 rotate-6">
            <strong className="absolute top-2 left-2 text-prussian-blue font-nunito antialiased bg-selective-yellow/80 rounded-sm p-1 uppercase tracking-wide text-sm font-bold">
              Accesible
            </strong>
            <p className="font-bebas font-extrabold text-3xl lg:text-4xl text-prussian-blue tracking-wide">
              Porque cada huella merece cuidado.
            </p>
            <img
              className="size-28 md:size-32 rounded-t-4xl rounded-b-lg object-cover"
              src="perro-1.webp"
              alt="Dog smiling"
            />
          </div>
          <div className="relative flex items-center justify-center space-x-4 bg-prussian-blue rounded-lg p-4 pt-12 -rotate-6">
            <strong className="absolute top-2 left-2 text-prussian-blue text-sm font-nunito uppercase tracking-wide antialiased bg-blanco/80 rounded-sm p-1">
              Confiable
            </strong>
            <img
              className="size-30 md:size-40 lg:size-48 rounded-full object-cover"
              src="perro-2.webp"
              alt="Dog with a leash"
            />
            <p className="font-bebas font-extrabold text-3xl md:text-4xl lg:text-5xl text-white tracking-wide antialiased">
              Control total, tranquilidad asegurada.
            </p>
          </div>
          <div className="relative flex items-center space-x-4 bg-blanco rounded-lg p-4 pt-12 rotate-6">
            <strong className="absolute top-2 left-2 text-blanco text-sm font-nunito uppercase tracking-wide antialiased bg-ut-orange/80 rounded-sm p-1">
              Personalizado
            </strong>
            <p className="font-bebas font-extrabold text-3xl lg:text-4xl text-prussian-blue tracking-wide">
              Deja sus pasos en manos seguras.
            </p>
            <img
              className="size-28 md:size-32 rounded-t-4xl rounded-b-lg object-cover"
              src="perro-3.webp"
              alt="Dog playing in a park"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
