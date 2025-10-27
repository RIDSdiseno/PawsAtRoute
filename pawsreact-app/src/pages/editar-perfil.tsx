import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardContent,
  IonItem,
  IonAvatar,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonInput,
  IonButton,
  IonAlert,
  IonBackButton,
  IonButtons,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";

const EditarPerfil: React.FC = () => {
  const router = useIonRouter();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/tabs/tab3"
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
            <IonCardTitle color="prussian-blue">Editar perfil</IonCardTitle>
            <IonCardSubtitle>Puedes modificar tu información</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonAvatar slot="start">
                <img
                  style={{ border: "2px solid var(--ion-color-ut-orange)" }}
                  alt="Avatar"
                  src="https://ionicframework.com/docs/img/demos/avatar.svg"
                />
              </IonAvatar>
              <input type="file" accept="image/*" name="avatar" id="avatar" />
            </IonItem>
            <IonItem>
              <IonInput
                label="Nombre"
                labelPlacement="stacked"
                placeholder="Ej. Benjamín"
                minlength={2}
                maxlength={20}
                type="text"
                id="nombre"
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                label="Apellido"
                labelPlacement="stacked"
                placeholder="Ej. Pérez"
                minlength={2}
                maxlength={20}
                type="text"
                id="apellido"
              ></IonInput>
            </IonItem>
            <IonItem>
              <IonInput
                label="Teléfono"
                labelPlacement="stacked"
                placeholder="Ej. 987654321"
                type="tel"
                minlength={9}
                maxlength={9}
                id="telefono"
              ></IonInput>
            </IonItem>
            {/* Comuna */}
            <IonItem>
              <IonSelect
                label="Comuna"
                placeholder="Selecciona tu comuna de residencia"
                labelPlacement="stacked"
                required
              >
                <IonSelectOption value="Alhué">Alhué</IonSelectOption>
                <IonSelectOption value="Buin">Buin</IonSelectOption>
                <IonSelectOption value="Calera de Tango">
                  Calera de Tango
                </IonSelectOption>
                <IonSelectOption value="Cerrillos">Cerrillos</IonSelectOption>
                <IonSelectOption value="Cerro Navia">
                  Cerro Navia
                </IonSelectOption>
                <IonSelectOption value="Colina">Colina</IonSelectOption>
                <IonSelectOption value="Conchalí">Conchalí</IonSelectOption>
                <IonSelectOption value="Curacaví">Curacaví</IonSelectOption>
                <IonSelectOption value="El Bosque">El Bosque</IonSelectOption>
                <IonSelectOption value="El Monte">El Monte</IonSelectOption>
                <IonSelectOption value="Estación Central">
                  Estación Central
                </IonSelectOption>
                <IonSelectOption value="Huechuraba">Huechuraba</IonSelectOption>
                <IonSelectOption value="Independencia">
                  Independencia
                </IonSelectOption>
                <IonSelectOption value="Isla de Maipo">
                  Isla de Maipo
                </IonSelectOption>
                <IonSelectOption value="La Cisterna">
                  La Cisterna
                </IonSelectOption>
                <IonSelectOption value="La Florida">La Florida</IonSelectOption>
                <IonSelectOption value="La Granja">La Granja</IonSelectOption>
                <IonSelectOption value="La Pintana">La Pintana</IonSelectOption>
                <IonSelectOption value="La Reina">La Reina</IonSelectOption>
                <IonSelectOption value="Lampa">Lampa</IonSelectOption>
                <IonSelectOption value="Las Condes">Las Condes</IonSelectOption>
                <IonSelectOption value="Lo Barnechea">
                  Lo Barnechea
                </IonSelectOption>
                <IonSelectOption value="Lo Espejo">Lo Espejo</IonSelectOption>
                <IonSelectOption value="Lo Prado">Lo Prado</IonSelectOption>
                <IonSelectOption value="Macul">Macul</IonSelectOption>
                <IonSelectOption value="Maipú">Maipú</IonSelectOption>
                <IonSelectOption value="María Pinto">
                  María Pinto
                </IonSelectOption>
                <IonSelectOption value="Melipilla">Melipilla</IonSelectOption>
                <IonSelectOption value="Ñuñoa">Ñuñoa</IonSelectOption>
                <IonSelectOption value="Padre Hurtado">
                  Padre Hurtado
                </IonSelectOption>
                <IonSelectOption value="Paine">Paine</IonSelectOption>
                <IonSelectOption value="Pedro Aguirre Cerda">
                  Pedro Aguirre Cerda
                </IonSelectOption>
                <IonSelectOption value="Peñaflor">Peñaflor</IonSelectOption>
                <IonSelectOption value="Peñalolén">Peñalolén</IonSelectOption>
                <IonSelectOption value="Pirque">Pirque</IonSelectOption>
                <IonSelectOption value="Providencia">
                  Providencia
                </IonSelectOption>
                <IonSelectOption value="Pudahuel">Pudahuel</IonSelectOption>
                <IonSelectOption value="Puente Alto">
                  Puente Alto
                </IonSelectOption>
                <IonSelectOption value="Quilicura">Quilicura</IonSelectOption>
                <IonSelectOption value="Quinta Normal">
                  Quinta Normal
                </IonSelectOption>
                <IonSelectOption value="Recoleta">Recoleta</IonSelectOption>
                <IonSelectOption value="Renca">Renca</IonSelectOption>
                <IonSelectOption value="San Bernardo">
                  San Bernardo
                </IonSelectOption>
                <IonSelectOption value="San Joaquín">
                  San Joaquín
                </IonSelectOption>
                <IonSelectOption value="San José de Maipo">
                  San José de Maipo
                </IonSelectOption>
                <IonSelectOption value="San Miguel">San Miguel</IonSelectOption>
                <IonSelectOption value="San Pedro">San Pedro</IonSelectOption>
                <IonSelectOption value="San Ramón">San Ramón</IonSelectOption>
                <IonSelectOption value="Santiago">Santiago</IonSelectOption>
                <IonSelectOption value="Talagante">Talagante</IonSelectOption>
                <IonSelectOption value="Tiltil">Tiltil</IonSelectOption>
                <IonSelectOption value="Vitacura">Vitacura</IonSelectOption>
              </IonSelect>
            </IonItem>

            <IonButton
              className="ion-margin-top"
              expand="block"
              fill="solid"
              color="prussian-blue"
              type="submit"
              id="confirmar-alert"
            >
              Guardar cambios
            </IonButton>
            <IonAlert
              trigger="confirmar-alert"
              header="Perfil actualizado"
              subHeader="Se actualizó el perfil exitósamente."
              buttons={["Aceptar"]}
              onClick={() => router.push("/tabs/tab3")}
            ></IonAlert>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default EditarPerfil;
