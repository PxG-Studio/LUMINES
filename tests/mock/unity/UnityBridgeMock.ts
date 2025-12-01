/**
 * Mock implementation of Unity Bridge for testing
 * Replaces actual Unity WebGL communication in test environments
 */

export interface UnityEvent {
  type: string;
  payload: any;
}

export class UnityBridgeMock {
  private eventListeners: Map<string, Set<(payload: any) => void>> = new Map();
  private sentEvents: UnityEvent[] = [];

  /**
   * Send an event to Unity (mocked)
   */
  send(eventType: string, payload: any): void {
    console.log("[UnityBridgeMock] Sending event:", eventType, payload);
    this.sentEvents.push({ type: eventType, payload });
  }

  /**
   * Listen for events from Unity (mocked)
   */
  on(eventType: string, callback: (payload: any) => void): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, new Set());
    }
    this.eventListeners.get(eventType)!.add(callback);
  }

  /**
   * Remove event listener
   */
  off(eventType: string, callback: (payload: any) => void): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
    }
  }

  /**
   * Simulate Unity sending an event (for testing)
   */
  simulateUnityEvent(eventType: string, payload: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(payload);
        } catch (error) {
          console.error(`[UnityBridgeMock] Error in listener for ${eventType}:`, error);
        }
      });
    }
  }

  /**
   * Get all sent events (for testing)
   */
  getSentEvents(): UnityEvent[] {
    return [...this.sentEvents];
  }

  /**
   * Clear sent events history
   */
  clearSentEvents(): void {
    this.sentEvents = [];
  }

  /**
   * Check if an event was sent
   */
  wasEventSent(eventType: string): boolean {
    return this.sentEvents.some(e => e.type === eventType);
  }
}

export const unityBridgeMock = new UnityBridgeMock();

// Export singleton instance
export default unityBridgeMock;

