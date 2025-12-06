<<<<<<< HEAD
/**
 * Vitest Configuration
 */

=======
>>>>>>> slate/prototype-1
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
<<<<<<< HEAD
    setupFiles: ['./tests/vitest.setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    css: true,
    include: ['tests/**/*.test.{ts,tsx}'],
=======
    setupFiles: ['./src/test/setup.ts'],
>>>>>>> slate/prototype-1
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
<<<<<<< HEAD
        'tests/',
        '**/*.config.*',
        '**/dist/',
        '**/.storybook/',
        '**/*.stories.{ts,tsx}',
=======
        'src/test/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        '**/*.stories.tsx',
        '**/*.config.{ts,js}',
        '**/types.ts',
>>>>>>> slate/prototype-1
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
