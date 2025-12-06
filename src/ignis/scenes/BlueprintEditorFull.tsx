/**
 * Full Blueprint Editor Scene
 * 
 * Complete IDE scene combining all blueprint editor components
 */

import React from 'react';
import { AppShell } from '../../editor/shell/AppShell';
import { Sidebar } from '../../editor/shell/Sidebar';
import { TopBar } from '../../editor/shell/TopBar';
import { NodePalette } from '../palette/NodePalette';
import { BPGraphCanvas } from '../canvas/BPGraphCanvas';
import { BlueprintInspector } from '../inspector/BlueprintInspector';
import { DebuggerPanel } from '../debugger/DebuggerPanel';

export interface BlueprintEditorFullProps {
  graph?: any;
}

export const BlueprintEditorFull: React.FC<BlueprintEditorFullProps> = ({
  graph,
}) => {
  return (
    <AppShell
      sidebar={
        <Sidebar
          items={[
            { id: 'blueprints', label: 'Blueprints', icon: '📋' },
            { id: 'nodes', label: 'Node Library', icon: '🧩' },
            { id: 'templates', label: 'Templates', icon: '📦' },
          ]}
        />
      }
      topBar={<TopBar title="WISSIL Blueprint Editor" />}
      panels={
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ flex: 1, borderBottom: '1px solid var(--slate-border, #26292f)' }}>
            <BlueprintInspector />
          </div>
          <div style={{ flex: 1 }}>
            <DebuggerPanel />
          </div>
        </div>
      }
    >
      <div style={{ display: 'flex', height: '100%' }}>
        <div style={{ width: 250, borderRight: '1px solid var(--slate-border, #26292f)' }}>
          <NodePalette />
        </div>
        <div style={{ flex: 1 }}>
          <BPGraphCanvas graph={graph} />
        </div>
      </div>
    </AppShell>
  );
};

export default BlueprintEditorFull;

