/**
 * App Shell Storybook Stories
 * 
 * Complete IDE layout composition testing
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { AppShell } from '@/editor/shell/AppShell';
import { Sidebar } from '@/editor/shell/Sidebar';
import { TopBar } from '@/editor/shell/TopBar';
import { FileTree } from '@/editor/filesystem/FileTree';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/AppShell/AppShell',
  component: AppShell,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

const MockContent = () => (
  <div style={{
    padding: 16,
    color: 'var(--slate-text, #e4e7eb)',
    fontFamily: 'var(--font-mono, monospace)',
  }}>
    Editor Content Area
  </div>
);

const MockPanels = () => (
  <div style={{
    padding: 16,
    color: 'var(--slate-text, #e4e7eb)',
  }}>
    Inspector Panel
  </div>
);

export const Default: Story = {
  args: {
    sidebarVisible: true,
    panelsVisible: true,
    fullscreen: false,
    sidebar: <Sidebar />,
    topBar: <TopBar />,
    children: <MockContent />,
    panels: <MockPanels />,
  },
};

export const SidebarCollapsed: Story = {
  args: {
    sidebarVisible: false,
    panelsVisible: true,
    fullscreen: false,
    topBar: <TopBar />,
    children: <MockContent />,
    panels: <MockPanels />,
  },
};

export const PanelsHidden: Story = {
  args: {
    sidebarVisible: true,
    panelsVisible: false,
    fullscreen: false,
    sidebar: <Sidebar />,
    topBar: <TopBar />,
    children: <MockContent />,
  },
};

export const Fullscreen: Story = {
  args: {
    sidebarVisible: false,
    panelsVisible: false,
    fullscreen: true,
    topBar: <TopBar />,
    children: <MockContent />,
  },
};

export const Minimal: Story = {
  args: {
    sidebarVisible: false,
    panelsVisible: false,
    fullscreen: false,
    topBar: <TopBar />,
    children: <MockContent />,
  },
};

export const WithFileTree: Story = {
  args: {
    sidebarVisible: true,
    panelsVisible: true,
    fullscreen: false,
    sidebar: <FileTree />,
    topBar: <TopBar />,
    children: <MockContent />,
    panels: <MockPanels />,
  },
};

export const Loading: Story = {
  args: {
    sidebarVisible: true,
    panelsVisible: true,
    fullscreen: false,
    sidebar: (
      <div style={{ padding: 16, color: 'var(--slate-text-muted, #9ba1aa)' }}>
        Loading sidebar...
      </div>
    ),
    topBar: <TopBar />,
    children: (
      <div style={{ 
        padding: 16, 
        color: 'var(--slate-text-muted, #9ba1aa)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%'
      }}>
        <div>Loading editor...</div>
      </div>
    ),
    panels: (
      <div style={{ padding: 16, color: 'var(--slate-text-muted, #9ba1aa)' }}>
        Loading panels...
      </div>
    ),
  },
};

