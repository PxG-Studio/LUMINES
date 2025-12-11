/**
 * Graph Sync
 * 
 * Synchronizes Ignis Blueprint graph state across all users
 */

import { yGraph, yHistory, awareness } from './YProvider';
import { Graph, Node, Connection } from '../../ignis/blueprint/schema/NodeSchema';
import { lockManager } from './LockManager';

export class GraphSync {
  private userId: number;

  constructor() {
    this.userId = awareness.clientID;
  }

  syncGraph(graph: Graph) {
    // Sync graph metadata
    yGraph.set('id', graph.id);
    yGraph.set('name', graph.name);

    // Sync nodes
    if (graph.nodes) {
      Object.entries(graph.nodes).forEach(([id, node]) => {
        yGraph.set(`node:${id}`, node);
      });
    }

    // Sync connections
    if (graph.connections) {
      Object.entries(graph.connections).forEach(([id, conn]) => {
        yGraph.set(`conn:${id}`, conn);
      });
    }
  }

  observeGraph(callback: (graph: Graph) => void) {
    const updateGraph = () => {
      const graph: Graph = {
        id: (yGraph.get('id') as string) || 'default',
        name: (yGraph.get('name') as string) || 'Untitled',
        nodes: {},
        connections: {}
      };

      // Reconstruct graph from Y.js
      yGraph.forEach((value, key) => {
        if (key.startsWith('node:')) {
          const nodeId = key.replace('node:', '');
          graph.nodes[nodeId] = value as Node;
        } else if (key.startsWith('conn:')) {
          const connId = key.replace('conn:', '');
          graph.connections[connId] = value as Connection;
        }
      });

      callback(graph);
    };

    yGraph.observe(updateGraph);
    updateGraph(); // Initial call
  }

  updateNode(nodeId: string, updates: Partial<Node>): boolean {
    // Check lock
    if (lockManager.isLocked(nodeId)) {
      return false;
    }

    // Acquire lock
    if (!lockManager.lockNode(nodeId)) {
      return false;
    }

    try {
      const node = yGraph.get(`node:${nodeId}`) as Node;
      if (node) {
        yGraph.set(`node:${nodeId}`, { ...node, ...updates });
        this.recordAction('node:update', { nodeId, updates });
        return true;
      }
    } finally {
      // Lock will auto-expire
    }

    return false;
  }

  addNode(node: Node): boolean {
    if (lockManager.isLocked(node.id)) {
      return false;
    }

    if (!lockManager.lockNode(node.id)) {
      return false;
    }

    try {
      yGraph.set(`node:${node.id}`, node);
      this.recordAction('node:add', { node });
      return true;
    } finally {
      // Lock will auto-expire
    }
  }

  removeNode(nodeId: string): boolean {
    if (lockManager.isLocked(nodeId)) {
      return false;
    }

    if (!lockManager.lockNode(nodeId)) {
      return false;
    }

    try {
      yGraph.delete(`node:${nodeId}`);
      
      // Remove connections
      yGraph.forEach((value, key) => {
        if (key.startsWith('conn:')) {
          const conn = value as Connection;
          if (conn.fromNode === nodeId || conn.toNode === nodeId) {
            yGraph.delete(key);
          }
        }
      });

      this.recordAction('node:remove', { nodeId });
      return true;
    } finally {
      lockManager.unlockNode(nodeId);
    }
  }

  addConnection(conn: Connection): boolean {
    yGraph.set(`conn:${conn.id}`, conn);
    this.recordAction('conn:add', { conn });
    return true;
  }

  removeConnection(connId: string): boolean {
    yGraph.delete(`conn:${connId}`);
    this.recordAction('conn:remove', { connId });
    return true;
  }

  private recordAction(action: string, payload: any) {
    yHistory.push([{
      timestamp: Date.now(),
      userId: this.userId,
      action,
      payload
    }]);
  }
}

export const graphSync = new GraphSync();

