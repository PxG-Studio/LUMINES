/**
 * Editor Shell Storybook Stories
 * 
 * Complete IDE layout composition testing
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

// Mock components for now - will be replaced with actual components
const EditorShell = ({ 
  sidebarVisible = true, 
  panelsVisible = true,
  fullscreen = false 
}: { 
  sidebarVisible?: boolean;
  panelsVisible?: boolean;
  fullscreen?: boolean;
}) => (
  <div style={{ 
    display: 'flex', 
    height: '100vh', 
    background: 'var(--slate-bg, #0f1115)',
    fontFamily: 'var(--font-primary, system-ui)'
  }}>
    {sidebarVisible && !fullscreen && (
      <div style={{ 
        width: 250, 
        background: 'var(--slate-panel, #16181d)',
        borderRight: '1px solid var(--slate-border, #26292f)'
      }}>
        Sidebar
      </div>
    )}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div style={{ 
        height: 40, 
        background: 'var(--slate-panel, #16181d)',
        borderBottom: '1px solid var(--slate-border, #26292f)'
      }}>
        Top Bar
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ flex: 1, padding: 16 }}>
          Editor Canvas
        </div>
        {panelsVisible && !fullscreen && (
          <div style={{ 
            width: 300, 
            background: 'var(--slate-panel, #16181d)',
            borderLeft: '1px solid var(--slate-border, #26292f)'
          }}>
            Panels
          </div>
        )}
      </div>
    </div>
  </div>
);

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/AppShell/EditorShell',
  component: EditorShell,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof EditorShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sidebarVisible: true,
    panelsVisible: true,
    fullscreen: false,
  },
};

export const SidebarCollapsed: Story = {
  args: {
    sidebarVisible: false,
    panelsVisible: true,
    fullscreen: false,
  },
};

export const PanelsHidden: Story = {
  args: {
    sidebarVisible: true,
    panelsVisible: false,
    fullscreen: false,
  },
};

export const Fullscreen: Story = {
  args: {
    sidebarVisible: false,
    panelsVisible: false,
    fullscreen: true,
  },
};

export const Minimal: Story = {
  args: {
    sidebarVisible: false,
    panelsVisible: false,
    fullscreen: false,
  },
};

