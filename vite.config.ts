import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        // Use IPv4 explicitly. On Windows, `localhost` can resolve to ::1 while
        // the API server listens only on 127.0.0.1, which makes Vite return 502.
        target: 'http://127.0.0.1:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // use esbuild for css minification to avoid lightningcss parsing issues
    cssMinify: 'esbuild',
  },
})
