import { useRef, useState } from "react";

function EditarPerfil() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [foto, setFoto] = useState<string>(
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik0yMyAxMmMwIDMuMzQ1LTEuNDkzIDYuMzQyLTMuODUgOC4zNkExMC45NiAxMC45NiAwIDAgMSAxMiAyM2MtMi43MyAwLTUuMjI3LS45OTQtNy4xNS0yLjY0QTEwLjk4IDEwLjk4IDAgMCAxIDEgMTJDMSA1LjkyNSA1LjkyNSAxIDEyIDFzMTEgNC45MjUgMTEgMTFtLTctMy41YTQgNCAwIDEgMC04IDBhNCA0IDAgMCAwIDggMG0yLjUgOS43MjVWMThhNCA0IDAgMCAwLTQtNGgtNWE0IDQgMCAwIDAtNCA0di4yMjVxLjMxLjMyMy42NS42MTVBOC45NiA4Ljk2IDAgMCAwIDEyIDIxYTguOTYgOC45NiAwIDAgMCA2LjUtMi43NzUiLz48L3N2Zz4=" // Ejemplo: foto inicial
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="min-h-screen text-prussian-blue px-4 py-10 sm:px-6 lg:px-12 max-w-6xl mx-auto">
      <header className="mb-10 text-pretty md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold mb-3">Editar Perfil</h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto md:mx-0">
          Aquí podrás modificar tus datos personales, como tu foto de perfil,
          nombre, apellido y teléfono.
        </p>
      </header>

      <section>
        <form
          action="/mi-perfil"
          className="bg-white shadow-lg rounded-xl p-6 md:p-8 max-w-lg mx-auto flex flex-col gap-6"
        >
          {/* Foto de perfil */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <img
                src={foto}
                alt="Foto de perfil"
                className="w-32 h-32 rounded-full border-4 border-amber-500 object-cover shadow-md"
              />
              {/* Overlay para cambiar */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                Cambiar foto
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>
            <p className="text-sm text-gray-500">PNG o JPG, máximo 2MB.</p>
          </div>

          {/* Nombre */}
          <label className="flex flex-col gap-1" htmlFor="nombre">
            <span className="font-semibold">Nombre</span>
            <input
              id="nombre"
              type="text"
              required
              minLength={3}
              maxLength={15}
              placeholder="Ej: María"
              className="peer p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
            />
            <p className="invisible text-sm text-red-500 peer-invalid:visible">
              El nombre debe tener entre 3 y 15 caracteres.
            </p>
          </label>

          {/* Apellido */}
          <label className="flex flex-col gap-1" htmlFor="apellido">
            <span className="font-semibold">Apellido</span>
            <input
              id="apellido"
              type="text"
              required
              minLength={3}
              maxLength={15}
              placeholder="Ej: Pérez"
              className="peer p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
            />
            <p className="invisible text-sm text-red-500 peer-invalid:visible">
              El apellido debe tener entre 3 y 15 caracteres.
            </p>
          </label>

          {/* Teléfono */}
          <label className="flex flex-col gap-1" htmlFor="telefono">
            <span className="font-semibold">Teléfono</span>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              minLength={9}
              maxLength={12}
              pattern="^[0-9]{9,12}$"
              placeholder="Ej: 987654321"
              className="peer p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 invalid:border-red-500 invalid:text-red-500"
            />
            <p className="invisible text-sm text-red-500 peer-invalid:visible">
              Ingrese un número válido (solo dígitos, 9 a 12 caracteres).
            </p>
          </label>

          {/* Botón */}
          <button
            type="submit"
            className="bg-prussian-blue text-white rounded-full py-3 px-6 hover:bg-prussian-blue/80 border-2 border-cyan-900 shadow-md shadow-prussian-blue/40 font-semibold transition-colors duration-300 w-full md:w-auto"
          >
            Guardar cambios
          </button>
        </form>
      </section>
    </main>
  );
}

export default EditarPerfil;
