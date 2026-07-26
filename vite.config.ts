import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || ''

  return defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Proxy requests starting with /arquivos to the API to avoid CORS in dev
        '/arquivos': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  })
}
