/**
 * File Preview Storybook Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FilePreview } from '@/editor/filesystem/FilePreview';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Filesystem/FilePreview',
  component: FilePreview,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const JavaScript: Story = {
  args: {
    fileName: 'example.js',
    language: 'javascript',
    content: `function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet('World');
console.log(message);`,
  },
};

export const JSON: Story = {
  args: {
    fileName: 'config.json',
    language: 'json',
    content: `{
  "name": "wissil",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build"
  }
}`,
  },
};

export const TypeScript: Story = {
  args: {
    fileName: 'types.ts',
    language: 'typescript',
    content: `interface User {
  id: string;
  name: string;
  email: string;
}

function createUser(data: Partial<User>): User {
  return {
    id: crypto.randomUUID(),
    name: data.name || 'Anonymous',
    email: data.email || '',
  };
}`,
  },
};

export const Empty: Story = {
  args: {
    fileName: 'empty.txt',
    language: 'text',
    content: '',
  },
};

export const LongContent: Story = {
  args: {
    fileName: 'large-file.js',
    language: 'javascript',
    content: Array(50).fill(0).map((_, i) => 
      `// Line ${i + 1}\nconst item${i} = { id: ${i}, value: 'Item ${i}' };`
    ).join('\n\n'),
  },
};

