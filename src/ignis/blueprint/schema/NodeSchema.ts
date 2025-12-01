/**
 * Node Schema
 * Core types for Ignis Blueprint visual scripting system
 */

/**
 * Socket Types
 */
export type SocketType = "exec" | "bool" | "int" | "float" | "string" | "vector3" | "object" | "any";

/**
 * Socket Direction
 */
export type SocketDirection = "input" | "output";

/**
 * Socket
 * Connection point on a node
 */
export interface Socket {
  id: string;
  name: string;
  type: SocketType;
  direction: SocketDirection;
  defaultValue?: any;
  required?: boolean;
}

/**
 * Node Type
 */
export type NodeType = "exec" | "data" | "event" | "variable" | "function";

/**
 * Node
 * Visual scripting node
 */
export interface Node {
  id: string;
  type: string; // Node type identifier (e.g., "Branch", "Add", "Print")
  nodeType: NodeType; // Category
  title: string;
  description?: string;
  position: { x: number; y: number };
  inputs: Socket[];
  outputs: Socket[];
  data: Record<string, any>; // Node-specific data
  category?: string;
  color?: string;
}

/**
 * Connection
 * Wire between two sockets
 */
export interface Connection {
  id: string;
  fromNodeId: string;
  fromSocketId: string;
  toNodeId: string;
  toSocketId: string;
  active?: boolean; // For execution highlighting
}

/**
 * Blueprint Graph
 * Complete visual script
 */
export interface BlueprintGraph {
  id: string;
  name: string;
  nodes: Node[];
  connections: Connection[];
  variables: BlueprintVariable[];
  entryPoint?: string; // Entry node ID
  metadata?: {
    author?: string;
    createdAt?: number;
    updatedAt?: number;
    description?: string;
  };
}

/**
 * Blueprint Variable
 */
export interface BlueprintVariable {
  id: string;
  name: string;
  type: SocketType;
  defaultValue?: any;
  scope?: "local" | "global";
}

/**
 * Node Definition
 * Template for creating nodes
 */
export interface NodeDefinition {
  type: string;
  nodeType: NodeType;
  title: string;
  description?: string;
  category: string;
  color?: string;
  inputs: Omit<Socket, "id">[];
  outputs: Omit<Socket, "id">[];
  create: (data?: Record<string, any>) => Node;
  execute?: (node: Node, inputs: Record<string, any>, context: ExecutionContext) => any;
}

/**
 * Execution Context
 */
export interface ExecutionContext {
  variables: Record<string, any>;
  graph: BlueprintGraph;
  executeNode: (nodeId: string, inputs?: Record<string, any>) => any;
  sendToUnity?: (message: string, payload: any) => void;
}

/**
 * Node Validation Result
 */
export interface NodeValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Graph Validation Result
 */
export interface GraphValidation {
  valid: boolean;
  errors: Array<{ nodeId?: string; message: string }>;
  warnings: Array<{ nodeId?: string; message: string }>;
}

