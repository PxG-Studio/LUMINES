#!/usr/bin/env tsx
/**
 * Plugin Build Script
 * 
 * Packages a plugin for distribution
 */

import { build } from 'vite';
import federation from '@originjs/vite-plugin-federation';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

async function buildPlugin() {
  const manifestPath = join(process.cwd(), 'plugin.json');
  
  if (!existsSync(manifestPath)) {
    console.error('Error: plugin.json not found in current directory');
    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));

  console.log(`Building plugin: ${manifest.name} v${manifest.version}`);

  // Build federated module
  await build({
    plugins: [
      federation({
        name: manifest.id.replace(/[^a-z0-9]/gi, '_'),
        filename: 'remoteEntry.js',
        exposes: {
          './index': manifest.entry || './src/index.ts'
        },
        shared: {
          react: { singleton: true, requiredVersion: '^18.3.0' },
          'react-dom': { singleton: true, requiredVersion: '^18.3.0' }
        }
      })
    ],
    build: {
      outDir: 'dist',
      lib: {
        entry: manifest.entry || './src/index.ts',
        formats: ['es']
      },
      rollupOptions: {
        input: manifest.entry || './src/index.ts'
      }
    }
  });

  // Copy manifest to dist
  writeFileSync(
    join(process.cwd(), 'dist/manifest.json'),
    JSON.stringify(manifest, null, 2)
  );

  console.log(`✅ Plugin ${manifest.name} built successfully!`);
  console.log(`   Output: ${join(process.cwd(), 'dist')}`);
}

buildPlugin().catch(error => {
  console.error('Build failed:', error);
  process.exit(1);
});

