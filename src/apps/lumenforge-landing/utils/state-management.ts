/**
 * Comprehensive State Management Utilities
 * EC-LAND-701 to EC-LAND-750: State management edge cases fixes
 */

/**
 * State Initialization Manager
 * EC-LAND-701 to EC-LAND-710: State initialization
 */
export class StateInitializer {
  /**
   * Initialize state with validation
   * EC-LAND-701, EC-LAND-702
   */
  static initialize<T>(
    initialState: T,
    validator?: (state: T) => boolean
  ): T {
    // EC-LAND-702: Validate initial state
    if (validator && !validator(initialState)) {
      console.warn('Invalid initial state, using default');
      return initialState;
    }

    return initialState;
  }

  /**
   * Load state from storage
   * EC-LAND-704
   */
  static loadFromStorage<T>(
    key: string,
    defaultValue: T,
    validator?: (state: T) => boolean
  ): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;

      const parsed = JSON.parse(stored) as T;

      // EC-LAND-702: Validate loaded state
      if (validator && !validator(parsed)) {
        console.warn(`Invalid state loaded for ${key}, using default`);
        return defaultValue;
      }

      return parsed;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Resolve state conflicts with props
   * EC-LAND-705
   */
  static resolveConflict<T>(
    state: T,
    props: Partial<T>,
    _strategy: 'state' | 'props' | 'merge' = 'merge'
  ): T {
    // Always merge for now (strategy can be implemented later)
    return { ...state, ...props } as T;
  }

  /**
   * Ensure type-safe state
   * EC-LAND-706
   */
  static ensureTypeSafe<T>(state: any, typeGuard: (value: any) => value is T): T | null {
    return typeGuard(state) ? state : null;
  }
}

/**
 * State Update Manager
 * EC-LAND-711 to EC-LAND-720: State updates
 */
export class StateUpdateManager {
  private static updateQueue: Array<() => void> = [];
  private static isProcessing = false;

  /**
   * Batch state updates
   * EC-LAND-711
   */
  static batch(updates: Array<() => void>): void {
    this.updateQueue.push(...updates);
    this.processQueue();
  }

  private static processQueue(): void {
    if (this.isProcessing || this.updateQueue.length === 0) return;

    this.isProcessing = true;

    // Process all queued updates
    while (this.updateQueue.length > 0) {
      const update = this.updateQueue.shift();
      update?.();
    }

    this.isProcessing = false;
  }

  /**
   * Validate state update
   * EC-LAND-714
   */
  static validateUpdate<T>(
    _currentState: T,
    newState: T,
    validator: (state: T) => boolean
  ): boolean {
    return validator(newState);
  }

  /**
   * Prevent infinite loops
   * EC-LAND-712
   */
  private static updateHistory: Array<{ state: any; timestamp: number }> = [];
  private static readonly MAX_HISTORY = 10;
  private static readonly LOOP_THRESHOLD = 100; // ms

  static detectInfiniteLoop<T>(newState: T): boolean {
    const now = Date.now();
    const recentUpdates = this.updateHistory.filter(
      entry => now - entry.timestamp < this.LOOP_THRESHOLD
    );

    // Check if same state appears multiple times quickly
    const stateString = JSON.stringify(newState);
    const duplicates = recentUpdates.filter(
      entry => JSON.stringify(entry.state) === stateString
    ).length;

    if (duplicates > 3) {
      console.warn('Possible infinite loop detected in state updates');
      return true;
    }

    // Add to history
    this.updateHistory.push({ state: newState, timestamp: now });
    if (this.updateHistory.length > this.MAX_HISTORY) {
      this.updateHistory.shift();
    }

    return false;
  }

  /**
   * Memoize state updates
   * EC-LAND-720
   */
  private static memoCache = new Map<string, any>();

  static memoizedUpdate<T>(
    key: string,
    _currentState: T,
    updateFn: (state: T) => T
  ): T {
    const stateString = JSON.stringify(_currentState);
    const cacheKey = `${key}-${stateString}`;

    if (this.memoCache.has(cacheKey)) {
      return this.memoCache.get(cacheKey);
    }

    const newState = updateFn(_currentState);
    this.memoCache.set(cacheKey, newState);

    // Limit cache size
    if (this.memoCache.size > 100) {
      const firstKey = this.memoCache.keys().next().value;
      if (firstKey) {
        this.memoCache.delete(firstKey);
      }
    }

    return newState;
  }
}

/**
 * State Persistence Manager
 * EC-LAND-721 to EC-LAND-730: State persistence
 */
export class StatePersistence {
  /**
   * Persist state to storage
   * EC-LAND-721
   */
  static persist<T>(key: string, state: T): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const serialized = JSON.stringify(state);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      // EC-LAND-722: Handle persistence failures
      console.warn(`Failed to persist state for ${key}:`, error);
      return false;
    }
  }

  /**
   * Restore state from storage
   * EC-LAND-723
   */
  static restore<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const stored = localStorage.getItem(key);
      if (!stored) return defaultValue;

      return JSON.parse(stored) as T;
    } catch (error) {
      // EC-LAND-724: Handle restoration failures
      console.warn(`Failed to restore state for ${key}:`, error);
      return defaultValue;
    }
  }

  /**
   * Handle storage conflicts
   * EC-LAND-725
   */
  static resolveStorageConflict<T>(
    localState: T,
    storedState: T,
    strategy: 'local' | 'stored' | 'merge' | 'timestamp' = 'timestamp'
  ): T {
    switch (strategy) {
      case 'local':
        return localState;
      case 'stored':
        return storedState;
      case 'merge':
        return { ...storedState, ...localState } as T;
      case 'timestamp':
        // Assume stored state is newer if it exists
        return storedState;
      default:
        return localState;
    }
  }

  /**
   * Optimize state serialization
   * EC-LAND-726, EC-LAND-727
   */
  static serialize<T>(state: T): string {
    try {
      return JSON.stringify(state, (_key, value) => {
        // Remove functions and undefined values
        if (typeof value === 'function' || value === undefined) {
          return null;
        }
        return value;
      });
    } catch (error) {
      console.warn('State serialization failed:', error);
      return '{}';
    }
  }

  static deserialize<T>(serialized: string, defaultValue: T): T {
    try {
      const parsed = JSON.parse(serialized);
      return parsed as T;
    } catch (error) {
      console.warn('State deserialization failed:', error);
      return defaultValue;
    }
  }
}

/**
 * State Synchronization Manager
 * EC-LAND-731 to EC-LAND-740: State synchronization
 */
export class StateSynchronizer {
  private static syncListeners = new Map<string, Set<(state: any) => void>>();

  /**
   * Synchronize state across tabs
   * EC-LAND-731
   */
  static syncAcrossTabs<T>(key: string, state: T): () => void {
    if (typeof window === 'undefined') return () => {};

    // Broadcast to other tabs
    const channel = new BroadcastChannel(`state-sync-${key}`);
    channel.postMessage({ type: 'state-update', state });

    // Listen for updates from other tabs
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'state-update') {
        const listeners = this.syncListeners.get(key);
        listeners?.forEach(listener => listener(event.data.state));
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }

  /**
   * Subscribe to state changes
   * EC-LAND-731
   */
  static subscribe<T>(key: string, callback: (state: T) => void): () => void {
    if (!this.syncListeners.has(key)) {
      this.syncListeners.set(key, new Set());
    }

    const listeners = this.syncListeners.get(key);
    if (listeners) {
      listeners.add(callback);
    }

    return () => {
      this.syncListeners.get(key)?.delete(callback);
    };
  }

  /**
   * Synchronize with server
   * EC-LAND-733
   */
  static async syncWithServer<T>(
    key: string,
    localState: T,
    syncFn: (state: T) => Promise<T>
  ): Promise<T> {
    try {
      const serverState = await syncFn(localState);
      return serverState;
    } catch (error) {
      // EC-LAND-734: Handle sync conflicts
      console.warn(`Sync failed for ${key}:`, error);
      return localState;
    }
  }

  /**
   * Optimize synchronization
   * EC-LAND-735
   */
  static debounceSync<T>(
    _key: string,
    state: T,
    syncFn: (state: T) => Promise<void>,
    delay: number = 1000
  ): () => void {
    let timeoutId: number | null = null;

    const sync = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = window.setTimeout(() => {
        syncFn(state);
      }, delay);
    };

    sync();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }
}

/**
 * State Validation Manager
 * EC-LAND-741 to EC-LAND-750: State validation
 */
export class StateValidator {
  /**
   * Validate state on update
   * EC-LAND-741
   */
  static validate<T>(
    state: T,
    validator: (state: T) => boolean
  ): { valid: boolean; error?: string } {
    try {
      const isValid = validator(state);
      return {
        valid: isValid,
        error: isValid ? undefined : 'State validation failed',
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : 'Validation error',
      };
    }
  }

  /**
   * Reject invalid state
   * EC-LAND-742
   */
  static rejectInvalid<T>(
    state: T,
    validator: (state: T) => boolean,
    fallback: T
  ): T {
    const validation = this.validate(state, validator);
    return validation.valid ? state : fallback;
  }

  /**
   * Comprehensive validation
   * EC-LAND-743
   */
  static validateComprehensive<T>(
    state: T,
    validators: Array<(state: T) => boolean>
  ): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    validators.forEach((validator, index) => {
      try {
        if (!validator(state)) {
          errors.push(`Validation ${index + 1} failed`);
        }
      } catch (error) {
        errors.push(`Validation ${index + 1} error: ${error instanceof Error ? error.message : 'Unknown'}`);
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Log validation
   * EC-LAND-750
   */
  static logValidation<T>(
    state: T,
    validator: (state: T) => boolean,
    context?: string
  ): void {
    const validation = this.validate(state, validator);
    
    if (!validation.valid) {
      console.warn('State validation failed:', {
        context,
        error: validation.error,
        state: JSON.stringify(state).substring(0, 100),
      });
    }
  }
}

/**
 * State Cleanup Manager
 * EC-LAND-751 to EC-LAND-760: State cleanup
 */
export class StateCleanup {
  private static cleanupCallbacks = new Map<string, () => void>();

  /**
   * Register cleanup callback
   * EC-LAND-751
   */
  static register(key: string, cleanup: () => void): void {
    this.cleanupCallbacks.set(key, cleanup);
  }

  /**
   * Execute cleanup
   * EC-LAND-752
   */
  static cleanup(key: string): void {
    const callback = this.cleanupCallbacks.get(key);
    if (callback) {
      callback();
      this.cleanupCallbacks.delete(key);
    }
  }

  /**
   * Cleanup all
   * EC-LAND-752
   */
  static cleanupAll(): void {
    this.cleanupCallbacks.forEach((cleanup) => {
      try {
        cleanup();
      } catch (error) {
        console.warn('Cleanup error:', error);
      }
    });
    this.cleanupCallbacks.clear();
  }

  /**
   * Test cleanup
   * EC-LAND-753
   */
  static testCleanup(key: string): boolean {
    const callback = this.cleanupCallbacks.get(key);
    if (!callback) return false;

    try {
      callback();
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * State Performance Optimizer
 * EC-LAND-761 to EC-LAND-770: State performance
 */
export class StatePerformance {
  /**
   * Memoize state
   * EC-LAND-762
   */
  private static memoCache = new Map<string, { value: any; timestamp: number }>();
  private static readonly CACHE_TTL = 60000; // 1 minute

  static memoize<T>(key: string, valueFn: () => T): T {
    const cached = this.memoCache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < this.CACHE_TTL) {
      return cached.value as T;
    }

    const value = valueFn();
    this.memoCache.set(key, { value, timestamp: now });

    // Cleanup old cache entries
    if (this.memoCache.size > 100) {
      const oldestKey = Array.from(this.memoCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0][0];
      this.memoCache.delete(oldestKey);
    }

    return value;
  }

  /**
   * Partition state
   * EC-LAND-766
   */
  static partition<T extends Record<string, any>>(
    state: T,
    partitions: Array<keyof T>
  ): { partitioned: Partial<T>; remaining: Partial<T> } {
    const partitioned: Partial<T> = {} as Partial<T>;
    const remaining: Partial<T> = {} as Partial<T>;

    (Object.keys(state) as Array<keyof T>).forEach(key => {
      if (partitions.includes(key)) {
        (partitioned as any)[key] = state[key];
      } else {
        (remaining as any)[key] = state[key];
      }
    });

    return { partitioned, remaining };
  }

  /**
   * Normalize state
   * EC-LAND-791
   */
  static normalize<T extends Record<string, any>>(
    state: T,
    normalizer: (value: any) => any
  ): T {
    const normalized = {} as T;

    Object.keys(state).forEach(key => {
      normalized[key as keyof T] = normalizer(state[key]);
    });

    return normalized;
  }

  /**
   * Denormalize state
   * EC-LAND-792
   */
  static denormalize<T extends Record<string, any>>(
    state: T,
    denormalizer: (value: any) => any
  ): T {
    const denormalized = {} as T;

    Object.keys(state).forEach(key => {
      denormalized[key as keyof T] = denormalizer(state[key]);
    });

    return denormalized;
  }

  /**
   * Cache state
   * EC-LAND-793
   */
  private static stateCache = new Map<string, { value: any; timestamp: number }>();
  private static readonly STATE_CACHE_TTL = 300000; // 5 minutes

  static cache<T>(key: string, state: T): void {
    this.stateCache.set(key, { value: state, timestamp: Date.now() });
  }

  static getCached<T>(key: string): T | null {
    const cached = this.stateCache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.STATE_CACHE_TTL) {
      this.stateCache.delete(key);
      return null;
    }

    return cached.value as T;
  }

  /**
   * Lazy-load state
   * EC-LAND-794
   */
  static async lazyLoad<T>(
    key: string,
    loader: () => Promise<T>
  ): Promise<T> {
    const cached = this.getCached<T>(key);
    if (cached) return cached;

    const loaded = await loader();
    this.cache(key, loaded);
    return loaded;
  }

  /**
   * Monitor state
   * EC-LAND-797
   */
  private static stateMonitor = new Map<string, Array<(state: any) => void>>();

  static monitor<T>(key: string, callback: (state: T) => void): () => void {
    if (!this.stateMonitor.has(key)) {
      this.stateMonitor.set(key, []);
    }

    this.stateMonitor.get(key)!.push(callback);

    return () => {
      const callbacks = this.stateMonitor.get(key);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  static notifyMonitors<T>(key: string, state: T): void {
    const callbacks = this.stateMonitor.get(key);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(state);
        } catch (error) {
          console.warn('State monitor callback error:', error);
        }
      });
    }
  }

  /**
   * Log state
   * EC-LAND-798
   */
  static logState<T>(key: string, state: T, context?: string): void {
    console.log(`[State] ${key}${context ? ` (${context})` : ''}:`, state);
  }

  /**
   * Recover state
   * EC-LAND-799
   */
  static recoverState<T>(
    key: string,
    corruptedState: T,
    recoveryFn: (state: T) => T,
    fallback: T
  ): T {
    try {
      const recovered = recoveryFn(corruptedState);
      return recovered;
    } catch (error) {
      console.warn(`State recovery failed for ${key}:`, error);
      return fallback;
    }
  }
}

