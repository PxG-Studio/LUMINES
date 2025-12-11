import React from 'react';
import { X, Save, Code } from 'lucide-react';
import { lumenForgeColors, transitions } from '../../design-system/tokens';

interface EditorTab {
  id: string;
  name: string;
  path: string;
  modified?: boolean;
}

interface EditorPanelProps {
  tabs?: EditorTab[];
  activeTabId?: string;
  content?: string;
  onTabSelect?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onContentChange?: (content: string) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  tabs = [],
  activeTabId,
  content = '',
  onTabSelect,
  onTabClose,
  onContentChange,
}) => {
  const activeTab = tabs.find((t) => t.id === activeTabId);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: lumenForgeColors.background.primary,
      }}
    >
      {tabs.length > 0 && (
        <div
          style={{
            display: 'flex',
            borderBottom: `1px solid ${lumenForgeColors.border.subtle}`,
            overflowX: 'auto',
          }}
          role="tablist"
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onTabSelect?.(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  background: isActive
                    ? lumenForgeColors.background.secondary
                    : lumenForgeColors.background.primary,
                  borderBottom: isActive ? `2px solid ${lumenForgeColors.accent.primary}` : 'none',
                  cursor: 'pointer',
                  transition: transitions.fast,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = lumenForgeColors.background.tertiary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = lumenForgeColors.background.primary;
                  }
                }}
              >
                <Code size={14} style={{ color: lumenForgeColors.text.secondary }} />
                <span
                  style={{
                    color: isActive ? lumenForgeColors.accent.primary : lumenForgeColors.text.primary,
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {tab.name}
                  {tab.modified && (
                    <span style={{ color: lumenForgeColors.status.warning, marginLeft: '0.25rem' }}>
                      •
                    </span>
                  )}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabClose?.(tab.id);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    color: lumenForgeColors.text.tertiary,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = lumenForgeColors.text.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = lumenForgeColors.text.tertiary;
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div
        style={{
          flex: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {activeTab ? (
          <textarea
            value={content}
            onChange={(e) => onContentChange?.(e.target.value)}
            placeholder="// Start coding..."
            style={{
              width: '100%',
              height: '100%',
              padding: '1rem',
              background: lumenForgeColors.background.primary,
              color: lumenForgeColors.text.primary,
              border: 'none',
              outline: 'none',
              fontSize: '0.875rem',
              fontFamily: 'monospace',
              lineHeight: '1.6',
              resize: 'none',
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: lumenForgeColors.text.tertiary,
              gap: '1rem',
            }}
          >
            <Code size={64} style={{ opacity: 0.3 }} />
            <p style={{ fontSize: '1.125rem' }}>No file open</p>
            <p style={{ fontSize: '0.875rem' }}>Select a file from the explorer to start editing</p>
          </div>
        )}
      </div>

      {activeTab && (
        <div
          style={{
            padding: '0.5rem 1rem',
            background: lumenForgeColors.background.secondary,
            borderTop: `1px solid ${lumenForgeColors.border.subtle}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: lumenForgeColors.text.tertiary }}>
              {activeTab.path}
            </span>
            <span style={{ color: lumenForgeColors.text.tertiary }}>
              UTF-8
            </span>
          </div>

          <button
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.25rem 0.75rem',
              background: 'none',
              border: `1px solid ${lumenForgeColors.border.subtle}`,
              borderRadius: '0.25rem',
              color: lumenForgeColors.text.secondary,
              cursor: 'pointer',
              fontSize: '0.75rem',
            }}
          >
            <Save size={12} />
            Save
          </button>
        </div>
      )}
    </div>
  );
};
