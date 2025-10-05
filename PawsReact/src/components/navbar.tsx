import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";  // Importamos el hook del contexto

interface NavLink {
  label: string;
  to?: string;
  href?: string;
  primary?: boolean;
}

interface NavbarProps {
  links?: NavLink[];
}

function Navbar({ links = [] }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();  // Obtenemos el usuario y la función logout del contexto

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = async () => {
    logout(); // Llama al método logout del contexto
    closeMenu(); // Cierra el menú móvil (si está abierto)
  };

  // Filtramos los enlaces según si el usuario está autenticado o no
  const filteredLinks = links.filter(link => {
    if (user) {
      // Si el usuario está logueado, ocultamos 'Ingresar' y 'Registrarse'
      if (link.to === "/login" || link.to === "/register") return false;
    } else {
      // Si no está logueado, ocultamos 'Cerrar sesión'
      if (link.to === "/logout") return false;
    }
    return true;
  });

  return (
    <nav className="bg-selective-yellow">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
          onClick={closeMenu}
        >
          <span className="text-3xl font-coffeecake text-prussian-blue text-shadow-lg shadow-prussian-blue/50">
            Paws At Route
          </span>
        </Link>

        {/* Menú móvil */}
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

        {/* Links */}
        <div
          className={`${isMenuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
          id="navbar-default"
        >
          <ul className="text-md flex flex-col p-4 md:p-0 mt-4 border-2 border-gray-300/50 rounded-xl bg-gray-300/50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-transparent font-semibold">
            {/* Links filtrados */}
            {filteredLinks.map((link, index) => (
              <li
                key={index}
                className={`rounded-full transition-colors duration-300 ${
                  link.primary
                    ? "bg-prussian-blue/90 text-white border border-cyan-900 hover:bg-prussian-blue active:scale-90 transition-all duration-200"
                    : "hover:bg-ut-orange active:scale-90 transition-all duration-200"
                }`}
              >
                {link.to ? (
                  <Link to={link.to} className="block py-2 px-4" onClick={closeMenu}>
                    {link.label}
                  </Link>
                ) : (
                  <a href={link.href} className="block py-2 px-4" onClick={closeMenu}>
                    {link.label}
                  </a>
                )}
              </li>
            ))}

            {/* Botones que solo se muestran si hay usuario */}
            {user ? (
              <>
                <li>
                  <button
                    onClick={() => window.location.href = "/panel"}
                    className="block py-2 px-4 rounded-full bg-prussian-blue text-white hover:bg-prussian-blue/90 transition-all duration-200"
                  >
                    Mi Panel
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block py-2 px-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : null}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
