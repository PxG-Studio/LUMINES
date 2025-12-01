/**
 * Top Bar Storybook Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { TopBar } from '@/editor/shell/TopBar';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/AppShell/TopBar',
  component: TopBar,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'WISSIL IDE',
    menuItems: [
      { id: 'file', label: 'File' },
      { id: 'edit', label: 'Edit' },
      { id: 'view', label: 'View' },
      { id: 'run', label: 'Run' },
      { id: 'help', label: 'Help' },
    ],
    showCommandPalette: true,
    showSaveIndicator: false,
  },
};

export const WithSaveIndicator: Story = {
  args: {
    title: 'WISSIL IDE',
    menuItems: [
      { id: 'file', label: 'File' },
      { id: 'edit', label: 'Edit' },
      { id: 'view', label: 'View' },
    ],
    showCommandPalette: true,
    showSaveIndicator: true,
  },
};

export const WithoutCommandPalette: Story = {
  args: {
    title: 'WISSIL IDE',
    menuItems: [
      { id: 'file', label: 'File' },
      { id: 'edit', label: 'Edit' },
    ],
    showCommandPalette: false,
    showSaveIndicator: false,
  },
};

export const CustomTitle: Story = {
  args: {
    title: 'My Project - WISSIL',
    menuItems: [
      { id: 'file', label: 'File' },
      { id: 'edit', label: 'Edit' },
      { id: 'view', label: 'View' },
      { id: 'run', label: 'Run' },
      { id: 'help', label: 'Help' },
    ],
    showCommandPalette: true,
    showSaveIndicator: false,
  },
};

export const Minimal: Story = {
  args: {
    title: 'WISSIL',
    menuItems: [
      { id: 'file', label: 'File' },
    ],
    showCommandPalette: false,
    showSaveIndicator: false,
  },
};
