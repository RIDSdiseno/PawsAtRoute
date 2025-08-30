function Beneficios() {
  return (
    <section className="min-h-screen">
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
      <div className="p-4 max-w-6xl mx-auto py-24">
        <div className="flex flex-col mb-16 text-prussian-blue">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold ">
            Beneficios clave
          </h1>
          <p className="text-xl">Por qué elegir Paws At Route</p>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-4">
          <div className="bg-sky-400 p-4 rounded-2xl flex flex-col items-center gap-2 text-center row-span-2">
            <img
              className="size-20"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCTxnIGZpbGw9Im5vbmUiPgoJCTxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0ibTEyIDNsLjM5NC0uOTJhMSAxIDAgMCAwLS43ODggMHptMCAxOGwtLjQ5Ni44NjhhMSAxIDAgMCAwIC45OTIgMHptNi4zOTQtMTUuMjZMMTggNi42NnpNOC4wMjQgMTguNzI3bC0uNDk3Ljg2OXptMy41ODItMTYuNjQ2TDUuMjEyIDQuODJMNiA2LjY2bDYuMzk0LTIuNzR6TTQgNi42NTl2Ni44Nmgydi02Ljg2em0zLjUyNyAxMi45MzdsMy45NzcgMi4yNzJsLjk5Mi0xLjczNmwtMy45NzctMi4yNzN6bTQuOTcgMi4yNzJsMy45NzYtMi4yNzJsLS45OTItMS43MzdsLTMuOTc3IDIuMjczek0yMCAxMy41MThWNi42NmgtMnY2Ljg2em0tMS4yMTItOC42OTdsLTYuMzk0LTIuNzRsLS43ODggMS44MzhMMTggNi42NnpNMjAgNi42NmEyIDIgMCAwIDAtMS4yMTItMS44MzhMMTggNi42NnptLTMuNTI3IDEyLjkzN0E3IDcgMCAwIDAgMjAgMTMuNTE4aC0yYTUgNSAwIDAgMS0yLjUyIDQuMzQxek00IDEzLjUxOGE3IDcgMCAwIDAgMy41MjcgNi4wNzhsLjk5Mi0xLjczN0E1IDUgMCAwIDEgNiAxMy41MnptMS4yMTItOC42OTdBMiAyIDAgMCAwIDQgNi42NmgyeiIgLz4KCQk8cGF0aCBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Im0xNSAxMGwtNCA0bC0yLTIiIC8+Cgk8L2c+Cjwvc3ZnPg=="
              alt="Seguridad garantizada"
            />
            <p className="text-2xl font-semibold">Seguridad garantizada</p>
            <p className="text-xl">Paseadores cuidadosamente seleccionados.</p>
          </div>
          <div className="bg-emerald-400 p-4 rounded-2xl flex flex-col items-center gap-2 text-center col-start-1 row-start-3">
            <img
              className="size-20"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCTxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTE5IDRoLTJWM2ExIDEgMCAwIDAtMiAwdjFIOVYzYTEgMSAwIDAgMC0yIDB2MUg1YTMgMyAwIDAgMC0zIDN2MTJhMyAzIDAgMCAwIDMgM2gxNGEzIDMgMCAwIDAgMy0zVjdhMyAzIDAgMCAwLTMtM20xIDE1YTEgMSAwIDAgMS0xIDFINWExIDEgMCAwIDEtMS0xdi03aDE2Wm0wLTlINFY3YTEgMSAwIDAgMSAxLTFoMnYxYTEgMSAwIDAgMCAyIDBWNmg2djFhMSAxIDAgMCAwIDIgMFY2aDJhMSAxIDAgMCAxIDEgMVoiIC8+Cjwvc3ZnPg=="
              alt="Flexibilidad total"
            />
            <p className="text-2xl font-semibold">Flexibilidad total</p>
            <p className="text-xl">Elije horario y duración según tu rutina.</p>
          </div>
          <div className="bg-indigo-400 p-4 rounded-2xl flex flex-col items-center gap-2 text-center col-start-2 row-start-1">
            <img
              className="size-20"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij4KCTxwYXRoIGZpbGw9Im5vbmUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIiIGQ9Im0xMiAybDIuOTM5IDUuOTU1bDYuNTcyLjk1NWwtNC43NTYgNC42MzVsMS4xMjMgNi41NDVMMTIgMTdsLTUuODc4IDMuMDlsMS4xMjMtNi41NDVMMi40ODkgOC45MWw2LjU3Mi0uOTU1eiIgLz4KPC9zdmc+"
              alt="Reseñas"
            />
            <p className="text-2xl font-semibold">Reseñas</p>
            <p className="text-xl">
              Lee opiniones de otros dueños para encontrar al mejor.
            </p>
          </div>
          <div className="bg-red-400 p-4 rounded-2xl flex flex-col items-center gap-2 text-center row-span-2 col-start-2 row-start-2">
            <img
              className="size-20"
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4KCTxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0ibTEyLjU5NiAxMS41OTZsLTMuNTM1IDMuNTM2YTEuNSAxLjUgMCAwIDEtMi4xMjIgMGwtMy41MzUtMy41MzZhNi41IDYuNSAwIDEgMSA5LjE5Mi05LjE5M2E2LjUgNi41IDAgMCAxIDAgOS4xOTNtLTEuMDYtOC4xMzJhNSA1IDAgMSAwLTcuMDcyIDcuMDcyTDggMTQuMDdsMy41MzYtMy41MzRhNSA1IDAgMCAwIDAtNy4wNzJNOCA5YTIgMiAwIDEgMS0uMDAxLTMuOTk5QTIgMiAwIDAgMSA4IDkiIC8+Cjwvc3ZnPg=="
              alt="Local"
            />
            <p className="text-2xl font-semibold">Local</p>
            <p className="text-xl">
              Encuentra paseadores locales de la Región Metropolitana.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Beneficios;
