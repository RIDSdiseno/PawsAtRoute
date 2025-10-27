import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonButtons,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent,
  IonInput,
  IonItem,
  IonInputOtp,
  IonInputPasswordToggle,
  IonAlert,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { useState } from "react";
import { useIonRouter } from "@ionic/react";

const RecuperarClave: React.FC = () => {
  const router = useIonRouter();
  const [step, setStep] = useState(1);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/login"
              color="prussian-blue"
            ></IonBackButton>
          </IonButtons>
          <IonTitle className="coffeecake" color="prussian-blue">
            Paws At Route
          </IonTitle>
        </IonToolbar>
        <div style={{ overflow: "hidden" }}>
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              fill: "var(--ion-color-selective-yellow)",
              width: "125%",
              height: 35,
            }}
          >
            <path
              d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
              opacity=".25"
            />
            <path
              d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z"
              opacity=".5"
            />
            <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
          </svg>
        </div>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        {/* STEP 1: Ingreso de correo */}
        {step === 1 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">
                Restablecer Contraseña
              </IonCardTitle>
              <IonCardSubtitle>
                Ingresa tu correo para restablecer tu contraseña
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <form>
                <IonItem>
                  <IonInput
                    label="Correo"
                    labelPlacement="stacked"
                    placeholder="ejemplo@gmail.com"
                    type="email"
                    required
                    minlength={10}
                    maxlength={40}
                  ></IonInput>
                </IonItem>
                <IonButton
                  expand="full"
                  shape="round"
                  color="prussian-blue"
                  className="ion-margin-top"
                  id="recuperar-alert"
                >
                  Recuperar
                </IonButton>
                <IonAlert
                  trigger="recuperar-alert"
                  header="Correo identificado"
                  subHeader="Se envio un correo con el codigo de verificacion"
                  buttons={["Aceptar"]}
                  onClick={() => setStep(2)}
                ></IonAlert>
              </form>
            </IonCardContent>
          </IonCard>
        )}

        {/* STEP 2: Verificación de código */}
        {step === 2 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">
                Ingresa el código
              </IonCardTitle>
              <IonCardSubtitle>
                Se envió un código de 6 dígitos a tu correo
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonInputOtp length={6}>
                ¿No recibiste el código?{" "}
                <a color="ut-orange" href="#">
                  Reenviar
                </a>
              </IonInputOtp>
              <IonButton
                expand="full"
                shape="round"
                color="prussian-blue"
                className="ion-margin-top"
                id="verificar-alert"
              >
                Verificar
              </IonButton>
              <IonAlert
                trigger="verificar-alert"
                header="Código verificado"
                subHeader="Se verificó el código exitósamente."
                buttons={["Aceptar"]}
                onClick={() => setStep(3)}
              ></IonAlert>
            </IonCardContent>
          </IonCard>
        )}

        {/* STEP 3: Cambio de contraseña */}
        {step === 3 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">
                Cambiar contraseña
              </IonCardTitle>
              <IonCardSubtitle>Ingresa tu nueva contraseña</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonInput
                  label="Nueva contraseña"
                  labelPlacement="stacked"
                  placeholder="**********"
                  type="password"
                  required
                  counter={true}
                  minlength={10}
                  maxlength={30}
                >
                  <IonInputPasswordToggle
                    slot="end"
                    color="prussian-blue"
                  ></IonInputPasswordToggle>
                </IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Confirmar contraseña"
                  labelPlacement="stacked"
                  placeholder="**********"
                  type="password"
                  required
                  counter={true}
                  minlength={10}
                  maxlength={30}
                >
                  <IonInputPasswordToggle
                    slot="end"
                    color="prussian-blue"
                  ></IonInputPasswordToggle>
                </IonInput>
              </IonItem>
              <IonButton
                expand="full"
                shape="round"
                color="prussian-blue"
                className="ion-margin-top"
                id="confirmar-alert"
              >
                Confirmar
              </IonButton>
              <IonAlert
                trigger="confirmar-alert"
                header="Contraseña cambiada"
                subHeader="Se cambió la contraseña exitósamente."
                buttons={["Aceptar"]}
                onClick={() => router.push("/login")}
              ></IonAlert>
            </IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </IonPage>
  );
};

export default RecuperarClave;
