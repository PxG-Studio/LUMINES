/**
 * SplitView - StackBlitz Parity Storybook Stories
 * 8-Point UI/UX Parity Metrics Coverage
 */

import type { Meta, StoryObj } from '@storybook/react';
import { within, userEvent, expect } from '@storybook/test';
import { SplitView } from '@/design-system/primitives/SplitView';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import { InspectorPanel } from '@/wis2l/Slate/components/InspectorPanel';
import { FileTree } from '@/wis2l/Slate/components/FileTree';

const meta = {
  title: 'WIS2L Framework/Slate/Components/SplitView',
  component: SplitView,
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
    direction: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Split direction',
    },
    initial: {
      control: { type: 'number', min: 0, max: 1000, step: 10 },
      description: 'Initial panel size in pixels',
    },
    min: {
      control: { type: 'number', min: 0, max: 500, step: 10 },
      description: 'Minimum panel size',
    },
    max: {
      control: { type: 'number', min: 100, max: 2000, step: 10 },
      description: 'Maximum panel size',
    },
    children: {
      control: false,
      description: 'Two child components to split',
    },
  },
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

// METRIC 1: Component State Parity
export const Vertical: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    initial: 200,
    min: 100,
    max: 500,
    children: [
      <div key="top" style={{ padding: '20px', background: '#1a1a1a' }}>Top Panel</div>,
      <div key="bottom" style={{ padding: '20px', background: '#2a2a2a' }}>Bottom Panel</div>,
    ],
  },
};

export const AtMinimum: Story = {
  args: {
    direction: 'vertical',
    initial: 150,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
};

export const AtMaximum: Story = {
  args: {
    direction: 'vertical',
    initial: 800,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
};

// METRIC 2: Controls Coverage - All props are covered in argTypes

// METRIC 3: Action Emission Coverage
export const ResizeActions: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByRole('separator');
    
    // Drag separator
    await userEvent.pointer({
      keys: '[MouseLeft>]',
      target: separator,
      coords: { x: 300, y: 0 },
    });
    await userEvent.pointer({
      keys: '[MouseLeft]',
      target: separator,
      coords: { x: 400, y: 0 },
    });
  },
};

// METRIC 4: Interaction Test Coverage
export const DragResize: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByRole('separator');
    
    // Drag to resize
    await userEvent.pointer({
      keys: '[MouseLeft>]',
      target: separator,
    });
    await userEvent.pointer({
      keys: '[MouseLeft]',
      target: separator,
      coords: { x: 400, y: 0 },
    });
  },
};

export const KeyboardResize: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByRole('separator');
    
    // Tab to separator
    await userEvent.tab();
    await expect(separator).toHaveFocus();
    
    // Arrow keys to resize
    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowLeft}');
    await userEvent.keyboard('{ArrowUp}');
    await userEvent.keyboard('{ArrowDown}');
    
    // Home/End for min/max
    await userEvent.keyboard('{Home}');
    await userEvent.keyboard('{End}');
  },
};

// METRIC 5: Accessibility Coverage
export const AccessibilityTest: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const separator = canvas.getByRole('separator');
    
    // Check ARIA attributes
    expect(separator).toHaveAttribute('aria-orientation');
    expect(separator).toHaveAttribute('aria-label');
    expect(separator).toHaveAttribute('aria-valuemin');
    expect(separator).toHaveAttribute('aria-valuemax');
    expect(separator).toHaveAttribute('aria-valuenow');
    
    // Check keyboard accessibility
    await userEvent.tab();
    await expect(separator).toHaveFocus();
  },
};

// METRIC 6: Visual Regression Coverage
export const LightTheme: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#f0f0f0' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#ffffff' }}>Right Panel</div>,
    ],
  },
  parameters: {
    backgrounds: {
      default: 'light',
    },
  },
};

export const DarkTheme: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

export const MobileViewport: Story = {
  args: {
    direction: 'vertical',
    initial: 150,
    min: 100,
    max: 300,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// METRIC 7: API Contract Coverage
export const WithTypeScriptProps: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>Left Panel</div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>Right Panel</div>,
    ],
  },
  parameters: {
    docs: {
      description: {
        component: `
# SplitView

Draggable divider component for resizable panels.

## Props

- \`direction\`: Split direction ('horizontal' | 'vertical')
- \`initial\`: Initial panel size in pixels
- \`min\`: Minimum panel size
- \`max\`: Maximum panel size
- \`children\`: Two child components to split

## Usage

\`\`\`tsx
<SplitView direction="vertical" initial={300} min={150} max={800}>
  <LeftPanel />
  <RightPanel />
</SplitView>
\`\`\`

## Accessibility

- Uses \`role="separator"\` for semantic structure
- Includes ARIA attributes (orientation, label, value)
- Supports full keyboard navigation
- Focus management
        `,
      },
    },
  },
};

// METRIC 8: Integration Coverage
export const WithPanelIntegration: Story = {
  args: {
    direction: 'vertical',
    initial: 300,
    min: 150,
    max: 800,
    children: [
      <div key="left" style={{ padding: '20px', background: '#1a1a1a' }}>
        <InspectorPanel />
      </div>,
      <div key="right" style={{ padding: '20px', background: '#2a2a2a' }}>
        <FileTree />
      </div>,
    ],
  },
};


