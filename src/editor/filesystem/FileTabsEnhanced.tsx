/**
 * File Tabs Component
 * 
 * Advanced tab bar with drag & drop, context menu, overflow handling, and keyboard shortcuts
 */

'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export interface Tab {
  id: string;
  label: string;
  dirty?: boolean;
  icon?: string;
}

export interface FileTabsProps {
  tabs?: Tab[];
  activeTabId?: string;
  onTabSelect?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onTabReorder?: (fromIndex: number, toIndex: number) => void;
}

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  tabId: string;
}

export const FileTabs: React.FC<FileTabsProps> = ({
  tabs = [],
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabReorder,
}) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // Check if scroll arrows are needed
  useEffect(() => {
    const checkScroll = () => {
      if (!tabsContainerRef.current || !tabsRef.current) return;

      const container = tabsContainerRef.current;
      const tabsEl = tabsRef.current;

      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(
        scrollLeft < tabsEl.scrollWidth - container.clientWidth - 10
      );
    };

    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [scrollLeft, tabs]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+W or Cmd+W to close active tab
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') {
        e.preventDefault();
        if (activeTabId) {
          onTabClose?.(activeTabId);
        }
      }

      // Ctrl+Tab or Ctrl+PageDown to switch to next tab
      if ((e.ctrlKey || e.metaKey) && (e.key === 'Tab' || e.key === 'PageDown')) {
        e.preventDefault();
        const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
        const nextIndex = (currentIndex + 1) % tabs.length;
        if (tabs[nextIndex]) {
          onTabSelect?.(tabs[nextIndex].id);
        }
      }

      // Ctrl+Shift+Tab or Ctrl+PageUp to switch to previous tab
      if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        (e.key === 'Tab' || e.key === 'PageUp')
      ) {
        e.preventDefault();
        const currentIndex = tabs.findIndex((t) => t.id === activeTabId);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        if (tabs[prevIndex]) {
          onTabSelect?.(tabs[prevIndex].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, tabs, onTabSelect, onTabClose]);

  const scroll = (direction: 'left' | 'right') => {
    if (!tabsContainerRef.current) return;

    const container = tabsContainerRef.current;
    const scrollAmount = 200;
    const newScrollLeft =
      direction === 'left'
        ? scrollLeft - scrollAmount
        : scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
    setScrollLeft(newScrollLeft);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', '');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (draggedIndex === null || draggedIndex === index) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    const mouseX = e.clientX;

    if (mouseX < midpoint && draggedIndex > index) {
      // Move left
      onTabReorder?.(draggedIndex, index);
      setDraggedIndex(index);
    } else if (mouseX > midpoint && draggedIndex < index) {
      // Move right
      onTabReorder?.(draggedIndex, index + 1);
      setDraggedIndex(index + 1);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      tabId,
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const handleClose = (tabId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onTabClose?.(tabId);
    closeContextMenu();
  };

  const handleCloseOthers = () => {
    if (!contextMenu) return;
    tabs.forEach((tab) => {
      if (tab.id !== contextMenu.tabId) {
        onTabClose?.(tab.id);
      }
    });
    closeContextMenu();
  };

  const handleCloseAll = () => {
    tabs.forEach((tab) => {
      onTabClose?.(tab.id);
    });
    closeContextMenu();
  };

  const handleMiddleClick = (e: React.MouseEvent, tabId: string) => {
    if (e.button === 1) {
      // Middle mouse button
      e.preventDefault();
      onTabClose?.(tabId);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        background: 'var(--slate-panel, #16181d)',
        borderBottom: '1px solid var(--slate-border, #26292f)',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={closeContextMenu}
    >
      {/* Left Scroll Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          style={{
            padding: '8px 4px',
            background: 'var(--slate-panel, #16181d)',
            border: 'none',
            borderRight: '1px solid var(--slate-border, #26292f)',
            color: 'var(--slate-text, #e4e7eb)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--slate-panel, #16181d)';
          }}
        >
          <ChevronLeft size={16} />
        </button>
      )}

      {/* Tabs Container */}
      <div
        ref={tabsContainerRef}
        style={{
          flex: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          scrollBehavior: 'smooth',
          display: 'flex',
        }}
        onScroll={(e) => {
          setScrollLeft(e.currentTarget.scrollLeft);
        }}
      >
        <div
          ref={tabsRef}
          style={{
            display: 'flex',
            minWidth: 'max-content',
          }}
        >
          {tabs.map((tab, index) => {
            const isActive = activeTabId === tab.id;
            const isDragging = draggedIndex === index;

            return (
              <div
                key={tab.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                onClick={() => onTabSelect?.(tab.id)}
                onContextMenu={(e) => handleContextMenu(e, tab.id)}
                onMouseDown={(e) => handleMiddleClick(e, tab.id)}
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
                  maxWidth: 240,
                  borderTop: isActive
                    ? '2px solid var(--slate-accent, #3f8cff)'
                    : '2px solid transparent',
                  transition: 'background 0.15s',
                  opacity: isDragging ? 0.5 : 1,
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {tab.icon && <span>{tab.icon}</span>}
                <span
                  style={{
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {tab.label}
                </span>
                {tab.dirty && (
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--slate-text-muted, #9ba1aa)',
                      flexShrink: 0,
                    }}
                  />
                )}
                <button
                  onClick={(e) => handleClose(tab.id, e)}
                  style={{
                    padding: '2px 4px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--slate-text-muted, #9ba1aa)',
                    cursor: 'pointer',
                    borderRadius: 2,
                    fontSize: 14,
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--slate-text-muted, #9ba1aa)';
                  }}
                >
                  <X size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Scroll Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          style={{
            padding: '8px 4px',
            background: 'var(--slate-panel, #16181d)',
            border: 'none',
            borderLeft: '1px solid var(--slate-border, #26292f)',
            color: 'var(--slate-text, #e4e7eb)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--slate-panel, #16181d)';
          }}
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Context Menu */}
      {contextMenu?.visible && (
        <div
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            background: 'var(--slate-panel, #16181d)',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            zIndex: 1000,
            minWidth: 180,
            padding: 4,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            onClick={() => handleClose(contextMenu.tabId)}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 12,
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Close
          </div>
          <div
            onClick={handleCloseOthers}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 12,
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Close Others
          </div>
          <div
            onClick={handleCloseAll}
            style={{
              padding: '6px 12px',
              cursor: 'pointer',
              color: '#EF4444',
              fontSize: 12,
              borderRadius: 2,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
            }}
          >
            Close All
          </div>
        </div>
      )}
    </div>
  );
};

export default FileTabs;

