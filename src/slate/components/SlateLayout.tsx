import React, { useState } from 'react';
import { Code, Box, Layers, Menu, X } from 'lucide-react';
import { ExplorerPanel } from './ExplorerPanel';
import { EditorPanel } from './EditorPanel';
import { RuntimePanel } from './RuntimePanel';
import { BottomPanel } from './BottomPanel';
import { UnityAssetManager } from '../modules/assets/UnityAssetManager';
import { lumenForgeColors, transitions } from '../../design-system/tokens';

interface SlateLayoutProps {
  status?: string;
  onFileSelect?: (path: string) => void;
  onTabSelect?: (tab: string) => void;
  onTabClose?: (tab: string) => void;
  onRun?: () => void;
  onRestart?: () => void;
  onStop?: () => void;
}

type View = 'ide' | 'assets';

export const SlateLayout: React.FC<SlateLayoutProps> = ({
  status = 'Ignition: idle',
  onFileSelect,
  onTabSelect,
  onTabClose,
  onRun,
  onRestart,
  onStop,
}) => {
  const [currentView, setCurrentView] = useState<View>('ide');
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [openTabs, setOpenTabs] = useState<Array<{ id: string; name: string; path: string }>>([]);
  const [activeTabId, setActiveTabId] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);

  const handleFileSelect = (path: string) => {
    setSelectedFile(path);
    onFileSelect?.(path);

    const existingTab = openTabs.find((t) => t.path === path);
    if (existingTab) {
      setActiveTabId(existingTab.id);
      onTabSelect?.(existingTab.id);
    } else {
      const newTab = {
        id: `tab-${Date.now()}`,
        name: path.split('/').pop() || 'file',
        path,
      };
      setOpenTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
      onTabSelect?.(newTab.id);
    }
  };

  const handleTabClose = (tabId: string) => {
    setOpenTabs((prev) => prev.filter((t) => t.id !== tabId));
    if (activeTabId === tabId && openTabs.length > 1) {
      const remainingTabs = openTabs.filter((t) => t.id !== tabId);
      setActiveTabId(remainingTabs[0]?.id);
    } else if (openTabs.length === 1) {
      setActiveTabId(undefined);
    }
    onTabClose?.(tabId);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: lumenForgeColors.background.primary,
        color: lumenForgeColors.text.primary,
        overflow: 'hidden',
      }}
    >
      <header
        style={{
          height: '60px',
          background: `linear-gradient(135deg, ${lumenForgeColors.background.secondary}, ${lumenForgeColors.background.primary})`,
          borderBottom: `1px solid ${lumenForgeColors.border.primary}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          boxShadow: '0 2px 8px rgba(45, 127, 249, 0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label="Toggle sidebar"
            style={{
              background: 'none',
              border: 'none',
              color: lumenForgeColors.accent.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '0.5rem',
            }}
          >
            {sidebarCollapsed ? <Menu size={20} /> : <X size={20} />}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Layers size={28} style={{ color: lumenForgeColors.accent.primary }} />
            <div>
              <h1
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  margin: 0,
                  background: `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                SLATE
              </h1>
              <p
                style={{
                  fontSize: '0.625rem',
                  margin: 0,
                  color: lumenForgeColors.text.tertiary,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                Full IDE
              </p>
            </div>
          </div>
        </div>

        <nav
          role="navigation"
          aria-label="primary navigation"
          style={{
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <NavButton
            icon={<Code size={18} />}
            label="IDE"
            active={currentView === 'ide'}
            onClick={() => setCurrentView('ide')}
          />
          <NavButton
            icon={<Box size={18} />}
            label="Unity Assets"
            active={currentView === 'assets'}
            onClick={() => setCurrentView('assets')}
          />
        </nav>
      </header>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {currentView === 'ide' ? (
          <>
            {!sidebarCollapsed && (
              <div
                style={{
                  width: '280px',
                  borderRight: `1px solid ${lumenForgeColors.border.subtle}`,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <ExplorerPanel
                  onFileSelect={handleFileSelect}
                  selectedPath={selectedFile}
                  onShowAssetManager={() => setCurrentView('assets')}
                />
              </div>
            )}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <EditorPanel
                    tabs={openTabs}
                    activeTabId={activeTabId}
                    onTabSelect={(tabId) => {
                      setActiveTabId(tabId);
                      onTabSelect?.(tabId);
                    }}
                    onTabClose={handleTabClose}
                  />
                </div>

                <div
                  style={{
                    width: '320px',
                    borderLeft: `1px solid ${lumenForgeColors.border.subtle}`,
                  }}
                >
                  <RuntimePanel
                    status={status}
                    onRun={onRun}
                    onRestart={onRestart}
                    onStop={onStop}
                  />
                </div>
              </div>

              <div
                style={{
                  height: `${bottomPanelHeight}px`,
                  minHeight: '150px',
                  maxHeight: '400px',
                  borderTop: `1px solid ${lumenForgeColors.border.subtle}`,
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    cursor: 'ns-resize',
                    background: 'transparent',
                    zIndex: 10,
                  }}
                  onMouseDown={(e) => {
                    const startY = e.clientY;
                    const startHeight = bottomPanelHeight;

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const delta = startY - moveEvent.clientY;
                      const newHeight = Math.min(Math.max(startHeight + delta, 150), 400);
                      setBottomPanelHeight(newHeight);
                    };

                    const handleMouseUp = () => {
                      document.removeEventListener('mousemove', handleMouseMove);
                      document.removeEventListener('mouseup', handleMouseUp);
                    };

                    document.addEventListener('mousemove', handleMouseMove);
                    document.addEventListener('mouseup', handleMouseUp);
                  }}
                />
                <BottomPanel />
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <UnityAssetManager />
          </div>
        )}
      </div>
    </div>
  );
};

const NavButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}> = ({ icon, label, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      background: active
        ? `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`
        : 'transparent',
      border: active ? `1px solid ${lumenForgeColors.accent.primary}` : `1px solid ${lumenForgeColors.border.subtle}`,
      borderRadius: '0.5rem',
      color: lumenForgeColors.text.primary,
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontWeight: active ? 600 : 400,
      transition: transitions.normal,
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.borderColor = lumenForgeColors.accent.primary;
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.borderColor = lumenForgeColors.border.subtle;
      }
    }}
  >
    {icon}
    {label}
  </button>
);
