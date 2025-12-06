/**
 * Tabs Component
 * 
 * Tab bar with close buttons and dirty indicators
 */

import React from 'react';

export interface Tab {
  id: string;
  label: string;
  dirty?: boolean;
  icon?: string;
}

export interface TabsProps {
  tabs?: Tab[];
  activeTabId?: string;
  onTabClick?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs = [
    { id: '1', label: 'Untitled-1', dirty: true },
    { id: '2', label: 'file.json', dirty: false },
  ],
  activeTabId,
  onTabClick,
  onTabClose,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--slate-panel, #16181d)',
        borderBottom: '1px solid var(--slate-border, #26292f)',
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTabId === tab.id;
        return (
          <div
            key={tab.id}
            onClick={() => onTabClick?.(tab.id)}
            style={{
              padding: '8px 16px',
              background: isActive ? 'var(--slate-bg, #0f1115)' : 'transparent',
              borderRight: '1px solid var(--slate-border, #26292f)',
              color: 'var(--slate-text, #e4e7eb)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              whiteSpace: 'nowrap',
              fontSize: 12,
              minWidth: 120,
              borderTop: isActive ? '2px solid var(--slate-accent, #3f8cff)' : '2px solid transparent',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {tab.label}
            </span>
            {tab.dirty && (
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--slate-text-muted, #9ba1aa)',
                }}
              />
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTabClose?.(tab.id);
              }}
              aria-label={`Close tab ${tab.label}`}
              style={{
                padding: '2px 4px',
                background: 'transparent',
                border: 'none',
                color: 'var(--slate-text-muted, #9ba1aa)',
                cursor: 'pointer',
                borderRadius: 2,
                fontSize: 14,
                lineHeight: 1,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;

