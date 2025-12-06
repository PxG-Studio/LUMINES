/**
 * IDE Ribbon Component
 * 
 * Toolbar for switching between different IDE modes/subsystems
 */

import React from 'react';

const modes = [
  { id: "Ignis", label: "🔷 Ignis", icon: "🔷" },
  { id: "SceneGraph", label: "🌳 SceneGraph", icon: "🌳" },
  { id: "Shader", label: "🎨 Shader", icon: "🎨" },
  { id: "Templates", label: "✨ Templates", icon: "✨" },
  { id: "Runtime", label: "⚡ Runtime", icon: "⚡" },
  { id: "Waypoint", label: "🧭 Waypoint", icon: "🧭" },
];

interface IDERibbonProps {
  mode: string;
  setMode: (mode: string) => void;
}

export function IDERibbon({ mode, setMode }: IDERibbonProps) {
  return (
    <div style={{
      height: 36,
      display: "flex",
      alignItems: "center",
      padding: "0 12px",
      background: "var(--slate-panel)",
      borderBottom: "1px solid var(--slate-border)",
      gap: "4px"
    }}>
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          style={{
            padding: "4px 12px",
            background: mode === m.id ? "var(--slate-accent)" : "transparent",
            color: mode === m.id ? "white" : "var(--slate-text)",
            border: mode === m.id ? "1px solid var(--slate-accent)" : "1px solid var(--slate-border)",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: mode === m.id ? 600 : 400,
            transition: "all 0.2s",
            whiteSpace: "nowrap"
          }}
          onMouseEnter={(e) => {
            if (mode !== m.id) {
              e.currentTarget.style.background = "var(--slate-bg)";
            }
          }}
          onMouseLeave={(e) => {
            if (mode !== m.id) {
              e.currentTarget.style.background = "transparent";
            }
          }}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}

