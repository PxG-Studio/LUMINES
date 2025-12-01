/**
 * Runtime Event Mock Stories - OnUpdate (Animated)
 */

import React, { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const RuntimeEventMock = ({ 
  event = 'OnUpdate',
  payload = {},
  repeat = true,
  interval = 16 // ~60fps
}: { 
  event?: string;
  payload?: any;
  repeat?: boolean;
  interval?: number;
}) => {
  const [triggered, setTriggered] = useState(0);
  const [deltaTime, setDeltaTime] = useState(0.016);

  useEffect(() => {
    if (repeat) {
      const timer = setInterval(() => {
        setTriggered(prev => prev + 1);
        setDeltaTime(Math.random() * 0.02 + 0.014);
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
        Frames: {triggered} | Delta: {deltaTime.toFixed(4)}s
      </div>
      <pre style={{
        background: 'var(--slate-bg, #0f1115)',
        padding: 8,
        borderRadius: 4,
        color: 'var(--slate-text, #e4e7eb)',
        overflow: 'auto'
      }}>
        {JSON.stringify({ ...payload, deltaTime }, null, 2)}
      </pre>
    </div>
  );
};

const meta = {
  title: 'Lumenforge.io Design System/WIS2L Framework/Ignition/Runtime/Events/OnUpdate',
  component: RuntimeEventMock,
  parameters: {
    layout: 'padded',
    chromatic: { disable: true }, // Disable for animated events
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RuntimeEventMock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Event: Story = {
  args: {
    event: 'OnUpdate',
    payload: {},
    repeat: true,
    interval: 16,
  },
};

