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
  IonText,
  IonSpinner,
} from "@ionic/react";
import { useState, useCallback } from "react";
import { useIonRouter } from "@ionic/react";

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

const validateOtp = (otp: string) => {
  if (!otp) {
    return "El código es obligatorio.";
  }
  if (otp.length !== 6) {
    return "El código debe tener 6 dígitos.";
  }
  return undefined;
};

const validateNewPassword = (password: string) => {
  const erroresPassword = [];
  if (!password) {
    return "La contraseña es obligatoria.";
  }

  if (password.length < 10 || password.length > 30) {
    erroresPassword.push("Debe tener entre 10 y 30 caracteres.");
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

const validateConfirmPassword = (password: string, confirm: string) => {
  if (!confirm) {
    return "Debes confirmar la contraseña.";
  }
  if (password !== confirm) {
    return "Las contraseñas no coinciden.";
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
  correo?: string;
  otp?: string;
  password?: string;
  confirm?: string;
};

const RecuperarClave: React.FC = () => {
  const router = useIonRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [correo, setCorreo] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [showEmailAlert, setShowEmailAlert] = useState(false);
  const [showOtpAlert, setShowOtpAlert] = useState(false);
  const [showFinalAlert, setShowFinalAlert] = useState(false);

  const handleCorreoChange = useCallback(
    (e: any) => setCorreo(e.detail.value ?? ""),
    []
  );
  const handleOtpChange = useCallback(
    (e: any) => setOtp(e.detail.value ?? ""),
    []
  );
  const handleNewPasswordChange = useCallback(
    (e: any) => setNewPassword(e.detail.value ?? ""),
    []
  );
  const handleConfirmPasswordChange = useCallback(
    (e: any) => setConfirmPassword(e.detail.value ?? ""),
    []
  );

  const handleSubmitEmail = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setApiError(null);
      const correoError = validateEmail(correo);

      if (correoError) {
        setErrors({ correo: correoError });
        return;
      }

      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowEmailAlert(true);
      } catch (err: any) {
        setApiError(err?.message || "Error al enviar correo");
      } finally {
        setLoading(false);
      }
    },
    [correo]
  );

  const handleSubmitOtp = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setApiError(null);
      const otpError = validateOtp(otp);

      if (otpError) {
        setErrors({ otp: otpError });
        return;
      }

      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowOtpAlert(true);
      } catch (err: any) {
        setApiError(err?.message || "Error al verificar código");
      } finally {
        setLoading(false);
      }
    },
    [otp]
  );

  const handleSubmitNewPassword = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});
      setApiError(null);

      const passwordError = validateNewPassword(newPassword);
      const confirmError = validateConfirmPassword(
        newPassword,
        confirmPassword
      );

      const nuevosErrores: FormErrors = {};
      if (passwordError) nuevosErrores.password = passwordError;
      if (confirmError) nuevosErrores.confirm = confirmError;

      if (Object.keys(nuevosErrores).length > 0) {
        setErrors(nuevosErrores);
        return;
      }

      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setShowFinalAlert(true);
      } catch (err: any) {
        setApiError(err?.message || "Error al cambiar contraseña");
      } finally {
        setLoading(false);
      }
    },
    [newPassword, confirmPassword]
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="selective-yellow">
          <IonButtons slot="start">
            <IonBackButton
              defaultHref="/login"
              color="prussian-blue"
            ></IonBackButton>
          </IonButtons>
          <IonTitle className="coffeecake" color="prussian-blue">
            Paws At Route
          </IonTitle>
        </IonToolbar>
        <HeaderWave />
      </IonHeader>

      <IonContent className="ion-padding" fullscreen>
        {step === 1 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">
                Restablecer Contraseña
              </IonCardTitle>
              <IonCardSubtitle>
                Ingresa tu correo para restablecer tu contraseña
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmitEmail} noValidate>
                <IonItem>
                  <IonInput
                    label="Correo"
                    labelPlacement="stacked"
                    placeholder="ejemplo@gmail.com"
                    type="email"
                    value={correo}
                    onIonChange={handleCorreoChange}
                  ></IonInput>
                </IonItem>
                {errors.correo && (
                  <IonText color="danger">
                    <p className="ion-padding-start">{errors.correo}</p>
                  </IonText>
                )}

                {apiError && (
                  <IonText color="danger">
                    <p className="ion-text-center ion-margin-top">{apiError}</p>
                  </IonText>
                )}

                <IonButton
                  expand="block"
                  shape="round"
                  color="prussian-blue"
                  className="ion-margin-top"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="dots" /> : "Recuperar"}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        )}

        {step === 2 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">
                Ingresa el código
              </IonCardTitle>
              <IonCardSubtitle>
                Se envió un código de 6 dígitos a tu correo
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmitOtp} noValidate>
                <IonInputOtp length={6} onIonChange={handleOtpChange}>
                  ¿No recibiste el código?{" "}
                  <a color="ut-orange" href="#">
                    Reenviar
                  </a>
                </IonInputOtp>
                {errors.otp && (
                  <IonText color="danger">
                    <p className="ion-text-center ion-margin-top">
                      {errors.otp}
                    </p>
                  </IonText>
                )}

                {apiError && (
                  <IonText color="danger">
                    <p className="ion-text-center ion-margin-top">{apiError}</p>
                  </IonText>
                )}

                <IonButton
                  expand="block"
                  shape="round"
                  color="prussian-blue"
                  className="ion-margin-top"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="dots" /> : "Verificar"}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        )}

        {step === 3 && (
          <IonCard>
            <IonCardHeader className="ion-text-center">
              <IonCardTitle color="prussian-blue">
                Cambiar contraseña
              </IonCardTitle>
              <IonCardSubtitle>Ingresa tu nueva contraseña</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <form onSubmit={handleSubmitNewPassword} noValidate>
                <IonItem>
                  <IonInput
                    label="Nueva contraseña"
                    labelPlacement="stacked"
                    placeholder="**********"
                    type="password"
                    counter={true}
                    minlength={10}
                    maxlength={30}
                    value={newPassword}
                    onIonChange={handleNewPasswordChange}
                  >
                    <IonInputPasswordToggle
                      slot="end"
                      color="prussian-blue"
                    ></IonInputPasswordToggle>
                  </IonInput>
                </IonItem>
                {errors.password && (
                  <IonText color="danger">
                    <p className="ion-padding-start">{errors.password}</p>
                  </IonText>
                )}

                <IonItem className="ion-margin-top">
                  <IonInput
                    label="Confirmar contraseña"
                    labelPlacement="stacked"
                    placeholder="**********"
                    type="password"
                    counter={true}
                    minlength={10}
                    maxlength={30}
                    value={confirmPassword}
                    onIonChange={handleConfirmPasswordChange}
                  >
                    <IonInputPasswordToggle
                      slot="end"
                      color="prussian-blue"
                    ></IonInputPasswordToggle>
                  </IonInput>
                </IonItem>
                {errors.confirm && (
                  <IonText color="danger">
                    <p className="ion-padding-start">{errors.confirm}</p>
                  </IonText>
                )}

                {apiError && (
                  <IonText color="danger">
                    <p className="ion-text-center ion-margin-top">{apiError}</p>
                  </IonText>
                )}

                <IonButton
                  expand="block"
                  shape="round"
                  color="prussian-blue"
                  className="ion-margin-top"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <IonSpinner name="dots" /> : "Confirmar"}
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        )}

        <IonAlert
          isOpen={showEmailAlert}
          header="Correo identificado"
          subHeader="Se envio un correo con el codigo de verificacion"
          buttons={["Aceptar"]}
          onDidDismiss={() => {
            setShowEmailAlert(false);
            setStep(2);
          }}
        ></IonAlert>

        <IonAlert
          isOpen={showOtpAlert}
          header="Código verificado"
          subHeader="Se verificó el código exitósamente."
          buttons={["Aceptar"]}
          onDidDismiss={() => {
            setShowOtpAlert(false);
            setStep(3);
          }}
        ></IonAlert>

        <IonAlert
          isOpen={showFinalAlert}
          header="Contraseña cambiada"
          subHeader="Se cambió la contraseña exitósamente."
          buttons={["Aceptar"]}
          onDidDismiss={() => {
            setShowFinalAlert(false);
            router.push("/login");
          }}
        ></IonAlert>
      </IonContent>
    </IonPage>
  );
};

export default RecuperarClave;