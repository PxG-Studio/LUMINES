/**
 * Scene Graph Store
 * Zustand global database for Unity scene graph
 * Stores scene hierarchy and selection state
 */

import { create } from "zustand";

export interface SceneNode {
  id: string;
  name: string;
  parent: string | null;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number; w?: number };
  scale: { x: number; y: number; z: number };
  components: string[];
  active?: boolean;
  layer?: number;
  tag?: string;
}

interface SceneGraphState {
  nodes: Record<string, SceneNode>;
  selectedId: string | null;
  hoveredId: string | null;
  expandedNodes: Set<string>;

  // Actions
  updateNodes: (nodes: SceneNode[]) => void;
  updateNode: (node: SceneNode) => void;
  select: (id: string | null) => void;
  hover: (id: string | null) => void;
  toggleExpanded: (id: string) => void;
  clear: () => void;
  getRootNodes: () => SceneNode[];
  getChildren: (parentId: string) => SceneNode[];
  getNode: (id: string) => SceneNode | undefined;
}

/**
 * Scene Graph Store
 * Global state for Unity scene hierarchy
 */
export const useSceneGraph = create<SceneGraphState>((set, get) => ({
  nodes: {},
  selectedId: null,
  hoveredId: null,
  expandedNodes: new Set(),

  updateNodes: (nodeList: SceneNode[]) => {
    set((state) => {
      const nodes = { ...state.nodes };

      // Update or add nodes
      for (const node of nodeList) {
        nodes[node.id] = {
          ...nodes[node.id], // Preserve existing data if any
          ...node
        };
      }

      return { nodes };
    });
  },

  updateNode: (node: SceneNode) => {
    set((state) => ({
      nodes: {
        ...state.nodes,
        [node.id]: {
          ...state.nodes[node.id],
          ...node
        }
      }
    }));
  },

  select: (id: string | null) => {
    set({ selectedId: id });

    // Expand parent chain when selecting
    if (id) {
      const node = get().nodes[id];
      if (node && node.parent) {
        const parentChain: string[] = [];
        let current: SceneNode | undefined = node;

        while (current && current.parent) {
          parentChain.push(current.parent);
          current = get().nodes[current.parent];
        }

        set((state) => ({
          expandedNodes: new Set([...state.expandedNodes, ...parentChain])
        }));
      }
    }

    // Notify Unity of selection change
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("scenegraph-selection", {
          detail: { id }
        })
      );
    }
  },

  hover: (id: string | null) => {
    set({ hoveredId: id });

    // Notify Unity of hover change
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("scenegraph-hover", {
          detail: { id }
        })
      );
    }
  },

  toggleExpanded: (id: string) => {
    set((state) => {
      const expanded = new Set(state.expandedNodes);
      if (expanded.has(id)) {
        expanded.delete(id);
      } else {
        expanded.add(id);
      }
      return { expandedNodes: expanded };
    });
  },

  clear: () => {
    set({
      nodes: {},
      selectedId: null,
      hoveredId: null,
      expandedNodes: new Set()
    });
  },

  getRootNodes: () => {
    const nodes = get().nodes;
    return Object.values(nodes).filter((n) => !n.parent);
  },

  getChildren: (parentId: string) => {
    const nodes = get().nodes;
    return Object.values(nodes).filter((n) => n.parent === parentId);
  },

  getNode: (id: string) => {
    return get().nodes[id];
  }
}));

