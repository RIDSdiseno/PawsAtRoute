import Navbar from "../landing-components/navbar";
import Footer from "../landing-components/footer";
import { Link } from "react-router-dom";

function Postulantes() {
  return (
    <>
      <Navbar />
      <section className="min-h-screen bg-gray-50 text-prussian-blue font-nunito p-4 sm:p-6 lg:p-8 my-6">
        <header className="max-w-6xl mx-auto mb-8">
          <h1 className="text-3xl md:text-5xl font-extrabold">Postulantes</h1>
          <p className="mt-2">
            Aquí puedes ver a los paseadores interesados en tu paseo.
          </p>
        </header>
        <section className="max-w-6xl mx-auto bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          <h2 className="px-6 pt-6 text-xl md:text-2xl font-bold">
            Información
          </h2>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-6 py-3 text-left">Nombre</th>
                  <th className="px-6 py-3 text-left">Apellido</th>
                  <th className="px-6 py-3 text-left">Telefono</th>
                  <th className="px-6 py-3 text-left">Calificacion</th>
                  <th className="px-6 py-3 text-left">Elije</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">Juan</td>
                  <td className="px-6 py-4">Perez</td>
                  <td className="px-6 py-4">12345678</td>
                  <td className="px-6 py-4">3.5</td>
                  <td className="px-6 py-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        required
                        name="userType"
                        value="Seleccionar-paseador"
                        className="sr-only peer"
                      />
                      <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer font-semibold peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue">
                        Seleccionar
                      </div>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Maria</td>
                  <td className="px-6 py-4">Garcia</td>
                  <td className="px-6 py-4">87654321</td>
                  <td className="px-6 py-4">4.5</td>
                  <td className="px-6 py-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        required
                        name="userType"
                        value="Seleccionar-paseador"
                        className="sr-only peer"
                      />
                      <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer font-semibold peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue">
                        Seleccionar
                      </div>
                    </label>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Pedro</td>
                  <td className="px-6 py-4">Garcia</td>
                  <td className="px-6 py-4">12345678</td>
                  <td className="px-6 py-4">5</td>
                  <td className="px-6 py-4">
                    <label className="flex-1">
                      <input
                        type="radio"
                        required
                        name="userType"
                        value="Seleccionar-paseador"
                        className="sr-only peer"
                      />
                      <div className="p-2 text-center border-2 border-gray-300 rounded-lg cursor-pointer font-semibold peer-checked:bg-prussian-blue peer-checked:text-white peer-checked:border-prussian-blue">
                        Seleccionar
                      </div>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="px-6 py-6 flex ">
            <Link
              to="/home"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-prussian-blue hover:bg-prussian-blue/80 border-2 border-cyan-900 text-white font-semibold shadow-lg shadow-prussian-blue/50"
            >
              ¡Listo!
            </Link>
          </div>
        </section>
      </section>
      <Footer />
    </>
  );
}

export default Postulantes;
