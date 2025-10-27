import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonCardSubtitle,
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import { useState } from "react";

const paseador = {
  nombre: "Carlos",
  apellido: "Gómez",
  correo: "carlos.gomez@example.com",
  telefono: "+56 9 1234 5678",
  comuna: "Providencia",
  calificacion: 4,
  reseñas: [
    {
      id: 1,
      autor: "María López",
      aptitudes: {
        "Estado anímico": 5,
        Puntualidad: 4,
        Responsabilidad: 5,
      },
    },
    {
      id: 2,
      autor: "José Martínez",
      aptitudes: {
        "Estado anímico": 4,
        Puntualidad: 5,
        Responsabilidad: 4,
      },
    },
  ],
  foto: "https://ionicframework.com/docs/img/demos/avatar.svg",
};

interface RatingStarsProps {
  value: number;
  onStarClick?: (rating: number) => void;
  color?: string;
}

const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onStarClick,
  color = "warning",
}) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
      {stars.map((starValue) => (
        <IonIcon
          key={starValue}
          icon={starValue <= Math.floor(value) ? star : starOutline}
          color={color}
          style={{
            fontSize: "22px",
            cursor: onStarClick ? "pointer" : "default",
          }}
          onClick={() => onStarClick?.(starValue)}
        />
      ))}
    </div>
  );
};

const PerfilPaseador: React.FC = () => {
  const [reseñas, setReseñas] = useState(paseador.reseñas);
  const [nuevaReseña, setNuevaReseña] = useState({
    "Estado anímico": 0,
    Puntualidad: 0,
    Responsabilidad: 0,
  });

  const calificar = (criterio: string, valor: number) => {
    setNuevaReseña({ ...nuevaReseña, [criterio]: valor });
  };

  const publicarReseña = () => {
    const completa = Object.values(nuevaReseña).every((v) => v > 0);
    if (completa) {
      const nueva = {
        id: reseñas.length + 1,
        autor: "Tú",
        aptitudes: { ...nuevaReseña },
      };
      setReseñas([nueva, ...reseñas]);
      setNuevaReseña({
        "Estado anímico": 0,
        Puntualidad: 0,
        Responsabilidad: 0,
      });
    } else {
      console.log("Por favor, califica todos los criterios.");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonButtons slot="start">
            <IonBackButton color="prussian-blue" defaultHref="/tabs/tab1" />
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

      <IonContent fullscreen className="ion-padding">
        <IonText color="prussian-blue">
          <h1 style={{ fontWeight: "bold" }}>Perfil paseador</h1>
        </IonText>
        <IonText>
          <p>Aquí puedes ver y calificar tu experiencia con el paseador.</p>
        </IonText>
        <IonCard>
          <IonCardContent className="ion-text-center">
            <IonAvatar
              style={{
                width: "90px",
                height: "90px",
                margin: "0 auto 16px",
                border: "3px solid var(--ion-color-warning)",
              }}
            >
              <img src={paseador.foto} alt="foto-perfil" />
            </IonAvatar>
            <IonCardTitle>
              {paseador.nombre} {paseador.apellido}
            </IonCardTitle>
            <IonItem>
              <IonText className="ion-margin-end">
                <h2 style={{ fontWeight: "bold" }}>Comuna:</h2>
              </IonText>
              <IonText color="medium">
                <p>{paseador.comuna}</p>
              </IonText>
            </IonItem>
            <IonItem>
              <IonText className="ion-margin-end">
                <h2 style={{ fontWeight: "bold" }}>Correo:</h2>
              </IonText>
              <IonText color="medium">
                <p>{paseador.correo}</p>
              </IonText>
            </IonItem>
            <IonItem>
              <IonText className="ion-margin-end">
                <h2 style={{ fontWeight: "bold" }}>Teléfono:</h2>
              </IonText>
              <IonText color="medium">
                <p>{paseador.telefono}</p>
              </IonText>
            </IonItem>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: "8px",
                marginTop: "10px",
              }}
            >
              <IonLabel>Calificación:</IonLabel>
              <RatingStars value={paseador.calificacion} />
            </div>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader className="ion-text-center">
            <IonCardTitle color="prussian-blue">Calificaciones</IonCardTitle>
            <IonCardSubtitle>Calificaciones de otros dueños</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList inset={true} lines="none">
              {reseñas.map((reseña) => (
                <IonItem key={reseña.id}>
                  <IonLabel>
                    <h3 style={{ fontWeight: "bold" }}>{reseña.autor}</h3>
                    {Object.entries(reseña.aptitudes).map(
                      ([criterio, valor]) => (
                        <div
                          key={criterio}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: "5px",
                          }}
                        >
                          <p>{criterio}:</p>
                          <RatingStars value={valor} />
                        </div>
                      )
                    )}
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader className="ion-text-center">
            <IonCardTitle color="prussian-blue">
              Califica al paseador
            </IonCardTitle>
            <IonCardSubtitle>
              Evalúa tu experiencia con este paseador
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList inset={true}>
              {Object.keys(nuevaReseña).map((criterio) => (
                <IonItem key={criterio}>
                  <IonLabel>{criterio}</IonLabel>
                  <div slot="end">
                    <RatingStars
                      value={nuevaReseña[criterio as keyof typeof nuevaReseña]}
                      onStarClick={(rating) => calificar(criterio, rating)}
                    />
                  </div>
                </IonItem>
              ))}
            </IonList>
            <IonButton
              expand="block"
              onClick={publicarReseña}
              className="ion-margin-top"
              color="prussian-blue"
            >
              Publicar calificación
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PerfilPaseador;
