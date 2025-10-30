export default function PoliticaPrivacidad() {
  return (
    <div className="min-h-screen max-w-4xl mx-auto text-prussian-blue p-4 sm:p-6 lg:p-8 my-6">
      <main className="space-y-6 text-wrap bg-gray-50 p-6 rounded-xl shadow-md">
        <header>
          <h1 className="text-3xl md:text-5xl font-bold text-prussian-blue text-center">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-600 my-2">
            En Paws At Route, nos comprometemos a proteger su privacidad y
            garantizar que sus datos personales sean tratados de manera segura y
            responsable. Esta Política de Privacidad describe cómo recopilamos,
            usamos, almacenamos y protegemos su información cuando utiliza
            nuestra plataforma web y móvil.
          </p>
        </header>
        <section className="space-y-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold">1. Información que recopilamos</h2>
          <p className="text-lg text-gray-600">
            Recopilamos la información necesaria para ofrecer nuestros servicios
            de manera eficiente y segura, incluyendo:
            <ul className="list-disc list-inside">
              <li>
                Datos personales: nombre, correo electrónico, número de
                teléfono, dirección y fecha de nacimiento.
              </li>
              <li>
                Información de mascotas: tipo, raza, edad y necesidades
                especiales.
              </li>
              <li>
                Información de pago: datos de tarjetas o cuentas de pago, cuando
                aplica.
              </li>
              <li>
                Información de uso: registros de actividad en la plataforma,
                historial de reservas y preferencias de usuario.
              </li>
            </ul>
          </p>
        </section>
        <section className="space-y-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold">2. Uso de la información</h2>
          <p className="text-lg text-gray-600">
            La información que recopilamos se utiliza para los siguientes fines:
            <ul className="list-disc list-inside">
              <li>
                Proveer y mejorar nuestros servicios, incluyendo la conexión
                entre dueños de mascotas y paseadores.
              </li>
              <li>Gestionar cuentas de usuario y autenticación.</li>
              <li>Procesar pagos y transacciones de manera segura.</li>
              <li>
                Enviar comunicaciones relacionadas con la plataforma,
                actualizaciones y promociones, cuando el usuario haya otorgado
                su consentimiento.
              </li>
              <li>Cumplir con obligaciones legales y normativas aplicables.</li>
            </ul>
          </p>
        </section>
        <section className="space-y-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold">3. Compartir información</h2>
          <p className="text-lg text-gray-600">
            No vendemos, alquilamos ni compartimos su información personal con
            terceros para fines comerciales. Podemos compartir información
            únicamente con:
            <ul className="list-disc list-inside">
              <li>
                Paseadores verificados, para coordinar los servicios
                solicitados.
              </li>
              <li>
                Proveedores de servicios que apoyen la operación de la
                plataforma (por ejemplo, procesamiento de pagos y servicios en
                la nube).
              </li>
              <li>
                Autoridades legales, cuando sea requerido por ley o para
                proteger derechos de la plataforma.
              </li>
            </ul>
          </p>
        </section>
        <section className="space-y-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold">4. Seguridad de los datos</h2>
          <p className="text-lg text-gray-600">
            Implementamos medidas técnicas y organizativas para proteger la
            información personal contra accesos no autorizados, pérdida,
            alteración o divulgación indebida. Sin embargo, ningún sistema de
            transmisión o almacenamiento es completamente seguro y no podemos
            garantizar una seguridad absoluta.
          </p>
        </section>
        <section className="space-y-3 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold">5. Derechos del usuario</h2>
          <p className="text-lg text-gray-600">
            Los usuarios tienen derecho a acceder, rectificar, actualizar o
            eliminar sus datos personales. También pueden solicitar la
            restricción del tratamiento o la portabilidad de los mismos, de
            acuerdo con la legislación aplicable. Para ejercer estos derechos,
            puede contactarnos a través de los canales disponibles en la
            plataforma.
          </p>
        </section>
      </main>
    </div>
  );
}
