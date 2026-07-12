import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['lucide-static']
        }
      }
    }
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    open: true
  },
  preview: {
    port: 4173
  }
});