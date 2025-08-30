import { useScrollToTop } from "../../hooks/use-scroll-to-top";

function Footer() {
  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <>
      <footer className="bg-selective-yellow text-prussian-blue py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">PawsAtRoute</h3>
              <p>Conectando dueños de mascotas con paseadores de confianza.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Navegación</h3>
              <ul>
                <li className="mb-2">
                  <a href="#hero" className="hover:underline">
                    Inicio
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#beneficios" className="hover:underline">
                    Beneficios
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#pasos" className="hover:underline">
                    Pasos
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Legal</h3>
              <ul>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    Términos y Condiciones
                  </a>
                </li>
                <li className="mb-2">
                  <a href="#" className="hover:underline">
                    Política de Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-prussian-blue pt-8 text-center">
            <p className="text-sm">
              Proyecto desarrollado por: Mateo Sepúlveda - Mario Benedetti -
              Jois Rosales
            </p>
            <p className="text-sm">
              Todos los derechos reservados &copy; {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>

      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-prussian-blue text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-opacity duration-300"
          aria-label="Volver arriba"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}
    </>
  );
}

export default Footer;
