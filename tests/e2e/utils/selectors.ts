/**
 * Common Selectors
 * 
 * Centralized selectors for stable E2E tests
 */

export const selectors = {
  // Node Editor
  node: (nodeId?: string) => 
    nodeId ? `[data-node-id="${nodeId}"]` : '[data-node-id]',
  socket: (socketId?: string) => 
    socketId ? `[data-socket-id="${socketId}"]` : '[data-socket-id]',
  wire: (connectionId?: string) => 
    connectionId ? `[data-connection-id="${connectionId}"]` : 'path[stroke]',
  canvas: '[data-testid="blueprint-canvas"]',
  
  // Node Palette
  paletteItem: (nodeType?: string) => 
    nodeType ? `[data-palette-node="${nodeType}"]` : '[data-palette-node]',
  paletteSearch: 'input[placeholder*="Search nodes"]',
  
  // Inspector
  inspector: '[data-testid="blueprint-inspector"]',
  inspectorInput: (propName: string) => 
    `[data-inspector-prop="${propName}"]`,
  
  // Filesystem
  fileTree: '[data-testid="file-tree"]',
  fileTreeItem: (name: string) => 
    `[data-file-tree-item="${name}"]`,
  fileTab: (fileName: string) => 
    `[data-tab="${fileName}"]`,
  filePreview: '[data-testid="file-preview"]',
  
  // Editor Shell
  sidebar: '[data-testid="sidebar"]',
  topBar: '[data-testid="top-bar"]',
  commandPalette: '[data-testid="command-palette"]',
  commandPaletteInput: 'input[placeholder*="command"]',
  
  // AI Panels
  aiPanel: '[data-testid="ai-panel"]',
  aiSuggestion: (index?: number) => 
    index !== undefined ? `[data-ai-suggestion="${index}"]` : '[data-ai-suggestion]',
  
  // Templates
  templateCard: (templateId?: string) => 
    templateId ? `[data-template="${templateId}"]` : '[data-template]',
  templatePreview: '[data-testid="template-preview"]',
  
  // Runtime
  runtimeConsole: '[data-testid="runtime-console"]',
  runtimeLog: (index?: number) => 
    index !== undefined ? `[data-runtime-log="${index}"]` : '[data-runtime-log]',
  
  // Simulation
  simulationContainer: '[data-testid="simulation-container"]',
  gameState: '[data-testid="game-state"]',
} as const;

export type SelectorKey = keyof typeof selectors;

