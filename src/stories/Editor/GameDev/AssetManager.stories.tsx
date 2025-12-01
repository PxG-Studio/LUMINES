/**
 * Asset Manager Stories
 * 
 * Storybook stories for game asset management
 * With Chromatic visual regression testing
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { AssetManager, GameAsset } from '@/editor/gamedev/AssetManager';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

const meta = {
  title: 'Lumenforge.io Design System/Application Pages/GameDev/AssetManager',
  component: AssetManager,
  parameters: {
    layout: 'fullscreen',
    chromatic: {
      diffThreshold: 0.01,
      delay: 1000,
    },
    docs: {
      description: {
        component: `
# Asset Manager

Manages game assets (textures, models, audio, scripts) for Unity and game development.

## Features

- **Asset Browser**: Grid and list view modes
- **Type Filtering**: Filter by asset type
- **Search**: Search assets by name
- **Upload**: Upload new assets
- **Thumbnails**: Visual preview of assets
        `,
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ height: '600px', width: '100%' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof AssetManager>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleAssets: GameAsset[] = [
  {
    id: '1',
    name: 'player_texture.png',
    type: 'texture',
    path: '/Assets/Textures/player_texture.png',
    size: 1024 * 512,
    lastModified: new Date(),
    thumbnail: 'https://via.placeholder.com/120x80?text=Texture',
  },
  {
    id: '2',
    name: 'enemy_model.fbx',
    type: 'model',
    path: '/Assets/Models/enemy_model.fbx',
    size: 1024 * 1024 * 5,
    lastModified: new Date(),
  },
  {
    id: '3',
    name: 'background_music.mp3',
    type: 'audio',
    path: '/Assets/Audio/background_music.mp3',
    size: 1024 * 1024 * 3,
    lastModified: new Date(),
  },
  {
    id: '4',
    name: 'PlayerController.cs',
    type: 'script',
    path: '/Assets/Scripts/PlayerController.cs',
    size: 1024 * 2,
    lastModified: new Date(),
  },
  {
    id: '5',
    name: 'MainScene.unity',
    type: 'scene',
    path: '/Assets/Scenes/MainScene.unity',
    size: 1024 * 50,
    lastModified: new Date(),
  },
];

// Default asset manager
export const Default: Story = {
  args: {
    assets: sampleAssets,
  },
};

// Empty state
export const Empty: Story = {
  args: {
    assets: [],
  },
};

// Large asset list (performance test)
export const LargeList: Story = {
  args: {
    assets: Array.from({ length: 100 }, (_, i) => ({
      id: `asset-${i}`,
      name: `asset_${i}.png`,
      type: 'texture' as const,
      path: `/Assets/Textures/asset_${i}.png`,
      size: 1024 * 512,
      lastModified: new Date(),
    })),
  },
  parameters: {
    chromatic: {
      diffThreshold: 0.02,
    },
  },
};

// With handlers
export const WithHandlers: Story = {
  args: {
    assets: sampleAssets,
    onAssetSelect: (asset) => {
      console.log('Selected asset:', asset);
    },
    onAssetUpload: (files) => {
      console.log('Uploading files:', files);
    },
    onAssetDelete: (asset) => {
      console.log('Deleting asset:', asset);
    },
  },
};

