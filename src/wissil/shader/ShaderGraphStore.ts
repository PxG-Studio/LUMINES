/**
 * Shader Graph Store
 * Zustand store for shader graph editor
 */

import { create } from "zustand";
import { ShaderGraph, ShaderNode, ShaderEdge } from "./ShaderGraphTypes";

interface ShaderGraphStoreState {
  graph: ShaderGraph;
  selectedNode: string | null;

  // Actions
  load: (graph: ShaderGraph) => void;
  addNode: (node: ShaderNode) => void;
  updateNode: (id: string, updates: Partial<ShaderNode>) => void;
  deleteNode: (id: string) => void;
  addEdge: (edge: ShaderEdge) => void;
  deleteEdge: (id: string) => void;
  setOutputNode: (id: string | null) => void;
  selectNode: (id: string | null) => void;
  clear: () => void;
}

const defaultGraph: ShaderGraph = {
  nodes: [],
  edges: [],
  outputNode: null,
  name: "Untitled Shader",
  version: "1.0.0"
};

/**
 * Shader Graph Store
 * Global state for shader graph editor
 */
export const useShaderGraphStore = create<ShaderGraphStoreState>((set, get) => ({
  graph: defaultGraph,
  selectedNode: null,

  load: (graph: ShaderGraph) => {
    set({ graph });
  },

  addNode: (node: ShaderNode) => {
    set((state) => ({
      graph: {
        ...state.graph,
        nodes: [...state.graph.nodes, node]
      }
    }));
  },

  updateNode: (id: string, updates: Partial<ShaderNode>) => {
    set((state) => ({
      graph: {
        ...state.graph,
        nodes: state.graph.nodes.map((node) =>
          node.id === id ? { ...node, ...updates } : node
        )
      }
    }));
  },

  deleteNode: (id: string) => {
    set((state) => ({
      graph: {
        ...state.graph,
        nodes: state.graph.nodes.filter((node) => node.id !== id),
        edges: state.graph.edges.filter(
          (edge) => edge.from.node !== id && edge.to.node !== id
        ),
        outputNode: state.graph.outputNode === id ? null : state.graph.outputNode
      },
      selectedNode: state.selectedNode === id ? null : state.selectedNode
    }));
  },

  addEdge: (edge: ShaderEdge) => {
    set((state) => ({
      graph: {
        ...state.graph,
        edges: [...state.graph.edges, edge]
      }
    }));
  },

  deleteEdge: (id: string) => {
    set((state) => ({
      graph: {
        ...state.graph,
        edges: state.graph.edges.filter((edge) => edge.id !== id)
      }
    }));
  },

  setOutputNode: (id: string | null) => {
    set((state) => ({
      graph: {
        ...state.graph,
        outputNode: id
      }
    }));
  },

  selectNode: (id: string | null) => {
    set({ selectedNode: id });
  },

  clear: () => {
    set({
      graph: defaultGraph,
      selectedNode: null
    });
  }
}));

