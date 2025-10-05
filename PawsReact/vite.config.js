import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173, // Render inyecta PORT
    strictPort: true,                       // falla si no puede usar ese puerto
    allowedHosts: ['pawsatroute1.onrender.com'],
    hmr: {
      host: 'pawsatroute1.onrender.com',
      protocol: 'wss',
      clientPort: 443,
    },               
  },
  build: { outDir: 'dist' },
  publicDir: 'public',
});
