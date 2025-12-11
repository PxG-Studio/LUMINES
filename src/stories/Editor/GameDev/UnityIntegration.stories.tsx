/**
 * Unity Integration Stories
 * 
 * Storybook stories for Unity game development integration
 * With Chromatic visual regression testing
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { UnityIntegration } from '@/editor/gamedev/UnityIntegration';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/GameDev/UnityIntegration',
  component: UnityIntegration,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      diffThreshold: 0.02, // Allow more variance for Unity runtime
      delay: 3000, // Wait for Unity to load
      pauseAnimationAtEnd: true,
    },
    docs: {
      description: {
        component: `
# Unity Integration

Integration with Unity WebGL runtime for game development.

## Features

- **Unity WebGL Loading**: Loads Unity builds in the browser
- **Play/Stop Controls**: Control game execution
- **Scene Reload**: Reload Unity scenes
- **Progress Tracking**: Shows loading progress

## Usage

\`\`\`tsx
<UnityIntegration
  buildUrl="/unity/Build"
  loaderUrl="/unity/Build.loader.js"
  onReady={(instance) => {
    // Unity is ready
    instance.SendMessage('GameManager', 'Play');
  }}
/>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ height: '100vh', width: '100vw' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof UnityIntegration>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default Unity integration
export const Default: Story = {
  args: {
    buildUrl: '/unity/Build',
    loaderUrl: '/unity/Build.loader.js',
  },
  parameters: {
    chromatic: {
      disableSnapshot: true, // Unity canvas is dynamic
    },
  },
};

// Unity with custom handlers
export const WithHandlers: Story = {
  args: {
    ...Default.args,
    onReady: (instance) => {
      console.log('Unity ready:', instance);
    },
    onProgress: (progress) => {
      console.log('Loading progress:', progress);
    },
    onError: (error) => {
      console.error('Unity error:', error);
    },
  },
  parameters: {
    chromatic: {
      disableSnapshot: true,
    },
  },
};

// Loading state
export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    chromatic: {
      delay: 500, // Capture loading state
    },
  },
};

