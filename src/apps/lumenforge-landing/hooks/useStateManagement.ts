/**
 * State Management Hooks
 * EC-LAND-701 to EC-LAND-750: State management hooks
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  StateInitializer,
  StateUpdateManager,
  StatePersistence,
  StateSynchronizer,
  StateValidator,
  StateCleanup,
  StatePerformance,
} from '../utils/state-management';

/**
 * Hook for state initialization
 * EC-LAND-701 to EC-LAND-710
 */
export function useInitializedState<T>(
  initialValue: T,
  options: {
    storageKey?: string;
    validator?: (state: T) => boolean;
    loadFromStorage?: boolean;
  } = {}
) {
  const { storageKey, validator, loadFromStorage = false } = options;

  const [state, setState] = useState<T>(() => {
    // EC-LAND-704: Load from storage
    if (loadFromStorage && storageKey) {
      return StateInitializer.loadFromStorage(storageKey, initialValue, validator);
    }

    // EC-LAND-701, EC-LAND-702: Initialize with validation
    return StateInitializer.initialize(initialValue, validator);
  });

  // EC-LAND-703: Persist to storage
  useEffect(() => {
    if (storageKey) {
      StatePersistence.persist(storageKey, state);
    }
  }, [state, storageKey]);

  return [state, setState] as const;
}

/**
 * Hook for batched state updates
 * EC-LAND-711
 */
export function useBatchedUpdates() {
  const batchUpdates = useCallback((updates: Array<() => void>) => {
    StateUpdateManager.batch(updates);
  }, []);

  return { batchUpdates };
}

/**
 * Hook for state persistence
 * EC-LAND-721 to EC-LAND-730
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T
) {
  const [state, setState] = useState<T>(() => {
    return StatePersistence.restore(key, initialValue);
  });

  // EC-LAND-721: Persist on change
  useEffect(() => {
    StatePersistence.persist(key, state);
  }, [key, state]);

  return [state, setState] as const;
}

/**
 * Hook for state synchronization
 * EC-LAND-731 to EC-LAND-740
 */
export function useSynchronizedState<T>(
  key: string,
  initialValue: T
) {
  const [state, setState] = useState<T>(initialValue);

  // EC-LAND-731: Sync across tabs
  useEffect(() => {
    const unsubscribe = StateSynchronizer.subscribe<T>(key, (syncedState) => {
      setState(syncedState);
    });

    // Broadcast state changes
    const cleanup = StateSynchronizer.syncAcrossTabs(key, state);

    return () => {
      unsubscribe();
      cleanup();
    };
  }, [key, state]);

  return [state, setState] as const;
}

/**
 * Hook for validated state
 * EC-LAND-741 to EC-LAND-750
 */
export function useValidatedState<T>(
  initialValue: T,
  validator: (state: T) => boolean
) {
  const [state, setState] = useState<T>(initialValue);
  const [isValid, setIsValid] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const updateState = useCallback((newState: T | ((prev: T) => T)) => {
    const resolvedState = typeof newState === 'function'
      ? (newState as (prev: T) => T)(state)
      : newState;

    // EC-LAND-741: Validate on update
    const validation = StateValidator.validate(resolvedState, validator);
    
    setIsValid(validation.valid);
    setValidationError(validation.error || null);

    if (validation.valid) {
      setState(resolvedState);
    } else {
      // EC-LAND-742: Reject invalid state
      console.warn('Invalid state update rejected:', validation.error);
    }
  }, [state, validator]);

  return [state, updateState, isValid, validationError] as const;
}

/**
 * Hook for state cleanup
 * EC-LAND-751 to EC-LAND-760
 */
export function useStateCleanup(key: string) {
  const cleanupRef = useRef<(() => void) | null>(null);

  const registerCleanup = useCallback((cleanup: () => void) => {
    cleanupRef.current = cleanup;
    StateCleanup.register(key, cleanup);
  }, [key]);

  useEffect(() => {
    return () => {
      // EC-LAND-751: Cleanup on unmount
      if (cleanupRef.current) {
        cleanupRef.current();
      }
      StateCleanup.cleanup(key);
    };
  }, [key]);

  return { registerCleanup };
}

/**
 * Hook for memoized state
 * EC-LAND-762
 */
export function useMemoizedState<T>(
  key: string,
  valueFn: () => T
): T {
  return useMemo(() => {
    return StatePerformance.memoize(key, valueFn);
  }, [key, valueFn]);
}

/**
 * Hook for state performance monitoring
 * EC-LAND-761 to EC-LAND-770
 */
export function useStatePerformance() {
  const [stats, setStats] = useState({
    updateCount: 0,
    validationFailures: 0,
    syncConflicts: 0,
  });

  const trackUpdate = useCallback(() => {
    setStats(prev => ({ ...prev, updateCount: prev.updateCount + 1 }));
  }, []);

  const trackValidationFailure = useCallback(() => {
    setStats(prev => ({ ...prev, validationFailures: prev.validationFailures + 1 }));
  }, []);

  const trackSyncConflict = useCallback(() => {
    setStats(prev => ({ ...prev, syncConflicts: prev.syncConflicts + 1 }));
  }, []);

  return {
    stats,
    trackUpdate,
    trackValidationFailure,
    trackSyncConflict,
  };
}

