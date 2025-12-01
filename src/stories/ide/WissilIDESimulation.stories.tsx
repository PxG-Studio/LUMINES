/**
 * WISSIL IDE Simulation Story
 * 
 * Full IDE sandbox running inside Storybook
 */

import React, { useState, useEffect } from 'react';
import { IDEShell } from '@/wissil/ide-shell/IDEShell';
import { IDERibbon } from '@/wissil/ide-shell/IDERibbon';
import { BPGraphCanvas } from '@/ignis/blueprint/canvas/BPGraphCanvas';
import { NodePalette } from '@/ignis/blueprint/palette/NodePalette';
import { BlueprintInspector } from '@/ignis/inspector/BlueprintInspector';
import { RuntimeConsole } from '@/wissil/runtime/console/RuntimeConsole';
import { useBPGraphStore } from '@/ignis/blueprint/store/BPGraphStore';

export default {
  title: "Lumenforge.io Design System/Application Pages/Editor/IDE/WissilIDESimulation",
  parameters: {
    layout: "fullscreen",
    chromatic: { 
      disableSnapshot: true, // Disable for interactive stories
      delay: 1000 // Wait for animations
    },
  },
};

// Main IDE simulation
export const IDEPreview = () => {
  const [mode, setMode] = useState("Ignis");
  const graphStore = useBPGraphStore();

  useEffect(() => {
    // Load demo graph if available
    const demoGraph = {
      id: "demo",
      name: "Demo Graph",
      nodes: {},
      connections: {}
    };
    graphStore.loadGraph(demoGraph);
  }, [graphStore]);

  const renderLeftPanel = () => {
    switch (mode) {
      case "Ignis":
        return (
          <NodePalette 
            onSelect={(type) => {
              const graph = graphStore.getActiveGraph();
              if (graph) {
                graphStore.addNode(type, { x: 100, y: 100 });
              }
            }} 
          />
        );
      case "SceneGraph":
        return <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>SceneGraph Panel</div>;
      case "Shader":
        return <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Shader Library</div>;
      case "Templates":
        return <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Template Browser</div>;
      default:
        return <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Panel</div>;
    }
  };

  const renderCenterPanel = () => {
    switch (mode) {
      case "Ignis":
        return <BPGraphCanvas />;
      case "SceneGraph":
        return <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>SceneGraph Editor</div>;
      case "Shader":
        return <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Shader Graph Editor</div>;
      case "Templates":
        return <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Template Creator</div>;
      default:
        return <div style={{ padding: "16px", color: "var(--slate-text-muted)" }}>Editor</div>;
    }
  };

  return (
    <IDEShell
      top={<IDERibbon mode={mode} setMode={setMode} />}
      left={renderLeftPanel()}
      center={renderCenterPanel()}
      right={<BlueprintInspector />}
      bottom={<RuntimeConsole />}
    />
  );
};

// Layout-only story for Chromatic snapshots
export const IDELayout = () => (
  <IDEShell
    left={<div style={{ padding: "16px" }}>Left Panel</div>}
    center={<div style={{ padding: "16px" }}>Center Panel</div>}
    right={<div style={{ padding: "16px" }}>Right Panel</div>}
    bottom={<div style={{ padding: "16px" }}>Bottom Panel</div>}
  />
);

IDELayout.parameters = {
  chromatic: { disableSnapshot: false }
};

