/**
 * Spark Template Preview Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

const TemplatePreview = ({ 
  templateId = 'card_turn_core',
  template = {
    id: 'card_turn_core',
    name: 'Card Turn Core',
    description: 'Complete turn-based card game template',
    category: 'Game Templates',
    difficulty: 'intermediate',
    tags: ['card-game', 'turn-based', 'strategy'],
    nodeCount: 24,
    connectionCount: 18
  }
}: { 
  templateId?: string;
  template?: any;
}) => (
  <div style={{
    padding: 16,
    background: 'var(--slate-panel, #16181d)',
    border: '1px solid var(--slate-border, #26292f)',
    borderRadius: 8
  }}>
    <div style={{
      color: 'var(--slate-accent, #3f8cff)',
      fontWeight: 'bold',
      fontSize: 18,
      marginBottom: 8
    }}>
      {template.name}
    </div>
    <div style={{
      color: 'var(--slate-text-muted, #9ba1aa)',
      marginBottom: 16,
      fontSize: 14
    }}>
      {template.description}
    </div>
    <div style={{
      display: 'flex',
      gap: 8,
      marginBottom: 16,
      flexWrap: 'wrap'
    }}>
      {template.tags.map((tag: string) => (
        <span
          key={tag}
          style={{
            padding: '4px 8px',
            background: 'var(--slate-bg, #0f1115)',
            borderRadius: 4,
            fontSize: 11,
            color: 'var(--slate-text, #e4e7eb)'
          }}
        >
          {tag}
        </span>
      ))}
    </div>
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 12,
      fontSize: 12,
      color: 'var(--slate-text-muted, #9ba1aa)'
    }}>
      <div>Nodes: {template.nodeCount}</div>
      <div>Connections: {template.connectionCount}</div>
      <div>Category: {template.category}</div>
      <div>Difficulty: {template.difficulty}</div>
    </div>
  </div>
);

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Spark/Templates/CardGameTemplate',
  component: TemplatePreview,
  parameters: {
    layout: 'padded',
    chromatic: { diffThreshold: 0.01 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TemplatePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

