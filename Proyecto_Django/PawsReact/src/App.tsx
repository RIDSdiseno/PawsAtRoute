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

        {/* Página de login: SOLO el login (sin landing) */}
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
      </Routes>
    </Router>
  );
}

export default App;
