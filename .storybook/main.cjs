// Storybook main config (CommonJS) to avoid ESM/require loader issues
const path = require('path');

/** @type {import('@storybook/nextjs').StorybookConfig} */
module.exports = {
  stories: [
    '../src/wissil/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/stories/WIS2L Framework/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/stories/WIS2L Framework/**/*.mdx',
    '../src/stories/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
    '../src/stories/**/*.mdx',
    '../src/stories/Editor/**/*.stories.@(js|jsx|mjs|ts|tsx|mdx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-actions',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
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
      '@storybook/addon-docs/dist/mdx-react-shim.js': path.resolve(
        __dirname,
        '../node_modules/@storybook/addon-docs/dist/mdx-react-shim.js'
      ),
    };
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
  logLevel: 'warn',
};

