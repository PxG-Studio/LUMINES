/**
 * Runtime Event Mock Component
 * 
 * Simulates Unity runtime events
 */

import React, { useEffect, useState } from 'react';

export interface RuntimeEventMockProps {
  event?: string;
  payload?: any;
  repeat?: boolean;
  interval?: number;
  onEvent?: (event: string, payload: any) => void;
}

export const RuntimeEventMock: React.FC<RuntimeEventMockProps> = ({
  event = 'OnStart',
  payload = {},
  repeat = false,
  interval = 1000,
  onEvent,
}) => {
  const [triggered, setTriggered] = useState(0);
  const [lastPayload, setLastPayload] = useState(payload);

  useEffect(() => {
    if (repeat) {
      const timer = setInterval(() => {
        const newPayload = { ...payload, timestamp: Date.now() };
        setTriggered((prev) => prev + 1);
        setLastPayload(newPayload);
        onEvent?.(event, newPayload);
      }, interval);
      return () => clearInterval(timer);
    } else {
      setTriggered(1);
      setLastPayload(payload);
      onEvent?.(event, payload);
    }
  }, [event, payload, repeat, interval, onEvent]);

  return (
    <div
      style={{
        padding: 16,
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: 12,
      }}
    >
      <div
        style={{
          color: 'var(--slate-accent, #3f8cff)',
          marginBottom: 8,
          fontWeight: 'bold',
        }}
      >
        🎮 Runtime Event: {event}
      </div>
      <div
        style={{
          color: 'var(--slate-text-muted, #9ba1aa)',
          marginBottom: 8,
          fontSize: 11,
        }}
      >
        Triggered: {triggered} time{triggered !== 1 ? 's' : ''}
        {repeat && ` (every ${interval}ms)`}
      </div>
      <pre
        style={{
          background: 'var(--slate-bg, #0f1115)',
          padding: 8,
          borderRadius: 4,
          color: 'var(--slate-text, #e4e7eb)',
          overflow: 'auto',
          fontSize: 11,
        }}
      >
        {JSON.stringify(lastPayload, null, 2)}
      </pre>
    </div>
  );
};

export default RuntimeEventMock;

