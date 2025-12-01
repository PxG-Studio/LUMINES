// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from '@storybook/nextjs-vite';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config: StorybookConfig = {
  stories: [
    // WIS2L Framework Pages - EXCLUDED: src/app/**/*.stories.* (duplicates of canonical stories)
    // Canonical versions exist in: src/stories/WIS2L Framework/{Subsystem}/Pages/
    // '../src/app/**/*.stories.@(js|jsx|mjs|ts|tsx)', // EXCLUDED - duplicates

    // WISSIL Components organized by system and Atomic Design hierarchy
    '../src/wissil/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',

    // Consolidated Story Structure (canonical location - PRIMARY)
    // WIS2L Framework (canonical - use this)
    '../src/stories/WIS2L Framework/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/stories/WIS2L Framework/**/*.mdx',

    // Other stories
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/stories/**/*.mdx',
    
    // Editor Components (Complete IDE)
    '../src/stories/Editor/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    
    // Fallback: Any other stories (app stories excluded - duplicates exist in canonical locations)
    // Note: Not using '../src/**/*.stories.*' to avoid picking up src/app duplicates
  ],

  addons: [
    getAbsolutePath("@storybook/addon-links"),
    getAbsolutePath("@storybook/addon-a11y"),
    getAbsolutePath("@storybook/addon-docs"),
    getAbsolutePath("@storybook/addon-mcp")
  ],

  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },

  staticDirs: ['../public'],

  features: {
    // Modern Storybook features for performance
    storyStoreV7: true,
    buildStoriesJson: true,
    // Enable lazy compilation (if using Vite builder)
    // experimentalViteLazyCompilation: true,
    argTypeTargetsV7: true,
  },

  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
        '@/components': path.resolve(__dirname, '../src/components'),
        '@/tokens': path.resolve(__dirname, '../src/tokens'),
        '@/styles': path.resolve(__dirname, '../src/styles'),
        '@/wissil': path.resolve(__dirname, '../src/wissil'),
        '@/story-components': path.resolve(__dirname, '../src/story-components'),
        '@/design-system': path.resolve(__dirname, '../src/design-system'),
        '@/theme': path.resolve(__dirname, '../src/theme'),
        '@/editor': path.resolve(__dirname, '../src/editor'),
        '@/ignis': path.resolve(__dirname, '../src/ignis'),
        '@/ignition': path.resolve(__dirname, '../src/ignition'),
        '@/spark': path.resolve(__dirname, '../src/spark'),
        '@/waypoint': path.resolve(__dirname, '../src/waypoint'),
        '@/slate': path.resolve(__dirname, '../src/slate'),
        '@/state': path.resolve(__dirname, '../src/state'),
        '@/hooks': path.resolve(__dirname, '../src/hooks'),
        '@/utils': path.resolve(__dirname, '../src/utils'),
        '@/apps': path.resolve(__dirname, '../src/apps'),
        // LumenForge Landing App (now local in LUMINES)
        '@lumenforge/landing': path.resolve(__dirname, '../src/apps/lumenforge-landing'),
        // Workspace packages
        '@wissil/plugin-sdk': path.resolve(__dirname, '../packages/wissil-plugin-sdk/src'),
        // Mock Node.js modules that can't run in browser
        'simple-git': path.resolve(__dirname, './simple-git-mock.js'),
        // Mock Next.js components for Storybook
        'next/link': path.resolve(__dirname, './next-link.js'),
        'next/image': path.resolve(__dirname, './next-image.js'),
        // Storybook decorators (simple alias without @/ to avoid conflicts)
        'storybook-decorator': path.resolve(__dirname, './UnityPreviewDecorator'),
      };
      // CRITICAL: Ensure node_modules resolution works - prioritize root node_modules
      const rootNodeModules = path.resolve(__dirname, '../node_modules');
      config.resolve.modules = [
        rootNodeModules,
        'node_modules',
        ...(config.resolve.modules || []),
      ];
      
      // Ensure symlinks are resolved
      config.resolve.symlinks = true;
      
      // Ensure extensions are resolved
      config.resolve.extensions = [
        '.tsx',
        '.ts',
        '.jsx',
        '.js',
        '.json',
        ...(config.resolve.extensions || []),
      ];
      
      // CRITICAL: Fallback for Node.js built-in modules (can't run in browser)
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "child_process": false,
        "fs": false,
        "net": false,
        "tls": false,
        "crypto": false,
        "stream": false,
        "url": false,
        "zlib": false,
        "http": false,
        "https": false,
        "assert": false,
        "os": false,
        "path": false,
        "buffer": false,
        "util": false,
        "events": false,
      };
    }
    
    // Ensure webpack can find all node_modules for loaders
    if (!config.resolveLoader) {
      config.resolveLoader = {};
    }
    config.resolveLoader.modules = [
      path.resolve(__dirname, '../node_modules'),
      'node_modules',
      ...(config.resolveLoader.modules || []),
    ];
    
    return config;
  },

  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => {
        if (prop.parent) {
          return !prop.parent.fileName.includes('node_modules');
        }
        return true;
      },
    },
  },

  // Suppress package.json warnings for dev dependencies
  // These are expected warnings - packages are installed but Storybook
  // can't find their package.json during dependency analysis
  logLevel: 'warn'
};

// Suppress specific warnings about missing package.json files
// These are false positives - the packages are installed correctly
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  const message = args[0]?.toString() || '';
  if (message.includes('unable to find package.json')) {
    // Suppress these specific warnings
    return;
  }
  originalWarn(...args);
};

export default config;

function getAbsolutePath(value: string): any {
  return dirname(fileURLToPath(import.meta.resolve(`${value}/package.json`)));
}
