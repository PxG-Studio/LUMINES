/**
 * Complete Editor Container Stories
 * 
 * Comprehensive Storybook stories for the full editor
 * With Chromatic visual regression testing
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { EditorContainer } from '@/editor/monaco/EditorContainer';
import { GitProvider } from '@/editor/git/GitProvider';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/Complete/EditorContainer',
  component: EditorContainer,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      diffThreshold: 0.01,
      delay: 2000, // Wait for editor initialization
      pauseAnimationAtEnd: true,
    },
    docs: {
      description: {
        component: `
# Complete Editor Container

The full-featured game development IDE editor with:
- Monaco Editor with IntelliSense
- File tree and tab management
- Runtime preview (WebContainer)
- Git integration
- Split editor support
- Unity integration

## Features

- **Code Editing**: Full Monaco Editor with TypeScript support
- **File Management**: Virtual file system with tree view
- **Runtime**: Live preview with WebContainer
- **Git**: Complete Git workflow integration
- **Game Dev**: Unity WebGL integration
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <GitProvider>
          <Story />
        </GitProvider>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof EditorContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default editor with sample files
export const Default: Story = {
  args: {
    initialFiles: [
      {
        path: '/src/App.tsx',
        content: `import React from 'react';

function App() {
  return (
    <div>
      <h1>Game Development IDE</h1>
      <p>Welcome to WISSIL</p>
    </div>
  );
}

export default App;`,
      },
      {
        path: '/src/components/Player.tsx',
        content: `import React from 'react';

export const Player: React.FC = () => {
  return <div>Player Component</div>;
};`,
      },
      {
        path: '/package.json',
        content: JSON.stringify({
          name: 'game-project',
          version: '1.0.0',
          dependencies: {
            react: '^18.3.0',
            unity: '^2022.3.0',
          },
        }, null, 2),
      },
    ],
    showRuntime: true,
    showGit: true,
  },
};

// Editor with runtime only
export const WithRuntime: Story = {
  args: {
    ...Default.args,
    showGit: false,
  },
};

// Editor with Git only
export const WithGit: Story = {
  args: {
    ...Default.args,
    showRuntime: false,
  },
};

// Split editor mode
export const SplitEditor: Story = {
  args: {
    ...Default.args,
    showSplitEditor: true,
  },
};

// Minimal editor (no runtime, no git)
export const Minimal: Story = {
  args: {
    ...Default.args,
    showRuntime: false,
    showGit: false,
  },
};

// Large project (performance test)
export const LargeProject: Story = {
  args: {
    initialFiles: Array.from({ length: 50 }, (_, i) => ({
      path: `/src/components/Component${i}.tsx`,
      content: `export const Component${i} = () => <div>Component ${i}</div>;`,
    })),
    showRuntime: true,
    showGit: true,
  },
  parameters: {
    chromatic: {
      diffThreshold: 0.02, // Allow more variance for large projects
    },
  },
};

