/**
 * Sidebar Storybook Stories
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Sidebar } from '@/editor/shell/Sidebar';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/AppShell/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveWrapper = (args: any) => {
  const [collapsed, setCollapsed] = useState(args.collapsed || false);
  const [activeId, setActiveId] = useState(args.activeItemId);
  
  return (
    <Sidebar
      {...args}
      collapsed={collapsed}
      activeItemId={activeId}
      onToggleCollapse={() => setCollapsed(!collapsed)}
      onItemClick={(id) => setActiveId(id)}
    />
  );
};

export const Expanded: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    collapsed: false,
    items: [
      { id: 'files', label: 'Files', icon: '📁' },
      { id: 'search', label: 'Search', icon: '🔍' },
      { id: 'source-control', label: 'Source Control', icon: '📦', badge: '3' },
      { id: 'extensions', label: 'Extensions', icon: '🧩' },
    ],
    activeItemId: 'files',
  },
};

export const Collapsed: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    collapsed: true,
    items: [
      { id: 'files', label: 'Files', icon: '📁' },
      { id: 'search', label: 'Search', icon: '🔍' },
      { id: 'source-control', label: 'Source Control', icon: '📦', badge: '3' },
      { id: 'extensions', label: 'Extensions', icon: '🧩' },
    ],
  },
};

export const WithBadges: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    collapsed: false,
    items: [
      { id: 'files', label: 'Files', icon: '📁' },
      { id: 'search', label: 'Search', icon: '🔍', badge: '12' },
      { id: 'source-control', label: 'Source Control', icon: '📦', badge: '3' },
      { id: 'extensions', label: 'Extensions', icon: '🧩', badge: '1' },
    ],
    activeItemId: 'search',
  },
};

export const ManyItems: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    collapsed: false,
    items: [
      { id: 'files', label: 'Files', icon: '📁' },
      { id: 'search', label: 'Search', icon: '🔍' },
      { id: 'source-control', label: 'Source Control', icon: '📦' },
      { id: 'extensions', label: 'Extensions', icon: '🧩' },
      { id: 'debug', label: 'Debug', icon: '🐛' },
      { id: 'output', label: 'Output', icon: '📤' },
      { id: 'terminal', label: 'Terminal', icon: '💻' },
      { id: 'problems', label: 'Problems', icon: '⚠️', badge: '5' },
    ],
    activeItemId: 'files',
  },
};
