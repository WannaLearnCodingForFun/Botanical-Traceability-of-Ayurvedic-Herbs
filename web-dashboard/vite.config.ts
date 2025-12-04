import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/dashboard/',
  build: {
    outDir: '../backend-api/public/dashboard',
    emptyOutDir: true
  },
  server: {
    port: 5175,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});


