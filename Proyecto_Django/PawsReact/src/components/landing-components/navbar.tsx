import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-selective-yellow">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/App.tsx"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          onClick={closeMenu}
        >
          <span className="text-3xl font-coffeecake text-prussian-blue text-shadow-lg shadow-prussian-blue/50">
            Paws At Route
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden text-white bg-prussian-blue hover:bg-prussian-blue/80 focus:ring-2 focus:ring-cyan-900"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="text-md flex flex-col p-4 md:p-0 mt-4 border-2 border-gray-300/50 rounded-xl bg-gray-300/50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent font-semibold">
            <li className="hover:bg-blue-green/80 hover:border-2 hover:border-cyan-600 rounded-full transition-colors duration-300">
              <Link
                to="/"
                className="block py-2 px-3"
                aria-current="page"
                onClick={closeMenu}
              >
                Inicio
              </Link>
            </li>
            <li className="hover:bg-blue-green/80 hover:border-2 hover:border-cyan-600 rounded-full transition-colors duration-300">
              <a
                href="#beneficios"
                className="block py-2 px-3"
                onClick={closeMenu}
              >
                Beneficios
              </a>
            </li>
            <li className="hover:bg-blue-green/80 hover:border-2 hover:border-cyan-600 rounded-full transition-colors duración-300">
              <a href="#pasos" className="block py-2 px-3" onClick={closeMenu}>
                Pasos
              </a>
            </li>
            <li className="bg-prussian-blue hover:bg-prussian-blue/80 rounded-full transition-colors duration-300 text-white border-2 border-cyan-900 shadow-lg shadow-prussian-blue/50">
              <Link to="/login" className="block py-2 px-3" onClick={closeMenu}>
                Ingresar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
