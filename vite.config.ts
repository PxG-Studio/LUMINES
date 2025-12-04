import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
    include: ['nats.ws'],
  },
  build: {
    target: 'esnext',
    commonjsOptions: {
      include: [/nats\.ws/, /node_modules/],
    },
  },
});
