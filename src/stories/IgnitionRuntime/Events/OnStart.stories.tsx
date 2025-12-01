/**
 * Runtime Event Mock Stories - OnStart
 */

import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs';

const RuntimeEventMock = ({ 
  event = 'OnStart',
  payload = {},
  repeat = false,
  interval = 1000
}: { 
  event?: string;
  payload?: any;
  repeat?: boolean;
  interval?: number;
}) => {
  const [triggered, setTriggered] = useState(0);

  useEffect(() => {
    if (repeat) {
      const timer = setInterval(() => {
        setTriggered(prev => prev + 1);
      }, interval);
      return () => clearInterval(timer);
    } else {
      setTriggered(1);
    }
  }, [repeat, interval]);

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
  title: 'Lumenforge.io Design System/WIS2L Framework/Ignition/Runtime/Events/OnStart',
  component: RuntimeEventMock,
  parameters: {
    layout: 'padded',
    chromatic: { disable: true }, // Disable for dynamic events
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RuntimeEventMock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Event: Story = {
  args: {
    event: 'OnStart',
    payload: { sceneId: 'main', timestamp: Date.now() },
  },
};

export const WithPayload: Story = {
  args: {
    event: 'OnStart',
    payload: { 
      sceneId: 'game', 
      gameObjects: 42,
      components: 156
    },
  },
};

