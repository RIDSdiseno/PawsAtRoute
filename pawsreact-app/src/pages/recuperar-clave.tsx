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
  IonSpinner,
  IonToast,
} from "@ionic/react";
import { useState } from "react";
import { useIonRouter } from "@ionic/react";
import {
  sendVerificationCode as apiSendCode,
  verifyCode as apiVerifyCode,
  resetPassword as apiResetPassword,
} from "../services/api";

const RecuperarClave: React.FC = () => {
  const router = useIonRouter();

  // Steps: 1 correo -> 2 código -> 3 nueva clave
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form state
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ open: boolean; header: string; sub?: string }>({
    open: false,
    header: "",
    sub: "",
  });
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: "",
  });

  // === Actions ===
  const onSendCode = async () => {
    const email = correo.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setToast({ open: true, msg: "Ingresa un correo válido" });
      return;
    }
    try {
      setLoading(true);
      await apiSendCode(email);
      setAlert({
        open: true,
        header: "Correo identificado",
        sub: "Te enviamos un código de verificación.",
      });
      setStep(2);
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.response?.data?.message || "No se pudo enviar el código",
      });
    } finally {
      setLoading(false);
    }
  };

  const onVerifyCode = async () => {
    const n = Number(codigo);
    if (!codigo || isNaN(n) || codigo.length !== 6) {
      setToast({ open: true, msg: "El código debe tener 6 dígitos" });
      return;
    }
    try {
      setLoading(true);
      await apiVerifyCode(correo.trim().toLowerCase(), n);
      setAlert({
        open: true,
        header: "Código verificado",
        sub: "Código correcto. Ahora crea tu nueva contraseña.",
      });
      setStep(3);
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.response?.data?.message || "Código incorrecto o expirado",
      });
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async () => {
    if (!pass1 || pass1.length < 10) {
      setToast({ open: true, msg: "La contraseña debe tener al menos 10 caracteres" });
      return;
    }
    if (pass1 !== pass2) {
      setToast({ open: true, msg: "Las contraseñas no coinciden" });
      return;
    }
    try {
      setLoading(true);
      await apiResetPassword(correo.trim().toLowerCase(), pass1);
      setAlert({
        open: true,
        header: "Contraseña cambiada",
        sub: "Actualizamos tu contraseña correctamente.",
      });
      // pequeño delay para que el usuario lea y luego redirige
      setTimeout(() => router.push("/login"), 400);
    } catch (e: any) {
      setToast({
        open: true,
        msg: e?.response?.data?.error || "No se pudo cambiar la contraseña",
      });
    } finally {
      setLoading(false);
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
          <svg
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
            xmlns="http://www.w3.org/2000/svg"
            style={{ fill: "var(--ion-color-selective-yellow)", width: "125%", height: 35 }}
          >
            <path d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 218.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z" opacity=".25" />
            <path d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z" opacity=".5" />
            <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
          </svg>
        </div>
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        {/* Loader inline */}
        {loading && (
          <div className="ion-text-center ion-margin">
            <IonSpinner name="crescent" />
          </div>
        )}

        {/* STEP 1: Ingreso de correo */}
        {step === 1 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">Restablecer Contraseña</IonCardTitle>
              <IonCardSubtitle>Ingresa tu correo para restablecer tu contraseña</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonInput
                  label="Correo"
                  labelPlacement="stacked"
                  placeholder="ejemplo@gmail.com"
                  type="email"
                  required
                  minlength={6}
                  maxlength={60}
                  value={correo}
                  onIonInput={(e) => setCorreo(String(e.detail.value || ""))}
                />
              </IonItem>
              <IonButton
                expand="full"
                shape="round"
                color="prussian-blue"
                className="ion-margin-top"
                onClick={onSendCode}
                disabled={loading}
              >
                Recuperar
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* STEP 2: Verificación de código */}
        {step === 2 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">Ingresa el código</IonCardTitle>
              <IonCardSubtitle>Se envió un código de 6 dígitos a tu correo</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonInputOtp
                length={6}
                value={codigo}
                onIonChange={(e) => setCodigo(String(e.detail.value || ""))}
              />
              <div className="ion-text-right ion-margin-top">
                <IonButton
                  fill="clear"
                  size="small"
                  onClick={onSendCode}
                  disabled={loading}
                >
                  Reenviar código
                </IonButton>
              </div>
              <IonButton
                expand="full"
                shape="round"
                color="prussian-blue"
                className="ion-margin-top"
                onClick={onVerifyCode}
                disabled={loading}
              >
                Verificar
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* STEP 3: Cambio de contraseña */}
        {step === 3 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">Cambiar contraseña</IonCardTitle>
              <IonCardSubtitle>Ingresa tu nueva contraseña</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <IonItem>
                <IonInput
                  label="Nueva contraseña"
                  labelPlacement="stacked"
                  type="password"
                  required
                  counter
                  minlength={10}
                  maxlength={30}
                  value={pass1}
                  onIonInput={(e) => setPass1(String(e.detail.value || ""))}
                >
                  <IonInputPasswordToggle slot="end" color="prussian-blue" />
                </IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Confirmar contraseña"
                  labelPlacement="stacked"
                  type="password"
                  required
                  counter
                  minlength={10}
                  maxlength={30}
                  value={pass2}
                  onIonInput={(e) => setPass2(String(e.detail.value || ""))}
                >
                  <IonInputPasswordToggle slot="end" color="prussian-blue" />
                </IonInput>
              </IonItem>
              <IonButton
                expand="full"
                shape="round"
                color="prussian-blue"
                className="ion-margin-top"
                onClick={onResetPassword}
                disabled={loading}
              >
                Confirmar
              </IonButton>
            </IonCardContent>
          </IonCard>
        )}

        {/* Alert genérico de éxito */}
        <IonAlert
          isOpen={alert.open}
          header={alert.header}
          subHeader={alert.sub}
          buttons={["Aceptar"]}
          onDidDismiss={() => setAlert({ open: false, header: "", sub: "" })}
        />
        {/* Toast de errores */}
        <IonToast
          isOpen={toast.open}
          message={toast.msg}
          duration={2200}
          color="danger"
          onDidDismiss={() => setToast({ open: false, msg: "" })}
        />
      </IonContent>
    </IonPage>
  );
};

export default RecuperarClave;
