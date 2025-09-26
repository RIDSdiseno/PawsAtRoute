import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Postulantes from "./components/panel-components/postulantes";
import PerfilPaseador from "./components/panel-components/perfil-paseador";
import MiPerfil from "./components/panel-components/mi-perfil";
import EditarPerfil from "./components/panel-components/editar-perfil";
import PanelPaseador from "./components/panel-components/panel-paseador";

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas de las páginas */}
        <Route
          path="/"
          element={
            <>
              <Navbar
                links={[
                  { href: "#beneficios", label: "Beneficios" },
                  { href: "#pasos", label: "Pasos" },
                  { to: "/login", label: "Ingresar", primary: true },
                ]}
              />
              <Hero />
              <Beneficios />
              <Pasos />
              <Footer />
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
              <Footer />
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
              <Footer />
            </>
          }
        />
        <Route
          path="/panel-dueño"
          element={
            <>
              <Navbar
                links={[
                  { to: "/nuevo-paseo", label: "Nuevo Paseo" },
                  { to: "/mi-perfil", label: "Mi perfil", primary: true },
                ]}
              />
              <PanelDueño />
              <Footer />
            </>
          }
        />
        <Route
          path="/nuevo-paseo"
          element={
            <>
              <Navbar
                links={[
                  { to: "/panel-dueño", label: "Menú" },
                  { to: "/mi-perfil", label: "Mi perfil", primary: true },
                ]}
              />
              <NuevoPaseo />
              <Footer />
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
              <Footer />
            </>
          }
        />
        <Route
          path="/postulantes"
          element={
            <>
              <Navbar
                links={[
                  { to: "/panel-dueño", label: "Menú" },
                  { to: "/mi-perfil", label: "Mi perfil", primary: true },
                ]}
              />
              <Postulantes />
              <Footer />
            </>
          }
        />
        <Route
          path="/perfil-paseador"
          element={
            <>
              <Navbar
                links={[
                  { to: "/panel-paseador", label: "Menú" },
                  { to: "/mi-perfil", label: "Mi perfil", primary: true },
                ]}
              />
              <PerfilPaseador />
              <Footer />
            </>
          }
        />
        <Route
          path="/mi-perfil"
          element={
            <>
              <Navbar
                links={[
                  { to: "/editar-perfil", label: "Editar Perfil" },
                  { to: "/panel-dueño", label: "Menú", primary: true },
                ]}
              />
              <MiPerfil />
              <Footer />
            </>
          }
        />
        <Route
          path="/editar-perfil"
          element={
            <>
              <Navbar
                links={[
                  { to: "/panel-dueño", label: "Menú" },
                  { to: "/mi-perfil", label: "Mi perfil", primary: true },
                ]}
              />
              <EditarPerfil />
              <Footer />
            </>
          }
        />
        <Route
          path="/panel-paseador"
          element={
            <>
              <Navbar
                links={[
                  { to: "/panel-paseador", label: "Menú" },
                  { to: "/mi-perfil", label: "Mi perfil", primary: true },
                ]}
              />
              <PanelPaseador />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
