/**
 * Slate Vite Configuration with Module Federation
 * 
 * Exposes Slate design system components as federated modules
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from "@originjs/vite-plugin-federation";
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "slate",
      filename: "remoteEntry.js",
      exposes: {
        "./Button": "./src/slate/components/Button.tsx",
        "./Input": "./src/slate/components/Input.tsx",
        "./Panel": "./src/slate/components/Panel.tsx",
        "./Card": "./src/slate/components/Card.tsx",
        "./Tokens": "./src/slate/tokens/tokens.css"
      },
      shared: {
        react: { 
          singleton: true, 
          requiredVersion: "^18.3.0",
          eager: false
        },
        "react-dom": { 
          singleton: true, 
          requiredVersion: "^18.3.0",
          eager: false
        },
        "@wissil/kernel": { 
          singleton: true,
          eager: false
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@wissil/kernel': path.resolve(__dirname, '../wissil-kernel/src')
    }
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 4311,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
});

