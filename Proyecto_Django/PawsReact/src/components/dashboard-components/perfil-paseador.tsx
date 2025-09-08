import Navbar from "../landing-components/navbar";
import Footer from "../landing-components/footer";

function PerfilPaseador() {
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
  };

  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-50 text-prussian-blue font-nunito px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold mb-6">
          Perfil del Paseador
        </h1>
        <p className="mb-10 text-gray-600">
          Aquí puedes ver la información del paseador seleccionado.
        </p>

        {/* Card principal */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Información */}
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-bold">
                {paseador.nombre} {paseador.apellido}
              </h2>
              <p>
                <span className="font-semibold">Teléfono:</span>{" "}
                {paseador.telefono}
              </p>
              <p>
                <span className="font-semibold">Comuna:</span> {paseador.comuna}
              </p>
              <div>
                <span className="font-semibold">Calificación:</span>{" "}
                {paseador.calificacion}
              </div>
            </div>

            {/* Reseñas */}
            <div>
              <h3 className="text-xl font-bold mb-4">Reseñas</h3>
              <div className="space-y-4">
                {paseador.reseñas.map((reseña) => (
                  <div
                    key={reseña.id}
                    className="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm"
                  >
                    <p className="font-semibold">{reseña.autor}</p>
                    <p className="text-gray-600">{reseña.comentario}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default PerfilPaseador;
