/**
 * Waypoint AI Suggestions Panel Stories
 */

import React from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

const AISuggestionsPanel = ({ 
  suggestions = [
    "Add Branch node after GetPosition",
    "Connect flow from SetPosition to PlaySound",
    "Graph missing return value - add output node",
    "Consider adding error handling for null checks"
  ],
  loading = false
}: { 
  suggestions?: string[];
  loading?: boolean;
}) => (
  <div style={{
    width: 300,
    background: 'var(--slate-panel, #16181d)',
    border: '1px solid var(--slate-border, #26292f)',
    borderRadius: 8,
    padding: 16
  }}>
    <div style={{
      color: 'var(--slate-accent, #3f8cff)',
      fontWeight: 'bold',
      marginBottom: 12,
      fontSize: 14
    }}>
      🤖 LUNA Suggestions
    </div>
    {loading ? (
      <div style={{ color: 'var(--slate-text-muted, #9ba1aa)' }}>
        Generating suggestions...
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {suggestions.map((suggestion, i) => (
          <div
            key={i}
            style={{
              padding: 12,
              background: 'var(--slate-bg, #0f1115)',
              borderRadius: 4,
              border: '1px solid var(--slate-border, #26292f)',
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 12,
              cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--slate-panel, #16181d)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
            }}
          >
            {suggestion}
          </div>
        ))}
      </div>
    )}
  </div>
);

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Waypoint/AI Suggestions/AISuggestions',
  component: AISuggestionsPanel,
  parameters: {
    layout: 'padded',
    chromatic: { diffThreshold: 0.01 },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof AISuggestionsPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    suggestions: [],
  },
};

