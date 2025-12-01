/**
 * Scene Graph Stories
 * 
 * Storybook stories for Unity scene hierarchy
 * With Chromatic visual regression testing
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SceneGraph, SceneNode } from '@/editor/gamedev/SceneGraph';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/GameDev/SceneGraph',
  component: SceneGraph,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      diffThreshold: 0.01,
      delay: 500,
    },
    docs: {
      description: {
        component: `
# Scene Graph

Visual representation of Unity scene hierarchy, similar to Unity's Hierarchy panel.

## Features

- **Hierarchy Tree**: Expandable/collapsible scene tree
- **Node Selection**: Select scene nodes
- **Type Icons**: Visual indicators for different node types
- **Active/Inactive**: Visual distinction for active/inactive objects
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ height: '600px', width: '300px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof SceneGraph>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleScene: SceneNode = {
  id: 'root',
  name: 'Main Scene',
  type: 'GameObject',
  active: true,
  children: [
    {
      id: 'camera',
      name: 'Main Camera',
      type: 'Camera',
      active: true,
    },
    {
      id: 'light',
      name: 'Directional Light',
      type: 'Light',
      active: true,
    },
    {
      id: 'player',
      name: 'Player',
      type: 'GameObject',
      active: true,
      children: [
        {
          id: 'player-mesh',
          name: 'PlayerMesh',
          type: 'Mesh',
          active: true,
        },
        {
          id: 'player-collider',
          name: 'Collider',
          type: 'GameObject',
          active: true,
        },
      ],
    },
    {
      id: 'enemies',
      name: 'Enemies',
      type: 'GameObject',
      active: true,
      children: [
        {
          id: 'enemy-1',
          name: 'Enemy 1',
          type: 'GameObject',
          active: true,
        },
        {
          id: 'enemy-2',
          name: 'Enemy 2',
          type: 'GameObject',
          active: false,
        },
      ],
    },
  ],
};

// Default scene graph
export const Default: Story = {
  args: {
    root: sampleScene,
  },
};

// Empty scene
export const Empty: Story = {
  args: {
    root: undefined,
  },
};

// With handlers
export const WithHandlers: Story = {
  args: {
    root: sampleScene,
    onNodeSelect: (node) => {
      console.log('Selected node:', node);
    },
    onNodeToggle: (node) => {
      console.log('Toggled node:', node);
    },
  },
};

// Loading state
export const Loading: Story = {
  args: {
    root: undefined,
  },
  render: () => (
    <div style={{
      padding: 16,
      color: 'var(--slate-text-muted, #9ba1aa)',
      fontStyle: 'italic'
    }}>
      <div style={{ marginBottom: 8 }}>Loading scene graph...</div>
      <div style={{ fontSize: 12, opacity: 0.7 }}>Connecting to Unity runtime</div>
    </div>
  ),
};

// Error state
export const Error: Story = {
  args: {
    root: undefined,
  },
  render: () => (
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
        ⚠️ Error loading scene graph
      </div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        Failed to connect to Unity runtime
      </div>
      <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4 }}>
        Check Unity WebGL build is running
      </div>
    </div>
  ),
};

