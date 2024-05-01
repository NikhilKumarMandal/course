import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://course-2.onrender.com/api/v1',
        secure: false,
      },
    },
  },
  plugins: [react()],
})