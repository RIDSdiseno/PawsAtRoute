// src/pages/PanelPaseador.tsx
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonItem,
  IonAlert,
  IonSpinner,
  IonList,
  IonLabel,
} from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Auth } from "../services/auth";
import {
  listMisPaseosComoPaseador,
  listPaseosDisponibles,
  aceptarPaseo,
  startPaseo,
  finishPaseo,
  type PaseoListItem,
  type Paginated,
} from "../services/api";
import { estadoLabel, estadoColor, type Estado } from "../utils/estadoPaseo";

const PanelPaseador: React.FC = () => {
  const router = useIonRouter();

  // Guard: solo PASEADOR
  useEffect(() => {
    const u = Auth.getUser();
    if (!u) return router.push("/login", "root");
    if (u.rol !== "PASEADOR") return router.push("/tabs/tab1", "root");
  }, [router]);

  const user = Auth.getUser();
  const nombrePaseador = useMemo(() => (user?.nombre || "").toString(), [user]);

  const [misPaseos, setMisPaseos] = useState<Paginated<PaseoListItem> | null>(
    null
  );
  const [disponibles, setDisponibles] =
    useState<Paginated<PaseoListItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{
    open: boolean;
    header?: string;
    message?: string;
  }>({ open: false });

  const cargar = async () => {
    setLoading(true);
    try {
      const [a, b] = await Promise.all([
        listMisPaseosComoPaseador({ page: 1, pageSize: 50 }),
        listPaseosDisponibles({ page: 1, pageSize: 50 }),
      ]);

      // 🔹 deja en "mis paseos" solo NO finalizados
      const activos = {
        ...a,
        items: (a.items || []).filter((p) => p.estado !== "FINALIZADO"),
        total: (a.items || []).filter((p) => p.estado !== "FINALIZADO").length,
      };

      setMisPaseos(activos);
      setDisponibles(b);
    } catch (e: any) {
      setAlert({
        open: true,
        header: "Error",
        message:
          e?.response?.data?.error ||
          e?.message ||
          "No se pudieron cargar los paseos",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const tomarPaseo = async (idPaseo: number) => {
    try {
      setWorkingId(idPaseo);
      await aceptarPaseo(idPaseo);
      await cargar();
      setAlert({
        open: true,
        header: "Listo",
        message: "Paseo asignado a ti.",
      });
    } catch (e: any) {
      setAlert({
        open: true,
        header: "Error",
        message:
          e?.response?.data?.error || e?.message || "No se pudo tomar el paseo",
      });
    } finally {
      setWorkingId(null);
    }
  };

  const iniciar = async (idPaseo: number) => {
    try {
      setWorkingId(idPaseo);
      await startPaseo(idPaseo);
      await cargar();
      setAlert({
        open: true,
        header: "En curso",
        message: "Comenzaste el paseo.",
      });
    } catch (e: any) {
      setAlert({
        open: true,
        header: "Error",
        message:
          e?.response?.data?.error ||
          e?.message ||
          "No se pudo iniciar el paseo",
      });
    } finally {
      setWorkingId(null);
    }
  };

  const finalizar = async (idPaseo: number) => {
    try {
      setWorkingId(idPaseo);
      await finishPaseo(idPaseo);
      await cargar();
      setAlert({
        open: true,
        header: "Finalizado",
        message: "Paseo finalizado correctamente.",
      });
    } catch (e: any) {
      setAlert({
        open: true,
        header: "Error",
        message:
          e?.response?.data?.error ||
          e?.message ||
          "No se pudo finalizar el paseo",
      });
    } finally {
      setWorkingId(null);
    }
  };

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

  const renderAccionAsignado = (p: PaseoListItem) => {
    // Botones según estado
    if (p.estado === "PENDIENTE" || p.estado === "ACEPTADO") {
      return (
        <IonButton
          color="success"
          expand="block"
          onClick={() => iniciar(p.idPaseo)}
          disabled={workingId === p.idPaseo}
        >
          {workingId === p.idPaseo ? (
            <IonSpinner name="dots" />
          ) : (
            "Iniciar paseo"
          )}
        </IonButton>
      );
    }
    if (p.estado === "EN_CURSO") {
      return (
        <IonButton
          color="warning"
          expand="block"
          onClick={() => finalizar(p.idPaseo)}
          disabled={workingId === p.idPaseo}
        >
          {workingId === p.idPaseo ? (
            <IonSpinner name="dots" />
          ) : (
            "Finalizar paseo"
          )}
        </IonButton>
      );
    }
    // FINALIZADO / CANCELADO → sin acciones
    return null;
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonTitle color="prussian-blue" className="coffeecake">
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
          color="prussian-blue"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <h1 style={{ fontWeight: "bold", margin: 0 }}>
            ¡Hola, {nombrePaseador || "Paseador"}!
          </h1>
          <IonBadge color="prussian-blue">Paseador</IonBadge>
        </IonText>

        {/* Mis paseos */}
        <IonText color="prussian-blue">
          <h1 style={{ fontWeight: "bold" }}>Mis paseos</h1>
        </IonText>

        {loading ? (
          <div className="ion-text-center ion-margin-vertical">
            <IonSpinner name="dots" />
            <IonText>
              <p>Cargando paseos…</p>
            </IonText>
          </div>
        ) : misPaseos && misPaseos.items.length ? (
          misPaseos.items.map((p) => (
            <IonCard key={p.idPaseo}>
              <IonCardHeader className="ion-text-center">
                <IonCardTitle color="prussian-blue">
                  Mascota: {p.mascota?.nombre ?? "—"}
                </IonCardTitle>
                <IonCardSubtitle>
                  Dueño:{" "}
                  {p.duenio ? `${p.duenio.nombre} ${p.duenio.apellido}` : "—"}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  <IonItem>
                    <IonLabel>
                      <b>Fecha:</b> {fmtFecha(p.fecha)}
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <b>Hora:</b> {fmtHora(p.hora)}
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <b>Duración:</b> {p.duracion} min
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <b>Dirección:</b> {p.lugarEncuentro}
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <b>Estado:</b>{" "}
                      <IonBadge color={estadoColor[p.estado as Estado]}>
                        {estadoLabel[p.estado as Estado]}
                      </IonBadge>
                    </IonLabel>
                  </IonItem>
                </IonList>

                {/* Acciones según estado */}
                <div className="ion-text-center ion-margin-top">
                  {renderAccionAsignado(p)}
                </div>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <IonText>
            <p>No hay paseos asignados</p>
          </IonText>
        )}

        {/* Disponibles */}
        <IonText color="prussian-blue">
          <h1 style={{ fontWeight: "bold" }}>Paseos disponibles</h1>
        </IonText>

        {loading ? null : disponibles && disponibles.items.length ? (
          disponibles.items.map((p) => (
            <IonCard key={`disp-${p.idPaseo}`}>
              <IonCardHeader>
                <IonCardTitle color="prussian-blue">
                  Mascota: {p.mascota?.nombre ?? "—"}
                </IonCardTitle>
                <IonCardSubtitle>
                  Dueño:{" "}
                  {p.duenio ? `${p.duenio.nombre} ${p.duenio.apellido}` : "—"}
                </IonCardSubtitle>
              </IonCardHeader>
              <IonCardContent>
                <IonList lines="none">
                  <IonItem>
                    <IonLabel>
                      <b>Fecha:</b> {fmtFecha(p.fecha)}
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <b>Hora:</b> {fmtHora(p.hora)}
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <b>Duración:</b> {p.duracion} min
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <b>Dirección:</b> {p.lugarEncuentro}
                    </IonLabel>
                  </IonItem>
                </IonList>
                <div className="ion-text-center ion-margin-top">
                  <IonButton
                    color="prussian-blue"
                    onClick={() => tomarPaseo(p.idPaseo)}
                    disabled={workingId === p.idPaseo}
                  >
                    {workingId === p.idPaseo ? (
                      <IonSpinner name="dots" />
                    ) : (
                      "Tomar paseo"
                    )}
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <IonText>
            <p>No hay paseos disponibles por ahora.</p>
          </IonText>
        )}

        <IonAlert
          isOpen={alert.open}
          header={alert.header}
          message={alert.message}
          buttons={["Aceptar"]}
          onDidDismiss={() => setAlert({ open: false })}
        />
      </IonContent>
    </IonPage>
  );
};

export default PanelPaseador;
