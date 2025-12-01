/**
 * Mock implementation of Collaboration Server for testing
 * Simulates real-time multi-user editing
 */

export interface CollabOperation {
  id: string;
  type: 'addNode' | 'removeNode' | 'updateNode' | 'addConnection' | 'removeConnection';
  graphId: string;
  payload: any;
  userId: string;
  timestamp: number;
}

export class CollabServerMock {
  private operations: CollabOperation[] = [];
  private clients: Map<string, Set<(op: CollabOperation) => void>> = new Map();
  private latency: number = 50; // Simulated network latency in ms

  /**
   * Connect a client to the collaboration server
   */
  connect(clientId: string, onOperation: (op: CollabOperation) => void): void {
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, new Set());
    }
    this.clients.get(clientId)!.add(onOperation);
  }

  /**
   * Disconnect a client
   */
  disconnect(clientId: string): void {
    this.clients.delete(clientId);
  }

  /**
   * Broadcast operation to all clients (except sender)
   */
  async broadcastOperation(operation: CollabOperation, excludeClientId?: string): Promise<void> {
    this.operations.push(operation);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, this.latency));

    // Broadcast to all connected clients except sender
    for (const [clientId, listeners] of this.clients.entries()) {
      if (clientId !== excludeClientId) {
        listeners.forEach(listener => {
          try {
            listener(operation);
          } catch (error) {
            console.error(`[CollabServerMock] Error broadcasting to ${clientId}:`, error);
          }
        });
      }
    }
  }

  /**
   * Get operation history
   */
  getHistory(graphId?: string): CollabOperation[] {
    if (graphId) {
      return this.operations.filter(op => op.graphId === graphId);
    }
    return [...this.operations];
  }

  /**
   * Clear operation history (for testing)
   */
  clearHistory(): void {
    this.operations = [];
  }

  /**
   * Set simulated latency
   */
  setLatency(ms: number): void {
    this.latency = ms;
  }

  /**
   * Simulate packet loss (for stress testing)
   */
  simulatePacketLoss(probability: number): void {
    // Implementation would randomly drop operations
    // This is a placeholder for stress testing scenarios
  }
}

export const collabServerMock = new CollabServerMock();

// Export singleton instance
export default collabServerMock;

