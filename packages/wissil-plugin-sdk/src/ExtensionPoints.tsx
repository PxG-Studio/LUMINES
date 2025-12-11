/**
 * Extension Points
 * 
 * Type definitions and examples for plugin extension points
 */

import React from 'react';
import type { NodeDefinition } from '@wissil/kernel';

// ============================================================================
// Extension Point 1: Ignis Node Packs
// ============================================================================

export interface CustomNodeDefinition extends NodeDefinition {
  pluginId: string;
  pluginVersion: string;
}

// Example: Noise Generator Node
export const NoiseGeneratorNode: CustomNodeDefinition = {
  type: "NoiseGenerator",
  pluginId: "com.example.noise-pack",
  pluginVersion: "1.0.0",
  nodeType: "data",
  title: "Noise Generator",
  description: "Generate Perlin noise",
  category: "Math",
  color: "#7B68EE",
  inputs: [
    { name: "Seed", type: "float", direction: "input", defaultValue: 0 },
    { name: "Scale", type: "float", direction: "input", defaultValue: 1 }
  ],
  outputs: [
    { name: "Value", type: "float", direction: "output" }
  ],
  create: (data) => ({
    id: "",
    type: "NoiseGenerator",
    nodeType: "data",
    title: "Noise Generator",
    position: { x: 0, y: 0 },
    inputs: [
      { id: "seed_in", name: "Seed", type: "float", direction: "input", defaultValue: 0 },
      { id: "scale_in", name: "Scale", type: "float", direction: "input", defaultValue: 1 }
    ],
    outputs: [
      { id: "value_out", name: "Value", type: "float", direction: "output" }
    ],
    data: data || {}
  }),
  execute: (node, inputs) => {
    // Simplified Perlin noise implementation
    const seed = inputs.Seed || 0;
    const scale = inputs.Scale || 1;
    return Math.sin(seed * scale) * 0.5 + 0.5;
  },
  generate: (node, inputs) => {
    return `NoiseGenerator.Generate(${inputs.Seed || "0f"}, ${inputs.Scale || "1f"})`;
  }
};

// ============================================================================
// Extension Point 2: ShaderGraph Nodes
// ============================================================================

export interface CustomShaderNode {
  type: string;
  pluginId: string;
  inputs: ShaderSocket[];
  outputs: ShaderSocket[];
  glslCode: string;
}

export interface ShaderSocket {
  name: string;
  type: 'vec2' | 'vec3' | 'vec4' | 'float' | 'int' | 'sampler2D';
  defaultValue?: any;
}

// Example: Perlin Noise Shader Node
export const PerlinNoiseShaderNode: CustomShaderNode = {
  type: "PerlinNoise",
  pluginId: "com.example.shader-pack",
  inputs: [
    { name: "UV", type: "vec2" },
    { name: "Scale", type: "float", defaultValue: 1.0 }
  ],
  outputs: [
    { name: "Noise", type: "float" }
  ],
  glslCode: `
    float perlinNoise(vec2 uv, float scale) {
      // Simplified Perlin noise implementation
      return (sin(uv.x * scale) + cos(uv.y * scale)) * 0.5 + 0.5;
    }
  `
};

// ============================================================================
// Extension Point 3: Spark Template Packs
// ============================================================================

export interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  pluginId: string;
  graph: any;
  metadata: {
    category: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
}

// Example: Card Battler Template
export const CardBattlerTemplate: CustomTemplate = {
  id: "card-battler",
  name: "Card Battler Template",
  description: "Complete card game template with turn system",
  pluginId: "com.example.card-game-pack",
  graph: {
    id: "card-battler-graph",
    name: "Card Battler",
    nodes: {},
    connections: {}
  },
  metadata: {
    category: "Game Templates",
    tags: ["card-game", "turn-based", "strategy"],
    difficulty: "intermediate"
  }
};

// ============================================================================
// Extension Point 4: Inspector Panels
// ============================================================================

export interface CustomInspector {
  componentType: string;
  InspectorComponent: React.ComponentType<{ object: any; onChange: (data: any) => void }>;
}

// Example: Custom Prefab Inspector
export const CustomPrefabInspector: CustomInspector = {
  componentType: "CustomPrefab",
  InspectorComponent: ({ object, onChange }) => (
    <div style={{ padding: "12px" }}>
      <label style={{ display: "block", marginBottom: "8px" }}>Custom Property</label>
      <input 
        type="text"
        value={object.customProperty || ''} 
        onChange={(e) => onChange({ ...object, customProperty: e.target.value })}
        style={{ width: "100%", padding: "4px" }}
      />
    </div>
  )
};

// ============================================================================
// Extension Point 5: Custom UI Panels
// ============================================================================

export interface CustomPanel {
  id: string;
  title: string;
  icon?: string;
  PanelComponent: React.ComponentType;
  location?: 'left' | 'right' | 'bottom' | 'top';
}

// Example: Collision Debug Panel
export const CollisionDebugPanel: CustomPanel = {
  id: "collision-debug",
  title: "Collision Debug",
  icon: "🐛",
  PanelComponent: () => (
    <div style={{ padding: "16px" }}>
      <h3>Collision Debug Log</h3>
      <div style={{ 
        fontFamily: "monospace", 
        fontSize: "12px",
        background: "#1a1a1a",
        padding: "8px",
        borderRadius: "4px"
      }}>
        No collisions detected
      </div>
    </div>
  ),
  location: "right"
};

// ============================================================================
// Extension Point 6: Waypoint Extensions (AI Plugins)
// ============================================================================

export interface AIExtension {
  command: string;
  handler: (prompt: string, context: any) => Promise<string>;
  description: string;
}

// Example: Pathfinding AI Extension
export const PathfindingAIExtension: AIExtension = {
  command: "generate-pathfinding",
  description: "Generate pathfinding blueprint logic",
  handler: async (prompt, context) => {
    // AI generates pathfinding nodes
    const pathfindingGraph = {
      nodes: [
        { type: "Start", position: { x: 0, y: 0 } },
        { type: "Pathfind", position: { x: 200, y: 0 } },
        { type: "Move", position: { x: 400, y: 0 } }
      ],
      connections: []
    };
    return JSON.stringify(pathfindingGraph);
  }
};

// ============================================================================
// Extension Point 7: Build Hooks (Ignition)
// ============================================================================

export interface BuildHook {
  name: string;
  stage: 'pre-build' | 'post-build' | 'pre-export' | 'post-export';
  handler: (context: BuildContext) => Promise<void>;
}

export interface BuildContext {
  config: any;
  assets: any[];
  outputPath: string;
  log: (message: string) => void;
}

// Example: Texture Compressor Hook
export const TextureCompressorHook: BuildHook = {
  name: "compress-textures",
  stage: "pre-build",
  handler: async (context) => {
    context.log("Compressing textures...");
    // Texture compression logic
    context.log("Textures compressed successfully");
  }
};


