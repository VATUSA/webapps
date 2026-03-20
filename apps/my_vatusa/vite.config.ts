import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/my',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    strictPort: true,
    port: 3002,
  },
  plugins: [react()],
})
