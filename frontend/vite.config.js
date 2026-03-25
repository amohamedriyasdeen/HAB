import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return defineConfig({
    base: "./",
    plugins: [react()],
    server: {
      port: Number(env.VITE_PORT) || 5173
    },
    build: {
      outDir: "dist"
    }
  })
}