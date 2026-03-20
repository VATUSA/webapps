import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/staff',
  server: {
    host: '0.0.0.0',
    allowedHosts: true,
    strictPort: true,
    port: 3001,
  },
  plugins: [react()],
})
