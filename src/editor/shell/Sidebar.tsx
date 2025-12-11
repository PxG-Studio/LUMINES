/**
 * Sidebar Component
 * 
 * IDE sidebar with navigation items
 */

import React, { useState } from 'react';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  badge?: string | number;
}

export interface SidebarProps {
  items?: SidebarItem[];
  collapsed?: boolean;
  activeItemId?: string;
  onItemClick?: (itemId: string) => void;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items = [
    { id: 'files', label: 'Files', icon: '📁' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'source-control', label: 'Source Control', icon: '📦' },
    { id: 'extensions', label: 'Extensions', icon: '🧩' },
  ],
  collapsed = false,
  activeItemId,
  onItemClick,
  onToggleCollapse,
}) => {
  return (
    <div
      style={{
        width: collapsed ? 48 : 250,
        height: '100%',
        background: 'var(--slate-panel, #16181d)',
        borderRight: '1px solid var(--slate-border, #26292f)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Collapse Button */}
      <div
        style={{
          padding: 12,
          borderBottom: '1px solid var(--slate-border, #26292f)',
        }}
      >
        <button
          onClick={onToggleCollapse}
          style={{
            width: '100%',
            padding: 8,
            background: 'var(--slate-accent, #3f8cff)',
            border: 'none',
            borderRadius: 4,
            color: 'white',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 'bold',
          }}
        >
          {collapsed ? '☰' : '←'}
        </button>
      </div>

      {/* Sidebar Items */}
      {!collapsed && (
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 8,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              style={{
                padding: '8px 12px',
                color:
                  activeItemId === item.id
                    ? 'var(--slate-accent, #3f8cff)'
                    : 'var(--slate-text, #e4e7eb)',
                cursor: 'pointer',
                borderRadius: 4,
                marginBottom: 4,
                background:
                  activeItemId === item.id
                    ? 'rgba(63, 140, 255, 0.1)'
                    : 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeItemId !== item.id) {
                  e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeItemId !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {item.icon && <span>{item.icon}</span>}
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    padding: '2px 6px',
                    background: 'var(--slate-accent, #3f8cff)',
                    borderRadius: 10,
                    fontSize: 11,
                    color: 'white',
                  }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Collapsed Icons */}
      {collapsed && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 8,
            gap: 8,
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              title={item.label}
              style={{
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: 4,
                background:
                  activeItemId === item.id
                    ? 'rgba(63, 140, 255, 0.2)'
                    : 'transparent',
                fontSize: 18,
              }}
            >
              {item.icon || '•'}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sidebar;

