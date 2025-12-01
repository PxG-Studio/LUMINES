import type { Meta, StoryObj } from '@storybook/nextjs';
import { Panel } from '@/design-system/primitives/Panel';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

const meta = {
  title: 'Lumenforge.io Design System/Components/Atoms/Panel',
  component: Panel,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ padding: '24px', background: 'var(--nv-bg-0)' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Panel content',
  },
};

export const WithTitle: Story = {
  args: {
    title: 'Panel Title',
    children: 'This panel has a title',
  },
};

export const Collapsible: Story = {
  args: {
    title: 'Collapsible Panel',
    collapsible: true,
    children: 'You can collapse and expand this panel',
  },
};
