/**
 * Dark Mode Theme Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

const ThemePreview = ({ theme = 'dark' }: { theme?: 'dark' | 'light' | 'high-contrast' }) => {
  const themeVars = {
    dark: {
      bg: '#0f1115',
      panel: '#16181d',
      border: '#26292f',
      text: '#e4e7eb',
      textMuted: '#9ba1aa',
      accent: '#3f8cff'
    },
    light: {
      bg: '#ffffff',
      panel: '#f5f5f5',
      border: '#e0e0e0',
      text: '#1a1a1a',
      textMuted: '#666666',
      accent: '#0066cc'
    },
    'high-contrast': {
      bg: '#000000',
      panel: '#1a1a1a',
      border: '#ffffff',
      text: '#ffffff',
      textMuted: '#cccccc',
      accent: '#00ffff'
    }
  };

  const vars = themeVars[theme];

  return (
    <div style={{
      padding: 24,
      background: vars.bg,
      border: `2px solid ${vars.border}`,
      borderRadius: 8,
      color: vars.text,
      fontFamily: 'system-ui'
    }}>
      <div style={{
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 16,
        color: vars.accent
      }}>
        {theme.charAt(0).toUpperCase() + theme.slice(1).replace('-', ' ')} Theme
      </div>
      <div style={{
        padding: 16,
        background: vars.panel,
        borderRadius: 4,
        border: `1px solid ${vars.border}`,
        marginBottom: 12
      }}>
        Panel Background
      </div>
      <div style={{ color: vars.textMuted, fontSize: 14 }}>
        Muted text color
      </div>
    </div>
  );
};

const meta = {
  title: 'Lumenforge.io Design System/Foundations/Themes/DarkMode',
  component: ThemePreview,
  parameters: {
    layout: 'padded',
    chromatic: { diffThreshold: 0.01 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ThemePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dark: Story = {
  args: {
    theme: 'dark',
  },
};
