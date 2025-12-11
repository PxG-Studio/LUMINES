/**
 * Command Palette Component
 * 
 * Floating command search modal
 */

import React, { useState, useEffect, useRef } from 'react';

export interface Command {
  id: string;
  label: string;
  category?: string;
  shortcut?: string;
}

export interface CommandPaletteProps {
  visible?: boolean;
  onClose?: () => void;
  onCommandSelect?: (commandId: string) => void;
  commands?: Command[];
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  visible = false,
  onClose,
  onCommandSelect,
  commands = [
    { id: 'new-file', label: 'New File', category: 'File' },
    { id: 'save', label: 'Save', category: 'File', shortcut: 'Ctrl+S' },
    { id: 'open-file', label: 'Open File', category: 'File' },
    { id: 'command-palette', label: 'Show Command Palette', category: 'View', shortcut: 'Ctrl+P' },
    { id: 'toggle-sidebar', label: 'Toggle Sidebar', category: 'View' },
  ],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (visible) {
      inputRef.current?.focus();
    } else {
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [visible]);

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(0);
    }
  }, [filteredCommands.length, selectedIndex]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        zIndex: 10000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '600px',
          maxWidth: '90vw',
          background: 'var(--slate-panel, #16181d)',
          border: '1px solid var(--slate-border, #26292f)',
          borderRadius: 8,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div
          style={{
            padding: 16,
            borderBottom: '1px solid var(--slate-border, #26292f)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              background: 'var(--slate-bg, #0f1115)',
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 14,
              outline: 'none',
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onClose?.();
              } else if (e.key === 'Enter') {
                const selected = filteredCommands[selectedIndex];
                if (selected) {
                  onCommandSelect?.(selected.id);
                  onClose?.();
                }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  prev < filteredCommands.length - 1 ? prev + 1 : 0
                );
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) =>
                  prev > 0 ? prev - 1 : filteredCommands.length - 1
                );
              }
            }}
          />
        </div>

        {/* Command List */}
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: 24,
                textAlign: 'center',
                color: 'var(--slate-text-muted, #9ba1aa)',
                fontSize: 13,
              }}
            >
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <div
                key={command.id}
                onClick={() => {
                  onCommandSelect?.(command.id);
                  onClose?.();
                }}
                style={{
                  padding: '12px 16px',
                  background:
                    selectedIndex === index
                      ? 'rgba(63, 140, 255, 0.1)'
                      : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--slate-border, #26292f)',
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div>
                  <div
                    style={{
                      color: 'var(--slate-text, #e4e7eb)',
                      fontSize: 13,
                      marginBottom: 2,
                    }}
                  >
                    {command.label}
                  </div>
                  {command.category && (
                    <div
                      style={{
                        color: 'var(--slate-text-muted, #9ba1aa)',
                        fontSize: 11,
                      }}
                    >
                      {command.category}
                    </div>
                  )}
                </div>
                {command.shortcut && (
                  <div
                    style={{
                      padding: '2px 6px',
                      background: 'var(--slate-bg, #0f1115)',
                      borderRadius: 4,
                      fontSize: 11,
                      color: 'var(--slate-text-muted, #9ba1aa)',
                      fontFamily: 'monospace',
                    }}
                  >
                    {command.shortcut}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;

