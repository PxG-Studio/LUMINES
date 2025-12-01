/**
 * Performance Hooks
 * EC-LAND-221 to EC-LAND-230: React performance optimizations
 */
import React, { useRef, useEffect, useMemo, useCallback, RefObject } from 'react';
import { MemoryManager, AnimationManager } from '../utils/performance-advanced';

/**
 * Hook to track and cleanup resources
 * EC-LAND-111, EC-LAND-115
 */
export function useResourceCleanup() {
  const cleanupRef = useRef<Array<() => void>>([]);

  useEffect(() => {
    return () => {
      cleanupRef.current.forEach(cleanup => cleanup());
      cleanupRef.current = [];
    };
  }, []);

  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupRef.current.push(cleanup);
  }, []);

  return { addCleanup };
}

/**
 * Hook for optimized event listeners
 * EC-LAND-111
 */
export function useEventListener<T extends EventTarget>(
  target: T | null,
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions
) {
  useEffect(() => {
    if (!target) return;

    MemoryManager.addEventListener(target, type, listener, options);

    return () => {
      MemoryManager.removeEventListener(target, type, listener, options);
    };
  }, [target, type, listener, options]);
}

/**
 * Hook for optimized timers
 * EC-LAND-115
 */
export function useTimeout(callback: () => void, delay: number | null) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (delay === null) return;

    timeoutRef.current = MemoryManager.setTimeout(callback, delay);

    return () => {
      if (timeoutRef.current !== null) {
        MemoryManager.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [callback, delay]);
}

/**
 * Hook for optimized intervals
 * EC-LAND-115
 */
export function useInterval(callback: () => void, delay: number | null) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (delay === null) return;

    intervalRef.current = MemoryManager.setInterval(callback, delay);

    return () => {
      if (intervalRef.current !== null) {
        MemoryManager.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [callback, delay]);
}

/**
 * Hook for optimized animation frame
 * EC-LAND-103, EC-LAND-139
 */
export function useAnimationFrame(callback: () => void, active: boolean = true) {
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active || !AnimationManager.shouldAnimate()) return;

    const animate = () => {
      callback();
      if (active && AnimationManager.shouldAnimate()) {
        frameRef.current = AnimationManager.requestAnimationFrame(animate);
      }
    };

    frameRef.current = AnimationManager.requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        AnimationManager.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [callback, active]);
}

/**
 * Hook for memoized expensive calculations
 * EC-LAND-222
 */
export function useMemoizedValue<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps);
}

/**
 * Hook for stable callback references
 * EC-LAND-223
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  return useCallback(callback, []) as T;
}

/**
 * Hook for lazy component loading
 * EC-LAND-224
 */
export function useLazyComponent<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => React.lazy(importFn), []);
}

/**
 * Hook for virtual scrolling optimization
 * EC-LAND-204
 */
export function useVirtualScroll<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(
    startIndex + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex),
    [items, startIndex, endIndex]
  );

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
  };
}

/**
 * Hook for intersection observer optimization
 * EC-LAND-205
 */
export function useIntersectionObserverOptimized(
  ref: RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      options
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return isIntersecting;
}

