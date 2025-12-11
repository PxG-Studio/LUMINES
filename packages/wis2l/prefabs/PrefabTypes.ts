/**
 * Prefab Types
 * Core types for Unity prefab system
 */

export interface PrefabTransform {
  pos: { x: number; y: number; z: number };
  rot: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
}

export interface PrefabComponent {
  type: string;
  json: string;
  properties?: Record<string, any>;
}

export interface PrefabData {
  id: string;
  name: string;
  transform: PrefabTransform;
  components: PrefabComponent[];
  children: PrefabData[];
  prefabPath?: string;
  guid?: string;
}

export interface PrefabDiff {
  path: string;
  original: any;
  modified: any;
  type: "add" | "remove" | "modify";
}

export interface PrefabOverride {
  nodeId: string;
  property: string;
  value: any;
}

