import { Link } from "react-router-dom";
import { useState } from "react";

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
      aptitudes: {
        "Estado anímico": 5,
        Puntualidad: 4,
        Responsabilidad: 5,
      },
    },
    {
      id: 2,
      autor: "José Martínez",
      aptitudes: {
        "Estado anímico": 4,
        Puntualidad: 5,
        Responsabilidad: 4,
      },
    },
  ],
  foto: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMyAxMmMwIDMuMzQ1LTEuNDkzIDYuMzQyLTMuODUgOC4zNkExMC45NiAxMC45NiAwIDAgMSAxMiAyM2MtMi43MyAwLTUuMjI3LS45OTQtNy4xNS0yLjY0QTEwLjk4IDEwLjk4IDAgMCAxIDEgMTJDMSA1LjkyNSA1LjkyNSAxIDEyIDFzMTEgNC45MjUgMTEgMTFtLTctMy41YTQgNCAwIDEgMC04IDBhNCA0IDAgMCAwIDggMG0yLjUgOS43MjVWMThhNCA0IDAgMCAwLTQtNGgtNWE0IDQgMCAwIDAtNCA0di4yMjVxLjMxLjMyMy42NS42MTVBOC45NiA4Ljk2IDAgMCAwIDEyIDIxYTguOTYgOC45NiAwIDAgMCA2LjUtMi43NzUiLz48L3N2Zz4=",
};

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
    </div>
  );
}

function PerfilPaseador() {
  const [reseñas, setReseñas] = useState(paseador.reseñas);
  const [nuevaReseña, setNuevaReseña] = useState({
    "Estado anímico": 0,
    Puntualidad: 0,
    Responsabilidad: 0,
  });

  const calificar = (criterio: string, valor: number) => {
    setNuevaReseña({ ...nuevaReseña, [criterio]: valor });
  };

  const publicarReseña = () => {
    const completa = Object.values(nuevaReseña).every((v) => v > 0);
    if (completa) {
      const nueva = {
        id: reseñas.length + 1,
        autor: "Usuario Anónimo",
        aptitudes: { ...nuevaReseña },
      };
      setReseñas([nueva, ...reseñas]);
      setNuevaReseña({
        "Estado anímico": 0,
        Puntualidad: 0,
        Responsabilidad: 0,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-prussian-blue font-nunito px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">
          Perfil del Paseador
        </h1>
        <p className="text-lg md:text-xl text-gray-700">
          Aquí podrás ver la información del paseador postulante a tu paseo.
        </p>
      </header>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-10">
        <div className="grid grid-cols-1 gap-10">
          <div className="flex flex-col items-center gap-4">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <h3 className="text-xl font-bold mb-4">Reseñas</h3>
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {reseñas.map((reseña) => (
                  <div
                    key={reseña.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-semibold">{reseña.autor}</p>
                    <div className="mt-2 space-y-2">
                      {Object.entries(reseña.aptitudes).map(
                        ([criterio, valor]) => (
                          <div
                            key={criterio}
                            className="flex items-center justify-between"
                          >
                            <span className="text-gray-600">{criterio}:</span>
                            <Rating value={valor} />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Calificar Paseador</h3>
              {Object.keys(nuevaReseña).map((criterio) => (
                <div key={criterio} className="mb-4">
                  <p className="font-semibold mb-1">{criterio}</p>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, i) => i + 1).map((star) => (
                      <button
                        key={star}
                        onClick={() => calificar(criterio, star)}
                        className={`text-2xl ${
                          star <=
                          nuevaReseña[criterio as keyof typeof nuevaReseña]
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={publicarReseña}
                className="w-full rounded-full py-2 px-4 bg-prussian-blue hover:bg-prussian-blue/80 text-white font-semibold shadow-lg shadow-prussian-blue/50 border border-cyan-900 active:scale-90 transition-all duration-100"
              >
                Publicar Reseña
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 flex justify-center md:justify-end">
          <Link
            to="/postulantes"
            className="inline-flex items-center justify-center rounded-full py-2 px-4 bg-prussian-blue hover:bg-prussian-blue/80 border border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50 active:scale-90 transition-all duration-100"
          >
            Ver otros
          </Link>
        </div>
      </div>
    </main>
  );
}

export default PerfilPaseador;