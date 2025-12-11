/**
 * Command Palette Storybook Stories
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { CommandPalette } from '@/editor/shell/CommandPalette';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/AppShell/CommandPalette',
  component: CommandPalette,
  parameters: {
    layout: 'centered',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof CommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

const InteractiveWrapper = (args: any) => {
  const [visible, setVisible] = useState(args.visible || false);
  
  return (
    <>
      <button 
        onClick={() => setVisible(true)}
        style={{
          padding: '8px 16px',
          background: '#3f8cff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Open Command Palette
      </button>
      <CommandPalette
        {...args}
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    visible: true,
    commands: [
      { id: 'new-file', label: 'New File', category: 'File' },
      { id: 'save', label: 'Save', category: 'File', shortcut: 'Ctrl+S' },
      { id: 'open-file', label: 'Open File', category: 'File' },
      { id: 'command-palette', label: 'Show Command Palette', category: 'View', shortcut: 'Ctrl+P' },
      { id: 'toggle-sidebar', label: 'Toggle Sidebar', category: 'View' },
    ],
  },
};

export const WithSearch: Story = {
  render: (args) => <InteractiveWrapper {...args} />,
  args: {
    visible: true,
    commands: [
      { id: 'new-file', label: 'New File', category: 'File' },
      { id: 'save', label: 'Save', category: 'File', shortcut: 'Ctrl+S' },
      { id: 'open-file', label: 'Open File', category: 'File' },
      { id: 'search', label: 'Search', category: 'Edit', shortcut: 'Ctrl+F' },
      { id: 'replace', label: 'Replace', category: 'Edit', shortcut: 'Ctrl+H' },
    ],
  },
};

export const Empty: Story = {
  args: {
    visible: true,
    commands: [],
  },
};

export const Hidden: Story = {
  args: {
    visible: false,
  },
};

