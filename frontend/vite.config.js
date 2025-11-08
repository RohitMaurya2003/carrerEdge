import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Netlify expects `dist` by default; ensure build output matches Netlify's publish dir
  build: { outDir: 'dist' },
  // During development, proxy API requests to the backend server
  server: {
    proxy: {
      // Proxy any request starting with /api to the backend on port 5001
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
