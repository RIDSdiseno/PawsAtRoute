// src/pages/Tab1.tsx
import { useEffect, useMemo, useState } from "react";
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonContent, IonHeader, IonItem, IonPage, IonText, IonTitle, IonToolbar, IonSpinner
} from "@ionic/react";
import "./Tab1.css";
import { useIonRouter } from "@ionic/react";
import { Auth, type Usuario } from "../services/auth";
import { listPaseos, type Paginated, type PaseoListItem } from "../services/api";

const Tab1: React.FC = () => {
  const router = useIonRouter();

  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [data, setData] = useState<Paginated<PaseoListItem> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const isDueno = useMemo(() => user?.rol === "DUEÑO", [user]);

  useEffect(() => {
    const u = Auth.getUser();
    if (!u) { router.push("/login", "root"); return; }
    if (u.rol !== "DUEÑO") { router.push("/panel-paseador/inicio", "root"); return; }
    setUser(u);
  }, [router]);

  const soloNoFinalizados = (items: PaseoListItem[]) =>
    (items || []).filter(p => p.estado !== "FINALIZADO");

  // carga inicial
  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const res = await listPaseos({ mias: true, page: 1, pageSize });
        setData({
          ...res,
          // filtramos para que NO aparezcan finalizados
          items: soloNoFinalizados(res.items),
          // opcional: ajustamos total para la UI de paginación
          total: soloNoFinalizados(res.items).length
        });
        setPage(1);
      } catch (e: any) {
        setErr(e?.response?.data?.error || e?.message || "Error cargando paseos");
      } finally {
        setLoading(false);
      }
    })();
  }, [user, pageSize]);

  const cargarMas = async () => {
    if (!data) return;
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await listPaseos({ mias: true, page: nextPage, pageSize });
      const nuevos = soloNoFinalizados(res.items);
      setData(prev => prev ? ({
        ...res,
        items: [...(prev.items || []), ...nuevos],
        total: (prev.items?.length || 0) + nuevos.length
      }) : res);
      setPage(nextPage);
    } catch (e: any) {
      setErr(e?.response?.data?.error || e?.message || "Error cargando más paseos");
    } finally {
      setLoadingMore(false);
    }
  };

  const formatFecha = (iso?: string) => {
    if (!iso) return "-";
    try {
      const d = new Date(iso);
      return d.toLocaleDateString() + " " + d.toLocaleTimeString();
    } catch { return iso; }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonTitle className="coffeecake" color="prussian-blue">Paws At Route</IonTitle>
        </IonToolbar>
        <div style={{ overflow: "hidden" }}>
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg"
               style={{ fill: "var(--ion-color-selective-yellow)", width: "125%", height: 35 }}>
            <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25"/>
            <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z" opacity=".5"/>
            <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z"/>
          </svg>
        </div>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        <IonText color="prussian-blue">
          <h1 style={{ fontWeight: "bold" }}>Mi panel</h1>
        </IonText>
        <IonText><p>Bienvenid@. Aquí puedes ver y gestionar tus paseos.</p></IonText>

        {loading && (
          <div className="ion-text-center ion-margin-vertical">
            <IonSpinner name="dots" />
          </div>
        )}

        {err && (
          <IonText color="danger">
            <p className="ion-text-center">{err}</p>
          </IonText>
        )}

        {( !loading && data?.items?.length ) ? (
          <>
            <IonText color="prussian-blue">
              <h2 style={{ fontWeight: "bold" }}>Mis paseos</h2>
            </IonText>

            {data.items.map((p) => (
              <IonCard key={p.idPaseo}>
                <IonCardHeader>
                  <IonCardTitle color="prussian-blue">
                    {p.mascota?.nombre ?? "Mascota"} • {p.estado}
                  </IonCardTitle>
                  <IonCardSubtitle>
                    {p.mascota?.especie ?? "-"} {p.mascota?.raza ? `· ${p.mascota.raza}` : ""}
                  </IonCardSubtitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem>
                    <IonText color="prussian-blue" className="ion-margin-end">
                      <h2 style={{ fontWeight: "bold" }}>Fecha</h2>
                    </IonText>
                    <IonText>{formatFecha(p.fecha)}</IonText>
                  </IonItem>
                  <IonItem>
                    <IonText color="prussian-blue" className="ion-margin-end">
                      <h2 style={{ fontWeight: "bold" }}>Hora</h2>
                    </IonText>
                    <IonText>{p.hora ?? "-"}</IonText>
                  </IonItem>
                  <IonItem>
                    <IonText color="prussian-blue" className="ion-margin-end">
                      <h2 style={{ fontWeight: "bold" }}>Duración</h2>
                    </IonText>
                    <IonText>{p.duracion} min</IonText>
                  </IonItem>
                  <IonItem>
                    <IonText color="prussian-blue" className="ion-margin-end">
                      <h2 style={{ fontWeight: "bold" }}>Lugar de encuentro</h2>
                    </IonText>
                    <IonText>{p.lugarEncuentro}</IonText>
                  </IonItem>
                  <IonItem>
                    <IonText color="prussian-blue" className="ion-margin-end">
                      <h2 style={{ fontWeight: "bold" }}>Paseador</h2>
                    </IonText>
                    <IonText>
                      {p.paseadorNombre ??
                        (p.paseador
                          ? `${p.paseador.nombre} ${p.paseador.apellido}`.trim()
                          : "No asignado")}
                    </IonText>
                  </IonItem>
                </IonCardContent>
              </IonCard>
            ))}

            {data && loadingMore && (
              <div className="ion-text-center ion-margin-vertical">
                <IonSpinner name="dots" />
              </div>
            )}
            {data && data.items.length >= 1 && (
              <div className="ion-text-center ion-margin-vertical">
                <IonButton onClick={cargarMas} disabled={loadingMore}>
                  {loadingMore ? "Cargando…" : "Cargar más"}
                </IonButton>
              </div>
            )}
          </>
        ) : (
          !loading && <IonText><p>No tienes paseos pendientes o en curso.</p></IonText>
        )}

        <div className="ion-text-center">
          <IonButton onClick={() => router.push("/nuevo-paseo")} color="prussian-blue">
            Nuevo paseo
          </IonButton>
          <IonButton onClick={() => router.push("/registro-mascota")} color="prussian-blue" fill="outline">
            Registrar mascota
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
