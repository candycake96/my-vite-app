import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    // use esbuild for css minification to avoid lightningcss parsing issues
    cssMinify: 'esbuild',
  },
})