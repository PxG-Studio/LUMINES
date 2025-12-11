import type { Meta, StoryObj } from '@storybook/react';
import { EngineSelector } from './EngineSelector';

const meta: Meta<typeof EngineSelector> = {
  title: 'SPARK/EngineSelector',
  component: EngineSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof EngineSelector>;

export const Default: Story = {
  args: {
    selectedEngine: 'unity',
    onEngineChange: (engineId) => console.log('Selected engine:', engineId),
  },
};

export const GodotSelected: Story = {
  args: {
    selectedEngine: 'godot',
    onEngineChange: (engineId) => console.log('Selected engine:', engineId),
  },
};

