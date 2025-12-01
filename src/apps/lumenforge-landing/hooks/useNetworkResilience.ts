/**
 * Network Resilience Hooks
 * EC-LAND-501 to EC-LAND-550: Network resilience hooks
 */
import { useEffect, useState, useCallback } from 'react';
import {
  OfflineManager,
  RetryManager,
  RequestOptimizer,
  NetworkErrorHandler,
  ConnectionManager,
} from '../utils/network-resilience';

/**
 * Hook for offline detection
 * EC-LAND-501
 */
export function useOfflineDetection() {
  const [isOnline, setIsOnline] = useState(() => OfflineManager.isAppOnline());
  const [networkQuality, setNetworkQuality] = useState<'slow-2g' | '2g' | '3g' | '4g' | 'unknown'>('unknown');

  useEffect(() => {
    const unsubscribe = OfflineManager.onStatusChange((online) => {
      setIsOnline(online);
    });

    OfflineManager.getNetworkQuality().then(setNetworkQuality);

    return unsubscribe;
  }, []);

  return { isOnline, networkQuality };
}

/**
 * Hook for retry logic
 * EC-LAND-531 to EC-LAND-540
 */
export function useRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    retryCondition?: (error: any) => boolean;
  } = {}
) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const execute = useCallback(async (): Promise<T> => {
    setIsRetrying(true);
    setRetryCount(0);

    try {
      const result = await RetryManager.retry(
        () => {
          setRetryCount(prev => prev + 1);
          return fn();
        },
        options
      );
      setIsRetrying(false);
      return result;
    } catch (error) {
      setIsRetrying(false);
      throw error;
    }
  }, [fn, options]);

  return { execute, isRetrying, retryCount };
}

/**
 * Hook for request optimization
 * EC-LAND-541 to EC-LAND-550
 */
export function useRequestOptimization() {
  const batchRequests = useCallback(
    <T,>(requests: Array<() => Promise<T>>, batchSize: number = 5) => {
      return RequestOptimizer.batchRequests(requests, batchSize);
    },
    []
  );

  const debounceRequest = useCallback(
    <T,>(key: string, request: () => Promise<T>, delay: number = 300) => {
      return RequestOptimizer.debounceRequest(key, request, delay);
    },
    []
  );

  const deduplicateRequest = useCallback(
    <T,>(key: string, request: () => Promise<T>) => {
      return RequestOptimizer.deduplicateRequest(key, request);
    },
    []
  );

  return { batchRequests, debounceRequest, deduplicateRequest };
}

/**
 * Hook for network error handling
 * EC-LAND-521 to EC-LAND-530
 */
export function useNetworkError() {
  const handleError = useCallback((error: any) => {
    return NetworkErrorHandler.handleError(error);
  }, []);

  const getUserFriendlyMessage = useCallback((error: any) => {
    return NetworkErrorHandler.getUserFriendlyMessage(error);
  }, []);

  return { handleError, getUserFriendlyMessage };
}

/**
 * Hook for WebSocket connection
 * EC-LAND-551
 */
export function useWebSocket(
  url: string | null,
  options: {
    onOpen?: (event: Event) => void;
    onMessage?: (event: MessageEvent) => void;
    onError?: (event: Event) => void;
    onClose?: (event: CloseEvent) => void;
    protocols?: string | string[];
  } = {}
) {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    const websocket = ConnectionManager.createWebSocket(url, {
      ...options,
      onOpen: (event) => {
        setIsConnected(true);
        options.onOpen?.(event);
      },
      onClose: (event) => {
        setIsConnected(false);
        options.onClose?.(event);
      },
    });

    setWs(websocket);

    return () => {
      ConnectionManager.closeConnection(url);
    };
  }, [url]);

  return { ws, isConnected };
}

