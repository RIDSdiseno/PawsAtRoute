import { Auth } from "./services/auth";
import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { analytics, person, home } from "ionicons/icons";
import Tab1 from "./pages/Tab1";
import Tab2 from "./pages/Tab2";
import Tab3 from "./pages/Tab3";
import Login from "./pages/login";
import RecuperarClave from "./pages/recuperar-clave";
import Registro from "./pages/registro";
import NuevoPaseo from "./pages/nuevo-paseo";
import RegistroMascota from "./pages/registro-mascota";
import EditarPerfil from "./pages/editar-perfil";
import PerfilPaseador from "./pages/perfil-paseador";
import PanelPaseador from "./pages/panel-paseador";
import EstadisticasPaseador from "./pages/estadisticas-paseador";
import NotFound from "./pages/notfound";

import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";

setupIonicReact({ mode: "ios" });

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>

        <Redirect exact from="/" to="/login" />

        {/* LOGIN: si ya está logueado, lo mando a su home por rol */}
        <Route
          exact
          path="/login"
          render={(props) => {
            if (!Auth.isLoggedIn()) return <Login/>;
            const role = Auth.getRole();
            return <Redirect to={role === "PASEADOR" ? "/panel-paseador/inicio" : "/tabs/tab1"} />;
          }}
        />

        {/* públicas simples */}
        <Route exact path="/recuperar-clave" component={RecuperarClave} />
        <Route exact path="/registro" component={Registro} />

        {/* PRIVADAS GENÉRICAS (si no hay login -> /login) */}
        <Route
          exact
          path="/nuevo-paseo"
          render={(p) => Auth.isLoggedIn() ? <NuevoPaseo /> : <Redirect to="/login" />}
        />
        <Route
          exact
          path="/registro-mascota"
          render={(p) => Auth.isLoggedIn() ? <RegistroMascota /> : <Redirect to="/login" />}
        />
        <Route
          exact
          path="/editar-perfil"
          render={(p) => Auth.isLoggedIn() ? <EditarPerfil /> : <Redirect to="/login" />}
        />
        <Route
          exact
          path="/perfil-paseador"
          render={(p) => Auth.isLoggedIn() ? <PerfilPaseador/> : <Redirect to="/login" />}
        />

        {/* DUEÑO: TABS protegidas por rol */}
        <Route
          path="/tabs"
          render={() => {
            if (!Auth.isLoggedIn()) return <Redirect to="/login" />;
            if (Auth.getRole() !== "DUEÑO") return <Redirect to="/tabs/tab1" />;
            return (
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/tabs/tab1" component={Tab1} />
                  <Route exact path="/tabs/tab2" component={Tab2} />
                  <Route exact path="/tabs/tab3" component={Tab3} />
                  <Redirect exact from="/tabs" to="/tabs/tab1" />
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="tab1" href="/tabs/tab1"><IonIcon icon={home} /><IonLabel>Inicio</IonLabel></IonTabButton>
                  <IonTabButton tab="tab2" href="/tabs/tab2"><IonIcon icon={analytics} /><IonLabel>Estadísticas</IonLabel></IonTabButton>
                  <IonTabButton tab="tab3" href="/tabs/tab3"><IonIcon icon={person} /><IonLabel>Perfil</IonLabel></IonTabButton>
                </IonTabBar>
              </IonTabs>
            );
          }}
        />

        {/* PASEADOR: panel protegido por rol */}
        <Route
          path="/panel-paseador"
          render={() => {
            if (!Auth.isLoggedIn()) return <Redirect to="/login" />;
            if (Auth.getRole() !== "PASEADOR") return <Redirect to="/panel-paseador/inicio" />;
            return (
              <IonTabs>
                <IonRouterOutlet>
                  <Route exact path="/panel-paseador/inicio" component={PanelPaseador} />
                  <Route exact path="/panel-paseador/estadisticas" component={EstadisticasPaseador} />
                  <Route exact path="/panel-paseador/perfil" component={Tab3} />
                  <Redirect exact from="/panel-paseador" to="/panel-paseador/inicio" />
                </IonRouterOutlet>
                <IonTabBar slot="bottom">
                  <IonTabButton tab="inicio" href="/panel-paseador/inicio"><IonIcon icon={home} /><IonLabel>Inicio</IonLabel></IonTabButton>
                  <IonTabButton tab="estadisticas" href="/panel-paseador/estadisticas"><IonIcon icon={analytics} /><IonLabel>Estadísticas</IonLabel></IonTabButton>
                  <IonTabButton tab="perfil" href="/panel-paseador/perfil"><IonIcon icon={person} /><IonLabel>Perfil</IonLabel></IonTabButton>
                </IonTabBar>
              </IonTabs>
            );
          }}
        />

        <Route component={NotFound} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;