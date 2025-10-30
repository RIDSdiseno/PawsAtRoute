import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

export default function PanelAdmin() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: "",
    message: "",
    confirmText: "",
    confirmColor: "",
    onConfirm: () => {},
  });

  const handleOpenModal = (
    title: string,
    message: string,
    confirmText: string,
    confirmColor: string,
    onConfirm: () => void
  ) => {
    setModalConfig({ title, message, confirmText, confirmColor, onConfirm });
    setModalOpen(true);
  };
  return (
    <div className="min-h-screen max-w-7xl mx-auto text-prussian-blue p-4 sm:p-6 lg:p-8 my-6">
      <header className="mb-10 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl md:text-5xl font-bold text-prussian-blue">
            ¡Bienvenid@ Nombre Apellido!
          </h1>
          <span className="bg-blue-green text-white text-sm md:text-base font-semibold px-3 py-1 rounded-full shadow-sm">
            Administrador
          </span>
        </div>
        <p className="text-lg text-gray-700 max-w-3xl">
          Aquí puedes gestionar las solicitudes de los paseadores y habilitar o
          deshabilitar usuarios.
        </p>
      </header>

      <main className="grid grid-cols-1 gap-10">
        <section className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Gestión de paseadores</h2>
          <form className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              name="q"
              placeholder="Buscar paseador..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-green"
            />
            <button
              type="submit"
              className="bg-blue-green hover:bg-prussian-blue text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              Buscar
            </button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden">
              <thead className="bg-selective-yellow text-prussian-blue">
                <tr>
                  <th className="p-3 text-left font-semibold">Nombre</th>
                  <th className="p-3 text-left font-semibold">Correo</th>
                  <th className="p-3 text-left font-semibold">
                    Fecha solicitud
                  </th>
                  <th className="p-3 text-center font-semibold">
                    Carnet de identidad
                  </th>
                  <th className="p-3 text-center font-semibold">
                    Antecedentes penales
                  </th>
                  <th className="p-3 text-center font-semibold">Estado</th>
                  <th className="p-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-gray-50">
                <tr className="hover:bg-gray-100 transition">
                  <td className="p-3">Pedro</td>
                  <td className="p-3">pedro@gmail.com</td>
                  <td className="p-3">30/10/2025</td>
                  <td className="p-3 text-center">
                    <button className="bg-blue-green hover:bg-prussian-blue text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                      Descargar
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <button className="bg-blue-green hover:bg-prussian-blue text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200">
                      Descargar
                    </button>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-gray-400 text-white px-3 py-1 rounded-lg text-sm">
                      Pendiente
                    </span>
                  </td>
                  <td className="p-3 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() =>
                        handleOpenModal(
                          "Aprobar paseador",
                          "¿Estás seguro de aprobar esta solicitud?",
                          "Aprobar",
                          "bg-emerald-500",
                          () => console.log("Aprobado")
                        )
                      }
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() =>
                        handleOpenModal(
                          "Denegar solicitud",
                          "¿Seguro que deseas denegar esta solicitud?",
                          "Denegar",
                          "bg-red-500",
                          () => console.log("Denegado")
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Denegar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        <section className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-6">Gestión de usuarios</h2>
          <form className="flex flex-col sm:flex-row gap-3 mb-6">
            <input
              type="text"
              name="q"
              placeholder="Buscar usuario..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-green"
            />
            <button
              type="submit"
              className="bg-blue-green hover:bg-prussian-blue text-white font-semibold py-2 px-6 rounded-lg transition-all duration-200"
            >
              Buscar
            </button>
          </form>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-xl overflow-hidden">
              <thead className="bg-selective-yellow text-prussian-blue">
                <tr>
                  <th className="p-3 text-left font-semibold">Nombre</th>
                  <th className="p-3 text-left font-semibold">Correo</th>
                  <th className="p-3 text-center font-semibold">Rol</th>
                  <th className="p-3 text-center font-semibold">Estado</th>
                  <th className="p-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-gray-50">
                <tr className="hover:bg-gray-100 transition">
                  <td className="p-3">Osnellys</td>
                  <td className="p-3">osnellys@gmail.com</td>
                  <td className="p-3 text-center">
                    <span className="bg-prussian-blue text-white px-3 py-1 rounded-lg text-sm">
                      Paseador
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-gray-400 text-white px-3 py-1 rounded-lg text-sm">
                      Inactivo
                    </span>
                  </td>
                  <td className="p-3 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() =>
                        handleOpenModal(
                          "Habilitar usuario",
                          "¿Estás seguro de habilitar este usuario?",
                          "Habilitar",
                          "bg-emerald-500",
                          () => console.log("Habilitado")
                        )
                      }
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Habilitar
                    </button>
                    <button
                      onClick={() =>
                        handleOpenModal(
                          "Deshabilitar usuario",
                          "¿Estás seguro de deshabilitar este usuario?",
                          "Deshabilitar",
                          "bg-red-500",
                          () => console.log("Deshabilitado")
                        )
                      }
                      className="bg-red-500 text-white font-semibold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Deshabilitar
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-100 transition">
                  <td className="p-3">Bonifacio</td>
                  <td className="p-3">bonifacio@gmail.com</td>
                  <td className="p-3 text-center">
                    <span className="bg-ut-orange text-white px-3 py-1 rounded-lg text-sm">
                      Dueño
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className="bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm">
                      Activo
                    </span>
                  </td>
                  <td className="p-3 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() =>
                        handleOpenModal(
                          "Deshabilitar usuario",
                          "¿Estás seguro de deshabilitar este usuario?",
                          "Deshabilitar",
                          "bg-red-500",
                          () => console.log("Deshabilitado")
                        )
                      }
                      className="bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                      disabled
                    >
                      Habilitar
                    </button>
                    <button
                      onClick={() =>
                        handleOpenModal(
                          "Deshabilitar usuario",
                          "¿Estás seguro de deshabilitar este usuario?",
                          "Deshabilitar",
                          "bg-red-500",
                          () => console.log("Deshabilitado")
                        )
                      }
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                    >
                      Deshabilitar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <ConfirmModal
        open={modalOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmText={modalConfig.confirmText}
        confirmColor={modalConfig.confirmColor}
        onConfirm={modalConfig.onConfirm}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
