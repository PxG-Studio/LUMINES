import type { Meta, StoryObj } from '@storybook/nextjs';
import { Button } from '@/design-system/primitives/Button';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

const meta = {
  title: 'Lumenforge.io Design System/Components/Atoms/Button',
  component: Button,
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
  argTypes: {
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'default',
    onClick: () => console.log('Button clicked!'),
  },
};

export const Accent: Story = {
  args: {
    children: 'Accent Button',
    variant: 'accent',
    onClick: () => console.log('Accent button clicked!'),
  },
};

export const Ghost: Story = {
  args: {
    children: 'Ghost Button',
    variant: 'ghost',
    onClick: () => console.log('Ghost button clicked!'),
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
    onClick: () => console.log('This should not fire'),
  },
};
