/**
 * Ignis Vite Configuration with Module Federation
 * 
 * Exposes Ignis components as federated modules
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from "@originjs/vite-plugin-federation";
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "ignis",
      filename: "remoteEntry.js",
      exposes: {
        "./BlueprintEditor": "./src/ignis/blueprint/canvas/BPGraphCanvas.tsx",
        "./NodeRenderer": "./src/ignis/blueprint/canvas/NodeRenderer.tsx",
        "./WireRenderer": "./src/ignis/blueprint/canvas/WireRenderer.tsx",
        "./InspectorPanel": "./src/ignis/blueprint/inspector/InspectorPanel.tsx",
        "./NodePalette": "./src/ignis/blueprint/palette/NodePalette.tsx",
        "./NodeLibrary": "./src/ignis/blueprint/library/NodeLibrary.ts",
        "./BPInterpreter": "./src/ignis/blueprint/runtime/BPInterpreter.ts",
        "./CSharpGenerator": "./src/ignis/blueprint/runtime/CSharpGenerator.ts",
        "./GraphStore": "./src/ignis/blueprint/store/BPGraphStore.ts"
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
        zustand: { 
          singleton: true,
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
    cssCodeSplit: false,
    rollupOptions: {
      external: []
    }
  },
  server: {
    port: 4312,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  }
});

