/**
 * Network Utilities
 * EC-079, EC-080, EC-081, EC-082: Network detection and offline handling
 * EC-LAND-501 to EC-LAND-550: Enhanced network resilience
 */
import { useState, useEffect } from 'react';
// Network resilience utilities are available for import when needed
// import { OfflineManager, RetryManager, RequestOptimizer, NetworkErrorHandler } from './network-resilience';

export interface NetworkStatus {
  online: boolean;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

class NetworkMonitor {
  private listeners: Set<(status: NetworkStatus) => void> = new Set();
  private currentStatus: NetworkStatus = {
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
  };

  constructor() {
    if (typeof window === 'undefined') return;

    // Initial status
    this.updateStatus();

    // Listen for online/offline events
    window.addEventListener('online', () => {
      this.updateStatus();
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.updateStatus();
      this.notifyListeners();
    });

    // Listen for connection changes (if supported)
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        connection.addEventListener('change', () => {
          this.updateStatus();
          this.notifyListeners();
        });
      }
    }
  }

  private updateStatus(): void {
    if (typeof navigator === 'undefined') return;

    this.currentStatus = {
      online: navigator.onLine,
    };

    // Add connection info if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      if (connection) {
        this.currentStatus.effectiveType = connection.effectiveType;
        this.currentStatus.downlink = connection.downlink;
        this.currentStatus.rtt = connection.rtt;
        this.currentStatus.saveData = connection.saveData;
      }
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => {
      listener(this.currentStatus);
    });
  }

  getStatus(): NetworkStatus {
    return { ...this.currentStatus };
  }

  subscribe(listener: (status: NetworkStatus) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  isOnline(): boolean {
    return this.currentStatus.online;
  }

  isSlowConnection(): boolean {
    return (
      this.currentStatus.effectiveType === 'slow-2g' ||
      this.currentStatus.effectiveType === '2g' ||
      (this.currentStatus.downlink !== undefined && this.currentStatus.downlink < 0.5)
    );
  }
}

export const networkMonitor = new NetworkMonitor();

/**
 * Hook to monitor network status
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() =>
    networkMonitor.getStatus()
  );

  useEffect(() => {
    const unsubscribe = networkMonitor.subscribe((newStatus) => {
      setStatus(newStatus);
    });

    return unsubscribe;
  }, []);

  return status;
}

