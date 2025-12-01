/**
 * Debugger Panel Component
 * 
 * Shows active node and execution logs
 */

import React from 'react';

export interface DebuggerPanelProps {
  activeNodeId?: string;
  logs?: string[];
}

export const DebuggerPanel: React.FC<DebuggerPanelProps> = ({
  activeNodeId,
  logs = [],
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--slate-panel, #16181d)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 12,
          borderBottom: '1px solid var(--slate-border, #26292f)',
          color: 'var(--slate-text, #e4e7eb)',
          fontWeight: 'bold',
          fontSize: 13,
        }}
      >
        Debugger
      </div>

      {/* Active Node */}
      {activeNodeId && (
        <div
          style={{
            padding: 12,
            borderBottom: '1px solid var(--slate-border, #26292f)',
            background: 'rgba(63, 140, 255, 0.1)',
          }}
        >
          <div
            style={{
              color: 'var(--slate-text-muted, #9ba1aa)',
              fontSize: 11,
              marginBottom: 4,
            }}
          >
            Active Node
          </div>
          <div
            style={{
              color: 'var(--slate-accent, #3f8cff)',
              fontSize: 12,
              fontFamily: 'monospace',
            }}
          >
            {activeNodeId}
          </div>
        </div>
      )}

      {/* Logs */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 12,
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: 11,
        }}
      >
        {logs.length === 0 ? (
          <div
            style={{
              color: 'var(--slate-text-muted, #9ba1aa)',
              textAlign: 'center',
              paddingTop: 24,
            }}
          >
            No execution logs yet
          </div>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              style={{
                color: 'var(--slate-text, #e4e7eb)',
                marginBottom: 4,
                whiteSpace: 'pre-wrap',
              }}
            >
              {log}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DebuggerPanel;

