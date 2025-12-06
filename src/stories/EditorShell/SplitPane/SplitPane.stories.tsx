/**
 * Split Pane Storybook Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { SplitPane } from '@/editor/shell/SplitPane';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/Editor/AppShell/SplitPane',
  component: SplitPane,
  parameters: {
    layout: 'fullscreen',
    chromatic: { 
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true
    }
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SplitPane>;

export default meta;
type Story = StoryObj<typeof meta>;

const LeftPane = () => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'var(--slate-panel, #16181d)',
    padding: 16,
    color: 'var(--slate-text, #e4e7eb)'
  }}>
    Left Pane
  </div>
);

const RightPane = () => (
  <div style={{
    width: '100%',
    height: '100%',
    background: 'var(--slate-bg, #0f1115)',
    padding: 16,
    color: 'var(--slate-text, #e4e7eb)'
  }}>
    Right Pane
  </div>
);

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    defaultSize: 50,
    children: [<LeftPane key="left" />, <RightPane key="right" />],
  },
};

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    defaultSize: 50,
    children: [<LeftPane key="top" />, <RightPane key="bottom" />],
  },
};

export const LeftHeavy: Story = {
  args: {
    direction: 'horizontal',
    defaultSize: 70,
    children: [<LeftPane key="left" />, <RightPane key="right" />],
  },
};

export const RightHeavy: Story = {
  args: {
    direction: 'horizontal',
    defaultSize: 30,
    children: [<LeftPane key="left" />, <RightPane key="right" />],
  },
};

