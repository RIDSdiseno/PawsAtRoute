import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/navbar";
import Hero from "./components/hero";
import Beneficios from "./components/beneficios";
import Pasos from "./components/pasos";
import Footer from "./components/footer";
import Login from "./components/panel-components/login";
import Register from "./components/panel-components/register";
import PanelDueño from "./components/panel-components/panel-dueño";
import NuevoPaseo from "./components/panel-components/nuevo-paseo";
import RecuperarClave from "./components/panel-components/recuperar-clave";
import PerfilPaseador from "./components/panel-components/perfil-paseador";
import MiPerfil from "./components/panel-components/mi-perfil";
import EditarPerfil from "./components/panel-components/editar-perfil";
import PanelPaseador from "./components/panel-components/panel-paseador";
import Pricing from "./components/pricing";
import RegistroMascota from "./components/panel-components/registro-mascota";
import PanelAdmin from "./components/panel-components/panel-admin";
import PoliticaPrivacidad from "./components/politica-privacidad";
import TerminosCondiciones from "./components/terminos-condiciones";
import NotFound from "./components/notfound";

function App() {
  const footerSections = [
    {
      title: "Paws At Route",
      links: [
        { label: "Inicio", href: "/" },
        { label: "Beneficios", href: "/beneficios" },
        { label: "Pasos", href: "/pasos" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Términos y Condiciones", href: "/terminos-condiciones" },
        { label: "Política de Privacidad", href: "/politica-privacidad" },
        { label: "Panel Administrador", href: "/panel-admin" },
      ],
    },
  ];

  const developers = ["Mateo Sepúlveda", "Mario Benedetti", "Jois Rosales"];

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route
            path="/"
            element={
              <>
                <Navbar
                  links={[
                    { href: "#beneficios", label: "Beneficios" },
                    { href: "#pasos", label: "Pasos" },
                    { href: "#pricing", label: "Planes" },
                    { to: "/login", label: "Ingresar", primary: true },
                  ]}
                />
                <Hero />
                <Beneficios />
                <Pasos />
                <Pricing />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/beneficios"
            element={
              <>
                <Navbar
                  links={[
                    { to: "/", label: "Inicio" },
                    { to: "/pasos", label: "Pasos" },
                    { to: "/pricing", label: "Planes" },
                  ]}
                />
                <Beneficios />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/pasos"
            element={
              <>
                <Navbar
                  links={[
                    { to: "/", label: "Inicio" },
                    { to: "/beneficios", label: "Beneficios" },
                    { to: "/pricing", label: "Planes" },
                  ]}
                />
                <Pasos />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/pricing"
            element={
              <>
                <Navbar
                  links={[
                    { to: "/", label: "Inicio" },
                    { to: "/beneficios", label: "Beneficios" },
                    { to: "/pasos", label: "Pasos" },
                  ]}
                />
                <Pricing />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/login"
            element={
              <>
                <Navbar
                  links={[
                    { to: "/", label: "Inicio" },
                    { to: "/recuperar-clave", label: "Recuperar clave" },
                    { to: "/register", label: "Registrarse", primary: true },
                  ]}
                />
                <Login />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/register"
            element={
              <>
                <Navbar
                  links={[
                    { to: "/", label: "Inicio" },
                    { to: "/login", label: "Ingresar", primary: true },
                  ]}
                />
                <Register />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/panel-dueño"
            element={
              <>
                <Navbar
                  links={[
                    { to: "/registro-mascota", label: "Registrar Mascota" },
                    { to: "/nuevo-paseo", label: "Nuevo Paseo" },
                    { to: "/mi-perfil", label: "Mi perfil" },
                  ]}
                />
                <PanelDueño />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/nuevo-paseo"
            element={
              <>
                <Navbar links={[{ to: "/mi-perfil", label: "Mi perfil" }]} />
                <NuevoPaseo />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/recuperar-clave"
            element={
              <>
                <Navbar
                  links={[
                    { to: "/", label: "Inicio" },
                    { to: "/login", label: "Ingresar", primary: true },
                  ]}
                />
                <RecuperarClave />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/perfil-paseador"
            element={
              <>
                <Navbar links={[{ to: "/mi-perfil", label: "Mi perfil" }]} />
                <PerfilPaseador />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/mi-perfil"
            element={
              <>
                <Navbar
                  links={[{ to: "/editar-perfil", label: "Editar Perfil" }]}
                />
                <MiPerfil />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/editar-perfil"
            element={
              <>
                <Navbar links={[{ to: "/mi-perfil", label: "Mi perfil" }]} />
                <EditarPerfil />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/panel-paseador"
            element={
              <>
                <Navbar links={[{ to: "/mi-perfil", label: "Mi perfil" }]} />
                <PanelPaseador />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/registro-mascota"
            element={
              <>
                <Navbar links={[{ to: "/mi-perfil", label: "Mi perfil" }]} />
                <RegistroMascota />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />

          <Route
            path="/panel-admin"
            element={
              <>
                <Navbar links={[{ to: "/mi-perfil", label: "Mi perfil" }]} />
                <PanelAdmin />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />
          <Route
            path="/politica-privacidad"
            element={
              <>
                <Navbar links={[{ to: "/mi-perfil", label: "Mi perfil" }]} />
                <PoliticaPrivacidad />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />
          <Route
            path="/terminos-condiciones"
            element={
              <>
                <Navbar links={[{ to: "/mi-perfil", label: "Mi perfil" }]} />
                <TerminosCondiciones />
                <Footer sections={footerSections} developers={developers} />
              </>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
