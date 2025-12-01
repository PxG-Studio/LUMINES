/**
 * Unity ↔ JS Messaging Bus
 * Bidirectional communication system between WISSIL and Unity WebGL
 * Similar to Bolt.new and StackBlitz runtime messaging
 */

export type UnityMessage = {
  type: string;
  payload?: any;
  timestamp?: number;
};

export type UnityMessageListener = (payload: any, message: UnityMessage) => void;

export class UnityMessagingBus {
  private static unityInstance: any = null;
  private static listeners: Record<string, UnityMessageListener[]> = {};
  private static messageQueue: UnityMessage[] = [];

  /**
   * Set Unity WebGL instance
   */
  static setUnityInstance(instance: any): void {
    this.unityInstance = instance;
    
    // Make receive method globally available for Unity
    (window as any).UnityBridge = {
      receive: this.receive.bind(this)
    };

    // Process queued messages
    this.processQueue();
  }

  /**
   * Get Unity instance
   */
  static getUnityInstance(): any {
    return this.unityInstance;
  }

  /**
   * Check if Unity is connected
   */
  static isConnected(): boolean {
    return this.unityInstance !== null;
  }

  /**
   * Receive message from Unity WebGL
   * Called by Unity via Application.ExternalCall or SendMessage
   */
  static receive(message: string | UnityMessage): void {
    let parsed: UnityMessage;

    if (typeof message === "string") {
      try {
        parsed = JSON.parse(message);
      } catch (err) {
        console.error("[UnityBridge] Failed to parse message:", err);
        return;
      }
    } else {
      parsed = message;
    }

    if (!parsed.type) {
      console.warn("[UnityBridge] Message missing type:", parsed);
      return;
    }

    parsed.timestamp = parsed.timestamp || Date.now();

    // Call all listeners for this message type
    const listeners = this.listeners[parsed.type] || [];
    listeners.forEach((fn) => {
      try {
        fn(parsed.payload || {}, parsed);
      } catch (err) {
        console.error(`[UnityBridge] Listener error for ${parsed.type}:`, err);
      }
    });

    // Also call wildcard listeners
    const wildcardListeners = this.listeners["*"] || [];
    wildcardListeners.forEach((fn) => {
      try {
        fn(parsed.payload || {}, parsed);
      } catch (err) {
        console.error(`[UnityBridge] Wildcard listener error:`, err);
      }
    });
  }

  /**
   * Send message to Unity
   */
  static send(type: string, payload?: any): boolean {
    if (!this.unityInstance) {
      // Queue message for when Unity loads
      this.messageQueue.push({ type, payload, timestamp: Date.now() });
      console.warn(`[UnityBridge] Unity not loaded, queued message: ${type}`);
      return false;
    }

    const message: UnityMessage = {
      type,
      payload,
      timestamp: Date.now()
    };

    try {
      // Try SendMessage first (Unity 2020+)
      if (typeof this.unityInstance.SendMessage === "function") {
        this.unityInstance.SendMessage(
          "JSBridge", // GameObject name in Unity
          "ReceiveMessage", // C# method name
          JSON.stringify(message)
        );
        return true;
      } else {
        console.warn("[UnityBridge] Unity instance does not support SendMessage");
        return false;
      }
    } catch (err) {
      console.error(`[UnityBridge] Error sending message ${type}:`, err);
      return false;
    }
  }

  /**
   * Register event listener
   */
  static on(type: string, listener: UnityMessageListener): () => void {
    if (!this.listeners[type]) {
      this.listeners[type] = [];
    }

    this.listeners[type].push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners[type]?.indexOf(listener);
      if (index !== undefined && index >= 0) {
        this.listeners[type].splice(index, 1);
      }
    };
  }

  /**
   * Remove event listener
   */
  static off(type: string, listener: UnityMessageListener): void {
    if (!this.listeners[type]) return;

    const index = this.listeners[type].indexOf(listener);
    if (index >= 0) {
      this.listeners[type].splice(index, 1);
    }
  }

  /**
   * Remove all listeners for a type
   */
  static removeAllListeners(type?: string): void {
    if (type) {
      delete this.listeners[type];
    } else {
      this.listeners = {};
    }
  }

  /**
   * Process queued messages
   */
  private static processQueue(): void {
    while (this.messageQueue.length > 0 && this.unityInstance) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message.type, message.payload);
      }
    }
  }

  /**
   * Clear all state
   */
  static reset(): void {
    this.unityInstance = null;
    this.listeners = {};
    this.messageQueue = [];
    delete (window as any).UnityBridge;
  }
}

