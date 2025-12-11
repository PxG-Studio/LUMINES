/**
 * Console Output Component
 * 
 * Displays runtime console output (stdout, stderr)
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Terminal, X, Trash2 } from 'lucide-react';

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info' | 'debug';
  message: string;
  timestamp: Date;
}

export interface ConsoleOutputProps {
  messages?: ConsoleMessage[];
  onClear?: () => void;
  maxMessages?: number;
  showTimestamp?: boolean;
  autoScroll?: boolean;
}

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  messages = [],
  onClear,
  maxMessages = 1000,
  showTimestamp = true,
  autoScroll = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'all' | 'log' | 'error' | 'warn' | 'info'>('all');

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // Filter messages
  const filteredMessages = messages.filter((msg) => {
    if (filter === 'all') return true;
    return msg.type === filter;
  });

  // Limit messages
  const displayMessages = filteredMessages.slice(-maxMessages);

  const getMessageColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return '#ef4444';
      case 'warn':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      case 'debug':
        return '#8b5cf6';
      default:
        return 'var(--slate-text, #e4e7eb)';
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--slate-bg, #0f1115)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--slate-panel, #16181d)',
          borderBottom: '1px solid var(--slate-border, #26292f)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Terminal size={14} style={{ color: 'var(--slate-text-muted, #9ba1aa)' }} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--slate-text, #e4e7eb)',
            }}
          >
            Console
          </span>
          <span
            style={{
              fontSize: 11,
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          >
            ({displayMessages.length})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Filter Buttons */}
          {(['all', 'log', 'error', 'warn', 'info'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              style={{
                padding: '2px 6px',
                background: filter === type ? 'var(--slate-accent, #3f8cff)' : 'transparent',
                border: '1px solid var(--slate-border, #26292f)',
                borderRadius: 4,
                color: filter === type ? '#FFFFFF' : 'var(--slate-text-muted, #9ba1aa)',
                cursor: 'pointer',
                fontSize: 10,
                textTransform: 'capitalize',
              }}
            >
              {type}
            </button>
          ))}

          {/* Clear Button */}
          <button
            onClick={onClear}
            style={{
              padding: '4px 8px',
              background: 'transparent',
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              color: 'var(--slate-text-muted, #9ba1aa)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 11,
            }}
            title="Clear console"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 8,
          fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
          fontSize: 12,
          lineHeight: 1.5,
        }}
      >
        {displayMessages.length === 0 ? (
          <div
            style={{
              color: 'var(--slate-text-muted, #9ba1aa)',
              fontSize: 12,
              textAlign: 'center',
              padding: 20,
            }}
          >
            No console messages
          </div>
        ) : (
          displayMessages.map((msg, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                gap: 8,
                padding: '2px 0',
                color: getMessageColor(msg.type),
              }}
            >
              {showTimestamp && (
                <span
                  style={{
                    color: 'var(--slate-text-muted, #9ba1aa)',
                    fontSize: 11,
                    minWidth: 80,
                  }}
                >
                  {formatTimestamp(msg.timestamp)}
                </span>
              )}
              <span style={{ flex: 1, wordBreak: 'break-word' }}>{msg.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConsoleOutput;

