/**
 * File Tabs Storybook Stories
 * 
 * FileTabs is a re-export of Tabs, so we use the same component
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { FileTabs } from '@/editor/filesystem/FileTabs';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Filesystem/FileTabs',
  component: FileTabs,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FileTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tabs: [
      { id: '1', label: 'TurnSystem.json', dirty: false },
      { id: '2', label: 'CardLogic.json', dirty: true },
      { id: '3', label: 'GameManager.ts', dirty: false },
    ],
    activeTabId: '1',
  },
};

export const WithIcons: Story = {
  args: {
    tabs: [
      { id: '1', label: 'config.json', dirty: false, icon: '📄' },
      { id: '2', label: 'component.tsx', dirty: true, icon: '⚛️' },
      { id: '3', label: 'styles.css', dirty: false, icon: '🎨' },
    ],
    activeTabId: '2',
  },
};

export const ManyTabs: Story = {
  args: {
    tabs: [
      { id: '1', label: 'file1.ts', dirty: false },
      { id: '2', label: 'file2.ts', dirty: true },
      { id: '3', label: 'file3.ts', dirty: false },
      { id: '4', label: 'file4.ts', dirty: false },
      { id: '5', label: 'file5.ts', dirty: true },
      { id: '6', label: 'file6.ts', dirty: false },
    ],
    activeTabId: '3',
  },
};

export const AllDirty: Story = {
  args: {
    tabs: [
      { id: '1', label: 'unsaved1.json', dirty: true },
      { id: '2', label: 'unsaved2.json', dirty: true },
    ],
    activeTabId: '1',
  },
};
