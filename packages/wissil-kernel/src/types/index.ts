/**
 * Core Types
 * 
 * Shared TypeScript types used across all WISSIL subsystems
 */

// Graph types (from Ignis)
export interface Graph {
  id: string;
  name: string;
  nodes: Record<string, Node>;
  connections: Record<string, Connection>;
}

export interface Node {
  id: string;
  type: string;
  nodeType: "exec" | "data" | "event";
  title: string;
  position: { x: number; y: number };
  inputs: Socket[];
  outputs: Socket[];
  data: Record<string, any>;
}

export interface Socket {
  id: string;
  name: string;
  type: SocketType;
  direction: "input" | "output";
  required?: boolean;
  defaultValue?: any;
}

export type SocketType = "exec" | "float" | "string" | "bool" | "vector3" | "object" | "int";

export interface Connection {
  id: string;
  fromNode: string;
  fromSocket: string;
  toNode: string;
  toSocket: string;
}

// Session types
export interface SessionMetadata {
  sessionId: string;
  userId: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  branch?: string;
  parentSessionId?: string;
  eventCount: number;
  lastEventTime: number;
}

// Event types
export interface IDEEvent {
  sessionId: string;
  userId: string;
  timestamp: number;
  event: {
    type: string;
    subsystem: 'ignis' | 'unity' | 'spark' | 'ignition' | 'waypoint';
    payload: any;
  };
  metadata?: {
    version?: string;
    branch?: string;
    parentEventId?: string;
  };
}

// Subsystem types
export type Subsystem = 'ignis' | 'unity' | 'spark' | 'ignition' | 'waypoint' | 'slate';

