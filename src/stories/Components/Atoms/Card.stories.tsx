import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '@/design-system/primitives/Card';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

const meta = {
  title: 'Lumenforge.io Design System/Components/Atoms/Card',
  component: Card,
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
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Card content goes here',
  },
};

export const WithTitle: Story = {
  render: () => (
    <Card>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>Card Title</h3>
      <p style={{ margin: 0, opacity: 0.8 }}>This is card content with a title and some text.</p>
    </Card>
  ),
};
