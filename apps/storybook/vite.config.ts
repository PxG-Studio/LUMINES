import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // TODO: Future migration - Add path aliases once packages are migrated
  // resolve: {
  //   alias: {
  //     '@lumines/ui': path.resolve(__dirname, '../../packages/ui/src'),
  //     '@lumines/tokens': path.resolve(__dirname, '../../packages/tokens/src'),
  //   },
  // },
});

