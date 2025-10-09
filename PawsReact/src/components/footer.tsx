function Footer() {
  return (
    <>
      <footer className="bg-selective-yellow text-prussian-blue py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Paws At Route</h3>
              <p>Conectando dueños de mascotas con paseadores de confianza.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Navegación</h3>
              <ul>
                <li className="mb-2">
                  <a href="/" className="hover:underline">
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
    </>
  );
}

export default Footer;
