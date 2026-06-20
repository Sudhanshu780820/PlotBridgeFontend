import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Forwards any request starting with '/api' to your Express backend
      '/api': {
        target: 'http://localhost:5000', // Ensure 5000 matches your Node server port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})