import { Link } from "react-router-dom";

function MiPerfil() {
  // Datos de ejemplo (deberían venir de la base de datos)
  const user = {
    nombre: "Jois",
    apellido: "Rosales",
    rol: "Dueño de mascota",
    correo: "jois.rosales@example.com",
    telefono: "9 1234 5678",
    comuna: "Santiago, Chile",
    foto: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMyAxMmMwIDMuMzQ1LTEuNDkzIDYuMzQyLTMuODUgOC4zNkExMC45NiAxMC45NiAwIDAgMSAxMiAyM2MtMi43MyAwLTUuMjI3LS45OTQtNy4xNS0yLjY0QTEwLjk4IDEwLjk4IDAgMCAxIDEgMTJDMSA1LjkyNSA1LjkyNSAxIDEyIDFzMTEgNC45MjUgMTEgMTFtLTctMy41YTQgNCAwIDEgMC04IDBhNCA0IDAgMCAwIDggMG0yLjUgOS43MjVWMThhNCA0IDAgMCAwLTQtNGgtNWE0IDQgMCAwIDAtNCA0di4yMjVxLjMxLjMyMy42NS42MTVBOC45NiA4Ljk2IDAgMCAwIDEyIDIxYTguOTYgOC45NiAwIDAgMCA2LjUtMi43NzUiLz48L3N2Zz4=",
  };

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-pretty md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Mi Perfil</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Aquí podrás ver tu información, como tu foto de perfil, rol, nombre,
          apellido, correo y teléfono.
        </p>
      </header>

      {/* Info básica */}
      <section
        id="info-básica"
        className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8"
      >
        <img
          src={user.foto}
          alt={`Foto de perfil de ${user.nombre} ${user.apellido}`}
          className="size-36 rounded-full border-2 border-amber-500 object-cover"
        />
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-2xl font-bold">
            {user.nombre} {user.apellido}
          </p>
          <p className="text-md bg-selective-yellow px-3 py-1 rounded-md font-semibold border border-amber-500">
            {user.rol}
          </p>
          <div>
            <Link
              to="/editar-perfil"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 bg-ut-orange hover:bg-ut-orange/80 border-2 border-amber-400 text-white font-semibold shadow-lg shadow-ut-orange/50 transition-colors duration-300"
            >
              Editar Perfil
            </Link>
          </div>
        </div>
      </section>

      {/* Info contacto */}
      <section id="info-contacto" className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Información de Contacto</h2>
        <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <dt className="text-gray-600 font-semibold">Correo</dt>
            <dd className="text-lg">{user.correo}</dd>
          </div>
          <div>
            <dt className="text-gray-600 font-semibold">Teléfono</dt>
            <dd className="text-lg">{user.telefono}</dd>
          </div>
          <div>
            <dt className="text-gray-600 font-semibold">Comuna</dt>
            <dd className="text-lg">{user.comuna}</dd>
          </div>
        </dl>
      </section>
    </main>
  );
}

export default MiPerfil;
