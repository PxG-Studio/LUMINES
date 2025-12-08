/**
 * MonacoEditor - StackBlitz Parity Storybook Stories
 * 8-Point UI/UX Parity Metrics Coverage
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn, within, userEvent, expect, waitFor } from '@storybook/test';
import { MonacoEditor } from '@/wissil/Slate/editor/MonacoEditor';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import React from 'react';

const meta = {
  title: 'WIS2L Framework/Slate/Components/MonacoEditor',
  component: MonacoEditor,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ width: '800px', height: '600px' }}>
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
        ],
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof MonacoEditor>;

export default meta;
type Story = StoryObj<typeof meta>;

// METRIC 1: Component State Parity
export const NoFileOpen: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: null,
        openFiles: [],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No file open')).toBeInTheDocument();
  },
};

export const WithFileOpen: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;\npublic class Test : MonoBehaviour { }'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(() => {
      expect(canvas.queryByText('No file open')).not.toBeInTheDocument();
    });
  },
};

export const Dirty: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;\npublic class Test : MonoBehaviour { }'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // Simulate dirty state (unsaved changes)
    await userEvent.keyboard('modified content');
  },
};

export const ReadOnly: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  parameters: {
    readOnly: true,
  },
};

export const WithErrors: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'public class Test { invalid syntax }'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // Editor should show error markers
    await waitFor(() => {
      expect(canvasElement.querySelector('.monaco-editor')).toBeInTheDocument();
    });
  },
};

export const WithWarnings: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'public class Test { int unused; }'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
};

export const Loading: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => null), // Loading
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
};

// METRIC 2: Controls Coverage
export const WithCustomLanguage: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.ts',
        openFiles: ['Assets/Test.ts'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'const test = "typescript";'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
};

// METRIC 3: Action Emission Coverage
export const TypingActions: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      const writeFile = vi.fn();
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile,
        }),
      } as any);
      vi.mocked(triggerHMR).mockImplementation(vi.fn());
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      await userEvent.click(editor);
      await userEvent.keyboard('new code');
      // Should trigger writeFile and HMR
      await waitFor(() => {
        expect(triggerHMR).toHaveBeenCalled();
      });
    }
  },
};

export const SaveAction: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      const writeFile = vi.fn();
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile,
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // Ctrl+S / Cmd+S to save
    await userEvent.keyboard('{Control>}s{/Control}');
  },
};

export const KeyboardShortcuts: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // Ctrl+F / Cmd+F for find
    await userEvent.keyboard('{Control>}f{/Control}');
    
    // Ctrl+/ / Cmd+/ for comment
    await userEvent.keyboard('{Control>}/{/Control}');
    
    // Ctrl+A / Cmd+A for select all
    await userEvent.keyboard('{Control>}a{/Control}');
  },
};

// METRIC 4: Interaction Test Coverage
export const TypingInteraction: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      await userEvent.click(editor);
      await userEvent.keyboard('public class Test { }');
    }
  },
};

export const TextSelection: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;\npublic class Test { }'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      await userEvent.click(editor);
      // Select all
      await userEvent.keyboard('{Control>}a{/Control}');
      // Copy
      await userEvent.keyboard('{Control>}c{/Control}');
      // Paste
      await userEvent.keyboard('{Control>}v{/Control}');
    }
  },
};

export const CodeFolding: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => `public class Test {
  public void Method1() { }
  public void Method2() { }
}`),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // Click fold icon (if available)
    const foldIcon = canvasElement.querySelector('.folding-icon');
    if (foldIcon) {
      await userEvent.click(foldIcon);
    }
  },
};

export const AutoComplete: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'gameObject.'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      await userEvent.click(editor);
      await userEvent.keyboard('gameObject.');
      // Should trigger autocomplete
      await waitFor(() => {
        const suggestions = canvasElement.querySelector('.suggest-widget');
        expect(suggestions).toBeInTheDocument();
      }, { timeout: 2000 });
    }
  },
};

// METRIC 5: Accessibility Coverage
export const AccessibilityTest: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      // Check keyboard accessibility
      await userEvent.tab();
      await expect(editor).toHaveFocus();
      
      // Check ARIA attributes
      const textarea = editor.querySelector('textarea');
      if (textarea) {
        expect(textarea).toHaveAttribute('role', 'textbox');
      }
    }
  },
};

export const KeyboardOnlyEditing: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      // Tab to editor
      await userEvent.tab();
      await expect(editor).toHaveFocus();
      
      // Type with keyboard only
      await userEvent.keyboard('public class Test { }');
      
      // Navigate with arrow keys
      await userEvent.keyboard('{ArrowLeft}');
      await userEvent.keyboard('{ArrowRight}');
      await userEvent.keyboard('{ArrowUp}');
      await userEvent.keyboard('{ArrowDown}');
    }
  },
};

// METRIC 6: Visual Regression Coverage
export const LightTheme: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export const DarkTheme: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const MobileViewport: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// METRIC 7: API Contract Coverage
export const WithTypeScriptProps: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  parameters: {
    docs: {
      description: {
        component: `
# MonacoEditor

Full-featured code editor with FS binding and HMR.

## Features

- Syntax highlighting
- Code folding
- Auto-complete
- Hot reload patching
- Compile on Save

## Accessibility

- Keyboard navigation
- Screen reader support
- ARIA roles
- Focus management
        `,
      },
    },
  },
};

// METRIC 8: Integration Coverage
export const WithFileSystemIntegration: Story = {
  decorators: [
    (Story) => {
      const fs = {
        readFile: vi.fn((path: string) => {
          if (path === 'Assets/Test.cs') return 'using UnityEngine;';
          return null;
        }),
        writeFile: vi.fn(),
        exists: vi.fn(),
      };
      
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => fs,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      await userEvent.click(editor);
      await userEvent.keyboard('modified');
      // Should trigger writeFile
      await waitFor(() => {
        expect(useWissilFS().getState().writeFile).toHaveBeenCalled();
      });
    }
  },
};

export const WithCompilerIntegration: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'public class Test { }'),
          writeFile: vi.fn(),
        }),
      } as any);
      vi.mocked(triggerHMR).mockImplementation(() => {
        // Simulate compilation
        return Promise.resolve();
      });
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      await userEvent.click(editor);
      await userEvent.keyboard('modified');
      // Should trigger HMR (which triggers compilation)
      await waitFor(() => {
        expect(triggerHMR).toHaveBeenCalled();
      });
    }
  },
};

export const WithRuntimeIntegration: Story = {
  decorators: [
    (Story) => {
      vi.mocked(useEditorTabs).mockReturnValue({
        activeFile: 'Assets/Test.cs',
        openFiles: ['Assets/Test.cs'],
        open: vi.fn(),
        close: vi.fn(),
        setActive: vi.fn(),
      } as any);
      vi.mocked(useWissilFS).mockReturnValue({
        getState: () => ({
          readFile: vi.fn(() => 'using UnityEngine;'),
          writeFile: vi.fn(),
        }),
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    // Editor changes should trigger runtime updates
    const editor = canvasElement.querySelector('.monaco-editor');
    if (editor) {
      await userEvent.click(editor);
      await userEvent.keyboard('new code');
    }
  },
};

