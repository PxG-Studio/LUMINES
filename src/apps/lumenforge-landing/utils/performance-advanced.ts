/**
 * Advanced Performance Utilities
 * EC-LAND-101 to EC-LAND-250: Performance edge cases fixes
 */

/**
 * DOM Node Counter - EC-LAND-101
 * Monitor and limit DOM nodes to prevent slowdown
 */
export class DOMNodeMonitor {
  private static readonly MAX_NODES = 1000;

  static getNodeCount(): number {
    if (typeof document === 'undefined') return 0;
    return document.querySelectorAll('*').length;
  }

  static isNodeCountExceeded(): boolean {
    return this.getNodeCount() > this.MAX_NODES;
  }

  static logNodeCount(): void {
    // Skip logging in Storybook
    const isStorybook = typeof window !== 'undefined' && 
      (window.location?.href?.includes('storybook') || 
       window.location?.href?.includes('localhost:6006') ||
       (window as any).__STORYBOOK_STORY_STORE__);
    if (isStorybook) return;
    
    const count = this.getNodeCount();
    if (count > this.MAX_NODES) {
      console.warn(`DOM node count (${count}) exceeds recommended limit (${this.MAX_NODES})`);
    }
  }
}

/**
 * Image Lazy Loading Manager - EC-LAND-102, EC-LAND-173, EC-LAND-231 to EC-LAND-240
 */
export class ImageOptimizer {
  private static imageCache = new Map<string, HTMLImageElement>();
  private static readonly MAX_CACHE_SIZE = 50;

  /**
   * Preload image with optimization
   * EC-LAND-102, EC-LAND-173, EC-LAND-231
   */
  static async preloadImage(
    src: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'jpg' | 'png';
    } = {}
  ): Promise<HTMLImageElement> {
    // Check cache first
    if (this.imageCache.has(src)) {
      return this.imageCache.get(src)!;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // EC-LAND-231: Use modern formats
      const optimizedSrc = this.getOptimizedSrc(src, options);
      
      img.onload = () => {
        // Cache the image
        if (this.imageCache.size >= this.MAX_CACHE_SIZE) {
          const firstKey = this.imageCache.keys().next().value;
          if (firstKey) {
            this.imageCache.delete(firstKey);
          }
        }
        this.imageCache.set(src, img);
        resolve(img);
      };
      
      img.onerror = reject;
      img.src = optimizedSrc;
    });
  }

  /**
   * Generate optimized image src
   * EC-LAND-231, EC-LAND-232
   */
  static getOptimizedSrc(
    src: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'avif' | 'jpg' | 'png';
    } = {}
  ): string {
    // If already a data URI or external URL, return as-is
    if (src.startsWith('data:') || src.startsWith('http')) {
      return src;
    }

    // EC-LAND-231: Check for WebP/AVIF support
    const supportsWebP = this.supportsWebP();
    const supportsAVIF = this.supportsAVIF();

    // EC-LAND-232: Generate srcset for responsive images
    if (options.width || options.height) {
      const params = new URLSearchParams();
      if (options.width) params.set('w', String(options.width));
      if (options.height) params.set('h', String(options.height));
      if (options.quality) params.set('q', String(options.quality));
      
      if (supportsAVIF && options.format !== 'webp') {
        params.set('format', 'avif');
      } else if (supportsWebP && options.format !== 'jpg' && options.format !== 'png') {
        params.set('format', 'webp');
      }
      
      return `${src}?${params.toString()}`;
    }

    return src;
  }

  /**
   * Generate responsive srcset
   * EC-LAND-161, EC-LAND-232
   */
  static generateSrcset(
    baseSrc: string,
    widths: number[] = [320, 640, 960, 1280, 1920]
  ): string {
    return widths
      .map(width => `${this.getOptimizedSrc(baseSrc, { width })} ${width}w`)
      .join(', ');
  }

  private static supportsWebP(): boolean {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  private static supportsAVIF(): boolean {
    if (typeof document === 'undefined') return false;
    const canvas = document.createElement('canvas');
    try {
      return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
    } catch {
      return false;
    }
  }

  /**
   * Release image from memory
   * EC-LAND-113
   */
  static releaseImage(src: string): void {
    this.imageCache.delete(src);
  }

  /**
   * Clear all cached images
   * EC-LAND-113
   */
  static clearCache(): void {
    this.imageCache.clear();
  }
}

/**
 * Animation Performance Manager - EC-LAND-103, EC-LAND-131 to EC-LAND-140
 */
export class AnimationManager {
  private static activeAnimations = new Set<number>();
  private static readonly TARGET_FPS = 60;
  private static frameTime = 1000 / this.TARGET_FPS;
  private static lastFrameTime = 0;
  private static isPageVisible = true;

  /**
   * Initialize visibility tracking
   * EC-LAND-137
   */
  static init(): void {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      this.isPageVisible = !document.hidden;
      if (!this.isPageVisible) {
        // Pause all animations when tab is hidden
        this.pauseAll();
      }
    });
  }

  /**
   * Optimized requestAnimationFrame with FPS control
   * EC-LAND-103, EC-LAND-139
   */
  static requestAnimationFrame(callback: FrameRequestCallback): number {
    const now = performance.now();
    const elapsed = now - this.lastFrameTime;

    if (elapsed >= this.frameTime) {
      this.lastFrameTime = now;
      const id = window.requestAnimationFrame(callback);
      this.activeAnimations.add(id);
      return id;
    }

    // Throttle to target FPS
    const id = window.setTimeout(() => {
      this.lastFrameTime = performance.now();
      const rafId = window.requestAnimationFrame(callback);
      this.activeAnimations.add(rafId);
    }, this.frameTime - elapsed);

    return id;
  }

  /**
   * Cancel animation frame
   */
  static cancelAnimationFrame(id: number): void {
    this.activeAnimations.delete(id);
    window.cancelAnimationFrame(id);
    clearTimeout(id);
  }

  /**
   * Pause all animations
   * EC-LAND-137
   */
  static pauseAll(): void {
    this.activeAnimations.forEach(id => {
      window.cancelAnimationFrame(id);
    });
    this.activeAnimations.clear();
  }

  /**
   * Check if animations should run
   * EC-LAND-137
   */
  static shouldAnimate(): boolean {
    return this.isPageVisible;
  }

  /**
   * GPU-accelerated transform
   * EC-LAND-131
   */
  static getGPUAcceleratedStyle(): React.CSSProperties {
    return {
      transform: 'translateZ(0)',
      willChange: 'transform',
      backfaceVisibility: 'hidden',
      perspective: 1000,
    };
  }
}

/**
 * Memory Management Utilities - EC-LAND-111 to EC-LAND-120
 */
export class MemoryManager {
  private static listeners = new Map<string, Set<EventListener>>();
  private static timers = new Set<number>();
  private static intervals = new Set<number>();
  private static websockets = new Set<WebSocket>();

  /**
   * Track event listener for cleanup
   * EC-LAND-111
   */
  static addEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | AddEventListenerOptions
  ): void {
    target.addEventListener(type, listener, options);
    
    const key = `${target.constructor.name}-${type}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(listener);
  }

  /**
   * Remove tracked event listener
   * EC-LAND-111
   */
  static removeEventListener(
    target: EventTarget,
    type: string,
    listener: EventListener,
    options?: boolean | EventListenerOptions
  ): void {
    target.removeEventListener(type, listener, options);
    
    const key = `${target.constructor.name}-${type}`;
    this.listeners.get(key)?.delete(listener);
  }

  /**
   * Track setTimeout for cleanup
   * EC-LAND-115
   */
  static setTimeout(callback: () => void, delay: number): number {
    const id = window.setTimeout(() => {
      this.timers.delete(id);
      callback();
    }, delay);
    this.timers.add(id);
    return id;
  }

  /**
   * Track setInterval for cleanup
   * EC-LAND-115
   */
  static setInterval(callback: () => void, delay: number): number {
    const id = window.setInterval(callback, delay);
    this.intervals.add(id);
    return id;
  }

  /**
   * Clear tracked timer
   * EC-LAND-115
   */
  static clearTimeout(id: number): void {
    this.timers.delete(id);
    window.clearTimeout(id);
  }

  /**
   * Clear tracked interval
   * EC-LAND-115
   */
  static clearInterval(id: number): void {
    this.intervals.delete(id);
    window.clearInterval(id);
  }

  /**
   * Track WebSocket for cleanup
   * EC-LAND-114
   */
  static trackWebSocket(ws: WebSocket): void {
    this.websockets.add(ws);
  }

  /**
   * Close and untrack WebSocket
   * EC-LAND-114
   */
  static closeWebSocket(ws: WebSocket): void {
    if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
      ws.close();
    }
    this.websockets.delete(ws);
  }

  /**
   * Cleanup all tracked resources
   * EC-LAND-111, EC-LAND-114, EC-LAND-115
   */
  static cleanup(): void {
    // Clear all timers
    this.timers.forEach(id => window.clearTimeout(id));
    this.timers.clear();

    // Clear all intervals
    this.intervals.forEach(id => window.clearInterval(id));
    this.intervals.clear();

    // Close all WebSockets
    this.websockets.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    });
    this.websockets.clear();

    // Note: Event listeners should be removed by components
    this.listeners.clear();
  }

  /**
   * Get memory usage stats
   * EC-LAND-112, EC-LAND-117
   */
  static getMemoryStats(): {
    timers: number;
    intervals: number;
    websockets: number;
    listeners: number;
  } {
    return {
      timers: this.timers.size,
      intervals: this.intervals.size,
      websockets: this.websockets.size,
      listeners: Array.from(this.listeners.values()).reduce((sum, set) => sum + set.size, 0),
    };
  }
}

/**
 * Network Performance Optimizer - EC-LAND-121 to EC-LAND-130
 */
export class NetworkOptimizer {
  private static requestCache = new Map<string, { data: any; timestamp: number; ttl: number }>();
  private static pendingRequests = new Map<string, Promise<any>>();
  private static readonly MAX_CACHE_SIZE = 100;
  private static readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Batch API requests
   * EC-LAND-121
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
   * Cache API response
   * EC-LAND-124
   */
  static async cachedRequest<T>(
    key: string,
    request: () => Promise<T>,
    ttl: number = this.DEFAULT_TTL
  ): Promise<T> {
    // Check cache
    const cached = this.requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    // Check if request is already pending
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key)!;
    }

    // Make request
    const promise = request().then(data => {
      // Cache the result
      if (this.requestCache.size >= this.MAX_CACHE_SIZE) {
        const firstKey = this.requestCache.keys().next().value;
        if (firstKey) {
          this.requestCache.delete(firstKey);
        }
      }
      this.requestCache.set(key, { data, timestamp: Date.now(), ttl });
      this.pendingRequests.delete(key);
      return data;
    });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  /**
   * Debounce API requests
   * EC-LAND-126
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
   * EC-LAND-127
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
   * Clear cache
   * EC-LAND-124
   */
  static clearCache(): void {
    this.requestCache.clear();
  }

  /**
   * Invalidate cache entry
   * EC-LAND-155
   */
  static invalidateCache(key: string): void {
    this.requestCache.delete(key);
  }
}

/**
 * Bundle Size Monitor - EC-LAND-141 to EC-LAND-150
 */
export class BundleMonitor {
  /**
   * Get current bundle size estimate
   * EC-LAND-141
   */
  static getBundleSize(): number {
    if (typeof performance === 'undefined' || !performance.getEntriesByType) {
      return 0;
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    return resources.reduce((total, resource) => {
      if (resource.name.includes('/src/') || resource.name.includes('.js')) {
        return total + (resource.transferSize || 0);
      }
      return total;
    }, 0);
  }

  /**
   * Log bundle size warning
   * EC-LAND-141
   */
  static logBundleSize(): void {
    // Skip logging in Storybook
    const isStorybook = typeof window !== 'undefined' && 
      (window.location?.href?.includes('storybook') || 
       window.location?.href?.includes('localhost:6006') ||
       (window as any).__STORYBOOK_STORY_STORE__);
    if (isStorybook) return;
    
    const size = this.getBundleSize();
    const sizeKB = size / 1024;
    const sizeMB = sizeKB / 1024;

    if (sizeMB > 0.5) {
      console.warn(`Bundle size (${sizeMB.toFixed(2)}MB) exceeds recommended limit (500KB)`);
    }
  }
}

/**
 * Cache Strategy Manager - EC-LAND-151 to EC-LAND-160
 */
export class CacheStrategy {
  /**
   * Cache-first strategy
   * EC-LAND-159
   */
  static async cacheFirst<T>(
    key: string,
    request: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    const cached = NetworkOptimizer['requestCache'].get(key);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data;
    }

    const data = await request();
    NetworkOptimizer['requestCache'].set(key, { data, timestamp: Date.now(), ttl });
    return data;
  }

  /**
   * Network-first strategy
   * EC-LAND-160
   */
  static async networkFirst<T>(
    key: string,
    request: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    try {
      const data = await request();
      NetworkOptimizer['requestCache'].set(key, { data, timestamp: Date.now(), ttl });
      return data;
    } catch (error) {
      const cached = NetworkOptimizer['requestCache'].get(key);
      if (cached) {
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Stale-while-revalidate strategy
   */
  static async staleWhileRevalidate<T>(
    key: string,
    request: () => Promise<T>,
    ttl: number = 5 * 60 * 1000
  ): Promise<T> {
    const cached = NetworkOptimizer['requestCache'].get(key);
    
    // Return cached data immediately if available
    if (cached) {
      // Revalidate in background
      request()
        .then(data => {
          NetworkOptimizer['requestCache'].set(key, { data, timestamp: Date.now(), ttl });
        })
        .catch(() => {
          // Ignore revalidation errors
        });
      
      return cached.data;
    }

    // No cache, make request
    const data = await request();
    NetworkOptimizer['requestCache'].set(key, { data, timestamp: Date.now(), ttl });
    return data;
  }
}

/**
 * Performance Monitor - EC-LAND-191 to EC-LAND-200
 */
export class PerformanceMonitor {
  private static metrics: Map<string, number[]> = new Map();

  /**
   * Measure performance
   * EC-LAND-191
   */
  static measure(name: string, fn: () => void): void {
    if (typeof performance === 'undefined') {
      fn();
      return;
    }

    const start = performance.now();
    fn();
    const end = performance.now();
    const duration = end - start;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);
  }

  /**
   * Measure async performance
   */
  static async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (typeof performance === 'undefined') {
      return fn();
    }

    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const duration = end - start;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(duration);

    return result;
  }

  /**
   * Get performance metrics
   * EC-LAND-191
   */
  static getMetrics(): Record<string, { avg: number; min: number; max: number; count: number }> {
    const result: Record<string, { avg: number; min: number; max: number; count: number }> = {};

    this.metrics.forEach((values, name) => {
      const sum = values.reduce((a, b) => a + b, 0);
      result[name] = {
        avg: sum / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length,
      };
    });

    return result;
  }

  /**
   * Clear metrics
   */
  static clearMetrics(): void {
    this.metrics.clear();
  }

  /**
   * Monitor Core Web Vitals
   * EC-LAND-192
   */
  static monitorWebVitals(): void {
    if (typeof window === 'undefined' || !('PerformanceObserver' in window)) {
      return;
    }

    // Check if we're in Storybook - disable noisy logs
    const isStorybook = typeof window !== 'undefined' && 
      (window.location?.href?.includes('storybook') || 
       window.location?.href?.includes('localhost:6006') ||
       (window as any).__STORYBOOK_STORY_STORE__);

    // LCP (Largest Contentful Paint)
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        if (isStorybook) return; // Skip logging in Storybook
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as any;
        console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP not supported
    }

    // FID (First Input Delay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        if (isStorybook) return; // Skip logging in Storybook
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      // FID not supported
    }

    // CLS (Cumulative Layout Shift)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        if (isStorybook) return; // Skip logging in Storybook
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        console.log('CLS:', clsValue);
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      // CLS not supported
    }
  }
}

// Initialize animation manager
if (typeof window !== 'undefined') {
  AnimationManager.init();
  PerformanceMonitor.monitorWebVitals();
}

