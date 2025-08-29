function Hero() {
  return (
    <section className="bg-selective-yellow min-h-screen flex items-center justify-center p-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl">
        {/*Title*/}
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide">
            Paz para ti,
            <br />
            bienestar para tu mascota.
          </h1>
        </div>

        {/*Cards*/}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="relative flex items-center space-x-4 bg-blanco rounded-lg p-4 pt-12 rotate-6 bg-white">
            <strong className="absolute top-2 left-2 rounded-xs p-1 uppercase text-xs bg-blue-green text-prussian-blue brightness-110">
              Accesible
            </strong>
            <p className="font-work-sans leading-5 md:leading-6 text-2xl uppercase">
              Porque cada huella <br />
              merece cuidado.
            </p>
            <img
              className="size-28 md:size-30 rounded-t-4xl rounded-b-lg object-cover"
              src="/src/assets/img/perro-1.webp"
              decoding="async"
              loading="lazy"
              alt="Dog smiling"
            />
          </div>
          <div className="relative flex items-center justify-center space-x-4 bg-prussian-blue rounded-lg p-4 pt-12 -rotate-6">
            <strong className="absolute top-2 left-2 text-sm uppercase bg-ut-orange/80 text-selective-yellow brightness-110 rounded-xs p-1">
              Confiable
            </strong>
            <img
              className="size-30 lg:size-44 rounded-full object-cover"
              src="/src/assets/img/perro-2.webp"
              decoding="async"
              loading="lazy"
              alt="Dog with a leash"
            />
            <p className="font-work-sans leading-5 md:leading-6 lg:leading-8 text-2xl lg:text-4xl text-blanco uppercase text-white">
              Control total,
              <br />
              tranquilidad asegurada.
            </p>
          </div>
          <div className="relative flex items-center space-x-4 bg-blanco rounded-lg p-4 pt-12 rotate-6 bg-white">
            <strong className="absolute top-2 left-2 text-xs uppercase bg-prussian-blue/80 text-sky-blue brightness-110 rounded-xs p-1">
              Personalizado
            </strong>
            <p className="font-work-sans leading-5 md:leading-6 text-2xl uppercase">
              Deja sus pasos en
              <br />
              manos seguras.
            </p>
            <img
              className="size-28 md:size-30 rounded-t-4xl rounded-b-lg object-cover"
              src="/src/assets/img/perro-3.webp"
              decoding="async"
              loading="lazy"
              alt="Dog playing in a park"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
