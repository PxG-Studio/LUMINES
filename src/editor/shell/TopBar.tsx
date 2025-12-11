/**
 * Top Bar Component
 * 
 * IDE top menu bar
 */

import React from 'react';

export interface MenuItem {
  id: string;
  label: string;
  submenu?: MenuItem[];
}

export interface TopBarProps {
  title?: string;
  menuItems?: MenuItem[];
  onMenuItemClick?: (itemId: string) => void;
  showCommandPalette?: boolean;
  onCommandPaletteClick?: () => void;
  showSaveIndicator?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  title = 'WISSIL IDE',
  menuItems = [
    { id: 'file', label: 'File' },
    { id: 'edit', label: 'Edit' },
    { id: 'view', label: 'View' },
    { id: 'run', label: 'Run' },
    { id: 'help', label: 'Help' },
  ],
  onMenuItemClick,
  showCommandPalette = true,
  onCommandPaletteClick,
  showSaveIndicator = false,
}) => {
  return (
    <div
      style={{
        height: 40,
        background: 'var(--slate-panel, #16181d)',
        borderBottom: '1px solid var(--slate-border, #26292f)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        gap: 16,
      }}
    >
      {/* Title */}
      <div
        style={{
          color: 'var(--slate-text, #e4e7eb)',
          fontWeight: 'bold',
          fontSize: 13,
          marginRight: 16,
        }}
      >
        {title}
      </div>

      {/* Menu Items */}
      <div
        style={{
          display: 'flex',
          gap: 4,
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onMenuItemClick?.(item.id)}
            style={{
              padding: '4px 8px',
              background: 'transparent',
              border: 'none',
              color: 'var(--slate-text, #e4e7eb)',
              cursor: 'pointer',
              borderRadius: 4,
              fontSize: 12,
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Command Palette Button */}
      {showCommandPalette && (
        <button
          onClick={onCommandPaletteClick}
          style={{
            padding: '4px 12px',
            background: 'var(--slate-bg, #0f1115)',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            color: 'var(--slate-text-muted, #9ba1aa)',
            cursor: 'pointer',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
          title="Command Palette (Ctrl+P)"
        >
          <span>⌘</span>
          <span>P</span>
        </button>
      )}

      {/* Save Indicator */}
      {showSaveIndicator && (
        <div
          style={{
            padding: '4px 8px',
            background: 'rgba(63, 140, 255, 0.1)',
            borderRadius: 4,
            fontSize: 11,
            color: 'var(--slate-accent, #3f8cff)',
          }}
        >
          ● Unsaved
        </div>
      )}
    </div>
  );
};

export default TopBar;

