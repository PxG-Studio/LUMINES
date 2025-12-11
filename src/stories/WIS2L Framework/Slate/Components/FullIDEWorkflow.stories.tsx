/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * Full IDE Workflow - StackBlitz Parity Integration Story
 * METRIC 8: Integration Coverage - Complete IDE lifecycle
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn, within, userEvent, expect, waitFor } from '@storybook/test';
import { SlateLayout } from '@/wis2l/Slate/SlateLayout';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import React from 'react';

const meta = {
  title: 'WIS2L Framework/Slate/Full IDE/Complete Workflow',
  component: SlateLayout,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '100vw', height: '100vh' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    chromatic: {
      diffThreshold: 0.01,
      pauseAnimationAtEnd: true,
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'keyboard-navigation', enabled: true },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onFileSelect: {
      action: 'file-selected',
    },
    onTabSelect: {
      action: 'tab-selected',
    },
    onTabClose: {
      action: 'tab-closed',
    },
    onRun: {
      action: 'run',
    },
    onRestart: {
      action: 'restart',
    },
    onStop: {
      action: 'stop',
    },
  },
} satisfies Meta<typeof SlateLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// METRIC 8: Integration Coverage - Full IDE Workflow
export const CompleteWorkflow: Story = {
  args: {
    onFileSelect: fn(),
    onTabSelect: fn(),
    onTabClose: fn(),
    onRun: fn(),
    onRestart: fn(),
    onStop: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Step 1: Select file from tree
    const fileTree = canvas.getByRole('tree', { name: /file explorer/i });
    await userEvent.click(fileTree);
    
    // Step 2: File opens in editor
    await waitFor(() => {
      expect(args.onFileSelect).toHaveBeenCalled();
    });
    
    // Step 3: Type code
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      await userEvent.click(editor);
      await userEvent.keyboard('using UnityEngine;');
    }
    
    // Step 4: Save (Ctrl+S)
    await userEvent.keyboard('{Control>}s{/Control}');
    
    // Step 5: Run
    const runButton = canvas.getByRole('button', { name: /run/i });
    await userEvent.click(runButton);
    await expect(args.onRun).toHaveBeenCalled();
  },
};

export const FileManagementWorkflow: Story = {
  args: {
    onFileSelect: fn(),
    onTabSelect: fn(),
    onTabClose: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Create file
    await userEvent.keyboard('{Control>}n{/Control}');
    
    // Rename file
    const file = canvas.getByText(/new file/i);
    await userEvent.click(file);
    await userEvent.keyboard('{F2}');
    await userEvent.keyboard('Test.cs{Enter}');
    
    // Delete file
    await userEvent.keyboard('{Delete}');
  },
};

export const BuildDeployWorkflow: Story = {
  args: {
    onRun: fn(),
    onRestart: fn(),
    onStop: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    
    // Build
    const buildButton = canvas.getByRole('button', { name: /build/i });
    await userEvent.click(buildButton);
    
    // Deploy
    const deployButton = canvas.getByRole('button', { name: /deploy/i });
    await userEvent.click(deployButton);
  },
};


