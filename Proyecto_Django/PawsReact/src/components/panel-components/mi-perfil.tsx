import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../api/api.ts";

function MiPerfil() {
  const [user, setUser] = useState<null | {
    nombre: string;
    apellido: string;
    rol: string;
    correo: string;
    telefono: string;
    comuna?: string;
    foto?: string; // Base64 o URL
  }>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
         const perfil = await getProfile();
    console.log("Perfil recibido:", perfil);  // <-- debug
    setUser(perfil);
      console.log("Perfil cargado:", perfil);
      } catch (error) {
        console.error("Error al obtener el perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen flex justify-center items-center text-prussian-blue">
        <p className="text-xl font-semibold">Cargando perfil...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex justify-center items-center text-red-700">
        <p className="text-xl font-semibold">No se pudo cargar el perfil.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-pretty md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Mi Perfil</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Aquí podrás ver tu información, como foto de perfil, rol, nombre,
          apellido, correo y teléfono.
        </p>
      </header>

      {/* Info básica */}
      <section
        id="info-básica"
        className="flex flex-col items-center gap-4 md:flex-row md:items-center md:gap-8"
      >
        <img
          src={
            user.foto ||
            "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(`${user.nombre} ${user.apellido}`) +
              "&background=FDBA74&color=000"
          }
          alt={`Foto de perfil de ${user.nombre} ${user.apellido}`}
          className="size-36 rounded-full border-2 border-amber-500 object-cover"
        />
        <div className="flex flex-col items-center md:items-start gap-2">
          <p className="text-2xl font-bold">
            {user.nombre} {user.apellido}
          </p>
          <p className="text-md bg-selective-yellow px-2 py-1 rounded-lg font-semibold border border-amber-500">
            {user.rol}
          </p>
          <div>
            <Link
              to="/editar-perfil"
              className="inline-flex items-center justify-center rounded-full px-4 py-2 bg-ut-orange hover:bg-ut-orange/80 border border-amber-400 text-white font-semibold shadow-lg shadow-ut-orange/50 active:scale-90 transition-all duration-100"
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
