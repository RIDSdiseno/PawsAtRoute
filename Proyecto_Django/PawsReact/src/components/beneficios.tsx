function Beneficios() {
  return (
    <main id="beneficios" className="min-h-screen">
      {/* Divider superior */}
      <div className="overflow-hidden">
        <svg
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[125%] h-[75px] fill-[#ffb703]"
        >
          <path
            d="M0 0v46.29c47.79 22.2 103.59 32.17 158 28 70.36-5.37 136.33-33.31 206.8-37.5 73.84-4.36 147.54 16.88 21F8.2 35.26 69.27 18 138.3 24.88 209.4 13.08 36.15-6 69.85-17.84 104.45-29.34C989.49 25 1113-14.29 1200 52.47V0z"
            opacity=".25"
          />
          <path
            d="M0 0v15.81c13 21.11 27.64 41.05 47.69 56.24C99.41 111.27 165 111 224.58 91.58c31.15-10.15 60.09-26.07 89.67-39.8 40.92-19 84.73-46 130.83-49.67 36.26-2.85 70.9 9.42 98.6 31.56 31.77 25.39 62.32 62 103.63 73 40.44 10.79 81.35-6.69 119.13-24.28s75.16-39 116.92-43.05c59.73-5.85 113.28 22.88 168.9 38.84 30.2 8.66 59 6.17 87.09-7.5 22.43-10.89 48-26.93 60.65-49.24V0z"
            opacity=".5"
          />
          <path d="M0 0v5.63C149.93 59 314.09 71.32 475.83 42.57c43-7.64 84.23-20.12 127.61-26.46 59-8.63 112.48 12.24 165.56 35.4C827.93 77.22 886 95.24 951.2 90c86.53-7 172.46-45.71 248.8-84.81V0z" />
        </svg>
      </div>
      <section className="p-4 max-w-6xl mx-auto py-24">
        <div className="flex flex-col mb-16 text-prussian-blue">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold ">
            Beneficios clave
          </h1>
          <p className="text-xl">¿Por qué elegirnos?</p>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className="bg-sky-400 p-4 rounded-2xl flex flex-col items-center gap-2 text-center row-span-2 shadow-lg shadow-sky-400/50 border-2 border-sky-500">
            <img
              className="size-20"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCTxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWRhc2hhcnJheT0iNjQiIHN0cm9rZS1kYXNob2Zmc2V0PSI2NCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Ik0xMiAybC05IDMuNXY2LjVjMCAzLjUgMy41IDkgOCAxMGM0LjUgLTEgOCAtNi41IDggLTEwdi02LjVsLTggLTMuNVoiPgoJCTxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0iZmlsbC1vcGFjaXR5IiBiZWdpbj0iMC43cyIgZHVyPSIwLjE1cyIgdmFsdWVzPSIwOzAuMyIgLz4KCQk8YW5pbWF0ZSBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBkdXI9IjAuNnMiIHZhbHVlcz0iNjQ7MCIgLz4KCTwvcGF0aD4KPC9zdmc+"
              alt="Seguridad garantizada"
            />
            <p className="text-2xl font-semibold">Verificación de paseadores</p>
            <p className="text-xl">
              Paseadores cuidadosamente seleccionados y verificados.
            </p>
          </div>
          <div className="bg-emerald-400 p-4 rounded-2xl flex flex-col items-center gap-2 text-center col-start-1 row-start-3 shadow-lg shadow-emerald-400/50 border-2 border-emerald-500">
            <img
              className="size-20"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCTxnPgoJCTxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTcgM0gxN1Y3LjJMMTIgMTJMNyA3LjJWM1oiPgoJCQk8YW5pbWF0ZSBpZD0iU1ZHRmpuT25keHQiIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ib3BhY2l0eSIgYmVnaW49IjA7U1ZHbjZtTGFkZ2UuZW5kIiBkdXI9IjJzIiBmcm9tPSIxIiB0bz0iMCIgLz4KCQk8L3BhdGg+CgkJPHBhdGggZmlsbD0iY3VycmVudENvbG9yIiBkPSJNMTcgMjFIN1YxNi44TDEyIDEyTDE3IDE2LjhWMjFaIj4KCQkJPGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJvcGFjaXR5IiBiZWdpbj0iMDtTVkduNm1MYWRnZS5lbmQiIGR1cj0iMnMiIGZyb209IjAiIHRvPSIxIiAvPgoJCTwvcGF0aD4KCQk8cGF0aCBmaWxsPSJjdXJyZW50Q29sb3IiIGQ9Ik02IDJWOEg2LjAxTDYgOC4wMUwxMCAxMkw2IDE2TDYuMDEgMTYuMDFINlYyMkgxOFYxNi4wMUgxNy45OUwxOCAxNkwxNCAxMkwxOCA4LjAxTDE3Ljk5IDhIMThWMkg2Wk0xNiAxNi41VjIwSDhWMTYuNUwxMiAxMi41TDE2IDE2LjVaTTEyIDExLjVMOCA3LjVWNEgxNlY3LjVMMTIgMTEuNVoiIC8+CgkJPGFuaW1hdGVUcmFuc2Zvcm0gaWQ9IlNWR242bUxhZGdlIiBhdHRyaWJ1dGVOYW1lPSJ0cmFuc2Zvcm0iIGF0dHJpYnV0ZVR5cGU9IlhNTCIgYmVnaW49IlNWR0Zqbk9uZHh0LmVuZCIgZHVyPSIwLjVzIiBmcm9tPSIwIDEyIDEyIiB0bz0iMTgwIDEyIDEyIiB0eXBlPSJyb3RhdGUiIC8+Cgk8L2c+Cjwvc3ZnPg=="
              alt="Flexibilidad total"
            />
            <p className="text-2xl font-semibold">Flexibilidad total</p>
            <p className="text-xl">Elije duración según tu rutina.</p>
          </div>
          <div className="bg-indigo-400 p-4 rounded-2xl flex flex-col items-center gap-2 text-center col-start-2 row-start-1 shadow-lg shadow-indigo-400/50 border-2 border-indigo-500">
            <img
              className="size-20"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCTxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNMTIgM2wyLjM1IDUuNzZsNi4yMSAwLjQ2bC00Ljc2IDQuMDJsMS40OSA2LjA0bC01LjI5IC0zLjI4bC01LjI5IDMuMjhsMS40OSAtNi4wNGwtNC43NiAtNC4wMmw2LjIxIC0wLjQ2WiI+CgkJPGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGJlZ2luPSIwLjVzIiBkdXI9IjAuMTVzIiB2YWx1ZXM9IjA7MC4zIiAvPgoJPC9wYXRoPgoJPHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1kYXNoYXJyYXk9IjM2IiBzdHJva2UtZGFzaG9mZnNldD0iMzYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMTIgM2wtMi4zNSA1Ljc2bC02LjIxIDAuNDZsNC43NiA0LjAybC0xLjQ5IDYuMDRsNS4yOSAtMy4yOE0xMiAzbDIuMzUgNS43Nmw2LjIxIDAuNDZsLTQuNzYgNC4wMmwxLjQ5IDYuMDRsLTUuMjkgLTMuMjgiPgoJCTxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGR1cj0iMC41cyIgdmFsdWVzPSIzNjswIiAvPgoJPC9wYXRoPgo8L3N2Zz4="
              alt="Reseñas"
            />
            <p className="text-2xl font-semibold">Calificaciones</p>
            <p className="text-xl">
              Ve como otros dueños valoran a los paseadores para encontrar al
              mejor.
            </p>
          </div>
          <div className="bg-red-400 p-4 rounded-2xl flex flex-col items-center gap-2 text-center row-span-2 col-start-2 row-start-2 shadow-lg shadow-red-400/50 border-2 border-red-500">
            <img
              className="size-20"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCTxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZmlsbC1vcGFjaXR5PSIwIiBkPSJNNSA4LjVsNyAtNS41bDcgNS41djEyLjVoLTR2LThsLTEgLTFoLTRsLTEgMXY4aC00di0xMi41WiI+CgkJPGFuaW1hdGUgZmlsbD0iZnJlZXplIiBhdHRyaWJ1dGVOYW1lPSJmaWxsLW9wYWNpdHkiIGJlZ2luPSIxLjFzIiBkdXI9IjAuMTVzIiB2YWx1ZXM9IjA7MC4zIiAvPgoJPC9wYXRoPgoJPGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIj4KCQk8cGF0aCBzdHJva2UtZGFzaGFycmF5PSIxNiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjE2IiBkPSJNNC41IDIxLjVoMTUiPgoJCQk8YW5pbWF0ZSBmaWxsPSJmcmVlemUiIGF0dHJpYnV0ZU5hbWU9InN0cm9rZS1kYXNob2Zmc2V0IiBkdXI9IjAuMnMiIHZhbHVlcz0iMTY7MCIgLz4KCQk8L3BhdGg+CgkJPHBhdGggc3Ryb2tlLWRhc2hhcnJheT0iMTYiIHN0cm9rZS1kYXNob2Zmc2V0PSIxNiIgZD0iTTQuNSAyMS41di0xMy41TTE5LjUgMjEuNXYtMTMuNSI+CgkJCTxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGJlZ2luPSIwLjJzIiBkdXI9IjAuMnMiIHZhbHVlcz0iMTY7MCIgLz4KCQk8L3BhdGg+CgkJPHBhdGggc3Ryb2tlLWRhc2hhcnJheT0iMjgiIHN0cm9rZS1kYXNob2Zmc2V0PSIyOCIgZD0iTTIgMTBsMTAgLThsMTAgOCI+CgkJCTxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGJlZ2luPSIwLjRzIiBkdXI9IjAuNHMiIHZhbHVlcz0iMjg7MCIgLz4KCQk8L3BhdGg+CgkJPHBhdGggc3Ryb2tlLWRhc2hhcnJheT0iMjQiIHN0cm9rZS1kYXNob2Zmc2V0PSIyNCIgZD0iTTkuNSAyMS41di05aDV2OSI+CgkJCTxhbmltYXRlIGZpbGw9ImZyZWV6ZSIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiIGJlZ2luPSIwLjdzIiBkdXI9IjAuNHMiIHZhbHVlcz0iMjQ7MCIgLz4KCQk8L3BhdGg+Cgk8L2c+Cjwvc3ZnPg=="
              alt="Local"
            />
            <p className="text-2xl font-semibold">Paseadores locales</p>
            <p className="text-xl">
              Encuentra paseadores residentes de la Región Metropolitana.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Beneficios;
