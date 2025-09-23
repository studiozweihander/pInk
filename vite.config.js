import { defineConfig } from 'vite'

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: './index.html',
        'how-to-use': './pages/how-to-use.html'
      }
    }
  },
  server: {
    port: 5173,
    open: true
  }
})
