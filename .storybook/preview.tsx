/**
 * Storybook Preview Configuration
 * 
 * Comprehensive configuration for game development IDE components
 * Includes Chromatic settings, viewports, themes, and accessibility
 */

import type { Preview } from '@storybook/react';
import React from 'react';
import { ThemeProvider } from '../src/design-system/themes/ThemeProvider';
import '../src/styles/globals.css';
import '../src/styles/editor.css';

const preview: Preview = {
  parameters: {
    // Chromatic Configuration
    chromatic: {
      // Visual regression testing settings
      diffThreshold: 0.01, // 1% pixel difference tolerance
      delay: 1000, // Wait 1s for animations/transitions
      pauseAnimationAtEnd: true, // Pause animations at end for consistent screenshots
      viewports: [375, 768, 1280, 1920], // Mobile, Tablet, Desktop, Wide
      modes: {
        // Dark mode (default for game dev IDE)
        dark: {
          backgrounds: {
            default: 'dark',
          },
        },
        // Light mode
        light: {
          backgrounds: {
            default: 'light',
          },
        },
        // High contrast (accessibility)
        highContrast: {
          backgrounds: {
            default: 'dark',
          },
        },
      },
      // Disable snapshots for complex interactive stories
      disableSnapshot: false,
    },

    // Viewport Configuration
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile',
          styles: {
            width: '375px',
            height: '667px',
          },
        },
        tablet: {
          name: 'Tablet',
          styles: {
            width: '768px',
            height: '1024px',
          },
        },
        desktop: {
          name: 'Desktop',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
        wide: {
          name: 'Wide',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
        // Game dev specific viewports
        unityEditor: {
          name: 'Unity Editor',
          styles: {
            width: '1920px',
            height: '1080px',
          },
        },
        gamePreview: {
          name: 'Game Preview',
          styles: {
            width: '1280px',
            height: '720px',
          },
        },
      },
      defaultViewport: 'desktop',
    },

    // Backgrounds
    backgrounds: {
      default: 'dark',
      values: [
        {
          name: 'dark',
          value: '#0f1115', // SLATE dark background
        },
        {
          name: 'light',
          value: '#ffffff',
        },
        {
          name: 'game-dev',
          value: '#1a1a1a', // Unity-style dark
        },
      ],
    },

    // Layout
    layout: 'fullscreen',

    // Actions (for event logging)
    actions: { argTypesRegex: '^on[A-Z].*' },

    // Controls
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    // Accessibility
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
          {
            id: 'keyboard-navigation',
            enabled: true,
          },
          {
            id: 'aria-required-attr',
            enabled: true,
          },
        ],
      },
    },

    // Docs
    docs: {
      toc: true,
      source: {
        type: 'code',
      },
    },
  },

  // Global decorators
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'dark';
      
      return (
        <ThemeProvider theme={theme}>
          <div
            style={{
              minHeight: '100vh',
              background: theme === 'dark' ? '#0f1115' : '#ffffff',
              color: theme === 'dark' ? '#e4e7eb' : '#1a1a1a',
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      );
    },
  ],

  // Global types
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'dark', title: 'Dark' },
          { value: 'light', title: 'Light' },
          { value: 'high-contrast', title: 'High Contrast' },
        ],
        dynamicTitle: true,
      },
    },
  },
};

export default preview;

