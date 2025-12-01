/**
 * File Tree Storybook Stories
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FileTree } from '@/editor/filesystem/FileTree';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Filesystem/FileTree',
  component: FileTree,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileTree>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveWrapper = (args: any) => {
  const [expanded, setExpanded] = useState<Set<string>>(
    new Set(args.defaultExpanded || ['Blueprints'])
  );
  
  return (
    <FileTree
      {...args}
      expandedPaths={expanded}
      onFileSelect={(path) => console.log('Selected:', path)}
    />
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    files: [
      {
        name: 'Blueprints',
        type: 'folder',
        path: '/Blueprints',
        children: [
          { name: 'TurnSystem.json', type: 'file', path: '/Blueprints/TurnSystem.json' },
          { name: 'CardLogic.json', type: 'file', path: '/Blueprints/CardLogic.json' },
        ],
      },
      {
        name: 'Templates',
        type: 'folder',
        path: '/Templates',
        children: [],
      },
      {
        name: 'Assets',
        type: 'folder',
        path: '/Assets',
        children: [
          {
            name: 'Sprites',
            type: 'folder',
            path: '/Assets/Sprites',
            children: [],
          },
        ],
      },
    ],
    defaultExpanded: ['Blueprints'],
  },
};

export const DeepNesting: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    files: [
      {
        name: 'src',
        type: 'folder',
        path: '/src',
        children: [
          {
            name: 'components',
            type: 'folder',
            path: '/src/components',
            children: [
              {
                name: 'ui',
                type: 'folder',
                path: '/src/components/ui',
                children: [
                  { name: 'Button.tsx', type: 'file', path: '/src/components/ui/Button.tsx' },
                  { name: 'Card.tsx', type: 'file', path: '/src/components/ui/Card.tsx' },
                ],
              },
            ],
          },
        ],
      },
    ],
    defaultExpanded: ['src', 'src/components', 'src/components/ui'],
  },
};

export const ManyFiles: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    files: [
      {
        name: 'Blueprints',
        type: 'folder',
        path: '/Blueprints',
        children: Array.from({ length: 20 }, (_, i) => ({
          name: `Blueprint${i + 1}.json`,
          type: 'file' as const,
          path: `/Blueprints/Blueprint${i + 1}.json`,
        })),
      },
    ],
    defaultExpanded: ['Blueprints'],
  },
};

export const Empty: Story = {
  args: {
    files: [],
  },
};

export const Loading: Story = {
  args: {
    files: [],
  },
  render: (args) => (
    <div style={{
      padding: 16,
      color: 'var(--slate-text-muted, #9ba1aa)',
      fontStyle: 'italic'
    }}>
      <div style={{ marginBottom: 8 }}>Loading file tree...</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>Scanning filesystem</div>
    </div>
  ),
};

export const Error: Story = {
  args: {
    files: [],
  },
  render: (args) => (
    <div style={{
      padding: 16,
      background: 'rgba(220, 38, 38, 0.1)',
      border: '1px solid rgba(220, 38, 38, 0.3)',
      borderRadius: 4,
      color: 'var(--slate-text, #e4e7eb)'
    }}>
      <div style={{ 
        color: '#ef4444', 
        fontWeight: 'bold', 
        marginBottom: 8 
      }}>
        ⚠️ Error loading file tree
      </div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        Failed to read directory: /project
      </div>
    </div>
  ),
};
