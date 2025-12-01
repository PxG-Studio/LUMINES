/**
 * Monaco Editor Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { MonacoEditor } from '@/editor/monaco/MonacoEditor';
import { EditorContainer } from '@/editor/monaco/EditorContainer';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/MonacoEditor/MonacoEditor',
  component: MonacoEditor,
  parameters: {
    layout: 'fullscreen',
    chromatic: { diffThreshold: 0.01 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MonacoEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filePath: '/example.ts',
    language: 'typescript',
    height: '600px',
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#0A0A0A' }}>
      <MonacoEditor {...args} />
    </div>
  ),
};

export const JavaScript: Story = {
  args: {
    filePath: '/example.js',
    language: 'javascript',
    height: '600px',
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#0A0A0A' }}>
      <MonacoEditor {...args} />
    </div>
  ),
};

export const TypeScript: Story = {
  args: {
    filePath: '/example.tsx',
    language: 'typescript',
    height: '600px',
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#0A0A0A' }}>
      <MonacoEditor {...args} />
    </div>
  ),
};

export const JSON: Story = {
  args: {
    filePath: '/config.json',
    language: 'json',
    height: '600px',
  },
  render: (args) => (
    <div style={{ height: '100vh', background: '#0A0A0A' }}>
      <MonacoEditor {...args} />
    </div>
  ),
};

export const FullEditorContainer: Story = {
  render: () => (
    <EditorContainer
      initialFiles={[
        { path: '/src/App.tsx', content: 'export default function App() {\n  return <div>Hello</div>;\n}' },
        { path: '/src/index.ts', content: 'console.log("Hello World");' },
        { path: '/package.json', content: '{\n  "name": "my-app",\n  "version": "1.0.0"\n}' },
      ]}
    />
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ 
      height: '100vh', 
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ba1aa',
      fontFamily: 'monospace'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: 8 }}>Loading Monaco Editor...</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Initializing editor instance</div>
      </div>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div style={{ 
      height: '100vh', 
      background: '#0A0A0A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#ef4444',
      fontFamily: 'monospace'
    }}>
      <div style={{ 
        textAlign: 'center',
        background: 'rgba(220, 38, 38, 0.1)',
        border: '1px solid rgba(220, 38, 38, 0.3)',
        borderRadius: 4,
        padding: 16
      }}>
        <div style={{ fontWeight: 'bold', marginBottom: 8 }}>
          ⚠️ Editor Error
        </div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Failed to load file: /example.ts
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 8 }}>
          File not found or access denied
        </div>
      </div>
    </div>
  ),
};

