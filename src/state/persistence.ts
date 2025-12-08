/**
 * Zustand State Persistence
 * Persist state to localStorage with synchronization across tabs
 */

import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { logger } from '../lib/monitoring/logger';

export interface PersistOptions<T> {
  name: string;
  version?: number;
  migrate?: (persistedState: any, version: number) => T;
  partialize?: (state: T) => Partial<T>;
  onRehydrateStorage?: (state: T) => void;
}

/**
 * Create a persistence middleware for Zustand
 * Stores state in localStorage and syncs across tabs
 */
export function createPersistence<T>(
  options: PersistOptions<T>
) {
  return (config: StateCreator<T>): StateCreator<T> => (set, get, api) => {
    const { name, version = 1, migrate, partialize, onRehydrateStorage } = options;

    // Hydrate state from localStorage
    const hydrate = () => {
      try {
        const item = localStorage.getItem(name);
        if (item) {
          const { state, version: storedVersion } = JSON.parse(item);
          
          let hydratedState = state;
          
          // Run migration if version changed
          if (migrate && storedVersion !== version) {
            hydratedState = migrate(state, storedVersion);
            logger.info('State migrated', { name, from: storedVersion, to: version });
          }

          set(hydratedState);
          onRehydrateStorage?.(hydratedState);
          logger.debug('State hydrated from localStorage', { name });
        }
      } catch (error) {
        logger.error('Failed to hydrate state', error, { name });
      }
    };

    // Persist state to localStorage
    const persist = () => {
      try {
        const state = get();
        const stateToStore = partialize ? partialize(state) : state;
        
        localStorage.setItem(
          name,
          JSON.stringify({
            state: stateToStore,
            version,
          })
        );
        
        logger.debug('State persisted to localStorage', { name });
      } catch (error) {
        logger.error('Failed to persist state', error, { name });
      }
    };

    // Listen for storage events (cross-tab synchronization)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === name && event.newValue) {
        try {
          const { state } = JSON.parse(event.newValue);
          set(state);
          logger.debug('State synchronized from another tab', { name });
        } catch (error) {
          logger.error('Failed to sync state from storage event', error, { name });
        }
      }
    };

    // Setup
    if (typeof window !== 'undefined') {
      hydrate();
      window.addEventListener('storage', handleStorageChange);
    }

    // Override set to persist on every change
    const originalSet = set;
    const persistingSet: typeof set = (...args) => {
      originalSet(...args);
      persist();
    };

    return config(persistingSet, get, api);
  };
}

/**
 * Clear persisted state
 */
export function clearPersistedState(name: string): void {
  try {
    localStorage.removeItem(name);
    logger.info('Persisted state cleared', { name });
  } catch (error) {
    logger.error('Failed to clear persisted state', error, { name });
  }
}

/**
 * Get persisted state without hydrating store
 */
export function getPersistedState<T>(name: string): T | null {
  try {
    const item = localStorage.getItem(name);
    if (item) {
      const { state } = JSON.parse(item);
      return state;
    }
    return null;
  } catch (error) {
    logger.error('Failed to get persisted state', error, { name });
    return null;
  }
}
