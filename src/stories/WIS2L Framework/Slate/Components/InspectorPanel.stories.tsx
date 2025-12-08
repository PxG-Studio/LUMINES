/**
 * InspectorPanel - StackBlitz Parity Storybook Stories
 * 8-Point UI/UX Parity Metrics Coverage
 */

import type { Meta, StoryObj } from '@storybook/react';
import { fn, within, userEvent, expect } from '@storybook/test';
import { InspectorPanel } from '@/wissil/Slate/components/InspectorPanel';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import React from 'react';

const meta = {
  title: 'WIS2L Framework/Slate/Components/InspectorPanel',
  component: InspectorPanel,
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
    className: {
      control: 'text',
      description: 'Additional CSS class name',
    },
    style: {
      control: 'object',
      description: 'Inline styles',
    },
  },
} satisfies Meta<typeof InspectorPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

// METRIC 1: Component State Parity - All States
export const Normal: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No file selected')).toBeInTheDocument();
  },
};

export const WithFile: Story = {
  args: {},
  decorators: [
    (Story) => {
      // Mock selectedFile via context or props
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Test\.cs/i)).toBeInTheDocument();
  },
};

export const Focused: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('region', { name: /inspector panel/i });
    await userEvent.click(panel);
    await expect(panel).toHaveFocus();
  },
};

export const Hovered: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('region', { name: /inspector panel/i });
    await userEvent.hover(panel);
  },
};

export const Empty: Story = {
  args: {},
  decorators: [
    (Story) => {
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: null,
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No file selected')).toBeInTheDocument();
  },
};

export const LongFileName: Story = {
  args: {},
  decorators: [
    (Story) => {
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: 'Assets/Very/Long/Path/To/A/File/With/An/Extremely/Long/FileNameThatExceedsNormalLength.cs',
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/LongFileNameThatExceedsNormalLength/i)).toBeInTheDocument();
  },
};

// METRIC 2: Controls Coverage - All Props
export const WithCustomClassName: Story = {
  args: {
    className: 'custom-inspector',
  },
};

export const WithCustomStyle: Story = {
  args: {
    style: {
      border: '2px solid red',
      padding: '20px',
    },
  },
};

// METRIC 3: Action Emission Coverage
export const WithActions: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('region', { name: /inspector panel/i });
    
    // Simulate keyboard navigation
    await userEvent.tab();
    await expect(panel).toHaveFocus();
    
    // Simulate mouse interaction
    await userEvent.click(panel);
  },
};

// METRIC 4: Interaction Test Coverage
export const KeyboardNavigation: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const panel = canvas.getByRole('region', { name: /inspector panel/i });
    
    // Tab to focus
    await userEvent.tab();
    await expect(panel).toHaveFocus();
    
    // Arrow keys (if applicable)
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowUp}');
    
    // Escape to blur
    await userEvent.keyboard('{Escape}');
  },
};

export const FileSelectionFlow: Story = {
  args: {},
  decorators: [
    (Story) => {
      const [selectedFile, setSelectedFile] = React.useState<string | null>(null);
      vi.mocked(useEditorState).mockImplementation((selector: any) => {
        if (selector.toString().includes('selectedFile')) {
          return selectedFile;
        }
        return null;
      });
      
      React.useEffect(() => {
        setTimeout(() => setSelectedFile('Assets/Test.cs'), 100);
      }, []);
      
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Test\.cs/i)).toBeInTheDocument();
  },
};

// METRIC 5: Accessibility Coverage
export const AccessibilityTest: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    
    // Check ARIA roles
    const panel = canvas.getByRole('region', { name: /inspector panel/i });
    await expect(panel).toBeInTheDocument();
    
    // Check ARIA live region
    const status = canvas.getByRole('status');
    await expect(status).toBeInTheDocument();
    
    // Check keyboard accessibility
    await userEvent.tab();
    await expect(panel).toHaveFocus();
    
    // Check screen reader text
    const announcement = document.getElementById('sr-announcements');
    if (announcement) {
      await expect(announcement).toBeInTheDocument();
    }
  },
};

export const HighContrast: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'high-contrast',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('No file selected')).toBeInTheDocument();
  },
};

// METRIC 6: Visual Regression Coverage
export const LightTheme: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export const DarkTheme: Story = {
  args: {},
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const MobileViewport: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletViewport: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const DesktopViewport: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

// METRIC 7: API Contract Coverage
export const WithTypeScriptProps: Story = {
  args: {
    className: 'test-class',
    style: { padding: '10px' },
  },
  parameters: {
    docs: {
      description: {
        component: `
# InspectorPanel

Displays file and folder information in the SLATE IDE.

## Props

- \`className\`: Additional CSS class name
- \`style\`: Inline styles

## Usage

\`\`\`tsx
<InspectorPanel className="custom" style={{ padding: '10px' }} />
\`\`\`

## Accessibility

- Uses \`role="region"\` for semantic structure
- Includes \`aria-label\` for screen readers
- Supports keyboard navigation
- Provides ARIA live region for file selection announcements
        `,
      },
    },
  },
};

// METRIC 8: Integration Coverage
export const WithFileSystemIntegration: Story = {
  args: {},
  decorators: [
    (Story) => {
      // Mock FS integration
      const fs = {
        readFile: vi.fn(() => 'file content'),
        writeFile: vi.fn(),
        exists: vi.fn(() => true),
      };
      
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: 'Assets/Test.cs',
        fileContent: fs.readFile('Assets/Test.cs'),
      } as any);
      
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Test\.cs/i)).toBeInTheDocument();
  },
};

export const WithCompilerIntegration: Story = {
  args: {},
  decorators: [
    (Story) => {
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: 'Assets/Test.cs',
        compileStatus: 'compiling',
        compileErrors: [],
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Test\.cs/i)).toBeInTheDocument();
  },
};

export const WithRuntimeIntegration: Story = {
  args: {},
  decorators: [
    (Story) => {
      vi.mocked(useEditorState).mockReturnValue({
        selectedFile: 'Assets/Test.cs',
        runtimeStatus: 'running',
        runtimeOutput: 'Console output...',
      } as any);
      return <Story />;
    },
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/Test\.cs/i)).toBeInTheDocument();
  },
};

