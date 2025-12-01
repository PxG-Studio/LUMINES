/**
 * IDE Shell Component
 * 
 * Creates a mini-IDE layout with left, center, right, and bottom panels
 * Similar to Unity, Unreal, VSCode, and other professional IDEs
 */

import React from 'react';

interface IDEShellProps {
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  bottom?: React.ReactNode;
  top?: React.ReactNode;
  height?: string;
}

export function IDEShell({ 
  left, 
  center, 
  right, 
  bottom, 
  top,
  height = "100vh"
}: IDEShellProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "320px 1fr 320px",
      gridTemplateRows: top ? "auto 1fr 240px" : "1fr 240px",
      height,
      background: "var(--slate-bg)",
      color: "var(--slate-text)",
      fontFamily: "var(--font-primary, system-ui)",
      overflow: "hidden"
    }}>
      {top && (
        <div style={{ 
          gridColumn: "1 / 4", 
          gridRow: "1",
          borderBottom: "1px solid var(--slate-border)",
          background: "var(--slate-panel)"
        }}>
          {top}
        </div>
      )}

      <div style={{ 
        gridColumn: "1", 
        gridRow: top ? "2" : "1", 
        borderRight: "1px solid var(--slate-border)",
        overflow: "auto",
        background: "var(--slate-panel)"
      }}>
        {left || <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Left Panel</div>}
      </div>

      <div style={{ 
        gridColumn: "2", 
        gridRow: top ? "2" : "1", 
        overflow: "hidden",
        position: "relative",
        background: "var(--slate-bg)"
      }}>
        {center || <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Center Panel</div>}
      </div>

      <div style={{ 
        gridColumn: "3", 
        gridRow: top ? "2" : "1", 
        borderLeft: "1px solid var(--slate-border)",
        overflow: "auto",
        background: "var(--slate-panel)"
      }}>
        {right || <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Right Panel</div>}
      </div>

      <div style={{ 
        gridColumn: "1 / 4", 
        gridRow: top ? "3" : "2", 
        borderTop: "1px solid var(--slate-border)",
        overflow: "auto",
        background: "var(--slate-panel)"
      }}>
        {bottom || <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Bottom Panel</div>}
      </div>
    </div>
  );
}

