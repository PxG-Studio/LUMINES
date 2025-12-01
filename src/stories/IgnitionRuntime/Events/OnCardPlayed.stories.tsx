/**
 * Runtime Event Mock Stories - OnCardPlayed
 */

import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const RuntimeEventMock = ({ 
  event = 'OnCardPlayed',
  payload = {
    cardId: 'card-001',
    cardName: 'Knight',
    playerId: 'player-1',
    position: { x: 2, y: 3 }
  }
}: { 
  event?: string;
  payload?: any;
}) => {
  const [triggered, setTriggered] = useState(0);

  return (
    <div style={{
      padding: 16,
      background: 'var(--slate-panel, #16181d)',
      border: '1px solid var(--slate-border, #26292f)',
      borderRadius: 8,
      fontFamily: 'var(--font-mono, monospace)',
      fontSize: 12
    }}>
      <div style={{ color: 'var(--slate-accent, #3f8cff)', marginBottom: 8 }}>
        🎮 Runtime Event: {event}
      </div>
      <div style={{ color: 'var(--slate-text-muted, #9ba1aa)', marginBottom: 8 }}>
        Triggered: {triggered} time{triggered !== 1 ? 's' : ''}
      </div>
      <button
        onClick={() => setTriggered(prev => prev + 1)}
        style={{
          padding: '8px 16px',
          background: 'var(--slate-accent, #3f8cff)',
          border: 'none',
          borderRadius: 4,
          color: 'white',
          cursor: 'pointer',
          marginBottom: 12
        }}
      >
        Trigger Event
      </button>
      <pre style={{
        background: 'var(--slate-bg, #0f1115)',
        padding: 8,
        borderRadius: 4,
        color: 'var(--slate-text, #e4e7eb)',
        overflow: 'auto'
      }}>
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
};

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Ignition/Runtime/Events/OnCardPlayed',
  component: RuntimeEventMock,
  parameters: {
    layout: 'padded',
    chromatic: { disable: true },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RuntimeEventMock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Event: Story = {
  args: {},
};

