/**
 * Waypoint AI Explainer Panel Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

const AIExplainerPanel = ({ 
  explanation = "This node adds two numbers together. It takes two float inputs (A and B) and outputs their sum (Result). Use this node for basic arithmetic operations in your blueprint."
}: { 
  explanation?: string;
}) => (
  <div style={{
    width: 400,
    background: 'var(--slate-panel, #16181d)',
    border: '1px solid var(--slate-border, #26292f)',
    borderRadius: 8,
    padding: 16
  }}>
    <div style={{
      color: 'var(--slate-accent, #3f8cff)',
      fontWeight: 'bold',
      marginBottom: 12,
      fontSize: 14,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }}>
      🤖 LUNA Explanation
    </div>
    <div style={{
      color: 'var(--slate-text, #e4e7eb)',
      fontSize: 13,
      lineHeight: 1.6,
      marginBottom: 12
    }}>
      {explanation}
    </div>
    <div style={{
      display: 'flex',
      gap: 8
    }}>
      <button style={{
        padding: '6px 12px',
        background: 'var(--slate-accent, #3f8cff)',
        border: 'none',
        borderRadius: 4,
        color: 'white',
        cursor: 'pointer',
        fontSize: 12
      }}>
        Copy
      </button>
      <button style={{
        padding: '6px 12px',
        background: 'transparent',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 4,
        color: 'var(--slate-text, #e4e7eb)',
        cursor: 'pointer',
        fontSize: 12
      }}>
        More Details
      </button>
    </div>
  </div>
);

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Waypoint/AI Explain/AIExplain',
  component: AIExplainerPanel,
  parameters: {
    layout: 'padded',
    chromatic: { diffThreshold: 0.01 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AIExplainerPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

