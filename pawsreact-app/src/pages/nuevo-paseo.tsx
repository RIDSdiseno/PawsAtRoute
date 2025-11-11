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
  IonText,
  IonSpinner,
  IonAlert,
  IonListHeader,
} from "@ionic/react";
import { useEffect, useMemo, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { Auth } from "../services/auth";
import { listMisMascotas, crearPaseo, type Mascota } from "../services/api";

const MAX_MASCOTAS = 3;

const NuevoPaseo: React.FC = () => {
  const router = useIonRouter();

  // Guard: solo DUEÑO logueado
  useEffect(() => {
    const u = Auth.getUser();
    if (!u) {
      router.push("/login", "root");
      return;
    }
    if (u.rol !== "DUEÑO") {
      router.push("/panel-paseador/inicio", "root");
      return;
    }
  }, [router]);

  // Estado
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [selMascotas, setSelMascotas] = useState<number[]>([]);
  const [fechaISO, setFechaISO] = useState<string>(""); // ISO completo
  const [duracionMin, setDuracionMin] = useState<string>("60"); // "30" | "60" | ...
  const [lugar, setLugar] = useState<string>("");
  const [metodoPago, setMetodoPago] = useState<string>(""); // opcional, lo incluimos en notas
  const [notas, setNotas] = useState<string>("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    open: boolean;
    header?: string;
    message?: string;
  }>({ open: false });

  // Cargar mascotas del dueño
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await listMisMascotas({ page: 1, pageSize: 50 });
        setMascotas(res.items || []);
      } catch (e: any) {
        setErr(
          e?.response?.data?.error ||
            e?.message ||
            "No se pudieron cargar tus mascotas"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Utilidad: limitar selección a 3
  const toggleMascota = (id: number, checked: boolean) => {
    setSelMascotas((prev) => {
      if (checked) {
        if (prev.includes(id)) return prev;
        if (prev.length >= MAX_MASCOTAS) return prev; // no agregar más de 3
        return [...prev, id];
      } else {
        return prev.filter((x) => x !== id);
      }
    });
  };

  // Formateos para backend
  const fechaStr = useMemo(() => {
    if (!fechaISO) return "";
    try {
      const d = new Date(fechaISO);
      // "YYYY-MM-DD"
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    } catch {
      return "";
    }
  }, [fechaISO]);

  const horaStr = useMemo(() => {
    if (!fechaISO) return "";
    try {
      const d = new Date(fechaISO);
      // "HH:mm" en hora local
      const hh = String(d.getHours()).padStart(2, "0");
      const mi = String(d.getMinutes()).padStart(2, "0");
      return `${hh}:${mi}`;
    } catch {
      return "";
    }
  }, [fechaISO]);

  const validar = (): string | null => {
    if (!selMascotas.length) return "Debes seleccionar al menos una mascota.";
    if (selMascotas.length > MAX_MASCOTAS)
      return `Solo puedes seleccionar hasta ${MAX_MASCOTAS}.`;
    if (!fechaStr || !horaStr) return "Debes elegir fecha y hora.";
    if (!duracionMin) return "Debes elegir la duración.";
    if (!lugar || lugar.trim().length < 10)
      return "Ingresa una ubicación válida (mín. 10 caracteres).";
    return null;
  };

  const publicar = async () => {
    const v = validar();
    if (v) {
      setAlert({ open: true, header: "Campos inválidos", message: v });
      return;
    }

    // ⬇️ Tomamos el dueño desde la sesión guardada
    const u = Auth.getUser();
    if (!u?.idUsuario) {
      setAlert({
        open: true,
        header: "Sesión",
        message: "Debes iniciar sesión nuevamente.",
      });
      router.push("/login", "root");
      return;
    }

    setSubmitting(true);
    setErr(null);

    try {
      // Base del payload + duenioId desde el usuario logueado
      const payloadBase = {
        fecha: fechaStr,
        hora: horaStr,
        duracion: Number(duracionMin),
        lugarEncuentro: lugar.trim(),
        notas: [notas, metodoPago ? `Método de pago: ${metodoPago}` : ""]
          .filter(Boolean)
          .join(" | "),
        duenioId: Number(u.idUsuario), // 👈 CLAVE
      };

      // Un paseo por cada mascota seleccionada
      await Promise.all(
        selMascotas.map((mascotaId) =>
          crearPaseo({ ...payloadBase, mascotaId })
        )
      );

      setAlert({
        open: true,
        header: "Paseo publicado",
        message: "Se publicaron tus paseos correctamente.",
      });
      setTimeout(() => router.push("/tabs/tab1", "root"), 600);
    } catch (e: any) {
      const msg =
        e?.response?.data?.error ||
        e?.message ||
        "No se pudo publicar el paseo";
      setErr(msg);
      setAlert({ open: true, header: "Error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/tab1" color="prussian-blue" />
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
            {loading ? (
              <div className="ion-text-center ion-margin-vertical">
                <IonSpinner name="dots" />
                <IonText>
                  <p>Cargando tus mascotas…</p>
                </IonText>
              </div>
            ) : (
              <>
                <form onSubmit={publicar}>
                  <IonList lines="inset">
                    <IonListHeader>
                      <IonLabel color="prussian-blue">
                        ¿Qué mascota irá de paseo?
                      </IonLabel>
                    </IonListHeader>

                    {mascotas.length ? (
                      mascotas.map((m) => {
                        const checked = selMascotas.includes(m.idMascota);
                        const disabled =
                          !checked && selMascotas.length >= MAX_MASCOTAS;
                        return (
                          <IonItem key={m.idMascota}>
                            <IonCheckbox
                              slot="start"
                              checked={checked}
                              disabled={disabled}
                              onIonChange={(e) =>
                                toggleMascota(m.idMascota, !!e.detail.checked)
                              }
                            />
                            <IonLabel>
                              {m.nombre} — {m.raza ? ` ${m.raza}` : ""}
                            </IonLabel>
                          </IonItem>
                        );
                      })
                    ) : (
                      <IonItem>
                        <IonNote color="medium">
                          No tienes mascotas registradas. Registra una antes de
                          publicar un paseo.
                        </IonNote>
                      </IonItem>
                    )}

                    <IonItem lines="none">
                      <IonNote
                        slot="end"
                        style={{ width: "100%", textAlign: "right" }}
                      >
                        Puedes seleccionar hasta {MAX_MASCOTAS} por paseo. (
                        {selMascotas.length}/{MAX_MASCOTAS})
                      </IonNote>
                    </IonItem>

                    <IonItem>
                      <IonLabel position="stacked" color="prussian-blue">
                        Fecha y hora
                      </IonLabel>
                      <IonDatetimeButton datetime="datetime-nuevo" />
                      <IonModal keepContentsMounted>
                        <IonDatetime
                          id="datetime-nuevo"
                          presentation="date-time"
                          minuteValues="0,5,10,15,20,25,30,35,40,45,50,55"
                          onIonChange={(e) =>
                            setFechaISO(String(e.detail.value || ""))
                          }
                        />
                      </IonModal>
                    </IonItem>

                    <IonRadioGroup
                      value={duracionMin}
                      onIonChange={(e) =>
                        setDuracionMin(String(e.detail.value))
                      }
                    >
                      <IonListHeader>
                        <IonLabel color="prussian-blue">Duración</IonLabel>
                      </IonListHeader>

                      <IonItem>
                        <IonRadio slot="start" value="30" />
                        <IonLabel>30 minutos</IonLabel>
                        <IonChip slot="end" color="success">
                          $10.000 CLP
                        </IonChip>
                      </IonItem>
                      <IonItem>
                        <IonRadio slot="start" value="60" />
                        <IonLabel>1 hora</IonLabel>
                        <IonChip slot="end" color="success">
                          $15.000 CLP
                        </IonChip>
                      </IonItem>
                      <IonItem>
                        <IonRadio slot="start" value="90" />
                        <IonLabel>1 hora y 30 minutos</IonLabel>
                        <IonChip slot="end" color="success">
                          $20.000 CLP
                        </IonChip>
                      </IonItem>
                      <IonItem>
                        <IonRadio slot="start" value="120" />
                        <IonLabel>2 horas</IonLabel>
                        <IonChip slot="end" color="success">
                          $25.000 CLP
                        </IonChip>
                      </IonItem>
                    </IonRadioGroup>

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
                        value={lugar}
                        onIonChange={(e) => setLugar(e.detail.value || "")}
                      />
                    </IonItem>

                    <IonItem>
                      <IonLabel position="stacked" color="prussian-blue">
                        Método de pago
                      </IonLabel>
                      <IonSelect
                        placeholder="Selecciona un método"
                        value={metodoPago}
                        onIonChange={(e) =>
                          setMetodoPago(String(e.detail.value || ""))
                        }
                      >
                        <IonSelectOption value="efectivo">
                          Efectivo
                        </IonSelectOption>
                        <IonSelectOption value="transferencia">
                          Transferencia
                        </IonSelectOption>
                      </IonSelect>
                    </IonItem>

                    <IonItem>
                      <IonLabel position="stacked" color="prussian-blue">
                        Notas (opcional)
                      </IonLabel>
                      <IonInput
                        placeholder="Ej: Tocar timbre 2 veces."
                        value={notas}
                        onIonChange={(e) => setNotas(e.detail.value || "")}
                        maxlength={120}
                        counter={true}
                      />
                    </IonItem>
                  </IonList>

                  <IonButton
                    type="submit"
                    color="prussian-blue"
                    expand="block"
                    className="ion-margin-top"
                    disabled={submitting || !mascotas.length}
                  >
                    {submitting ? <IonSpinner name="dots" /> : "Publicar paseo"}
                  </IonButton>
                </form>

                {err && (
                  <IonText color="danger">
                    <p className="ion-text-center ion-margin-top">{err}</p>
                  </IonText>
                )}
              </>
            )}
          </IonCardContent>
        </IonCard>

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

export default NuevoPaseo;
