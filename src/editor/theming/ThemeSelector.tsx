/**
 * Theme Selector Component
 * 
 * UI for selecting and previewing themes
 */

'use client';

import React from 'react';
import { Palette, Check } from 'lucide-react';
import { useTheme, Theme } from './ThemeSystem';

export interface ThemeSelectorProps {
  showLabel?: boolean;
  compact?: boolean;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  showLabel = true,
  compact = false,
}) => {
  const { theme, setTheme, colors } = useTheme();

  const themes: Array<{ id: Theme; label: string; preview: string[] }> = [
    {
      id: 'dark',
      label: 'Dark',
      preview: ['#0f1115', '#16181d', '#3f8cff'],
    },
    {
      id: 'light',
      label: 'Light',
      preview: ['#ffffff', '#f9fafb', '#3f8cff'],
    },
    {
      id: 'high-contrast',
      label: 'High Contrast',
      preview: ['#000000', '#1a1a1a', '#00ff00'],
    },
    {
      id: 'game-dev',
      label: 'Game Dev',
      preview: ['#1a1a1a', '#242424', '#ff6b35'],
    },
    {
      id: 'unity',
      label: 'Unity',
      preview: ['#282c33', '#323842', '#4ec9b0'],
    },
  ];

  if (compact) {
    return (
      <div style={{ display: 'flex', gap: 4 }}>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            style={{
              width: 24,
              height: 24,
              borderRadius: 4,
              background: t.preview[0],
              border: theme === t.id ? `2px solid ${colors.accent}` : '1px solid var(--slate-border, #26292f)',
              cursor: 'pointer',
              position: 'relative',
            }}
            title={t.label}
          >
            {theme === t.id && (
              <Check
                size={12}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: '#FFFFFF',
                }}
              />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 12,
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
      }}
    >
      {showLabel && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Palette size={16} style={{ color: 'var(--slate-text, #e4e7eb)' }} />
          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: 'var(--slate-text, #e4e7eb)',
            }}
          >
            Theme
          </span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              background: theme === t.id ? 'rgba(63, 140, 255, 0.1)' : 'transparent',
              border: `1px solid ${theme === t.id ? colors.accent : 'var(--slate-border, #26292f)'}`,
              borderRadius: 4,
              cursor: 'pointer',
              fontSize: 12,
            }}
            onMouseEnter={(e) => {
              if (theme !== t.id) {
                e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
              }
            }}
            onMouseLeave={(e) => {
              if (theme !== t.id) {
                e.currentTarget.style.background = 'transparent';
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ display: 'flex', gap: 2 }}>
                {t.preview.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      background: color,
                      borderRadius: 2,
                      border: '1px solid var(--slate-border, #26292f)',
                    }}
                  />
                ))}
              </div>
              <span
                style={{
                  color: theme === t.id ? colors.accent : 'var(--slate-text, #e4e7eb)',
                  fontWeight: theme === t.id ? 500 : 400,
                }}
              >
                {t.label}
              </span>
            </div>
            {theme === t.id && (
              <Check size={14} style={{ color: colors.accent }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSelector;

