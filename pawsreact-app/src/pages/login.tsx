import { useState } from "react";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonPage,
  IonTitle,
  IonToolbar,
  IonText,
  IonItem,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonLabel,
  IonSpinner,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { login as apiLogin } from "../services/api"; // <-- tu API adaptada
import { Auth } from "../services/auth";            // <-- tu Auth (sin normalizar “DUEÑO”)

const Login: React.FC = () => {
  const router = useIonRouter();

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const [errors, setErrors] = useState<{ correo?: string; password?: string }>({});
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Validaciones iguales a tu web (con mínimos ajustes)
  const validarFormulario = () => {
    const nuevosErrores: { correo?: string; password?: string } = {};

    if (!correo) {
      nuevosErrores.correo = "El correo es obligatorio.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      nuevosErrores.correo = "Por favor, ingresa un correo válido.";
    } else if (correo.length < 10 || correo.length > 30) {
      nuevosErrores.correo = "El correo debe tener entre 10 y 30 caracteres.";
    }

    if (!password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{10,20}$/.test(
        password
      )
    ) {
      nuevosErrores.password =
        "La contraseña debe tener entre 10 y 20 caracteres, incluir mayúscula, minúscula, número y caracter especial.";
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    if (!validarFormulario()) return;

    setLoading(true);
    try {
      const data = await apiLogin(correo, password, remember);
      // Guarda sesión exactamente como pediste (sin normalizar rol)
      Auth.login(data.token, data.user);

      // Redirección por rol (tal cual viene del backend)
      if (data.user.rol === "PASEADOR") {
        router.push("/panel-paseador/inicio", "root");
      } else if (data.user.rol === "DUEÑO") {
        router.push("/tabs/tab1", "root");
      } else {
        router.push("/", "root");
      }
    } catch (err: any) {
      setLoginError(
        err?.response?.data?.error ||
        err?.message ||
        "Error al iniciar sesión"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonTitle className="coffeecake" color="prussian-blue">
            Paws At Route
          </IonTitle>
        </IonToolbar>
        <div style={{ overflow: "hidden" }}>
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fill: "var(--ion-color-selective-yellow)", width: "125%", height: 35 }}
          >
            <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25" />
            <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z" opacity=".5" />
            <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
          </svg>
        </div>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        <IonCard>
          <IonCardHeader className="ion-text-center">
            <IonCardTitle color="prussian-blue">Inicio de sesión</IonCardTitle>
            <IonCardSubtitle>¡Bienvenido de vuelta!</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <form onSubmit={handleSubmit} noValidate>
              <IonItem>
                <IonInput
                  label="Correo"
                  labelPlacement="stacked"
                  type="email"
                  autocomplete="email"
                  inputmode="email"
                  value={correo}
                  onIonChange={(e) => setCorreo(e.detail.value ?? "")}
                />
              </IonItem>
              {errors.correo && (
                <IonText color="danger"><p className="ion-padding-start">{errors.correo}</p></IonText>
              )}

              <IonItem className="ion-margin-top">
                <IonInput
                  label="Contraseña"
                  labelPlacement="stacked"
                  type="password"
                  autocomplete="current-password"
                  value={password}
                  onIonChange={(e) => setPassword(e.detail.value ?? "")}
                  minlength={10}
                  maxlength={20}
                >
                  <IonInputPasswordToggle slot="end" color="prussian-blue" />
                </IonInput>
              </IonItem>
              {errors.password && (
                <IonText color="danger"><p className="ion-padding-start">{errors.password}</p></IonText>
              )}

              <IonItem className="ion-margin-top" lines="none">
                <IonCheckbox
                  checked={remember}
                  onIonChange={(e) => setRemember(!!e.detail.checked)}
                  justify="start"
                />
                <IonLabel className="ion-padding-start">Recordarme</IonLabel>
              </IonItem>

              {loginError && (
                <IonText color="danger">
                  <p className="ion-text-center ion-margin-top">{loginError}</p>
                </IonText>
              )}

              <IonButton
                expand="block"
                className="ion-margin-top"
                color="prussian-blue"
                shape="round"
                type="submit"
                disabled={loading}
              >
                {loading ? <IonSpinner name="dots" /> : "Iniciar sesión"}
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>

        <IonText className="ion-margin-top ion-text-center">
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <span
              style={{ color: "var(--ion-color-ut-orange)", fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}
              onClick={() => router.push("/recuperar-clave", "forward")}
            >
              Restablecer
            </span>
          </p>
        </IonText>

        <IonText className="ion-margin-top ion-text-center">
          <p>
            ¿No tienes cuenta?{" "}
            <span
              style={{ color: "var(--ion-color-ut-orange)", fontWeight: "bold", textDecoration: "underline", cursor: "pointer" }}
              onClick={() => router.push("/registro", "forward")}
            >
              Regístrate
            </span>
          </p>
        </IonText>
      </IonContent>

      <IonFooter>
        <IonToolbar>
          <IonTitle className="ion-text-center">Paws At Route</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Login;
