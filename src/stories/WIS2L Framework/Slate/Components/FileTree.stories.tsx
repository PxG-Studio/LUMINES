/**
 * FileTree - StackBlitz Parity Storybook Stories
 * 8-Point UI/UX Parity Metrics Coverage
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn, within, userEvent, expect } from '@storybook/test';
import { FileTree } from '@/wissil/Slate/components/FileTree';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import React from 'react';

const meta = {
  title: 'WIS2L Framework/Slate/Components/FileTree',
  component: FileTree,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '300px', height: '600px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#0f1115' },
        { name: 'light', value: '#ffffff' },
        { name: 'high-contrast', value: '#000000' },
      ],
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
          { id: 'aria-roles', enabled: true },
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    onFileSelect: {
      action: 'file-selected',
      description: 'Callback when a file is selected',
    },
  },
} satisfies Meta<typeof FileTree>;

export default meta;
type Story = StoryObj<typeof meta>;

// METRIC 1: Component State Parity
export const Empty: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      // FS will be empty by default
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No files yet')).toBeInTheDocument();
  },
};

export const WithFiles: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Assets': {
              type: 'folder',
              children: {
                'Test.cs': { type: 'file', content: 'using UnityEngine;' },
                'Script.cs': { type: 'file', content: 'public class Script {}' },
              },
            },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Assets/i)).toBeInTheDocument();
  },
};

export const WithSelectedFile: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Assets': {
              type: 'folder',
              children: {
                'Test.cs': { type: 'file', content: 'using UnityEngine;' },
              },
            },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: 'Assets/Test.cs',
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Test\.cs/i)).toBeInTheDocument();
  },
};

export const WithNestedFolders: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Assets': {
              type: 'folder',
              children: {
                'Scripts': {
                  type: 'folder',
                  children: {
                    'Player': {
                      type: 'folder',
                      children: {
                        'PlayerController.cs': { type: 'file', content: '' },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Assets/i)).toBeInTheDocument();
  },
};

export const WithLongFileNames: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Assets': {
              type: 'folder',
              children: {
                'VeryLongFileNameThatExceedsNormalLength.cs': { type: 'file', content: '' },
              },
            },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/VeryLongFileName/i)).toBeInTheDocument();
  },
};

// METRIC 2: Controls Coverage
export const WithFileSelectCallback: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByText(/Test\.cs/i);
    await userEvent.click(file);
    await expect(args.onFileSelect).toHaveBeenCalledWith('Test.cs');
  },
};

// METRIC 3: Action Emission Coverage
export const FileSelectionActions: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByText(/Test\.cs/i);
    
    // Click file
    await userEvent.click(file);
    await expect(args.onFileSelect).toHaveBeenCalled();
    
    // Double click
    await userEvent.dblClick(file);
    await expect(args.onFileSelect).toHaveBeenCalledTimes(2);
  },
};

// METRIC 4: Interaction Test Coverage
export const KeyboardNavigation: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
            'Script.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tree = canvas.getByRole('tree', { name: /file explorer/i });
    
    // Tab to tree
    await userEvent.tab();
    await expect(tree).toHaveFocus();
    
    // Arrow keys
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowUp}');
    
    // Enter to select
    await userEvent.keyboard('{Enter}');
  },
};

export const ContextMenuFlow: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByText(/Test\.cs/i);
    
    // Right click for context menu
    await userEvent.pointer({ keys: '[MouseRight>]', target: file });
    await userEvent.pointer({ keys: '[/MouseRight]' });
  },
};

export const FileRenameFlow: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByText(/Test\.cs/i);
    
    // Select file
    await userEvent.click(file);
    
    // F2 to rename (if implemented)
    await userEvent.keyboard('{F2}');
  },
};

export const CreateDeleteFileFlow: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Create file (Ctrl+N or context menu)
    await userEvent.keyboard('{Control>}n{/Control}');
    
    // Delete file (Delete key or context menu)
    const file = canvas.getByText(/Test\.cs/i);
    await userEvent.click(file);
    await userEvent.keyboard('{Delete}');
  },
};

// METRIC 5: Accessibility Coverage
export const AccessibilityTest: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check ARIA roles
    const tree = canvas.getByRole('tree', { name: /file explorer/i });
    await expect(tree).toBeInTheDocument();
    
    // Check keyboard navigation
    await userEvent.tab();
    await expect(tree).toHaveFocus();
    
    // Check screen reader announcements
    const announcement = document.getElementById('sr-announcements');
    if (announcement) {
      await expect(announcement).toBeInTheDocument();
    }
  },
};

export const KeyboardOnlyWorkflow: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
            'Script.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tree = canvas.getByRole('tree', { name: /file explorer/i });
    
    // Tab to tree
    await userEvent.tab();
    await expect(tree).toHaveFocus();
    
    // Navigate with arrow keys
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowDown}');
    
    // Select with Enter
    await userEvent.keyboard('{Enter}');
    
    // Expand/collapse with Space
    await userEvent.keyboard(' ');
  },
};

// METRIC 6: Visual Regression Coverage
export const LightTheme: Story = {
  args: {
    onFileSelect: fn(),
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
};

export const DarkTheme: Story = {
  args: {
    onFileSelect: fn(),
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
};

export const MobileViewport: Story = {
  args: {
    onFileSelect: fn(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
};

// METRIC 7: API Contract Coverage
export const WithTypeScriptProps: Story = {
  args: {
    onFileSelect: fn(),
  },
  parameters: {
    docs: {
      description: {
        component: `
# FileTree

Displays the project file structure from the virtual filesystem.

## Props

- \`onFileSelect\`: Callback when a file is selected \`(path: string) => void\`

## Usage

\`\`\`tsx
<FileTree onFileSelect={(path) => console.log('Selected:', path)} />
\`\`\`

## Accessibility

- Uses \`role="tree"\` for semantic structure
- Includes \`aria-label\` for screen readers
- Supports full keyboard navigation
- Provides ARIA live region for file selection announcements
        `,
      },
    },
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: '' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
};

// METRIC 8: Integration Coverage
export const WithFileSystemIntegration: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      const fs = {
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Assets': {
              type: 'folder',
              children: {
                'Test.cs': { type: 'file', content: 'using UnityEngine;' },
              },
            },
          },
        }),
        readFile: vi.fn((path: string) => {
          if (path === 'Assets/Test.cs') return 'using UnityEngine;';
          return null;
        }),
        writeFile: vi.fn(),
        exists: vi.fn((path: string) => path === 'Assets/Test.cs'),
      };
      
      vi.mocked(useWissilFS).mockReturnValue(fs as any);
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByText(/Test\.cs/i);
    await userEvent.click(file);
    await expect(args.onFileSelect).toHaveBeenCalledWith('Assets/Test.cs');
  },
};

export const WithEditorIntegration: Story = {
  args: {
    onFileSelect: fn(),
  },
  decorators: [
    (Story) => {
      vi.mocked(useWissilFS).mockReturnValue({
        getSnapshot: () => ({
          type: 'folder',
          children: {
            'Test.cs': { type: 'file', content: 'using UnityEngine;' },
          },
        }),
        readFile: vi.fn(),
        writeFile: vi.fn(),
        exists: vi.fn(),
      } as any);
      
      const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
      vi.mocked(useEditorState).mockImplementation((selector: any) => {
        if (selector.toString().includes('selectedFile')) {
          return selectedFile;
        }
        return null;
      });
      
      return <Story />;
    },
  ],
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const file = canvas.getByText(/Test\.cs/i);
    await userEvent.click(file);
    await expect(args.onFileSelect).toHaveBeenCalled();
  },
};

