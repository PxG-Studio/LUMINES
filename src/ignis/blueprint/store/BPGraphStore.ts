/**
 * Blueprint Graph Store
 * Zustand store for managing blueprint graphs
 */

import { create } from "zustand";
import { BlueprintGraph, Node, Connection, BlueprintVariable } from "../schema/NodeSchema";

interface BPGraphStoreState {
  graphs: Record<string, BlueprintGraph>;
  currentGraphId: string | null;
  selectedNodes: Set<string>;
  selectedConnections: Set<string>;
  clipboard: {
    nodes: Node[];
    connections: Connection[];
  } | null;

  // Actions
  createGraph: (name: string) => string;
  loadGraph: (graphId: string) => void;
  saveGraph: (graphId: string, graph: BlueprintGraph) => void;
  deleteGraph: (graphId: string) => void;
  addNode: (graphId: string, node: Node) => void;
  updateNode: (graphId: string, nodeId: string, updates: Partial<Node>) => void;
  removeNode: (graphId: string, nodeId: string) => void;
  moveNode: (graphId: string, nodeId: string, position: { x: number; y: number }) => void;
  addConnection: (graphId: string, connection: Connection) => void;
  removeConnection: (graphId: string, connectionId: string) => void;
  selectNode: (nodeId: string, multi?: boolean) => void;
  selectConnection: (connectionId: string, multi?: boolean) => void;
  clearSelection: () => void;
  copy: () => void;
  paste: (graphId: string, position: { x: number; y: number }) => void;
  duplicateNode: (graphId: string, nodeId: string) => void;
  getCurrentGraph: () => BlueprintGraph | null;
  getNode: (graphId: string, nodeId: string) => Node | undefined;
}

/**
 * Blueprint Graph Store
 * Global state for blueprint graphs
 */
export const useBPGraphStore = create<BPGraphStoreState>((set, get) => ({
  graphs: {},
  currentGraphId: null,
  selectedNodes: new Set(),
  selectedConnections: new Set(),
  clipboard: null,

  createGraph: (name: string) => {
    const graphId = `graph_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const graph: BlueprintGraph = {
      id: graphId,
      name,
      nodes: [],
      connections: [],
      variables: [],
      metadata: {
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    };

    set((state) => ({
      graphs: {
        ...state.graphs,
        [graphId]: graph
      },
      currentGraphId: graphId
    }));

    return graphId;
  },

  loadGraph: (graphId: string) => {
    const graph = get().graphs[graphId];
    if (graph) {
      set({
        currentGraphId: graphId,
        selectedNodes: new Set(),
        selectedConnections: new Set()
      });
    }
  },

  saveGraph: (graphId: string, graph: BlueprintGraph) => {
    set((state) => ({
      graphs: {
        ...state.graphs,
        [graphId]: {
          ...graph,
          metadata: {
            ...graph.metadata,
            updatedAt: Date.now()
          }
        }
      }
    }));
  },

  deleteGraph: (graphId: string) => {
    set((state) => {
      const graphs = { ...state.graphs };
      delete graphs[graphId];
      return {
        graphs,
        currentGraphId: state.currentGraphId === graphId ? null : state.currentGraphId
      };
    });
  },

  addNode: (graphId: string, node: Node) => {
    const graph = get().graphs[graphId];
    if (!graph) return;

    set((state) => ({
      graphs: {
        ...state.graphs,
        [graphId]: {
          ...graph,
          nodes: [...graph.nodes, node]
        }
      }
    }));
  },

  updateNode: (graphId: string, nodeId: string, updates: Partial<Node>) => {
    const graph = get().graphs[graphId];
    if (!graph) return;

    set((state) => ({
      graphs: {
        ...state.graphs,
        [graphId]: {
          ...graph,
          nodes: graph.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n))
        }
      }
    }));
  },

  removeNode: (graphId: string, nodeId: string) => {
    const graph = get().graphs[graphId];
    if (!graph) return;

    // Remove node and all its connections
    set((state) => {
      const connections = graph.connections.filter(
        (c) => c.fromNodeId !== nodeId && c.toNodeId !== nodeId
      );

      return {
        graphs: {
          ...state.graphs,
          [graphId]: {
            ...graph,
            nodes: graph.nodes.filter((n) => n.id !== nodeId),
            connections
          }
        },
        selectedNodes: new Set(Array.from(state.selectedNodes).filter((id) => id !== nodeId))
      };
    });
  },

  moveNode: (graphId: string, nodeId: string, position: { x: number; y: number }) => {
    get().updateNode(graphId, nodeId, { position });
  },

  addConnection: (graphId: string, connection: Connection) => {
    const graph = get().graphs[graphId];
    if (!graph) return;

    // Check if connection already exists
    const exists = graph.connections.some(
      (c) =>
        c.fromNodeId === connection.fromNodeId &&
        c.fromSocketId === connection.fromSocketId &&
        c.toNodeId === connection.toNodeId &&
        c.toSocketId === connection.toSocketId
    );

    if (exists) return;

    set((state) => ({
      graphs: {
        ...state.graphs,
        [graphId]: {
          ...graph,
          connections: [...graph.connections, connection]
        }
      }
    }));
  },

  removeConnection: (graphId: string, connectionId: string) => {
    const graph = get().graphs[graphId];
    if (!graph) return;

    set((state) => ({
      graphs: {
        ...state.graphs,
        [graphId]: {
          ...graph,
          connections: graph.connections.filter((c) => c.id !== connectionId)
        }
      },
      selectedConnections: new Set(Array.from(state.selectedConnections).filter((id) => id !== connectionId))
    }));
  },

  selectNode: (nodeId: string, multi: boolean = false) => {
    set((state) => ({
      selectedNodes: multi
        ? new Set([...state.selectedNodes, nodeId])
        : new Set([nodeId]),
      selectedConnections: new Set() // Clear connection selection when selecting node
    }));
  },

  selectConnection: (connectionId: string, multi: boolean = false) => {
    set((state) => ({
      selectedConnections: multi
        ? new Set([...state.selectedConnections, connectionId])
        : new Set([connectionId]),
      selectedNodes: new Set() // Clear node selection when selecting connection
    }));
  },

  clearSelection: () => {
    set({
      selectedNodes: new Set(),
      selectedConnections: new Set()
    });
  },

  copy: () => {
    const graph = get().getCurrentGraph();
    if (!graph) return;

    const selectedNodes = Array.from(get().selectedNodes);
    const nodes = graph.nodes.filter((n) => selectedNodes.includes(n.id));
    const connections = graph.connections.filter(
      (c) => selectedNodes.includes(c.fromNodeId) && selectedNodes.includes(c.toNodeId)
    );

    set({
      clipboard: {
        nodes,
        connections
      }
    });
  },

  paste: (graphId: string, position: { x: number; y: number }) => {
    const clipboard = get().clipboard;
    if (!clipboard || clipboard.nodes.length === 0) return;

    const offsetX = position.x - clipboard.nodes[0].position.x;
    const offsetY = position.y - clipboard.nodes[0].position.y;

    const newNodes = clipboard.nodes.map((node) => ({
      ...node,
      id: `${node.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      position: {
        x: node.position.x + offsetX,
        y: node.position.y + offsetY
      }
    }));

    const nodeIdMap = new Map(
      clipboard.nodes.map((n, i) => [n.id, newNodes[i].id])
    );

    const newConnections = clipboard.connections
      .map((conn) => {
        const fromNodeId = nodeIdMap.get(conn.fromNodeId);
        const toNodeId = nodeIdMap.get(conn.toNodeId);
        if (!fromNodeId || !toNodeId) return null;

        return {
          ...conn,
          id: `conn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fromNodeId,
          toNodeId
        };
      })
      .filter((c): c is Connection => c !== null);

    newNodes.forEach((node) => get().addNode(graphId, node));
    newConnections.forEach((conn) => get().addConnection(graphId, conn));

    // Select pasted nodes
    set({
      selectedNodes: new Set(newNodes.map((n) => n.id))
    });
  },

  duplicateNode: (graphId: string, nodeId: string) => {
    const node = get().getNode(graphId, nodeId);
    if (!node) return;

    const newNode: Node = {
      ...node,
      id: `${node.id}_copy_${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50
      }
    };

    get().addNode(graphId, newNode);
    get().selectNode(newNode.id, false);
  },

  getCurrentGraph: () => {
    const graphId = get().currentGraphId;
    if (!graphId) return null;
    return get().graphs[graphId] || null;
  },

  getNode: (graphId: string, nodeId: string) => {
    const graph = get().graphs[graphId];
    if (!graph) return undefined;
    return graph.nodes.find((n) => n.id === nodeId);
  }
}));

