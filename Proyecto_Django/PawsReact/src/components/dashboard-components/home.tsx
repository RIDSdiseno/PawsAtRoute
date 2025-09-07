import { Link } from "react-router-dom";
import Navbar from "../landing-components/navbar";
import Footer from "../landing-components/footer";

function Home() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen text-prussian-blue font-nunito p-4 sm:p-6 lg:p-8 my-6">
        <header className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold">Hola, Nombre!</h1>
          <p className="mt-2">
            Bienvenid@ a tu panel de control. Aquí puedes gestionar tus paseos y
            conectar con paseadores de confianza.
          </p>
        </header>

        {/* Tarjetas de métricas */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
          <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <p className="text-gray-600">Paseos Completados</p>
            <p className="text-3xl md:text-4xl font-extrabold">5</p>
          </article>

          <article className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
            <p className="text-gray-600">Nuevo Paseo</p>
            <p className="text-2xl md:text-3xl font-extrabold">
              10:00 AM - 11:30 AM
            </p>
            <p className="text-gray-600 mt-2">Paseador</p>
            <p className="text-2xl md:text-3xl font-extrabold">Nombre</p>
            <div className="py-4 flex">
              <Link
                to="/postulantes"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50"
              >
                Ver Postulantes
              </Link>
            </div>
          </article>
        </section>

        {/* Historial de Paseos Recientes */}
        <section className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <h2 className="px-6 pt-6 text-xl md:text-2xl font-bold">
            Historial de Paseos Recientes
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Fecha</th>
                  <th className="px-6 py-3 text-left">Hora</th>
                  <th className="px-6 py-3 text-left">Paseador</th>
                  <th className="px-6 py-3 text-left">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">15 de Mayo</td>
                  <td className="px-6 py-4">10:00 AM</td>
                  <td className="px-6 py-4">Carlos</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-4 py-1 bg-emerald-50 text-emerald-700 font-semibold">
                      Completado
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">12 de Mayo</td>
                  <td className="px-6 py-4">3:00 PM</td>
                  <td className="px-6 py-4">Ana</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-4 py-1 bg-emerald-50 text-emerald-700 font-semibold">
                      Completado
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">10 de Mayo</td>
                  <td className="px-6 py-4">11:00 AM</td>
                  <td className="px-6 py-4">Carlos</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full px-4 py-1 bg-emerald-50 text-emerald-700 font-semibold">
                      Completado
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* CTA alineado a la derecha */}
          <div className="px-6 py-6 flex ">
            <Link
              to="/nuevo-paseo"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50"
            >
              Solicitar Nuevo Paseo
            </Link>
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default Home;
