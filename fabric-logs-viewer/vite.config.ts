import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/logs/',
  build: {
    outDir: '../backend-api/public/logs',
    emptyOutDir: true
  },
  server: {
    port: 5176,
    proxy: {
      '/api': 'http://localhost:4000'
    }
  }
});



