import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
} from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Auth } from "../services/auth";
import {
  listMisPaseosComoPaseador,
  type PaseoListItem,
  type Paginated,
} from "../services/api";

const fmtFecha = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString();
  } catch {
    return iso;
  }
};
const fmtHora = (iso: string) => {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
};

// Mapa simple para saldo estimado según duración
const tarifaPorMinuto = (min: number) => {
  switch (min) {
    case 30:
      return 10000;
    case 60:
      return 15000;
    case 90:
      return 20000;
    case 120:
      return 25000;
    default:
      return 0; // si otro valor, ajusta acá
  }
};

const badgeColor: Record<string, string> = {
  PENDIENTE: "warning",
  ACEPTADO: "tertiary",
  EN_CURSO: "medium",
  FINALIZADO: "success",
  CANCELADO: "danger",
};

const EstadisticasPaseador: React.FC = () => {
  const router = useIonRouter();

  const [data, setData] = useState<Paginated<PaseoListItem> | null>(null);
  const [loading, setLoading] = useState(true);

  // Guard + carga finalizados
  useEffect(() => {
    const u = Auth.getUser();
    if (!u) {
      router.push("/login", "root");
      return;
    }
    if (u.rol !== "PASEADOR") {
      router.push("/tabs/tab1", "root");
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const res = await listMisPaseosComoPaseador({
          estado: "FINALIZADO", // 🔹 solo historial
          page: 1,
          pageSize: 100,
        });
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const items = data?.items ?? [];
  const completados = items.length;

  // Suma estimada según duración
  const saldo = useMemo(
    () => items.reduce((acc, p) => acc + tarifaPorMinuto(p.duracion), 0),
    [items]
  );

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
        <IonText
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          color="prussian-blue"
        >
          <h1 style={{ fontWeight: "bold", margin: 0 }}>Mis estadísticas</h1>
          <IonBadge color="prussian-blue">Paseador</IonBadge>
        </IonText>
        <IonText>
          <p>
            Aquí puedes ver tus estadísticas como paseos completados e historial
            de paseos.
          </p>
        </IonText>

        {/* Saldo estimado */}
        <IonCard className="ion-text-center">
          <IonCardHeader>
            <IonCardTitle color="prussian-blue">Saldo (CLP)</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loading ? (
              <IonSpinner name="dots" />
            ) : (
              <IonText>
                <h1>${saldo.toLocaleString("es-CL")}</h1>
              </IonText>
            )}
          </IonCardContent>
        </IonCard>

        {/* Completados */}
        <IonCard className="ion-text-center">
          <IonCardHeader>
            <IonCardTitle color="prussian-blue">
              Paseos completados
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loading ? (
              <IonSpinner name="dots" />
            ) : (
              <IonText>
                <h1>{completados}</h1>
              </IonText>
            )}
          </IonCardContent>
        </IonCard>

        {/* Historial */}
        <IonCard className="ion-text-center">
          <IonCardHeader>
            <IonCardTitle color="prussian-blue">Historial</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            {loading ? (
              <div className="ion-text-center">
                <IonSpinner name="dots" />
              </div>
            ) : completados === 0 ? (
              <IonText>
                <p>No tienes paseos finalizados todavía.</p>
              </IonText>
            ) : (
              <IonAccordionGroup>
                {items.map((p) => (
                  <IonAccordion key={p.idPaseo} value={`p-${p.idPaseo}`}>
                    <IonItem slot="header" color="light">
                      <IonLabel>
                        {fmtFecha(p.fecha)} • {p.mascota?.nombre ?? "Mascota"}
                      </IonLabel>
                      <IonBadge color={badgeColor[p.estado] || "medium"}>
                        {p.estado === "FINALIZADO" ? "Completado" : p.estado}
                      </IonBadge>
                    </IonItem>
                    <div slot="content" className="ion-padding">
                      <IonItem lines="none">
                        <IonLabel>
                          <b>Hora:</b> {fmtHora(p.hora)}
                        </IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonLabel>
                          <b>Duración:</b> {p.duracion} min
                        </IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonLabel>
                          <b>Dirección:</b> {p.lugarEncuentro}
                        </IonLabel>
                      </IonItem>
                      <IonItem lines="none">
                        <IonLabel>
                          <b>Dueño:</b>{" "}
                          {p.duenio
                            ? `${p.duenio.nombre} ${p.duenio.apellido}`
                            : "—"}
                        </IonLabel>
                      </IonItem>
                    </div>
                  </IonAccordion>
                ))}
              </IonAccordionGroup>
            )}
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default EstadisticasPaseador;
