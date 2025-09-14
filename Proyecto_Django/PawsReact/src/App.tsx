import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/landing-components/navbar";
import Hero from "./components/landing-components/hero";
import Beneficios from "./components/landing-components/beneficios";
import Pasos from "./components/landing-components/pasos";
import Footer from "./components/landing-components/footer";
import Login from "./components/dashboard-components/login";
import Register from "./components/dashboard-components/register";
import Home from "./components/dashboard-components/home";
import NuevoPaseo from "./components/dashboard-components/nuevo-paseo";
import RecuperarClave from "./components/dashboard-components/recuperar-clave";
import Postulantes from "./components/dashboard-components/postulantes";
import PerfilPaseador from "./components/dashboard-components/perfil-paseador";

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
          path="/home"
          element={
            <>
              <Navbar
                links={[
                  { to: "/nuevo-paseo", label: "Nuevo Paseo" },
                  { to: "/perfil", label: "Mi perfil", primary: true },
                ]}
              />
              <Home />
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
                  { to: "/home", label: "Menú" },
                  { to: "/perfil", label: "Mi perfil", primary: true },
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
                  { to: "/home", label: "Menú" },
                  { to: "/perfil", label: "Mi perfil", primary: true },
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
                  { to: "/home", label: "Menú" },
                  { to: "/perfil", label: "Mi perfil", primary: true },
                ]}
              />
              <PerfilPaseador />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
