import type { Meta, StoryObj } from '@storybook/react';
import { FileTree } from './FileTree';

const meta: Meta<typeof FileTree> = {
  title: 'SPARK/FileTree',
  component: FileTree,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FileTree>;

export const Default: Story = {
  args: {
    rootPath: '/',
    onFileSelect: (path) => console.log('Selected file:', path),
    onFileCreate: (path, type) => console.log('Create:', type, path),
    onFileDelete: (path) => console.log('Delete:', path),
  },
};

