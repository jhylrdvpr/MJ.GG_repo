import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use relative paths for GitHub Pages compatibility. Change to '/REPO_NAME/' if you prefer absolute base.
  base: './',
  server: {
    proxy: {
      '/api/riot': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/api/health': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
