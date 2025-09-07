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

function App() {
  return (
    <Router>
      <Routes>
        {/* Página de inicio (landing) */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Beneficios />
              <Pasos />
              <Footer />
            </>
          }
        />

        {/* Ruta de las páginas individuales */}
        <Route
          path="/login"
          element={
            <>
              <Login />
            </>
          }
        />
        <Route
          path="/register"
          element={
            <>
              <Register />
            </>
          }
        />
        <Route
          path="/home"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route
          path="/nuevo-paseo"
          element={
            <>
              <NuevoPaseo />
            </>
          }
        />
        <Route
          path="/recuperar-clave"
          element={
            <>
              <RecuperarClave />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
