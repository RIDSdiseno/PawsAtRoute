// src/components/Navbar.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProfile, logout } from "../api/api";

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
  const [user, setUser] = useState<{ rol: string; nombre: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!localStorage.getItem("access_token")) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      try {
        const profile = await getProfile();
        setUser(profile);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (isLoading) {
    return <nav>Loading...</nav>;
  }

  const handleLogout = async () => {
    await logout();
    setUser(null);
    closeMenu();
    window.location.href = "/login";
  };

  const goToPanel = () => {
    if (!user) return;
    if (user.rol === "DUEÑO") window.location.href = "/panel-dueño";
    else if (user.rol === "PASEADOR") window.location.href = "/panel-paseador";
  };

  const filteredLinks = links.filter((link) => {
    if (user) {
      if (link.to === "/login" || link.to === "/register") return false;
    } else {
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
          <span className="text-3xl font-coffeecake text-prussian-blue">
            Paws At Route
          </span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg text-white bg-prussian-blue hover:bg-prussian-blue/80 focus:ring-2 focus:ring-cyan-900 md:inline-flex lg:hidden"
          aria-controls="navbar-default"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="sr-only">Abrir menú principal</span>
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

        {/* Menú colapsable */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } w-full lg:flex lg:w-auto transition-all duration-200`}
          id="navbar-default"
        >
          <ul className="flex flex-col lg:flex-row items-center justify-center gap-2 p-4 lg:p-0 mt-4 lg:mt-0 md:border-2 border-gray-200/50 lg:border-0 rounded-xl bg-gray-100/60 lg:bg-transparent font-semibold text-md">
            {filteredLinks.map((link, index) => (
              <li
                key={index}
                className={`w-full lg:w-auto text-center rounded-full transition-all duration-200 ${
                  link.primary
                    ? "bg-prussian-blue/80 text-white hover:bg-prussian-blue border border-cyan-900 cursor-pointer"
                    : "hover:bg-ut-orange/90 hover:text-white cursor-pointer"
                }`}
              >
                {link.to ? (
                  <Link
                    to={link.to}
                    onClick={closeMenu}
                    className="block px-5 py-2 rounded-full w-full transition-transform active:scale-95"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="block px-5 py-2 rounded-full w-full transition-transform active:scale-95"
                  >
                    {link.label}
                  </a>
                )}
              </li>
            ))}

            {user && (
              <>
                <li className="w-full lg:w-auto">
                  <button
                    onClick={goToPanel}
                    className="w-full cursor-pointer lg:w-auto px-5 py-2 rounded-full bg-prussian-blue/80 text-white border border-cyan-900 hover:bg-prussian-blue transition-all duration-200 active:scale-95"
                  >
                    Mi Panel
                  </button>
                </li>
                <li className="w-full lg:w-auto">
                  <button
                    onClick={handleLogout}
                    className="w-full cursor-pointer lg:w-auto px-5 py-2 rounded-full bg-red-500 text-white border border-red-600 hover:bg-red-600 transition-all duration-200 active:scale-95"
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;