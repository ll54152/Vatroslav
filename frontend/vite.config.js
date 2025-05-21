import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
  host: "0.0.0.0", // Omogućava pristup sa drugih uređaja u mreži
  port: 5173, // Port frontend aplikacije
  proxy: {
    "/component": {
      target: "http://localhost:8080", // Pošto backend i frontend rade na istom računalu
      changeOrigin: true,
      secure: false,
      },
    },
  },
})
