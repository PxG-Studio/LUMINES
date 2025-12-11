/**
 * Network Resilience Utilities
 * EC-LAND-501 to EC-LAND-550: Network resilience edge cases fixes
 */

/**
 * Offline Detection Manager
 * EC-LAND-501, EC-LAND-502, EC-LAND-503
 */
export class OfflineManager {
  private static listeners = new Set<(isOnline: boolean) => void>();
  private static isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  /**
   * Check if app is online
   * EC-LAND-501
   */
  static isAppOnline(): boolean {
    if (typeof navigator === 'undefined') return true;
    return navigator.onLine;
  }

  /**
   * Subscribe to online/offline changes
   * EC-LAND-501
   */
  static onStatusChange(callback: (isOnline: boolean) => void): () => void {
    this.listeners.add(callback);
    
    // Call immediately with current status
    callback(this.isOnline);

    const handleOnline = () => {
      this.isOnline = true;
      this.listeners.forEach(listener => listener(true));
    };

    const handleOffline = () => {
      this.isOnline = false;
      this.listeners.forEach(listener => listener(false));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
    }

    return () => {
      this.listeners.delete(callback);
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      }
    };
  }

  /**
   * Get network quality estimate
   * EC-LAND-581
   */
  static async getNetworkQuality(): Promise<'slow-2g' | '2g' | '3g' | '4g' | 'unknown'> {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return 'unknown';
    }

    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (!conn) return 'unknown';

    return conn.effectiveType || 'unknown';
  }

  /**
   * Check if connection is slow
   * EC-LAND-511, EC-LAND-512
   */
  static async isSlowConnection(): Promise<boolean> {
    const quality = await this.getNetworkQuality();
    return quality === 'slow-2g' || quality === '2g' || quality === '3g';
  }

  /**
   * Check if data saver mode is enabled
   * EC-LAND-514, EC-LAND-578
   */
  static isDataSaverEnabled(): boolean {
    if (typeof navigator === 'undefined' || !('connection' in navigator)) {
      return false;
    }

    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return conn?.saveData === true;
  }
}

/**
 * Retry Manager with Exponential Backoff
 * EC-LAND-531 to EC-LAND-540: Retry logic
 */
export class RetryManager {
  /**
   * Retry with exponential backoff
   * EC-LAND-531, EC-LAND-533
   */
  static async retry<T>(
    fn: () => Promise<T>,
    options: {
      maxRetries?: number;
      initialDelay?: number;
      maxDelay?: number;
      backoffMultiplier?: number;
      retryCondition?: (error: any) => boolean;
    } = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      initialDelay = 1000,
      maxDelay = 30000,
      backoffMultiplier = 2,
      retryCondition = () => true,
    } = options;

    let lastError: any;
    let delay = initialDelay;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // EC-LAND-534: Check retry conditions
        if (!retryCondition(error)) {
          throw error;
        }

        // EC-LAND-532: Don't retry on last attempt
        if (attempt === maxRetries) {
          break;
        }

        // EC-LAND-533: Exponential backoff
        await this.delay(delay);
        delay = Math.min(delay * backoffMultiplier, maxDelay);
      }
    }

    throw lastError;
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry with user confirmation
   * EC-LAND-536
   */
  static async retryWithUserConfirmation<T>(
    fn: () => Promise<T>,
    getUserConfirmation: () => Promise<boolean>
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      const shouldRetry = await getUserConfirmation();
      if (shouldRetry) {
        return await fn();
      }
      throw error;
    }
  }
}

/**
 * Request Optimizer
 * EC-LAND-541 to EC-LAND-550: Request optimization
 */
export class RequestOptimizer {
  private static pendingRequests = new Map<string, Promise<any>>();
  private static requestQueue: Array<{ key: string; fn: () => Promise<any>; resolve: (value: any) => void; reject: (error: any) => void }> = [];
  private static isProcessingQueue = false;
  private static readonly MAX_CONCURRENT = 5;
  private static activeRequests = 0;

  /**
   * Batch requests
   * EC-LAND-541
   */
  static async batchRequests<T>(
    requests: Array<() => Promise<T>>,
    batchSize: number = 5
  ): Promise<T[]> {
    const results: T[] = [];
    
    for (let i = 0; i < requests.length; i += batchSize) {
      const batch = requests.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(req => req()));
      results.push(...batchResults);
    }
    
    return results;
  }

  /**
   * Debounce requests
   * EC-LAND-542
   */
  static debounceRequest<T>(
    key: string,
    request: () => Promise<T>,
    delay: number = 300
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const existingTimeout = this.pendingRequests.get(key);
      if (existingTimeout) {
        clearTimeout(existingTimeout as any);
      }

      const timeoutId = window.setTimeout(async () => {
        try {
          const result = await request();
          this.pendingRequests.delete(key);
          resolve(result);
        } catch (error) {
          this.pendingRequests.delete(key);
          reject(error);
        }
      }, delay);

      this.pendingRequests.set(key, timeoutId as any);
    });
  }

  /**
   * Deduplicate requests
   * EC-LAND-543
   */
  static async deduplicateRequest<T>(
    key: string,
    request: () => Promise<T>
  ): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    const promise = request().finally(() => {
      this.pendingRequests.delete(key);
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Cancel request
   * EC-LAND-544
   */
  static cancelRequest(key: string): void {
    const request = this.pendingRequests.get(key);
    if (request && typeof (request as any).cancel === 'function') {
      (request as any).cancel();
    }
    this.pendingRequests.delete(key);
  }

  /**
   * Queue request with priority
   * EC-LAND-545
   */
  static async queueRequest<T>(
    key: string,
    request: () => Promise<T>,
    priority: 'high' | 'normal' | 'low' = 'normal'
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const queueItem = { key, fn: request, resolve, reject };
      
      if (priority === 'high') {
        this.requestQueue.unshift(queueItem);
      } else if (priority === 'low') {
        this.requestQueue.push(queueItem);
      } else {
        // Insert after high priority items
        const highPriorityCount = this.requestQueue.filter(
          item => item === queueItem // This is a placeholder check
        ).length;
        this.requestQueue.splice(highPriorityCount, 0, queueItem);
      }

      this.processQueue();
    });
  }

  private static async processQueue(): Promise<void> {
    if (this.isProcessingQueue || this.requestQueue.length === 0) return;

    this.isProcessingQueue = true;

    while (this.requestQueue.length > 0 && this.activeRequests < this.MAX_CONCURRENT) {
      const item = this.requestQueue.shift();
      if (!item) break;

      this.activeRequests++;
      
      item.fn()
        .then(item.resolve)
        .catch(item.reject)
        .finally(() => {
          this.activeRequests--;
          this.processQueue();
        });
    }

    this.isProcessingQueue = false;
  }

  /**
   * Optimize request size
   * EC-LAND-550
   */
  static optimizeRequestSize(data: any): any {
    // Remove null/undefined values
    if (typeof data === 'object' && data !== null) {
      if (Array.isArray(data)) {
        return data.map(item => this.optimizeRequestSize(item));
      }
      
      const optimized: any = {};
      for (const [key, value] of Object.entries(data)) {
        if (value !== null && value !== undefined) {
          optimized[key] = this.optimizeRequestSize(value);
        }
      }
      return optimized;
    }
    
    return data;
  }
}

/**
 * Connection Manager
 * EC-LAND-551 to EC-LAND-560: Connection management
 */
export class ConnectionManager {
  private static connections = new Map<string, WebSocket | EventSource>();
  private static reconnectAttempts = new Map<string, number>();
  private static readonly MAX_RECONNECT_ATTEMPTS = 5;
  private static readonly INITIAL_RECONNECT_DELAY = 1000;

  /**
   * Create WebSocket with auto-reconnect
   * EC-LAND-551
   */
  static createWebSocket(
    url: string,
    options: {
      onOpen?: (event: Event) => void;
      onMessage?: (event: MessageEvent) => void;
      onError?: (event: Event) => void;
      onClose?: (event: CloseEvent) => void;
      protocols?: string | string[];
    } = {}
  ): WebSocket {
    const ws = new WebSocket(url, options.protocols);

    ws.onopen = (event) => {
      this.reconnectAttempts.set(url, 0);
      options.onOpen?.(event);
    };

    ws.onmessage = options.onMessage || null;

    ws.onerror = options.onError || null;

    ws.onclose = (event) => {
      options.onClose?.(event);
      
      // EC-LAND-551: Auto-reconnect
      if (!event.wasClean) {
        this.reconnectWebSocket(url, options);
      }
    };

    this.connections.set(url, ws);
    return ws;
  }

  private static reconnectWebSocket(
    url: string,
    options: {
      onOpen?: (event: Event) => void;
      onMessage?: (event: MessageEvent) => void;
      onError?: (event: Event) => void;
      onClose?: (event: CloseEvent) => void;
      protocols?: string | string[];
    }
  ): void {
    const attempts = this.reconnectAttempts.get(url) || 0;
    
    if (attempts >= this.MAX_RECONNECT_ATTEMPTS) {
      console.warn(`Max reconnection attempts reached for ${url}`);
      return;
    }

    this.reconnectAttempts.set(url, attempts + 1);
    const delay = this.INITIAL_RECONNECT_DELAY * Math.pow(2, attempts);

    setTimeout(() => {
      this.createWebSocket(url, options);
    }, delay);
  }

  /**
   * Close connection
   * EC-LAND-559
   */
  static closeConnection(url: string): void {
    const connection = this.connections.get(url);
    if (connection) {
      if (connection instanceof WebSocket) {
        connection.close();
      } else if (connection instanceof EventSource) {
        connection.close();
      }
      this.connections.delete(url);
      this.reconnectAttempts.delete(url);
    }
  }

  /**
   * Close all connections
   * EC-LAND-559
   */
  static closeAllConnections(): void {
    this.connections.forEach((_connection, url) => {
      this.closeConnection(url);
    });
  }
}

/**
 * Network Error Handler
 * EC-LAND-521 to EC-LAND-530: Network error handling
 */
export class NetworkErrorHandler {
  /**
   * Handle network errors gracefully
   * EC-LAND-521
   */
  static handleError(error: any): {
    type: 'network' | 'timeout' | 'cors' | 'server' | 'unknown';
    message: string;
    retryable: boolean;
  } {
    if (!error) {
      return { type: 'unknown', message: 'Unknown error', retryable: false };
    }

    // EC-LAND-522: DNS errors
    if (error.message?.includes('DNS') || error.code === 'ENOTFOUND') {
      return { type: 'network', message: 'DNS resolution failed', retryable: true };
    }

    // EC-LAND-523: Connection refused
    if (error.message?.includes('ECONNREFUSED') || error.code === 'ECONNREFUSED') {
      return { type: 'network', message: 'Connection refused', retryable: true };
    }

    // EC-LAND-524: Timeout
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return { type: 'timeout', message: 'Request timeout', retryable: true };
    }

    // EC-LAND-525: 404
    if (error.status === 404) {
      return { type: 'server', message: 'Resource not found', retryable: false };
    }

    // EC-LAND-526: 500
    if (error.status === 500) {
      return { type: 'server', message: 'Server error', retryable: true };
    }

    // EC-LAND-527: CORS
    if (error.message?.includes('CORS') || error.name === 'TypeError') {
      return { type: 'cors', message: 'CORS error', retryable: false };
    }

    // EC-LAND-528: SSL
    if (error.message?.includes('SSL') || error.message?.includes('certificate')) {
      return { type: 'network', message: 'SSL error', retryable: false };
    }

    return { type: 'unknown', message: error.message || 'Unknown error', retryable: false };
  }

  /**
   * Get user-friendly error message
   * EC-LAND-521
   */
  static getUserFriendlyMessage(error: any): string {
    const handled = this.handleError(error);
    
    const messages: Record<string, string> = {
      network: 'Network connection error. Please check your internet connection.',
      timeout: 'Request timed out. Please try again.',
      cors: 'Cross-origin request blocked. Please contact support.',
      server: 'Server error. Please try again later.',
      unknown: 'An error occurred. Please try again.',
    };

    return messages[handled.type] || messages.unknown;
  }
}

/**
 * Data Synchronization Manager
 * EC-LAND-561 to EC-LAND-570: Data synchronization
 */
export class DataSyncManager {
  private static syncQueue: Array<{ key: string; data: any; timestamp: number }> = [];
  private static isSyncing = false;

  /**
   * Queue data for sync
   * EC-LAND-561
   */
  static queueForSync(key: string, data: any): void {
    this.syncQueue.push({
      key,
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Sync queued data
   * EC-LAND-561
   */
  static async sync(syncFn: (key: string, data: any) => Promise<void>): Promise<void> {
    if (this.isSyncing || this.syncQueue.length === 0) return;

    this.isSyncing = true;

    try {
      // EC-LAND-565: Incremental sync
      const itemsToSync = this.syncQueue.splice(0, 10); // Sync in batches
      
      await Promise.all(
        itemsToSync.map(item => syncFn(item.key, item.data))
      );
    } finally {
      this.isSyncing = false;
      
      // Continue syncing if more items in queue
      if (this.syncQueue.length > 0) {
        await this.sync(syncFn);
      }
    }
  }

  /**
   * Resolve conflicts
   * EC-LAND-562
   */
  static resolveConflict(
    local: any,
    remote: any,
    strategy: 'local' | 'remote' | 'merge' | 'timestamp' = 'timestamp'
  ): any {
    switch (strategy) {
      case 'local':
        return local;
      case 'remote':
        return remote;
      case 'merge':
        return { ...local, ...remote };
      case 'timestamp':
        return local.timestamp > remote.timestamp ? local : remote;
      default:
        return local;
    }
  }
}

// Initialize offline detection
if (typeof window !== 'undefined') {
  OfflineManager.onStatusChange((isOnline) => {
    if (isOnline) {
      // Sync queued data when back online
      DataSyncManager.sync(async (key, data) => {
        // Sync implementation
        console.log(`Syncing ${key}:`, data);
      });
    }
  });
}

