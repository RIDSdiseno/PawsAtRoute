import { Link } from "react-router-dom";

// Datos de ejemplo (deberían venir de la base de datos)
const paseador = {
  nombre: "Carlos",
  apellido: "Gómez",
  telefono: "+56 9 1234 5678",
  comuna: "Providencia",
  calificacion: 4,
  reseñas: [
    {
      id: 1,
      autor: "María López",
      comentario: "Excelente paseador, muy puntual y amable.",
    },
    {
      id: 2,
      autor: "José Martínez",
      comentario: "Mi perro estaba feliz después del paseo.",
    },
    {
      id: 3,
      autor: "Ana Fernández",
      comentario: "Muy responsable, lo recomiendo totalmente.",
    },
  ],
  foto: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMyAxMmMwIDMuMzQ1LTEuNDkzIDYuMzQyLTMuODUgOC4zNkExMC45NiAxMC45NiAwIDAgMSAxMiAyM2MtMi43MyAwLTUuMjI3LS45OTQtNy4xNS0yLjY0QTEwLjk4IDEwLjk4IDAgMCAxIDEgMTJDMSA1LjkyNSA1LjkyNSAxIDEyIDFzMTEgNC45MjUgMTEgMTFtLTctMy41YTQgNCAwIDEgMC04IDBhNCA0IDAgMCAwIDggMG0yLjUgOS43MjVWMThhNCA0IDAgMCAwLTQtNGgtNWE0IDQgMCAwIDAtNCA0di4yMjVxLjMxLjMyMy42NS42MTVBOC45NiA4Ljk2IDAgMCAwIDEyIDIxYTguOTYgOC45NiAwIDAgMCA2LjUtMi43NzUiLz48L3N2Zz4=",
};

// Reutilizamos Rating
function Rating({ value }: { value: number }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <span
          key={star}
          className={`${
            star <= Math.floor(value) ? "text-yellow-400" : "text-gray-300"
          } text-xl`}
        >
          ★
        </span>
      ))}
      <span className="text-sm text-gray-600">({value})</span>
    </div>
  );
}

function PerfilPaseador() {
  return (
    <main className="min-h-screen bg-gray-50 text-prussian-blue font-nunito px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-pretty md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Perfil del Paseador
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Aquí podrás ver la información del paseador postulante a tu paseo.
        </p>
      </header>

      {/* Card principal */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Información */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <img
              src={paseador.foto}
              alt="foto-perfil"
              className="size-36 rounded-full border-4 border-amber-500 shadow-md object-cover"
            />
            <h2 className="text-3xl font-bold">
              {paseador.nombre} {paseador.apellido}
            </h2>
            <p>
              <span className="font-semibold">Teléfono:</span>{" "}
              {paseador.telefono}
            </p>
            <p>
              <span className="font-semibold">Comuna:</span> {paseador.comuna}
            </p>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Calificación:</span>
              <Rating value={paseador.calificacion} />
            </div>
          </div>

          {/* Reseñas */}
          <div>
            <h3 className="text-xl font-bold mb-4">Reseñas</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {paseador.reseñas.map((reseña) => (
                <div
                  key={reseña.id}
                  className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                >
                  <p className="font-semibold">{reseña.autor}</p>
                  <p className="text-gray-600">{reseña.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Acción: elegir paseador */}
        <div className="mt-10 flex justify-center md:justify-end">
          <Link
            to="/postulantes"
            className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50 active:scale-95 transition-all duration-200"
          >
            Ver otros
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PerfilPaseador;