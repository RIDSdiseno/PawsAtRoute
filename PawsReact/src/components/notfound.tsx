
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-screen gap-4">
      <h1 className="text-5xl font-bold text-prussian-blue">404</h1>
      <p className="text-lg font-semibold text-gray-500">Lo siento, la página que estás buscando no existe.</p>
      <button className="cursor-pointer bg-prussian-blue/80 text-white font-bold py-2 px-4 rounded-lg flex justify-center items-center gap-2 hover:bg-prussian-blue hover:scale-105 active:scale-90 transition-all duration-200">
        <Link to="/">Volver al inicio</Link>
      </button>
    </div>
  );
}
