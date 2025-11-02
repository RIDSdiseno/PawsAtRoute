import { IonButton, IonIcon } from "@ionic/react";
import { home } from "ionicons/icons";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background:
          "linear-gradient(135deg, rgba(255,204,112,0.2), rgba(255,255,255,0.6))",
        textAlign: "center",
        color: "#333",
        padding: "1rem",
      }}
    >
      <h1
        style={{
          fontSize: "8rem",
          fontWeight: "800",
          marginBottom: "0.5rem",
          color: "#fbbf24",
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: "1.8rem",
          fontWeight: "600",
          marginBottom: "1rem",
        }}
      >
        La página que buscas no existe.
      </h2>
      <p
        style={{
          maxWidth: "400px",
          marginBottom: "2rem",
          color: "#555",
          fontSize: "1rem",
        }}
      >
        Puede que el enlace haya expirado o que la dirección sea incorrecta.
      </p>
      <IonButton
        color="warning"
        routerLink="/"
        style={{
          borderRadius: "50px",
          padding: "0.8rem 2rem",
          fontSize: "1.1rem",
          fontWeight: "600",
        }}
      >
        <IonIcon icon={home} slot="start" />
        Regresar al inicio
      </IonButton>
    </div>
  );
};

export default NotFound;