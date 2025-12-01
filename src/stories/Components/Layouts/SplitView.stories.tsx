import type { Meta, StoryObj } from '@storybook/react';
import { SplitView } from '@/design-system/primitives/SplitView';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';
import { Panel } from '@/design-system/primitives/Panel';

const meta = {
  title: 'Lumenforge.io Design System/Components/Layouts/SplitView',
  component: SplitView,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '24px', background: 'var(--nv-bg-0)', height: '500px' }}>
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
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SplitView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <SplitView direction="horizontal" initial={250} min={150} max={400}>
      <Panel>Left Panel</Panel>
      <Panel>Right Panel</Panel>
    </SplitView>
  ),
};

export const Vertical: Story = {
  render: () => (
    <SplitView direction="vertical" initial={200} min={100} max={300}>
      <Panel>Top Panel</Panel>
      <Panel>Bottom Panel</Panel>
    </SplitView>
  ),
};
