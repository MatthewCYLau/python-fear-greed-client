import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://python-fear-greed-api-3i2mtbjusq-ew.a.run.app'
    }
  }
})
