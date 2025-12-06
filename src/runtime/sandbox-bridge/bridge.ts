/**
 * Sandbox Bridge - Communication layer between Slate (editor) and Ignition (runtime)
 * Uses postMessage for iframe communication and WebSocket for live updates
 */

export interface BridgeMessage {
  type: 'code-change' | 'file-change' | 'compile' | 'error' | 'hmr' | 'ready' | 'request-files';
  payload: any;
  timestamp: number;
  id?: string;
}

export interface BridgeOptions {
  targetOrigin?: string;
  enableWebSocket?: boolean;
  wsUrl?: string;
}

export class SandboxBridge {
  private targetWindow: Window | null = null;
  private targetOrigin: string;
  private ws: WebSocket | null = null;
  private messageQueue: BridgeMessage[] = [];
  private listeners: Map<string, Set<(message: BridgeMessage) => void>> = new Map();
  private isReady = false;

  constructor(options: BridgeOptions = {}) {
    this.targetOrigin = options.targetOrigin || '*';
    
    if (options.enableWebSocket && options.wsUrl) {
      this.connectWebSocket(options.wsUrl);
    }

    // Listen for messages from sandbox
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handleMessage.bind(this));
    }
  }

  connect(targetWindow: Window): void {
    this.targetWindow = targetWindow;
    this.isReady = true;
    this.flushQueue();
  }

  private connectWebSocket(url: string): void {
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('[Bridge] WebSocket connected');
        this.flushQueue();
      };
      
      this.ws.onmessage = (event) => {
        try {
          const message: BridgeMessage = JSON.parse(event.data);
          this.handleMessage({ data: message } as MessageEvent);
        } catch (error) {
          console.error('[Bridge] Failed to parse WebSocket message:', error);
        }
      };
      
      this.ws.onerror = (error) => {
        console.error('[Bridge] WebSocket error:', error);
      };
      
      this.ws.onclose = () => {
        console.log('[Bridge] WebSocket closed, attempting reconnect...');
        setTimeout(() => this.connectWebSocket(url), 3000);
      };
    } catch (error) {
      console.error('[Bridge] Failed to create WebSocket:', error);
    }
  }

  private handleMessage(event: MessageEvent): void {
    const message = event.data as BridgeMessage;
    
    if (!message || !message.type) return;

    // Notify all listeners for this message type
    const listeners = this.listeners.get(message.type);
    if (listeners) {
      listeners.forEach((listener) => listener(message));
    }

    // Notify wildcard listeners
    const wildcardListeners = this.listeners.get('*');
    if (wildcardListeners) {
      wildcardListeners.forEach((listener) => listener(message));
    }
  }

  send(message: BridgeMessage): void {
    message.timestamp = Date.now();
    
    if (!this.isReady) {
      this.messageQueue.push(message);
      return;
    }

    // Send via postMessage
    if (this.targetWindow) {
      this.targetWindow.postMessage(message, this.targetOrigin);
    }

    // Send via WebSocket if available
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  on(type: string, listener: (message: BridgeMessage) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    
    this.listeners.get(type)!.add(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.listeners.get(type);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  off(type: string, listener: (message: BridgeMessage) => void): void {
    const listeners = this.listeners.get(type);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  private flushQueue(): void {
    while (this.messageQueue.length > 0 && this.isReady) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.targetWindow = null;
    this.isReady = false;
    this.listeners.clear();
  }
}

// Singleton instance
let bridgeInstance: SandboxBridge | null = null;

export function getBridge(options?: BridgeOptions): SandboxBridge {
  if (!bridgeInstance) {
    bridgeInstance = new SandboxBridge(options);
  }
  return bridgeInstance;
}

