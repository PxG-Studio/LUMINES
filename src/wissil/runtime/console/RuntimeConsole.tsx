/**
 * Runtime Console Component
 * 
 * Multi-tab console for logs, timeline, and events
 */

import React, { useState } from 'react';

type Tab = 'console' | 'timeline' | 'events';

interface LogEntry {
  timestamp: number;
  level: 'log' | 'warn' | 'error' | 'info';
  message: string;
  data?: any;
}

function ConsoleView() {
  const [logs] = useState<LogEntry[]>([
    { timestamp: Date.now(), level: 'info', message: 'Unity WebGL runtime initialized' },
    { timestamp: Date.now() + 100, level: 'log', message: 'Blueprint graph loaded' },
  ]);

  return (
    <div style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "12px" }}>
      {logs.map((log, i) => (
        <div 
          key={i}
          style={{
            padding: "4px 8px",
            color: log.level === 'error' ? '#ff6b6b' : 
                   log.level === 'warn' ? '#ffaa44' : 
                   'var(--slate-text)',
            borderLeft: `2px solid ${
              log.level === 'error' ? '#ff6b6b' : 
              log.level === 'warn' ? '#ffaa44' : 
              'var(--slate-border)'
            }`,
            marginBottom: "2px"
          }}
        >
          <span style={{ color: "var(--slate-text-muted)" }}>
            [{new Date(log.timestamp).toLocaleTimeString()}]
          </span> {log.message}
        </div>
      ))}
    </div>
  );
}

function TimelineView() {
  return (
    <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>
      Timeline view - Animation and blueprint execution timeline
    </div>
  );
}

function EventLogView() {
  return (
    <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>
      Event log - Blueprint events, runtime errors, Unity signals
    </div>
  );
}

export function RuntimeConsole() {
  const [activeTab, setActiveTab] = useState<Tab>('console');

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{
        display: "flex",
        borderBottom: "1px solid var(--slate-border)",
        background: "var(--slate-panel)"
      }}>
        {(['console', 'timeline', 'events'] as Tab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              background: activeTab === tab ? "var(--slate-bg)" : "transparent",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid var(--slate-accent)" : "none",
              color: activeTab === tab ? "var(--slate-text)" : "var(--slate-text-muted)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: activeTab === tab ? 600 : 400
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      
      <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
        {activeTab === 'console' && <ConsoleView />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'events' && <EventLogView />}
      </div>
    </div>
  );
}

