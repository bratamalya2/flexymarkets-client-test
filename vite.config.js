import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: [
      "cc8c-2401-4900-1c01-2a47-6438-c4d8-b73a-2a47.ngrok-free.app",
    ],
  },
  plugins: [
    react(),
    visualizer({
      filename: "bundle-stats.html",
      open: true, // opens the report automatically
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
