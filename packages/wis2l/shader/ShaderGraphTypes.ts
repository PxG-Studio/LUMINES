/**
 * Shader Graph Types
 * Core types for node-based shader editor
 */

export interface ShaderNode {
  id: string;
  type: string; // e.g., "color", "mul", "add", "uv", "tex"
  position: { x: number; y: number };
  data: Record<string, any>;
}

export interface ShaderEdge {
  id: string;
  from: { node: string; port: string };
  to: { node: string; port: string };
}

export interface ShaderGraph {
  nodes: ShaderNode[];
  edges: ShaderEdge[];
  outputNode: string | null;
  name?: string;
  version?: string;
}

export interface NodeDefinition {
  id: string;
  label: string;
  inputs: string[];
  outputs: string[];
  default?: Record<string, any>;
  code: (inputs: Record<string, any>, data: Record<string, any>) => string;
  category?: string;
}

export interface NodePort {
  id: string;
  type: "input" | "output";
  name: string;
  dataType: "float" | "vec2" | "vec3" | "vec4" | "texture";
}

