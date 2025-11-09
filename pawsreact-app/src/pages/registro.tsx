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
import { useState, useCallback } from "react";
import { register as apiRegister } from "../services/api";

const validateRol = (rol: string) => {
  if (!rol) {
    return "Debes seleccionar un rol.";
  }
  return undefined;
};

const validateNombre = (nombre: string) => {
  const errores = [];
  if (!nombre) {
    return "El nombre es obligatorio.";
  }
  if (nombre.length < 3 || nombre.length > 15) {
    errores.push("Debe tener entre 3 y 15 caracteres.");
  }
  if (/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g.test(nombre)) {
    errores.push("Solo debe contener letras y espacios.");
  }
  return errores.length > 0 ? errores.join(" ") : undefined;
};

const validateApellido = (apellido: string) => {
  const errores = [];
  if (!apellido) {
    return "El apellido es obligatorio.";
  }
  if (apellido.length < 3 || apellido.length > 15) {
    errores.push("Debe tener entre 3 y 15 caracteres.");
  }
  if (/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g.test(apellido)) {
    errores.push("Solo debe contener letras y espacios.");
  }
  return errores.length > 0 ? errores.join(" ") : undefined;
};

const validateTelefono = (telefono: string) => {
  if (!telefono) {
    return "El teléfono es obligatorio.";
  }
  if (telefono.length !== 9) {
    return "Debe tener 9 dígitos.";
  }
  return undefined;
};

const validateRut = (rut: string) => {
  if (!rut) {
    return "El RUT es obligatorio.";
  }
  if (!/^\d{7,8}-[\dkK]$/.test(rut)) {
    return "Formato inválido. Debe ser 12345678-9 (sin puntos).";
  }
  return undefined;
};

const validateEmail = (correo: string) => {
  const erroresCorreo = [];
  if (!correo) {
    return "El correo es obligatorio.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    erroresCorreo.push("Por favor, ingresa un correo válido.");
  } else {
    const atIndex = correo.indexOf("@");
    const localPart = correo.substring(0, atIndex);
    const domainPart = correo.substring(atIndex + 1);

    if (localPart.length > 64) {
      erroresCorreo.push(
        "La parte local (antes del @) no debe exceder los 64 caracteres."
      );
    }
    if (domainPart.length > 255) {
      erroresCorreo.push(
        "El dominio (después del @) no debe exceder los 255 caracteres."
      );
    }
  }
  return erroresCorreo.length > 0 ? erroresCorreo.join(" ") : undefined;
};

const validatePassword = (password: string) => {
  const erroresPassword = [];
  if (!password) {
    return "La contraseña es obligatoria.";
  }

  if (password.length < 8 || password.length > 20) {
    erroresPassword.push("Debe tener entre 8 y 20 caracteres.");
  }
  if (!/[a-z]/.test(password)) {
    erroresPassword.push("Debe incluir al menos una minúscula.");
  }
  if (!/[A-Z]/.test(password)) {
    erroresPassword.push("Debe incluir al menos una mayúscula.");
  }
  if (!/\d/.test(password)) {
    erroresPassword.push("Debe incluir al menos un número.");
  }
  if (!/[@$!%*?&._-]/.test(password)) {
    erroresPassword.push("Debe incluir un carácter especial (@$!%*?&._-).");
  }
  if (/[^A-Za-z\d@$!%*?&._-]/.test(password)) {
    erroresPassword.push("No debe contener caracteres inválidos o espacios.");
  }

  return erroresPassword.length > 0 ? erroresPassword.join(" ") : undefined;
};

const validateComuna = (comuna: string) => {
  if (!comuna) {
    return "Debes seleccionar una comuna.";
  }
  return undefined;
};

const validateFiles = (
  rol: string,
  carnet: File | null,
  antecedentes: File | null
) => {
  if (rol === "paseador" && (!carnet || !antecedentes)) {
    return "Debes adjuntar carnet y antecedentes para el rol Paseador.";
  }
  return undefined;
};

const HeaderWave: React.FC = () => (
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
);

type FormErrors = {
  rol?: string;
  nombre?: string;
  apellido?: string;
  telefono?: string;
  rut?: string;
  correo?: string;
  password?: string;
  comuna?: string;
  files?: string;
};

const Registro: React.FC = () => {
  const router = useIonRouter();

  const [rol, setRol] = useState<string>("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rut, setRut] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [comuna, setComuna] = useState("");

  const [carnetFile, setCarnetFile] = useState<File | null>(null);
  const [antecedentesFile, setAntecedentesFile] = useState<File | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiErrorMsg, setApiErrorMsg] = useState<string | null>(null);

  const handleRolChange = useCallback((e: any) => setRol(e.detail.value), []);
  const handleNombreInput = useCallback((e: any) => {
    const input = e.detail.value || "";
    const soloLetras = input.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    setNombre(soloLetras);
  }, []);
  const handleApellidoInput = useCallback((e: any) => {
    const input = e.detail.value || "";
    const soloLetras = input.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
    setApellido(soloLetras);
  }, []);
  const handleTelefonoInput = useCallback((e: any) => {
    const input = e.detail.value || "";
    const soloNumeros = input.replace(/\D/g, "").slice(0, 9);
    setTelefono(soloNumeros);
  }, []);
  const handleRutInput = useCallback((e: any) => {
    let input = e.detail.value || "";
    input = input.replace(/[^0-9Kk-]/g, "");
    input = input.replace(/(?!^)-(?=.*-)/g, "");
    setRut(input.slice(0, 10));
  }, []);
  const handleCorreoChange = useCallback(
    (e: any) => setCorreo(e.detail.value ?? ""),
    []
  );
  const handlePasswordChange = useCallback(
    (e: any) => setPassword(e.detail.value ?? ""),
    []
  );
  const handleComunaChange = useCallback(
    (e: any) => setComuna(e.detail.value),
    []
  );
  const handleCarnetChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setCarnetFile(file);
    },
    []
  );
  const handleAntecedentesChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null;
      setAntecedentesFile(file);
    },
    []
  );

  const validarFormulario = useCallback(() => {
    const nuevosErrores: FormErrors = {};

    nuevosErrores.rol = validateRol(rol);
    nuevosErrores.nombre = validateNombre(nombre);
    nuevosErrores.apellido = validateApellido(apellido);
    nuevosErrores.telefono = validateTelefono(telefono);
    nuevosErrores.rut = validateRut(rut);
    nuevosErrores.correo = validateEmail(correo);
    nuevosErrores.password = validatePassword(password);
    nuevosErrores.comuna = validateComuna(comuna);
    nuevosErrores.files = validateFiles(rol, carnetFile, antecedentesFile);

    const activeErrors = Object.fromEntries(
      Object.entries(nuevosErrores).filter(([_, v]) => v !== undefined)
    );
    setErrors(activeErrors);
    return Object.keys(activeErrors).length === 0;
  }, [
    rol,
    nombre,
    apellido,
    telefono,
    rut,
    correo,
    password,
    comuna,
    carnetFile,
    antecedentesFile,
  ]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiErrorMsg(null);

    if (!validarFormulario()) {
      return;
    }

    setSubmitting(true);
    try {
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
        antecedentes:
          rolApi === "PASEADOR" ? antecedentesFile ?? undefined : undefined,
      });

      router.push("/login", "root");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo completar el registro.";
      setApiErrorMsg(msg);
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
        <HeaderWave />
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        <IonCard color="success">
          <IonCardHeader>
            <IonCardTitle>Como dueño</IonCardTitle>
            <IonCardSubtitle>Si te registras</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>Tu cuenta estará activa de inmediato.</IonCardContent>
        </IonCard>
        <IonCard color="warning">
          <IonCardHeader>
            <IonCardTitle>Como paseador</IonCardTitle>
            <IonCardSubtitle>Si te registras</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            Tu cuenta estará activa una vez que el administrador lo apruebe.
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader className="ion-text-center">
            <IonCardTitle color="prussian-blue">Registro</IonCardTitle>
            <IonCardSubtitle>¡Bienvenido a Paws At Route!</IonCardSubtitle>
          </IonCardHeader>

          <IonCardContent>
            <form onSubmit={handleSubmit} noValidate>
              <IonItem>
                <IonSelect
                  label="Rol"
                  placeholder="Selecciona un rol"
                  labelPlacement="stacked"
                  value={rol}
                  onIonChange={handleRolChange}
                >
                  <IonSelectOption value="dueño">Dueño</IonSelectOption>
                  <IonSelectOption value="paseador">Paseador</IonSelectOption>
                </IonSelect>
              </IonItem>
              {errors.rol && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.rol}</p>
                </IonText>
              )}

              <IonItem>
                <IonInput
                  label="Nombre"
                  labelPlacement="stacked"
                  placeholder="Ejemplo"
                  value={nombre}
                  onIonInput={handleNombreInput}
                  minlength={3}
                  maxlength={15}
                />
              </IonItem>
              {errors.nombre && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.nombre}</p>
                </IonText>
              )}

              <IonItem>
                <IonInput
                  label="Apellido"
                  labelPlacement="stacked"
                  placeholder="Ejemplo"
                  value={apellido}
                  onIonInput={handleApellidoInput}
                  minlength={3}
                  maxlength={15}
                />
              </IonItem>
              {errors.apellido && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.apellido}</p>
                </IonText>
              )}

              <IonItem>
                <IonLabel slot="start" style={{ margin: 0 }}>
                  🇨🇱 +569
                </IonLabel>
                <IonInput
                  label="Teléfono"
                  labelPlacement="stacked"
                  placeholder="123456789"
                  type="tel"
                  value={telefono}
                  onIonInput={handleTelefonoInput}
                  minlength={9}
                  maxlength={9}
                />
              </IonItem>
              {errors.telefono && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.telefono}</p>
                </IonText>
              )}

              <IonItem>
                <IonInput
                  label="RUT"
                  labelPlacement="stacked"
                  placeholder="12345678-9"
                  value={rut}
                  onIonInput={handleRutInput}
                  maxlength={10}
                />
              </IonItem>
              {errors.rut && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.rut}</p>
                </IonText>
              )}

              <IonItem>
                <IonInput
                  label="Correo"
                  labelPlacement="stacked"
                  type="email"
                  autocomplete="email"
                  inputmode="email"
                  value={correo}
                  onIonChange={handleCorreoChange}
                />
              </IonItem>
              {errors.correo && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.correo}</p>
                </IonText>
              )}

              <IonItem className="ion-margin-top">
                <IonInput
                  label="Contraseña"
                  labelPlacement="stacked"
                  type="password"
                  autocomplete="new-password"
                  value={password}
                  onIonChange={handlePasswordChange}
                  minlength={8}
                  maxlength={20}
                >
                  <IonInputPasswordToggle slot="end" color="prussian-blue" />
                </IonInput>
              </IonItem>
              {errors.password && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.password}</p>
                </IonText>
              )}

              <IonItem>
                <IonSelect
                  label="Comuna"
                  placeholder="Selecciona tu comuna de residencia"
                  labelPlacement="stacked"
                  value={comuna}
                  onIonChange={handleComunaChange}
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
                  <IonSelectOption value="Huechuraba">
                    Huechuraba
                  </IonSelectOption>
                  <IonSelectOption value="Independencia">
                    Independencia
                  </IonSelectOption>
                  <IonSelectOption value="Isla de Maipo">
                    Isla de Maipo
                  </IonSelectOption>
                  <IonSelectOption value="La Cisterna">
                    La Cisterna
                  </IonSelectOption>
                  <IonSelectOption value="La Florida">
                    La Florida
                  </IonSelectOption>
                  <IonSelectOption value="La Granja">La Granja</IonSelectOption>
                  <IonSelectOption value="La Pintana">
                    La Pintana
                  </IonSelectOption>
                  <IonSelectOption value="La Reina">La Reina</IonSelectOption>
                  <IonSelectOption value="Lampa">Lampa</IonSelectOption>
                  <IonSelectOption value="Las Condes">
                    Las Condes
                  </IonSelectOption>
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
                  <IonSelectOption value="San Miguel">
                    San Miguel
                  </IonSelectOption>
                  <IonSelectOption value="San Pedro">San Pedro</IonSelectOption>
                  <IonSelectOption value="San Ramón">San Ramón</IonSelectOption>
                  <IonSelectOption value="Santiago">Santiago</IonSelectOption>
                  <IonSelectOption value="Talagante">Talagante</IonSelectOption>
                  <IonSelectOption value="Tiltil">Tiltil</IonSelectOption>
                  <IonSelectOption value="Vitacura">Vitacura</IonSelectOption>
                </IonSelect>
              </IonItem>
              {errors.comuna && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.comuna}</p>
                </IonText>
              )}

              {rol === "paseador" && (
                <>
                  <IonItem>
                    <IonLabel position="stacked">
                      Carnet de identidad (PDF)
                    </IonLabel>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleCarnetChange}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel position="stacked">
                      Antecedentes penales (PDF)
                    </IonLabel>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleAntecedentesChange}
                    />
                  </IonItem>
                </>
              )}
              {errors.files && (
                <IonText color="danger">
                  <p className="ion-padding-start">{errors.files}</p>
                </IonText>
              )}

              {apiErrorMsg && (
                <IonText color="danger">
                  <p className="ion-padding-start ion-margin-top ion-text-center">
                    {apiErrorMsg}
                  </p>
                </IonText>
              )}

              <IonButton
                expand="block"
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
