import type { Meta, StoryObj } from '@storybook/react';
import { UnityAssetManager } from './UnityAssetManager';
import { within, expect } from '@storybook/test';

const meta: Meta<typeof UnityAssetManager> = {
  title: 'LumenForge/WIS2L Framework/SLATE/Unity Asset Manager',
  component: UnityAssetManager,
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
    },
    docs: {
      description: {
        component: `
# Unity Asset Manager

Complete asset management system for Unity files within SLATE.

## Features

- **Upload Mode**: Drag & drop Unity assets (.prefab, .mat, .cs, .fbx, .png, .shader, etc.)
- **Preview Mode**: View asset details, dependencies, and content
- **Deconstruct Mode**: Break down assets into components and properties
- **Reconstruct Mode**: Modify and export assets in JSON or Unity package format

## Supported File Types

- Prefabs (.prefab)
- Materials (.mat)
- Scripts (.cs, .shader)
- Textures (.png, .jpg, .tga)
- Meshes (.fbx, .obj, .blend)
- Unity Packages (.unitypackage)
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const UploadMode: Story = {
  args: {
    mode: 'upload',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/Drag & drop Unity assets/i)).toBeInTheDocument();

    await expect(canvas.getByText(/Supports:/i)).toBeInTheDocument();
  },
};

export const PreviewMode: Story = {
  args: {
    mode: 'preview',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/Assets/i)).toBeInTheDocument();

    const previewButton = canvas.getByRole('button', { name: /preview/i });
    await expect(previewButton).toHaveStyle({
      background: expect.stringContaining('linear-gradient'),
    });
  },
};

export const DeconstructMode: Story = {
  args: {
    mode: 'deconstruct',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/Assets/i)).toBeInTheDocument();

    const deconstructButton = canvas.getByRole('button', { name: /deconstruct/i });
    await expect(deconstructButton).toHaveStyle({
      background: expect.stringContaining('linear-gradient'),
    });
  },
};

export const ReconstructMode: Story = {
  args: {
    mode: 'reconstruct',
  },
  parameters: {
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/Assets/i)).toBeInTheDocument();

    const reconstructButton = canvas.getByRole('button', { name: /reconstruct/i });
    await expect(reconstructButton).toHaveStyle({
      background: expect.stringContaining('linear-gradient'),
    });
  },
};

export const MobileView: Story = {
  args: {
    mode: 'upload',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
};

export const TabletView: Story = {
  args: {
    mode: 'preview',
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
};

export const WideScreenView: Story = {
  args: {
    mode: 'preview',
  },
  parameters: {
    viewport: {
      defaultViewport: 'wideScreen',
    },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: false }],
      },
    },
  },
};
