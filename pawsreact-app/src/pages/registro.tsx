// src/pages/registro.tsx
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonLabel,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  IonText,
  IonSpinner,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { useState } from "react";
import { register as apiRegister } from "../services/api"; // 👈 usa tu API

const Registro: React.FC = () => {
  const router = useIonRouter();

  // Estados
  const [rol, setRol] = useState<string>("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rut, setRut] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [comuna, setComuna] = useState("");

  // Archivos (solo paseador)
  const [carnetFile, setCarnetFile] = useState<File | null>(null);
  const [antecedentesFile, setAntecedentesFile] = useState<File | null>(null);

  // UI
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (
      !rol || !nombre || !apellido || !telefono || !rut ||
      !correo || !password || !comuna
    ) {
      setErrorMsg("Por favor completa todos los campos requeridos.");
      return;
    }
    if (rol === "paseador" && (!carnetFile || !antecedentesFile)) {
      setErrorMsg("Para rol Paseador debes adjuntar carnet y antecedentes.");
      return;
    }

    setSubmitting(true);
    try {
      // Mapea al valor que espera tu backend: "DUEÑO" | "PASEADOR"
      const rolApi = rol === "paseador" ? "PASEADOR" : "DUEÑO";

      await apiRegister({
        rut,
        nombre,
        apellido,
        telefono,
        correo,
        clave: password,
        comuna,
        rol: rolApi,
        carnet: rolApi === "PASEADOR" ? carnetFile ?? undefined : undefined,
        antecedentes: rolApi === "PASEADOR" ? antecedentesFile ?? undefined : undefined,
      });

      // Éxito → volvemos a /login
      router.push("/login", "root");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo completar el registro.";
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/login" color="prussian-blue" />
          </IonButtons>
          <IonTitle className="coffeecake" color="prussian-blue">
            Paws At Route
          </IonTitle>
        </IonToolbar>
        <div style={{ overflow: "hidden" }}>
          <svg preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg"
               style={{ fill: "var(--ion-color-selective-yellow)", width: "125%", height: 35 }}>
            <path d="M0 0v46.29c47.79 22.2 103.59..." opacity=".25" />
            <path d="M0 0v15.81c13 21.11..." opacity=".5" />
            <path d="M0 0v5.63C149.93 59..." />
          </svg>
        </div>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        <IonCard>
          <IonCardHeader className="ion-text-center">
            <IonCardTitle color="prussian-blue">Registro</IonCardTitle>
            <IonCardSubtitle>¡Bienvenido a Paws At Route!</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <form onSubmit={handleSubmit}>
              {/* Rol */}
              <IonItem>
                <IonSelect
                  label="Rol"
                  placeholder="Selecciona un rol"
                  labelPlacement="stacked"
                  value={rol}
                  onIonChange={(e) => setRol(e.detail.value)}
                  required
                >
                  <IonSelectOption value="dueño">Dueño</IonSelectOption>
                  <IonSelectOption value="paseador">Paseador</IonSelectOption>
                </IonSelect>
              </IonItem>

              {/* Nombre */}
              <IonItem>
                <IonInput
                  label="Nombre"
                  labelPlacement="stacked"
                  placeholder="Ejemplo"
                  value={nombre}
                  onIonInput={(e) => {
                    const input = e.detail.value || "";
                    const soloLetras = input.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                    setNombre(soloLetras);
                  }}
                  required
                  minlength={3}
                  maxlength={15}
                />
              </IonItem>

              {/* Apellido */}
              <IonItem>
                <IonInput
                  label="Apellido"
                  labelPlacement="stacked"
                  placeholder="Ejemplo"
                  value={apellido}
                  onIonInput={(e) => {
                    const input = e.detail.value || "";
                    const soloLetras = input.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
                    setApellido(soloLetras);
                  }}
                  required
                  minlength={3}
                  maxlength={15}
                />
              </IonItem>

              {/* Teléfono */}
              <IonItem>
                <IonInput
                  label="Teléfono"
                  labelPlacement="stacked"
                  placeholder="123456789"
                  type="tel"
                  value={telefono}
                  onIonInput={(e) => {
                    const input = e.detail.value || "";
                    const soloNumeros = input.replace(/\D/g, "").slice(0, 9);
                    setTelefono(soloNumeros);
                  }}
                  required
                  minlength={9}
                  maxlength={9}
                />
              </IonItem>

              {/* RUT */}
              <IonItem>
                <IonInput
                  label="RUT"
                  labelPlacement="stacked"
                  placeholder="12345678-9"
                  value={rut}
                  onIonInput={(e) => {
                    let input = e.detail.value || "";
                    input = input.replace(/[^0-9Kk-]/g, "");
                    input = input.replace(/(?!^)-(?=.*-)/g, "");
                    setRut(input.slice(0, 10));
                  }}
                  required
                />
              </IonItem>

              {/* Correo */}
              <IonItem>
                <IonInput
                  label="Correo"
                  labelPlacement="stacked"
                  placeholder="ejemplo@gmail.com"
                  type="email"
                  value={correo}
                  onIonInput={(e) => setCorreo(e.detail.value || "")}
                  required
                  minlength={15}
                  maxlength={30}
                />
              </IonItem>

              {/* Contraseña */}
              <IonItem>
                <IonInput
                  label="Contraseña"
                  labelPlacement="stacked"
                  placeholder="**********"
                  type="password"
                  value={password}
                  onIonInput={(e) => {
                    const val = e.detail.value || "";
                    setPassword(val.replace(/\s/g, ""));
                  }}
                  required
                  counter
                  minlength={10}
                  maxlength={30}
                >
                  <IonInputPasswordToggle slot="end" color="prussian-blue" />
                </IonInput>
              </IonItem>

              {/* Comuna */}
              <IonItem>
                <IonSelect
                  label="Comuna"
                  placeholder="Selecciona tu comuna de residencia"
                  labelPlacement="stacked"
                  value={comuna}
                  onIonChange={(e) => setComuna(e.detail.value)}
                  required
                >
                  <IonSelectOption value="Alhué">Alhué</IonSelectOption>
                  <IonSelectOption value="Buin">Buin</IonSelectOption>
                  <IonSelectOption value="Calera de Tango">Calera de Tango</IonSelectOption>
                  <IonSelectOption value="Cerrillos">Cerrillos</IonSelectOption>
                  <IonSelectOption value="Cerro Navia">Cerro Navia</IonSelectOption>
                  <IonSelectOption value="Colina">Colina</IonSelectOption>
                  <IonSelectOption value="Conchalí">Conchalí</IonSelectOption>
                  <IonSelectOption value="Curacaví">Curacaví</IonSelectOption>
                  <IonSelectOption value="El Bosque">El Bosque</IonSelectOption>
                  <IonSelectOption value="El Monte">El Monte</IonSelectOption>
                  <IonSelectOption value="Estación Central">Estación Central</IonSelectOption>
                  <IonSelectOption value="Huechuraba">Huechuraba</IonSelectOption>
                  <IonSelectOption value="Independencia">Independencia</IonSelectOption>
                  <IonSelectOption value="Isla de Maipo">Isla de Maipo</IonSelectOption>
                  <IonSelectOption value="La Cisterna">La Cisterna</IonSelectOption>
                  <IonSelectOption value="La Florida">La Florida</IonSelectOption>
                  <IonSelectOption value="La Granja">La Granja</IonSelectOption>
                  <IonSelectOption value="La Pintana">La Pintana</IonSelectOption>
                  <IonSelectOption value="La Reina">La Reina</IonSelectOption>
                  <IonSelectOption value="Lampa">Lampa</IonSelectOption>
                  <IonSelectOption value="Las Condes">Las Condes</IonSelectOption>
                  <IonSelectOption value="Lo Barnechea">Lo Barnechea</IonSelectOption>
                  <IonSelectOption value="Lo Espejo">Lo Espejo</IonSelectOption>
                  <IonSelectOption value="Lo Prado">Lo Prado</IonSelectOption>
                  <IonSelectOption value="Macul">Macul</IonSelectOption>
                  <IonSelectOption value="Maipú">Maipú</IonSelectOption>
                  <IonSelectOption value="María Pinto">María Pinto</IonSelectOption>
                  <IonSelectOption value="Melipilla">Melipilla</IonSelectOption>
                  <IonSelectOption value="Ñuñoa">Ñuñoa</IonSelectOption>
                  <IonSelectOption value="Padre Hurtado">Padre Hurtado</IonSelectOption>
                  <IonSelectOption value="Paine">Paine</IonSelectOption>
                  <IonSelectOption value="Pedro Aguirre Cerda">Pedro Aguirre Cerda</IonSelectOption>
                  <IonSelectOption value="Peñaflor">Peñaflor</IonSelectOption>
                  <IonSelectOption value="Peñalolén">Peñalolén</IonSelectOption>
                  <IonSelectOption value="Pirque">Pirque</IonSelectOption>
                  <IonSelectOption value="Providencia">Providencia</IonSelectOption>
                  <IonSelectOption value="Pudahuel">Pudahuel</IonSelectOption>
                  <IonSelectOption value="Puente Alto">Puente Alto</IonSelectOption>
                  <IonSelectOption value="Quilicura">Quilicura</IonSelectOption>
                  <IonSelectOption value="Quinta Normal">Quinta Normal</IonSelectOption>
                  <IonSelectOption value="Recoleta">Recoleta</IonSelectOption>
                  <IonSelectOption value="Renca">Renca</IonSelectOption>
                  <IonSelectOption value="San Bernardo">San Bernardo</IonSelectOption>
                  <IonSelectOption value="San Joaquín">San Joaquín</IonSelectOption>
                  <IonSelectOption value="San José de Maipo">San José de Maipo</IonSelectOption>
                  <IonSelectOption value="San Miguel">San Miguel</IonSelectOption>
                  <IonSelectOption value="San Pedro">San Pedro</IonSelectOption>
                  <IonSelectOption value="San Ramón">San Ramón</IonSelectOption>
                  <IonSelectOption value="Santiago">Santiago</IonSelectOption>
                  <IonSelectOption value="Talagante">Talagante</IonSelectOption>
                  <IonSelectOption value="Tiltil">Tiltil</IonSelectOption>
                  <IonSelectOption value="Vitacura">Vitacura</IonSelectOption>
                </IonSelect>
              </IonItem>

              {/* Campos solo para paseador */}
              {rol === "paseador" && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">Carnet de identidad (PDF)</IonLabel>
                    <input
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] ?? null;
                        setCarnetFile(file);
                      }}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">Antecedentes penales (PDF)</IonLabel>
                    <input
                      type="file"
                      accept="application/pdf"
                      required
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const file = e.target.files?.[0] ?? null;
                        setAntecedentesFile(file);
                      }}
                    />
                  </IonItem>
                </>
              )}

              {errorMsg && (
                <IonText color="danger">
                  <p className="ion-padding-start ion-margin-top">{errorMsg}</p>
                </IonText>
              )}

              <IonButton
                expand="full"
                className="ion-margin-top"
                color="prussian-blue"
                shape="round"
                type="submit"
                disabled={submitting}
              >
                {submitting ? <IonSpinner name="dots" /> : "Regístrate"}
              </IonButton>
            </form>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Registro;
