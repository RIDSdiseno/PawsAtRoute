import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonChip,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonPage,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import "./NuevoPaseo.css";

const NuevoPaseo: React.FC = () => {
  const router = useIonRouter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tabs/tab1"
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

        <IonCard>
          <IonCardHeader className="ion-text-center">
            <IonCardTitle color="prussian-blue">
              Solicitud de paseo
            </IonCardTitle>
            <IonCardSubtitle>Información del paseo</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <IonList lines="none">
              <IonItem>
                <IonLabel position="stacked" color="prussian-blue">
                  ¿Qué mascota irá de paseo?
                </IonLabel>
                <IonList>
                  <IonItem>
                    <IonCheckbox slot="start"></IonCheckbox>
                    <IonLabel>Firulais</IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonCheckbox slot="start"></IonCheckbox>
                    <IonLabel>Rocky</IonLabel>
                  </IonItem>
                </IonList>
                <IonNote slot="helper">
                  Puedes seleccionar hasta 3 por paseo.
                </IonNote>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked" color="prussian-blue">
                  Fecha y hora
                </IonLabel>
                <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                <IonModal keepContentsMounted={true}>
                  <IonDatetime id="datetime"></IonDatetime>
                </IonModal>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked" color="prussian-blue">
                  Duración
                </IonLabel>
                <IonRadioGroup value="30">
                  <IonItem>
                    <IonRadio value="30">
                      30 minutos
                      <IonChip color="success">$10.000 CLP</IonChip>
                    </IonRadio>
                  </IonItem>
                  <IonItem>
                    <IonRadio value="60">
                      1 hora
                      <IonChip color="success">$15.000 CLP</IonChip>
                    </IonRadio>
                  </IonItem>
                  <IonItem>
                    <IonRadio value="90">
                      1 hora y 30 minutos
                      <IonChip color="success">$20.000 CLP</IonChip>
                    </IonRadio>
                  </IonItem>
                  <IonItem>
                    <IonRadio value="120">
                      2 horas
                      <IonChip color="success">$25.000 CLP</IonChip>
                    </IonRadio>
                  </IonItem>
                </IonRadioGroup>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked" color="prussian-blue">
                  Ubicación
                </IonLabel>
                <IonInput
                  required
                  minlength={10}
                  maxlength={100}
                  counter={true}
                  placeholder="Av. Punk Hazard 123, Colina"
                ></IonInput>
              </IonItem>

              <IonItem>
                <IonLabel position="stacked" color="prussian-blue">
                  Método de pago
                </IonLabel>
                <IonSelect required placeholder="Selecciona un método">
                  <IonSelectOption value="efectivo">Efectivo</IonSelectOption>
                  <IonSelectOption value="transferencia">
                    Transferencia
                  </IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>

            <IonButton
              onClick={() => router.push("/tabs/tab1")}
              color="prussian-blue"
              expand="block"
              className="ion-margin-top"
            >
              Publicar paseo
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default NuevoPaseo;
