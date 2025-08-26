import { Link } from "react-router-dom";

function Login() {
  return (
    <section className="flex justify-center items-center h-screen tracking-wide text-prussian-blue font-nunito">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <form
        action="/home"
        className="flex flex-col gap-4 rounded-xl bg-white p-6"
      >
        <h1 className="font-bebas text-2xl text-center">Iniciar Sesión</h1>
        <label className="flex flex-col gap-2" htmlFor="correo">
          <p className="font-semibold">Correo</p>
          <input
            type="email"
            placeholder="ejemplo@gmail.com"
            required
            name="correo"
            id="correo"
            className="p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
          />
          <p className="invisible text-xs text-red-500 peer-invalid:visible">
            Por favor, ingresa un correo válido.
          </p>
        </label>

        <label className="flex flex-col gap-2" htmlFor="contraseña">
          <p className="font-semibold">Contraseña</p>
          <input
            type="password"
            placeholder="********"
            required
            name="contraseña"
            id="contraseña"
            className="p-2 -ml-2 border-2 border-gray-300 rounded-lg peer focus:invalid:border-red-500 focus:outline-none focus:border-blue-500 invalid:text-red-500 invalid:border-red-500"
          />
        </label>

        <button
          type="submit"
          className="bg-prussian-blue text-blanco rounded-md p-2 cursor-pointer hover:bg-prussian-blue/80 -ml-2"
        >
          Iniciar Sesión
        </button>
        <p className="text-center gap-2 flex">
          ¿No tienes cuenta?
          <Link
            to="/register"
            className="text-ut-orange font-semibold hover:underline"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </section>
  );
}

export default Login;
