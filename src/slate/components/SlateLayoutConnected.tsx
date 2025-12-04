import React, { useState } from 'react';
import { Code, Box, Layers, Menu, X, Plus, FolderOpen } from 'lucide-react';
import { ExplorerPanelConnected } from './ExplorerPanelConnected';
import { EditorPanelConnected } from './EditorPanelConnected';
import { RuntimePanel } from './RuntimePanel';
import { BottomPanel } from './BottomPanel';
import { UnityAssetManagerConnected } from '../modules/assets/UnityAssetManagerConnected';
import { lumenForgeColors, transitions } from '../../design-system/tokens';
import { useProjectContext } from '../context/ProjectContext';
import { useProjects } from '../../hooks/useProjects';
import { useSupabaseRealtimeSync } from '../../lib/cache/realtimeSync';

interface SlateLayoutConnectedProps {
  status?: string;
  onRun?: () => void;
  onRestart?: () => void;
  onStop?: () => void;
}

type View = 'ide' | 'assets';

interface EditorTab {
  id: string;
  name: string;
  path: string;
  fileId: string;
  modified?: boolean;
}

export const SlateLayoutConnected: React.FC<SlateLayoutConnectedProps> = ({
  status = 'Ignition: idle',
  onRun,
  onRestart,
  onStop,
}) => {
  const { projectId, setProjectId, userId } = useProjectContext();
  const { projects, createProject, loading: loadingProjects } = useProjects(userId);

  useSupabaseRealtimeSync(userId, projectId);

  const [currentView, setCurrentView] = useState<View>('ide');
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [openTabs, setOpenTabs] = useState<EditorTab[]>([]);
  const [activeTabId, setActiveTabId] = useState<string | undefined>();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bottomPanelHeight, setBottomPanelHeight] = useState(200);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleFileSelect = (fileId: string, path: string) => {
    setSelectedFile(path);

    const existingTab = openTabs.find((t) => t.fileId === fileId);
    if (existingTab) {
      setActiveTabId(existingTab.id);
    } else {
      const newTab: EditorTab = {
        id: `tab-${Date.now()}`,
        name: path.split('/').pop() || 'file',
        path,
        fileId,
      };
      setOpenTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
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
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;

    try {
      const project = await createProject({
        user_id: userId,
        name: newProjectName,
        metadata: { created_from: 'SLATE UI', unity_version: '2022.3' },
      });
      setProjectId(project.id);
      setNewProjectName('');
      setShowProjectSelector(false);
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  };

  const currentProject = projects.find((p) => p.id === projectId);

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

          <div style={{ position: 'relative', marginLeft: '1rem' }}>
            <button
              onClick={() => setShowProjectSelector(!showProjectSelector)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: lumenForgeColors.background.tertiary,
                border: `1px solid ${lumenForgeColors.border.subtle}`,
                borderRadius: '0.375rem',
                color: lumenForgeColors.text.primary,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              <FolderOpen size={16} />
              {currentProject ? currentProject.name : 'Select Project'}
            </button>

            {showProjectSelector && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '0.5rem',
                  background: lumenForgeColors.background.secondary,
                  border: `1px solid ${lumenForgeColors.border.subtle}`,
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                  minWidth: '300px',
                  maxHeight: '400px',
                  overflowY: 'auto',
                  zIndex: 1000,
                }}
              >
                <div style={{ padding: '1rem', borderBottom: `1px solid ${lumenForgeColors.border.subtle}` }}>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                    Create New Project
                  </h3>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      placeholder="Project name..."
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateProject();
                      }}
                      style={{
                        flex: 1,
                        padding: '0.5rem',
                        background: lumenForgeColors.background.tertiary,
                        border: `1px solid ${lumenForgeColors.border.subtle}`,
                        borderRadius: '0.25rem',
                        color: lumenForgeColors.text.primary,
                        fontSize: '0.875rem',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={handleCreateProject}
                      disabled={!newProjectName.trim()}
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: lumenForgeColors.accent.primary,
                        border: 'none',
                        borderRadius: '0.25rem',
                        color: lumenForgeColors.text.primary,
                        cursor: newProjectName.trim() ? 'pointer' : 'not-allowed',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        opacity: newProjectName.trim() ? 1 : 0.5,
                      }}
                    >
                      <Plus size={14} />
                      Create
                    </button>
                  </div>
                </div>

                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {loadingProjects ? (
                    <p style={{ padding: '1rem', color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
                      Loading projects...
                    </p>
                  ) : projects.length === 0 ? (
                    <p style={{ padding: '1rem', color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
                      No projects yet. Create one to get started.
                    </p>
                  ) : (
                    projects.map((project) => (
                      <button
                        key={project.id}
                        onClick={() => {
                          setProjectId(project.id);
                          setShowProjectSelector(false);
                          setOpenTabs([]);
                          setActiveTabId(undefined);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          background:
                            projectId === project.id
                              ? lumenForgeColors.accent.primary + '20'
                              : 'transparent',
                          border: 'none',
                          borderBottom: `1px solid ${lumenForgeColors.border.subtle}`,
                          color: lumenForgeColors.text.primary,
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontSize: '0.875rem',
                        }}
                        onMouseEnter={(e) => {
                          if (projectId !== project.id) {
                            e.currentTarget.style.background = lumenForgeColors.background.tertiary;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (projectId !== project.id) {
                            e.currentTarget.style.background = 'transparent';
                          }
                        }}
                      >
                        <div style={{ fontWeight: 600 }}>{project.name}</div>
                        <div style={{ fontSize: '0.75rem', color: lumenForgeColors.text.tertiary, marginTop: '0.25rem' }}>
                          {new Date(project.updated_at).toLocaleDateString()}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
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
                <ExplorerPanelConnected
                  onFileSelect={handleFileSelect}
                  selectedPath={selectedFile}
                  onShowAssetManager={() => setCurrentView('assets')}
                />
              </div>
            )}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <EditorPanelConnected
                    tabs={openTabs}
                    activeTabId={activeTabId}
                    onTabSelect={(tabId) => setActiveTabId(tabId)}
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
            <UnityAssetManagerConnected />
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
