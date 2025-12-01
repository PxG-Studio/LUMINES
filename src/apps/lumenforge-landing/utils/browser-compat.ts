/**
 * Browser Compatibility Utilities
 * EC-LAND-401 to EC-LAND-450: Browser compatibility fixes
 */

/**
 * Feature Detection Manager
 * EC-LAND-417: Feature detection
 */
export class FeatureDetector {
  /**
   * Check if CSS Grid is supported
   * EC-LAND-401
   */
  static supportsCSSGrid(): boolean {
    if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;
    return CSS.supports('display', 'grid');
  }

  /**
   * Check if Flexbox is supported
   * EC-LAND-402
   */
  static supportsFlexbox(): boolean {
    if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;
    return CSS.supports('display', 'flex');
  }

  /**
   * Check if CSS Custom Properties are supported
   * EC-LAND-403
   */
  static supportsCustomProperties(): boolean {
    if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;
    return CSS.supports('color', 'var(--test)');
  }

  /**
   * Check if Intersection Observer is supported
   * EC-LAND-404
   */
  static supportsIntersectionObserver(): boolean {
    return typeof IntersectionObserver !== 'undefined';
  }

  /**
   * Check if ResizeObserver is supported
   * EC-LAND-405
   */
  static supportsResizeObserver(): boolean {
    return typeof ResizeObserver !== 'undefined';
  }

  /**
   * Check if MutationObserver is supported
   * EC-LAND-406
   */
  static supportsMutationObserver(): boolean {
    return typeof MutationObserver !== 'undefined';
  }

  /**
   * Check if Fetch API is supported
   * EC-LAND-407
   */
  static supportsFetch(): boolean {
    return typeof fetch !== 'undefined';
  }

  /**
   * Check if Promise is supported
   * EC-LAND-408
   */
  static supportsPromise(): boolean {
    return typeof Promise !== 'undefined';
  }

  /**
   * Check if async/await is supported
   * EC-LAND-409
   */
  static supportsAsyncAwait(): boolean {
    try {
      // eslint-disable-next-line no-eval
      eval('(async () => {})');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if arrow functions are supported
   * EC-LAND-410
   */
  static supportsArrowFunctions(): boolean {
    try {
      // eslint-disable-next-line no-eval
      eval('(() => {})');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if localStorage is supported
   * EC-LAND-441
   */
  static supportsLocalStorage(): boolean {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if sessionStorage is supported
   * EC-LAND-442
   */
  static supportsSessionStorage(): boolean {
    try {
      const test = '__sessionStorage_test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if IndexedDB is supported
   * EC-LAND-443
   */
  static supportsIndexedDB(): boolean {
    return typeof indexedDB !== 'undefined';
  }

  /**
   * Check if WebSocket is supported
   * EC-LAND-444
   */
  static supportsWebSocket(): boolean {
    return typeof WebSocket !== 'undefined';
  }

  /**
   * Check if Service Worker is supported
   * EC-LAND-445
   */
  static supportsServiceWorker(): boolean {
    return 'serviceWorker' in navigator;
  }

  /**
   * Check if Push API is supported
   * EC-LAND-446
   */
  static supportsPushAPI(): boolean {
    return 'PushManager' in window;
  }

  /**
   * Check if Notification API is supported
   * EC-LAND-447
   */
  static supportsNotification(): boolean {
    return 'Notification' in window;
  }

  /**
   * Check if Geolocation API is supported
   * EC-LAND-448
   */
  static supportsGeolocation(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Check if Camera API is supported
   * EC-LAND-449
   */
  static supportsCamera(): boolean {
    return navigator.mediaDevices && 'getUserMedia' in navigator.mediaDevices;
  }

  /**
   * Check if File API is supported
   * EC-LAND-450
   */
  static supportsFileAPI(): boolean {
    return typeof File !== 'undefined' && typeof FileReader !== 'undefined';
  }

  /**
   * Get browser name and version
   */
  static getBrowserInfo(): { name: string; version: string } {
    if (typeof navigator === 'undefined') {
      return { name: 'unknown', version: '0' };
    }

    const ua = navigator.userAgent;
    let name = 'unknown';
    let version = '0';

    if (ua.includes('Chrome') && !ua.includes('Edg')) {
      name = 'chrome';
      const match = ua.match(/Chrome\/(\d+)/);
      version = match ? match[1] : '0';
    } else if (ua.includes('Firefox')) {
      name = 'firefox';
      const match = ua.match(/Firefox\/(\d+)/);
      version = match ? match[1] : '0';
    } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
      name = 'safari';
      const match = ua.match(/Version\/(\d+)/);
      version = match ? match[1] : '0';
    } else if (ua.includes('Edg')) {
      name = 'edge';
      const match = ua.match(/Edg\/(\d+)/);
      version = match ? match[1] : '0';
    } else if (ua.includes('MSIE') || ua.includes('Trident')) {
      name = 'ie';
      const match = ua.match(/(?:MSIE |rv:)(\d+)/);
      version = match ? match[1] : '0';
    }

    return { name, version };
  }

  /**
   * Check if browser is Internet Explorer
   * EC-LAND-411
   */
  static isIE(): boolean {
    const info = this.getBrowserInfo();
    return info.name === 'ie';
  }

  /**
   * Check if browser is Safari
   * EC-LAND-412
   */
  static isSafari(): boolean {
    const info = this.getBrowserInfo();
    return info.name === 'safari';
  }

  /**
   * Check if browser is Chrome
   * EC-LAND-413
   */
  static isChrome(): boolean {
    const info = this.getBrowserInfo();
    return info.name === 'chrome';
  }

  /**
   * Check if browser is Firefox
   * EC-LAND-414
   */
  static isFirefox(): boolean {
    const info = this.getBrowserInfo();
    return info.name === 'firefox';
  }

  /**
   * Check if browser is Edge Legacy
   * EC-LAND-415
   */
  static isEdgeLegacy(): boolean {
    const info = this.getBrowserInfo();
    return info.name === 'edge' && parseInt(info.version) < 79;
  }
}

/**
 * Polyfill Loader
 * EC-LAND-416: Polyfill loading
 */
export class PolyfillLoader {
  private static loadedPolyfills = new Set<string>();

  /**
   * Load polyfill if needed
   */
  static async loadPolyfill(
    name: string,
    check: () => boolean,
    loadFn: () => Promise<void>
  ): Promise<void> {
    if (this.loadedPolyfills.has(name)) return;
    if (check()) return;

    await loadFn();
    this.loadedPolyfills.add(name);
  }

  /**
   * Load Promise polyfill
   * EC-LAND-408
   */
  static async loadPromisePolyfill(): Promise<void> {
    await this.loadPolyfill(
      'promise',
      () => FeatureDetector.supportsPromise(),
      async () => {
        // In production, load from CDN
        if (typeof window !== 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js';
          document.head.appendChild(script);
        }
      }
    );
  }

  /**
   * Load Fetch polyfill
   * EC-LAND-407
   */
  static async loadFetchPolyfill(): Promise<void> {
    await this.loadPolyfill(
      'fetch',
      () => FeatureDetector.supportsFetch(),
      async () => {
        if (typeof window !== 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.js';
          document.head.appendChild(script);
        }
      }
    );
  }
}

/**
 * CSS Fallback Manager
 * EC-LAND-421 to EC-LAND-430: CSS compatibility
 */
export class CSSFallback {
  /**
   * Apply CSS Grid fallback
   * EC-LAND-401
   */
  static applyGridFallback(element: HTMLElement): void {
    if (!FeatureDetector.supportsCSSGrid()) {
      element.style.display = 'flex';
      element.style.flexWrap = 'wrap';
    }
  }

  /**
   * Apply Flexbox fallback
   * EC-LAND-402
   */
  static applyFlexboxFallback(element: HTMLElement): void {
    if (!FeatureDetector.supportsFlexbox()) {
      element.style.display = 'block';
      element.style.verticalAlign = 'top';
    }
  }

  /**
   * Apply CSS Variables fallback
   * EC-LAND-422
   */
  static applyVariableFallback(
    element: HTMLElement,
    variable: string,
    fallback: string
  ): void {
    if (!FeatureDetector.supportsCustomProperties()) {
      const computed = getComputedStyle(element);
      const value = computed.getPropertyValue(variable) || fallback;
      element.style.setProperty(variable.replace('var(', '').replace(')', ''), value);
    }
  }

  /**
   * Check backdrop-filter support
   * EC-LAND-421
   */
  static supportsBackdropFilter(): boolean {
    if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;
    return CSS.supports('backdrop-filter', 'blur(10px)');
  }

  /**
   * Apply backdrop-filter fallback
   * EC-LAND-421
   */
  static applyBackdropFilterFallback(element: HTMLElement): void {
    if (!this.supportsBackdropFilter()) {
      element.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    }
  }
}

/**
 * Progressive Enhancement Manager
 * EC-LAND-419: Progressive enhancement
 */
export class ProgressiveEnhancement {
  /**
   * Enhance feature if supported
   */
  static enhance<T>(
    check: () => boolean,
    enhanceFn: () => T,
    fallbackFn: () => T
  ): T {
    return check() ? enhanceFn() : fallbackFn();
  }

  /**
   * Add class if feature is supported
   */
  static addFeatureClass(element: HTMLElement, feature: string, className: string): void {
    const checks: Record<string, () => boolean> = {
      'css-grid': () => FeatureDetector.supportsCSSGrid(),
      'flexbox': () => FeatureDetector.supportsFlexbox(),
      'custom-properties': () => FeatureDetector.supportsCustomProperties(),
      'intersection-observer': () => FeatureDetector.supportsIntersectionObserver(),
      'fetch': () => FeatureDetector.supportsFetch(),
    };

    if (checks[feature]?.()) {
      element.classList.add(className);
    }
  }
}

/**
 * Graceful Degradation Manager
 * EC-LAND-418: Graceful degradation
 */
export class GracefulDegradation {
  /**
   * Degrade gracefully if feature not supported
   */
  static degrade<T>(
    check: () => boolean,
    modernFn: () => T,
    degradedFn: () => T
  ): T {
    return check() ? modernFn() : degradedFn();
  }

  /**
   * Show fallback message
   */
  static showFallbackMessage(message: string): void {
    if (typeof document !== 'undefined') {
      const banner = document.createElement('div');
      banner.className = 'browser-compat-banner';
      banner.textContent = message;
      banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff6b6b;
        color: white;
        padding: 1rem;
        text-align: center;
        z-index: 10000;
      `;
      document.body.insertBefore(banner, document.body.firstChild);
    }
  }
}

// Initialize polyfills on load
if (typeof window !== 'undefined') {
  // Load essential polyfills
  PolyfillLoader.loadPromisePolyfill().catch(() => {
    // Silently fail if polyfill can't be loaded
  });
}

