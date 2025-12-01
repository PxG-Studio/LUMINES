/**
 * Tabs Storybook Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Tabs } from '@/editor/shell/Tabs';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/AppShell/Tabs',
  component: Tabs,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { id: '1', label: 'Untitled-1', dirty: true },
      { id: '2', label: 'file.json', dirty: false },
      { id: '3', label: 'component.tsx', dirty: false },
    ],
    activeTabId: '1',
  },
};

export const MultipleTabs: Story = {
  args: {
    tabs: [
      { id: '1', label: 'AppShell.tsx', dirty: false, icon: '📄' },
      { id: '2', label: 'CommandPalette.tsx', dirty: true, icon: '📄' },
      { id: '3', label: 'Sidebar.tsx', dirty: false, icon: '📄' },
      { id: '4', label: 'Tabs.tsx', dirty: false, icon: '📄' },
      { id: '5', label: 'TopBar.tsx', dirty: true, icon: '📄' },
    ],
    activeTabId: '2',
  },
};

export const AllClean: Story = {
  args: {
    tabs: [
      { id: '1', label: 'saved-file.json', dirty: false },
      { id: '2', label: 'component.tsx', dirty: false },
    ],
    activeTabId: '1',
  },
};

export const AllDirty: Story = {
  args: {
    tabs: [
      { id: '1', label: 'unsaved-1.tsx', dirty: true },
      { id: '2', label: 'unsaved-2.tsx', dirty: true },
      { id: '3', label: 'unsaved-3.tsx', dirty: true },
    ],
    activeTabId: '1',
  },
};

export const SingleTab: Story = {
  args: {
    tabs: [
      { id: '1', label: 'file.json', dirty: false },
    ],
    activeTabId: '1',
  },
};

export const LongTabNames: Story = {
  args: {
    tabs: [
      { id: '1', label: 'very-long-file-name-that-should-truncate.tsx', dirty: true },
      { id: '2', label: 'another-extremely-long-file-name.json', dirty: false },
    ],
    activeTabId: '1',
  },
};

