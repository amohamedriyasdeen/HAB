import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: import.meta.env.VITE_PORT || 5173,
  },
  build: {
    outDir: 'dist',
  },
});
