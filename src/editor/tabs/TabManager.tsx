/**
 * Tab Manager Component
 * 
 * Advanced tab management with pinning, preview, and context menu
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Pin, PinOff, MoreVertical, FileText } from 'lucide-react';
import { useEditorStore, OpenFile } from '../monaco/editorStore';

export interface TabManagerProps {
  onTabSelect?: (path: string) => void;
  onTabClose?: (path: string) => void;
  onTabPin?: (path: string, pinned: boolean) => void;
  showPreview?: boolean;
}

export const TabManager: React.FC<TabManagerProps> = ({
  onTabSelect,
  onTabClose,
  onTabPin,
  showPreview = true,
}) => {
  const { openFiles, activeFilePath, closeFile, closeOtherFiles, closeAllFiles } = useEditorStore();
  const [pinnedTabs, setPinnedTabs] = useState<Set<string>>(new Set());
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    tabPath: string;
  } | null>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Sort tabs: pinned first, then by order
  const sortedTabs = React.useMemo(() => {
    const pinned = openFiles.filter((f) => pinnedTabs.has(f.path));
    const unpinned = openFiles.filter((f) => !pinnedTabs.has(f.path));
    return [...pinned, ...unpinned];
  }, [openFiles, pinnedTabs]);

  // Handle tab click
  const handleTabClick = useCallback((path: string) => {
    onTabSelect?.(path);
    useEditorStore.getState().setActiveFile(path);
  }, [onTabSelect]);

  // Handle tab close
  const handleTabClose = useCallback((e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    if (pinnedTabs.has(path)) {
      setPinnedTabs((prev) => {
        const next = new Set(prev);
        next.delete(path);
        return next;
      });
    }
    closeFile(path);
    onTabClose?.(path);
  }, [closeFile, onTabClose, pinnedTabs]);

  // Handle tab pin
  const handleTabPin = useCallback((e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    const newPinned = !pinnedTabs.has(path);
    setPinnedTabs((prev) => {
      const next = new Set(prev);
      if (newPinned) {
        next.add(path);
      } else {
        next.delete(path);
      }
      return next;
    });
    onTabPin?.(path, newPinned);
  }, [onTabPin, pinnedTabs]);

  // Handle context menu
  const handleContextMenu = useCallback((e: React.MouseEvent, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      tabPath: path,
    });
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [contextMenu]);

  // Context menu actions
  const handleClose = () => {
    if (contextMenu) {
      handleTabClose({ stopPropagation: () => {} } as React.MouseEvent, contextMenu.tabPath);
      setContextMenu(null);
    }
  };

  const handleCloseOthers = () => {
    if (contextMenu) {
      closeOtherFiles(contextMenu.tabPath);
      setContextMenu(null);
    }
  };

  const handleCloseAll = () => {
    closeAllFiles();
    setContextMenu(null);
  };

  const handlePin = () => {
    if (contextMenu) {
      handleTabPin({ stopPropagation: () => {} } as React.MouseEvent, contextMenu.tabPath);
      setContextMenu(null);
    }
  };

  const getTabLabel = (file: OpenFile) => {
    return file.path.split('/').pop() || file.path;
  };

  const getTabIcon = (file: OpenFile) => {
    const ext = file.path.split('.').pop()?.toLowerCase();
    // Simple icon mapping
    if (['ts', 'tsx', 'js', 'jsx'].includes(ext || '')) {
      return '📄';
    }
    if (['css', 'scss'].includes(ext || '')) {
      return '🎨';
    }
    if (['json'].includes(ext || '')) {
      return '📋';
    }
    if (['md', 'mdx'].includes(ext || '')) {
      return '📝';
    }
    return '📄';
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'var(--slate-panel, #16181d)',
        borderBottom: '1px solid var(--slate-border, #26292f)',
        height: 36,
        overflowX: 'auto',
        overflowY: 'hidden',
      }}
    >
      {sortedTabs.map((file) => {
        const isActive = file.path === activeFilePath;
        const isPinned = pinnedTabs.has(file.path);
        const isHovered = hoveredTab === file.path;

        return (
          <div
            key={file.path}
            onMouseEnter={() => setHoveredTab(file.path)}
            onMouseLeave={() => setHoveredTab(null)}
            onContextMenu={(e) => handleContextMenu(e, file.path)}
            onClick={() => handleTabClick(file.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              background: isActive
                ? 'var(--slate-bg, #0f1115)'
                : isHovered
                ? 'var(--slate-panel-hover, #1e2127)'
                : 'transparent',
              borderBottom: isActive ? '2px solid var(--slate-accent, #3f8cff)' : '2px solid transparent',
              cursor: 'pointer',
              userSelect: 'none',
              minWidth: 120,
              maxWidth: 240,
              position: 'relative',
            }}
          >
            {/* Pin Icon */}
            {isPinned && (
              <Pin
                size={12}
                style={{
                  color: 'var(--slate-text-muted, #9ba1aa)',
                  flexShrink: 0,
                }}
              />
            )}

            {/* File Icon */}
            <span style={{ fontSize: 12, flexShrink: 0 }}>
              {getTabIcon(file)}
            </span>

            {/* Tab Label */}
            <span
              style={{
                fontSize: 12,
                color: isActive
                  ? 'var(--slate-text, #e4e7eb)'
                  : 'var(--slate-text-muted, #9ba1aa)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
              }}
            >
              {getTabLabel(file)}
            </span>

            {/* Dirty Indicator */}
            {file.isDirty && (
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--slate-accent, #3f8cff)',
                  flexShrink: 0,
                }}
              />
            )}

            {/* Close Button */}
            {(isHovered || isActive) && (
              <button
                onClick={(e) => handleTabClose(e, file.path)}
                style={{
                  padding: 2,
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  color: 'var(--slate-text-muted, #9ba1aa)',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--slate-text, #e4e7eb)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--slate-text-muted, #9ba1aa)';
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>
        );
      })}

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            background: 'var(--slate-panel, #16181d)',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            minWidth: 180,
            padding: 4,
          }}
        >
          <button
            onClick={handlePin}
            style={{
              width: '100%',
              padding: '6px 12px',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--slate-text, #e4e7eb)',
              cursor: 'pointer',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            {pinnedTabs.has(contextMenu.tabPath) ? (
              <>
                <PinOff size={14} />
                Unpin
              </>
            ) : (
              <>
                <Pin size={14} />
                Pin
              </>
            )}
          </button>
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              padding: '6px 12px',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--slate-text, #e4e7eb)',
              cursor: 'pointer',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <X size={14} />
            Close
          </button>
          <div
            style={{
              height: 1,
              background: 'var(--slate-border, #26292f)',
              margin: '4px 0',
            }}
          />
          <button
            onClick={handleCloseOthers}
            style={{
              width: '100%',
              padding: '6px 12px',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--slate-text, #e4e7eb)',
              cursor: 'pointer',
              fontSize: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Close Others
          </button>
          <button
            onClick={handleCloseAll}
            style={{
              width: '100%',
              padding: '6px 12px',
              background: 'transparent',
              border: 'none',
              textAlign: 'left',
              color: 'var(--slate-text, #e4e7eb)',
              cursor: 'pointer',
              fontSize: 12,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Close All
          </button>
        </div>
      )}

      {/* Tab Preview (on hover) */}
      {showPreview && hoveredTab && (
        <div
          style={{
            position: 'fixed',
            left: '50%',
            top: 60,
            transform: 'translateX(-50%)',
            background: 'var(--slate-panel, #16181d)',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            padding: 12,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            maxWidth: 400,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--slate-text, #e4e7eb)',
              marginBottom: 4,
            }}
          >
            {hoveredTab}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          >
            Click to open
          </div>
        </div>
      )}
    </div>
  );
};

export default TabManager;

