// This file has been automatically migrated to valid ESM format by Storybook.
import { fileURLToPath } from "node:url";
import type { StorybookConfig } from '@storybook/nextjs-vite';
import path, { dirname } from 'path';
import { mergeConfig } from 'vite';

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
    getAbsolutePath("@storybook/addon-mcp"),
    getAbsolutePath("@storybook/addon-vitest")
  ],

  framework: {
    name: getAbsolutePath("@storybook/nextjs-vite"),
    options: {},
  },

  staticDirs: ['../public'],

  // features: {
  //   // Modern Storybook features for performance
  //   buildStoriesJson: true,
  //   argTypeTargetsV7: true,
  // },

  viteFinal: async (config) => {
    return mergeConfig(config, {
      resolve: {
        alias: {
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
          '@lumenforge/landing': path.resolve(__dirname, '../src/apps/lumenforge-landing'),
          '@wissil/plugin-sdk': path.resolve(__dirname, '../packages/wissil-plugin-sdk/src'),
          'simple-git': path.resolve(__dirname, './simple-git-mock.js'),
          'next/link': path.resolve(__dirname, './next-link.js'),
          'next/image': path.resolve(__dirname, './next-image.js'),
          'storybook-decorator': path.resolve(__dirname, './UnityPreviewDecorator'),
          // Fix for @storybook/addon-docs MDX shim resolution
          '@storybook/addon-docs/dist/mdx-react-shim.js': path.resolve(__dirname, '../node_modules/@storybook/addon-docs/dist/mdx-react-shim.js'),
        },
        // Fix file:// URL resolution for MDX files
        dedupe: ['react', 'react-dom'],
      },
      optimizeDeps: {
        // Note: Cannot use path aliases (@/) in optimizeDeps.include
        // Vite will automatically optimize these through normal resolution
        include: [
          // Use actual relative paths from node_modules or explicit file paths
          // Path aliases are handled by resolve.alias, so optimization happens automatically
        ],
        esbuildOptions: {
          // Handle file:// protocol in imports
          loader: {
            '.js': 'jsx',
          },
        },
      },
      server: {
        hmr: {
          overlay: false, // Disable error overlay to prevent HMR issues
          clientPort: 6006,
        },
        watch: {
          usePolling: false,
          interval: 100,
        },
      },
      plugins: [
        // Plugin to handle file:// URL resolution and MDX shim imports
        {
          name: 'fix-file-url-imports',
          enforce: 'pre',
          resolveId(id: string) {
            // Convert file:// URLs to regular paths
            if (id.startsWith('file:///')) {
              const filePath = id.replace(/^file:\/\/\//, '');
              return filePath;
            }
            // Resolve @storybook/addon-docs/dist/mdx-react-shim.js
            if (id === '@storybook/addon-docs/dist/mdx-react-shim.js' || id.includes('@storybook/addon-docs/dist/mdx-react-shim')) {
              const mdxShimPath = path.resolve(__dirname, '../node_modules/@storybook/addon-docs/dist/mdx-react-shim.js');
              return mdxShimPath;
            }
            return null;
          },
        },
        // Plugin to handle URL-encoded paths with spaces
        {
          name: 'fix-url-encoded-paths',
          configureServer(server: any) {
            server.middlewares.use((req: any, res: any, next: any) => {
              // Decode URL-encoded paths (e.g., %20 -> space)
              if (req.url && req.url.includes('%20')) {
                req.url = decodeURIComponent(req.url);
              }
              next();
            });
          },
        },
      ],
      server: {
        fs: {
          // Allow serving files from the project root
          allow: ['..'],
        },
      },
    });
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
