/**
 * App Shell Component
 * 
 * Main IDE container with sidebar, top bar, and content area
 */

import React from 'react';

export interface AppShellProps {
  children: React.ReactNode;
  sidebarVisible?: boolean;
  panelsVisible?: boolean;
  fullscreen?: boolean;
  sidebar?: React.ReactNode;
  topBar?: React.ReactNode;
  panels?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  sidebarVisible = true,
  panelsVisible = true,
  fullscreen = false,
  sidebar,
  topBar,
  panels,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: 'var(--slate-bg, #0f1115)',
        fontFamily: 'var(--font-primary, system-ui)',
        overflow: 'hidden',
      }}
    >
      {/* Sidebar */}
      {sidebarVisible && !fullscreen && sidebar && (
        <div
          style={{
            width: 250,
            background: 'var(--slate-panel, #16181d)',
            borderRight: '1px solid var(--slate-border, #26292f)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {sidebar}
        </div>
      )}

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Top Bar */}
        {topBar && (
          <div
            style={{
              height: 40,
              background: 'var(--slate-panel, #16181d)',
              borderBottom: '1px solid var(--slate-border, #26292f)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {topBar}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            overflow: 'hidden',
          }}
        >
          {/* Main Editor Area */}
          <div
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {children}
          </div>

          {/* Right Panels */}
          {panelsVisible && !fullscreen && panels && (
            <div
              style={{
                width: 300,
                background: 'var(--slate-panel, #16181d)',
                borderLeft: '1px solid var(--slate-border, #26292f)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
              }}
            >
              {panels}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppShell;

