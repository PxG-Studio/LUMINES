/**
 * Interactive Graph Component for MDX
 * 
 * Embeds live Ignis Blueprint graphs in Storybook documentation
 */

import React, { useEffect } from 'react';
import { BPGraphCanvas } from '../../src/ignis/blueprint/canvas/BPGraphCanvas';
import { useBPGraphStore } from '../../src/ignis/blueprint/store/BPGraphStore';
import { Graph } from '../../src/ignis/blueprint/schema/NodeSchema';

interface InteractiveGraphProps {
  graph?: Graph;
  readOnly?: boolean;
  height?: string;
}

export const GraphDemo: React.FC<InteractiveGraphProps> = ({ 
  graph, 
  readOnly = true,
  height = "600px"
}) => {
  const store = useBPGraphStore();
  
  useEffect(() => {
    if (graph) {
      store.loadGraph(graph);
    }
  }, [graph, store]);

  return (
    <div style={{ 
      height, 
      border: "1px solid var(--slate-border)", 
      borderRadius: 8,
      background: "var(--slate-bg)",
      margin: "16px 0",
      overflow: "hidden"
    }}>
      <BPGraphCanvas />
    </div>
  );
};

