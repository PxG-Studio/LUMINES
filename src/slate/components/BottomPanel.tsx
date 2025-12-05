import React, { useState } from 'react';
import { Terminal, FileText, AlertCircle, X } from 'lucide-react';
import { lumenForgeColors, transitions } from '../../design-system/tokens';

interface LogEntry {
  type: 'info' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

interface BottomPanelProps {
  logs?: LogEntry[];
  onClear?: () => void;
}

const mockLogs: LogEntry[] = [
  { type: 'info', message: 'System initialized', timestamp: '10:23:45' },
  { type: 'info', message: 'Loading assets...', timestamp: '10:23:46' },
  { type: 'warning', message: 'Asset cache not found, rebuilding', timestamp: '10:23:47' },
  { type: 'info', message: 'Build complete', timestamp: '10:23:50' },
];

const mockErrors: LogEntry[] = [
  { type: 'error', message: 'NullReferenceException at Player.cs:45', timestamp: '10:24:12' },
  { type: 'error', message: 'Failed to load texture: missing_tex.png', timestamp: '10:24:15' },
];

export const BottomPanel: React.FC<BottomPanelProps> = ({ logs = mockLogs, onClear }) => {
  const [activeTab, setActiveTab] = useState<'console' | 'logs' | 'errors'>('console');

  const getTabContent = () => {
    switch (activeTab) {
      case 'console':
        return (
          <div style={{ padding: '1rem' }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                color: lumenForgeColors.text.secondary,
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: lumenForgeColors.accent.secondary }}>{'>'}</span> SLATE Console
                v1.0
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ color: lumenForgeColors.text.tertiary }}>
                  Type 'help' for available commands
                </span>
              </div>
              <div>
                <span style={{ color: lumenForgeColors.accent.secondary }}>{'>'}</span>
                <span
                  style={{
                    marginLeft: '0.5rem',
                    borderRight: `2px solid ${lumenForgeColors.accent.primary}`,
                    animation: 'blink 1s step-end infinite',
                  }}
                >
                  &nbsp;
                </span>
              </div>
            </div>
          </div>
        );

      case 'logs':
        return (
          <div style={{ padding: '0.5rem' }}>
            {logs.map((log, idx) => (
              <LogLine key={idx} entry={log} />
            ))}
          </div>
        );

      case 'errors':
        return (
          <div style={{ padding: '0.5rem' }}>
            {mockErrors.length > 0 ? (
              mockErrors.map((error, idx) => <LogLine key={idx} entry={error} />)
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: lumenForgeColors.text.tertiary,
                  fontSize: '0.875rem',
                }}
              >
                No errors
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: lumenForgeColors.background.primary,
        borderTop: `1px solid ${lumenForgeColors.border.subtle}`,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: lumenForgeColors.background.secondary,
          borderBottom: `1px solid ${lumenForgeColors.border.subtle}`,
        }}
      >
        <div style={{ display: 'flex' }} role="tablist" aria-label="output panel tabs">
          <TabButton
            icon={<Terminal size={14} />}
            label="Console"
            active={activeTab === 'console'}
            onClick={() => setActiveTab('console')}
          />
          <TabButton
            icon={<FileText size={14} />}
            label="Logs"
            active={activeTab === 'logs'}
            count={logs.length}
            onClick={() => setActiveTab('logs')}
          />
          <TabButton
            icon={<AlertCircle size={14} />}
            label="Errors"
            active={activeTab === 'errors'}
            count={mockErrors.length}
            onClick={() => setActiveTab('errors')}
          />
        </div>

        {onClear && (
          <button
            onClick={onClear}
            style={{
              padding: '0.5rem',
              background: 'none',
              border: 'none',
              color: lumenForgeColors.text.tertiary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
            }}
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>{getTabContent()}</div>

      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

const TabButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}> = ({ icon, label, active, count, onClick }) => (
  <button
    role="tab"
    aria-selected={active}
    aria-label={label}
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      background: active ? lumenForgeColors.background.primary : 'transparent',
      borderBottom: active ? `2px solid ${lumenForgeColors.accent.primary}` : '2px solid transparent',
      border: 'none',
      color: active ? lumenForgeColors.accent.primary : lumenForgeColors.text.secondary,
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: active ? 600 : 400,
      transition: transitions.fast,
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.color = lumenForgeColors.text.primary;
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.color = lumenForgeColors.text.secondary;
      }
    }}
  >
    {icon}
    {label}
    {count !== undefined && count > 0 && (
      <span
        style={{
          padding: '0.125rem 0.375rem',
          background: active ? lumenForgeColors.accent.primary : lumenForgeColors.background.tertiary,
          color: active ? lumenForgeColors.background.primary : lumenForgeColors.text.tertiary,
          borderRadius: '0.75rem',
          fontSize: '0.625rem',
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    )}
  </button>
);

const LogLine: React.FC<{ entry: LogEntry }> = ({ entry }) => {
  const getColor = () => {
    switch (entry.type) {
      case 'error':
        return lumenForgeColors.status.error;
      case 'warning':
        return lumenForgeColors.status.warning;
      default:
        return lumenForgeColors.text.secondary;
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.75rem',
        padding: '0.5rem',
        borderBottom: `1px solid ${lumenForgeColors.border.subtle}`,
        fontFamily: 'monospace',
        fontSize: '0.75rem',
      }}
    >
      <span style={{ color: lumenForgeColors.text.tertiary }}>[{entry.timestamp}]</span>
      <span
        style={{
          color: getColor(),
          fontWeight: 600,
          textTransform: 'uppercase',
          minWidth: '60px',
        }}
      >
        {entry.type}
      </span>
      <span style={{ color: lumenForgeColors.text.primary, flex: 1 }}>{entry.message}</span>
    </div>
  );
};
