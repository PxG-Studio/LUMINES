/**
 * WISSIL Hub Storybook Configuration
 * 
 * Central aggregator that loads all federated subsystems
 */

import { mergeConfig } from 'vite';
import federation from "@originjs/vite-plugin-federation";
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../src/**/*.mdx",
  ],
  
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  
  features: {
    storyStoreV7: true,
    buildStoriesJson: true,
  },
  
  viteFinal: async (config) => {
    return mergeConfig(config, {
      plugins: [
        federation({
          name: "wissil_hub",
          remotes: {
            slate: process.env.SLATE_REMOTE_URL || "http://localhost:4311/assets/remoteEntry.js",
            ignis: process.env.IGNIS_REMOTE_URL || "http://localhost:4312/assets/remoteEntry.js",
            spark: process.env.SPARK_REMOTE_URL || "http://localhost:4313/assets/remoteEntry.js",
            ignition: process.env.IGNITION_REMOTE_URL || "http://localhost:4314/assets/remoteEntry.js",
            unitytools: process.env.UNITY_TOOLS_REMOTE_URL || "http://localhost:4315/assets/remoteEntry.js",
            waypoint: process.env.WAYPOINT_REMOTE_URL || "http://localhost:4316/assets/remoteEntry.js"
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
      build: {
        target: "esnext",
        minify: false,
        cssCodeSplit: false
      }
    });
  }
};

export default config;

