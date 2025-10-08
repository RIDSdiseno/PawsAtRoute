import { Link } from "react-router-dom";

function Pricing() {
  return (
    <main id="pricing" className="min-h-screen">
      <div className="overflow-hidden">
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-prussian-blue w-[125%] h-[75px]"
        >
          <path d="M321.39 56.44c58-10.79 114.16-30.13 172-41.86 82.39-16.72 168.19-17.73 250.45-.39C823.78 31 906.67 72 985.66 92.83c70.05 18.48 146.53 26.09 214.34 3V0H0v27.35a600.21 600.21 0 00321.39 29.09z" />
        </svg>
      </div>
      <section className="max-w-4xl mx-auto py-24 grid grid-cols-1 md:grid-cols-2 p-4 gap-8 justify-center items-center">
        <article className="animate-tada animate-delay-200 flex flex-col w-full h-full gap-4 p-8 card-neumorphism">
          <header className="flex flex-wrap gap-2 items-center">
            <h1 className="text-3xl font-bold">Plan básico</h1>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+Cgk8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTM4LjcwNyA4LjI5M2ExIDEgMCAwIDEgMCAxLjQxNEwyOC42NzIgMTkuNzQyYy44MDcuMDA3IDEuNjQ0LS4wMDQgMi41MzQtLjAxNmMuNzc2LS4wMSAxLjU5MS0uMDIgMi40Ni0uMDJjMi4zODQgMCA0LjAzOC45MzYgNS4wNjggMi40MjZjLjk4NSAxLjQyNSAxLjMyNSAzLjI0NCAxLjM5IDQuOTJjLjA2NyAxLjY5NS0uMTQzIDMuMzctLjM2NCA0LjYwNWEyNiAyNiAwIDAgMS0uNDIgMS45MzNsLS4wMDcuMDIyVjM5YTEgMSAwIDAgMS0xIDFIMzRhMSAxIDAgMCAxLTEtMWMwLS44NDcuMTI4LTEuNDk3LjM3LTIuMDE4Yy4yNDgtLjUzNi41OC0uODUyLjgyMy0xLjA2M2wuMTQ2LS4xMjhjLTEuNzE4LS45ODktMi43MjctMS44MTctMy41MjItMi44NzNjLS40MjQtLjU2Mi0uNzY4LTEuMTY0LTEuMTI0LTEuODMxYTg2IDg2IDAgMCAxLS40MTUtLjc5MmMtLjEzNC0uMjU4LS4yNzQtLjUyOC0uNDI3LS44MThMMjIgMzEuNzQ3djUuNTI3YzAgLjYzOC0uMTAxIDEuMy0uNTIxIDEuODNjLS40MzQuNTQ4LTEuMDUzLjc2LTEuNjMuODU1Yy0uNTcuMDkzLTEuMjY0LjA5Ni0yLjAyOS4wODRsLS40NzYtLjAwOWwtLjMtLjAwNkE5MCA5MCAwIDAgMCAxNSA0MGMtLjQxIDAtLjg0NC0uMTc3LTEuMTA4LS41OTVjLS4yMTktLjM0Ny0uMjI5LS43Mi0uMjA5LS45NTdjLjA0MS0uNDkuMjYtMS4wMTUuNTE2LTEuNDUyYTUgNSAwIDAgMSAxLjA3My0xLjI5NGMuNDEzLS4zNDUuOTgyLS42NzcgMS42NTMtLjd2LS4wMDRhNCA0IDAgMCAwLS4wMTgtLjU0N2EyMyAyMyAwIDAgMC0uMTE2LS45NDZjLS4xMDItLjc2Mi0uMjM0LTEuNzQxLS4yNzctMi43OThjLS45MTQtLjM5Mi0xLjY0My0uODMtMi4xOS0xLjM4M2MtLjctLjcxLTEuMDIyLTEuNTMyLTEuMTQ4LTIuNDYzYy0uMTItLjg4LS4wNjktMS45MTMtLjAwMi0zLjA2OGwuMDItLjMzOGMuMDQ3LS44MTYuMS0xLjczLjEyNS0yLjc3M2MtMS4wODcuMjc0LTIuMjg0LjMxOC0zLjMxOS4zMThjLTIuMDIgMC0zLTEuNzEyLTMuNDM3LTIuODg3YTEwIDEwIDAgMCAxLS40NTQtMS43MTVhMTAgMTAgMCAwIDEtLjEtLjcyNmwtLjAwNC0uMDQ4bC0uMDAyLS4wMTR2LS4wMDdMNyAxNS41MjlsLS45OTcuMDc0YTEgMSAwIDAgMSAuNjc0LTEuMDJsLjQ1NC0uMTU2YTg4MiA4ODIgMCAwIDAgMi45OTYtMS4wMzJjLjE2Ny0uNTE1LjQ3Ni0xLjAwMy44MDItMS40MDFjLjUxMy0uNjI3IDEuMjIxLTEuMjI1IDIuMDIyLTEuNmMuOC0uMzczIDEuNzkyLS41NjcgMi43Ny0uMTg4Yy45OTEuMzg0IDEuNzM3IDEuMjY2IDIuMjE3IDIuNTU4Yy43NyAyLjA3NSAxLjYzIDMuNDk3IDIuNTcxIDQuNDg3Yy45My45NzggMS45NzYgMS41NzIgMy4xOSAxLjkzN2ExMiAxMiAwIDAgMCAyLjI3MS40MjlMMzcuMjkzIDguMjkzYTEgMSAwIDAgMSAxLjQxNCAwbS0xNS41ODUgMTIuODFxLjUzNC4xNTkgMS4wOS4yN0wyMi4wODYgMjMuNWgtNi44OTJjLjA2LTEuMDQzLjEzMi0yLjI5My4xMzktMy43NzdxLjM1NC0uMjkuNjM3LS42ODJjLjQ2Mi0uNjQ3LjY5Ny0xLjQ0MS42OTctMi4zNjZoLTJjMCAuNTc2LS4xNDEuOTQ3LS4zMjUgMS4yMDRjLS4xODguMjY0LS40NzguNDg1LS44OTcuNjYyYy0uODc4LjM3LTIuMTEuNDU5LTMuNDQ1LjQ1OWMtLjY0NiAwLTEuMTY3LS41MjQtMS41NjMtMS41ODVhNy42IDcuNiAwIDAgMS0uMzMtMS4yMDlsLjc2My0uMjYyYTMxNyAzMTcgMCAwIDAgMi40NjQtLjg1NGExIDEgMCAwIDAgLjY2Ni0uOTQzYzAtLjA4NC4wOTUtLjQyLjQ3Ny0uODg4Yy4zNTItLjQzLjgzMS0uODI0IDEuMzIyLTEuMDU0cy44OTUtLjI1MyAxLjItLjEzNWMuMjg5LjExMi43MS40MzggMS4wNjQgMS4zOWMuODMyIDIuMjQgMS44MTQgMy45MjQgMi45OTcgNS4xNjhjMS4xOTMgMS4yNTUgMi41NSAyLjAyIDQuMDYyIDIuNDc0bS0yLjQzNiA4Ljk3M2wuODE0LS4yN1YyNS41aC02LjM5NmMtLjAwNC40Mi4wMS43NzcuMDU0IDEuMDkzYy4wODIuNjA1LjI2Ljk5Mi41OSAxLjMyN2MuMzY1LjM3Ljk4Ny43NDggMi4xMDUgMS4xN2ExIDEgMCAwIDEgLjY0Ny45MzVjMCAxLjE4LjEzMiAyLjE0OC4yNSAzLjAyMWMuMDU5LjQyNy4xMTQuODMyLjE0OSAxLjIyOGMuMDQ1LjUxMi4wNzQgMS4xNy0uMTc4IDEuNzE3YTEuNjYgMS42NiAwIDAgMS0uNzIzLjc3OUEyLjEgMi4xIDAgMCAxIDE3IDM3Yy0uMDQ2IDAtLjIuMDMxLS40NDQuMjM2YTMgMyAwIDAgMC0uNjMuNzY4bC0uMDAxLjAwM3EuNjQ0LjAwOSAxLjE5LjAyMmwuNzM3LjAxNGMuNzgyLjAxMyAxLjMwNi4wMDIgMS42NzQtLjA1OGExLjMgMS4zIDAgMCAwIC4zMzMtLjA5YS4zLjMgMCAwIDAgLjA0NC0uMDI2bC4wMDItLjAwMWwuMDA3LS4wMDZjLjAwMi0uMDAzLjA4OC0uMTEzLjA4OC0uNTg4di02LjI0OWExIDEgMCAwIDEgLjY4Ni0uOTQ5bTYuMDQ1LTguMzkzTDIzLjUgMjQuOTE0djQuMjNsNS41MTktMS44M2ExIDEgMCAwIDEgMS4xOTIuNDdjLjMyNy41OTguNjEyIDEuMTQ2Ljg2MiAxLjYyNnEuMjA4LjQwMy4zODUuNzM2Yy4zNDMuNjQ0LjYzIDEuMTM1Ljk1NiAxLjU2OWMuNjMuODM1IDEuNDgxIDEuNTU1IDMuNDAyIDIuNjEyYTEgMSAwIDAgMSAuNDg1LjYyNWMuMTUuNTc3LjE3NyAxLjEzNC0uMDc0IDEuNjQ4Yy0uMTkxLjM5LS41MjcuNjY3LS42NzYuNzlsLS4wMTQuMDExbC0uMDM0LjAyOWMtLjE1LjEzLS4yNDIuMjI3LS4zMi4zOTNhMS40IDEuNCAwIDAgMC0uMDY2LjE3N2gyLjIxNnYtNC4zMDRsLTMuMjQxLTcuMDVsMS44MTctLjgzNWwyLjA0NiA0LjQ1Yy4xMjgtLjk2LjIxMy0yLjA1LjE3LTMuMTNjLS4wNTktMS41MTgtLjM2NS0yLjg5MS0xLjAzNi0zLjg2MWMtLjYyNi0uOTA1LTEuNjM5LTEuNTY0LTMuNDIyLTEuNTY0Yy0uODA2IDAtMS42LjAxLTIuMzczLjAyYy0xLjE3LjAxNS0yLjI5LjAyOS0zLjMxOC4wMDZxLS42MzItLjAxNC0xLjI0NS0uMDUiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz4KPC9zdmc+"
              className="size-10"
              alt="Básico"
            />
          </header>
          <p className="text-xl font-semibold">Gratuito</p>
          <ul className="list-image-[url('/check.svg')] text-md list-inside">
            <li>Publicar paseos y recibir postulaciones de paseadores.</li>
            <li>Ver perfiles de paseadores.</li>
            <li>Historial de paseos realizados.</li>
            <li>Calificar paseadores.</li>
            <li>Acceso a paseadores disponibles en su comuna.</li>
            <li>
              Paseos precio estándar.
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-500 hover:underline">
                  Ver tarifa
                </summary>
                <p>Paseo de 30 minutos: $10.000 CLP.</p>
              </details>
            </li>
          </ul>
          <button className="cursor-pointer bg-prussian-blue/80 text-white font-bold py-2 px-4 rounded-full flex justify-center items-center gap-2 hover:bg-prussian-blue active:scale-90 transition-all duration-200">
            <Link to="/login">Empezar a usar</Link>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+Cgk8ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj4KCQk8cGF0aCBzdHJva2UtZGFzaGFycmF5PSIyMCIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjIwIiBkPSJNMyAxMmgxNy41Ij4KCQkJPGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgZHVyPSIwLjJzIiB2YWx1ZXM9IjIwOzAiIC8+CgkJPC9wYXRoPgoJCTxwYXRoIHN0cm9rZS1kYXNoYXJyYXk9IjEyIiBzdHJva2UtZGFzaG9mZnNldD0iMTIiIGQ9Ik0yMSAxMmwtNyA3TTIxIDEybC03IC03Ij4KCQkJPGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaG9mZnNldCIgYmVnaW49IjAuMnMiIGR1cj0iMC4ycyIgdmFsdWVzPSIxMjswIiAvPgoJCTwvcGF0aD4KCTwvZz4KPC9zdmc+"
              className="size-6"
              alt="flecha"
            />
          </button>
        </article>
        <article className="animate-tada animate-delay-400 flex flex-col gap-4 p-6 card-neumorphism">
          <header className="flex flex-wrap gap-2 items-center">
            <h1 className="text-3xl font-bold">Plan premium</h1>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+Cgk8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTYuNTM1IDMuMjVhMS43NSAxLjc1IDAgMCAwLTEuNDU2Ljc4TDEuNDkgOS40MTJjLS4yMTkuMzMtLjI0NS43NTItLjA2OCAxLjEwNkEzMyAzMyAwIDAgMCA5LjQ1IDIwLjhsMS43NSAxLjUwMWExLjIzIDEuMjMgMCAwIDAgMS42MDEgMGwxLjc1LTEuNWEzMyAzMyAwIDAgMCA4LjAyOS0xMC4yODNjLjE3Ny0uMzU0LjE1LS43NzYtLjA2OS0xLjEwNkwxOC45MiA0LjAzYTEuNzUgMS43NSAwIDAgMC0xLjQ1NS0uNzc5em0tLjIwOCAxLjYxMWEuMjUuMjUgMCAwIDEgLjIwOC0uMTExaDIuMzRMNi45NiA5LjM0NmEyIDIgMCAwIDAtLjEuMzI2YTY5IDY5IDAgMCAxLTIuMTEtLjE5bC0xLjQwNS0uMTQ3ek0zLjI4IDEwLjgzNmEzMS41IDMxLjUgMCAwIDAgNi45OTQgOC42OTVsLTMuMTI1LTguMzM0YTcxIDcxIDAgMCAxLTIuNTU0LS4yMjJ6bTUuNTA2LjQ1NEwxMiAxOS44NjRsMy4yMTUtOC41NzRhNzEgNzEgMCAwIDEtNi40MyAwbTguMDY3LS4wOTNsLTMuMTI1IDguMzM0YTMxLjUgMzEuNSAwIDAgMCA2Ljk5NC04LjY5NWwtMS4zMTUuMTM5cS0xLjI3NS4xMzMtMi41NTQuMjIybTMuODAzLTEuODYybC0xLjQwNi4xNDhhNjkgNjkgMCAwIDEtMi4xMS4xOWEyIDIgMCAwIDAtLjA5OS0uMzI3TDE1LjEyNSA0Ljc1aDIuMzRhLjI1LjI1IDAgMCAxIC4yMDguMTExem0tNS4wNjMuNDM1cS0zLjU5MS4xODYtNy4xODQgMEwxMC41IDQuNzVoM3oiIGNsaXAtcnVsZT0iZXZlbm9kZCIgLz4KPC9zdmc+"
              className="size-8"
              alt="Premium"
            />
          </header>
          <p className="text-xl font-semibold">$12.000 CLP /mes</p>
          <ul className="list-image-[url('/check.svg')] text-md list-inside">
            <li>Publicar paseos y recibir postulaciones de paseadores.</li>
            <li>Ver perfiles de paseadores.</li>
            <li>Historial de paseos realizados.</li>
            <li>Calificar paseadores.</li>
            <li>Acceso a paseadores disponibles en su comuna.</li>
            <li className="list-image-[url('/check-premium.svg')]">
              Paseos con 25% de descuento.
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-500 hover:underline">
                  Ver tarifa
                </summary>
                <p>
                  Paseo de 30 minutos: $10.000 CLP + 25% descuento = $7.500 CLP.
                </p>
              </details>
            </li>
          </ul>
          <button className="cursor-pointer bg-selective-yellow/80 text-prussian-blue font-bold py-2 px-4 rounded-full flex justify-center items-center gap-2 hover:bg-selective-yellow active:scale-90 transition-all duration-200">
            {/* Aquí debería de pasar por un proceso de seguridad hasta la pasarela de pago */}
            <Link to="/">Obtener ahora</Link>
            <img
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+Cgk8ZyBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiPgoJCTxwYXRoIHN0cm9rZS1kYXNoYXJyYXk9IjIwIiBzdHJva2UtZGFzaG9mZnNldD0iMjAiIGQ9Ik0zIDEyaDE3LjUiPgoJCQk8YW5pbWF0ZSBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBkdXI9IjAuMnMiIHZhbHVlcz0iMjA7MCIgLz4KCQk8L3BhdGg+CgkJPHBhdGggc3Ryb2tlLWRhc2hhcnJheT0iMTIiIHN0cm9rZS1kYXNob2Zmc2V0PSIxMiIgZD0iTTIxIDEybC03IDdNMjEgMTJsLTcgLTciPgoJCQk8YW5pbWF0ZSBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBiZWdpbj0iMC4ycyIgZHVyPSIwLjJzIiB2YWx1ZXM9IjEyOzAiIC8+CgkJPC9wYXRoPgoJPC9nPgo8L3N2Zz4="
              className="size-6"
              alt="arrow"
            />
          </button>
        </article>
      </section>
    </main>
  );
}

export default Pricing;
