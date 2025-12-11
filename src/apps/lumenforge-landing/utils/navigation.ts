/**
 * Navigation Utilities
 * EC-LAND-851 to EC-LAND-860: Navigation & Routing
 */

/**
 * Navigation Manager
 * EC-LAND-851 to EC-LAND-860
 */
export class NavigationManager {
  /**
   * Navigate to URL
   * EC-LAND-851: Intuitive navigation
   */
  static navigate(url: string, options?: { replace?: boolean; state?: any }): void {
    if (options?.replace) {
      window.history.replaceState(options.state || {}, '', url);
    } else {
      window.history.pushState(options?.state || {}, '', url);
    }

    // Trigger popstate event for SPA routing
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  /**
   * Check if navigation is accessible
   * EC-LAND-852: Accessible navigation
   */
  static isAccessible(element: HTMLElement): boolean {
    const hasAriaLabel = element.hasAttribute('aria-label') || element.hasAttribute('aria-labelledby');
    const hasRole = element.hasAttribute('role');
    const isSemantic = ['nav', 'a', 'button'].includes(element.tagName.toLowerCase());

    return hasAriaLabel || hasRole || isSemantic;
  }

  /**
   * Make navigation keyboard-friendly
   * EC-LAND-853: Keyboard-friendly navigation
   */
  static enableKeyboardNavigation(container: HTMLElement): () => void {
    const handleKeyDown = (e: KeyboardEvent) => {
      const focusableElements = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      const currentIndex = Array.from(focusableElements).indexOf(
        document.activeElement as HTMLElement
      );

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          e.preventDefault();
          nextIndex = currentIndex < focusableElements.length - 1 ? currentIndex + 1 : 0;
          break;
        case 'ArrowUp':
        case 'ArrowLeft':
          e.preventDefault();
          nextIndex = currentIndex > 0 ? currentIndex - 1 : focusableElements.length - 1;
          break;
        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          e.preventDefault();
          nextIndex = focusableElements.length - 1;
          break;
      }

      if (nextIndex !== currentIndex) {
        focusableElements[nextIndex]?.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  /**
   * Make navigation mobile-friendly
   * EC-LAND-854: Mobile-friendly navigation
   */
  static makeMobileFriendly(container: HTMLElement): () => void {
    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button')) {
        target.style.touchAction = 'manipulation';
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a, button') as HTMLElement;
      if (link && link.getBoundingClientRect().width >= 44 && link.getBoundingClientRect().height >= 44) {
        // Touch target is large enough
      } else if (link) {
        // Expand touch target
        link.style.padding = '12px';
        link.style.minWidth = '44px';
        link.style.minHeight = '44px';
      }
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }

  /**
   * Ensure consistent navigation
   * EC-LAND-855: Consistent navigation
   */
  static ensureConsistency(navElements: HTMLElement[]): void {
    navElements.forEach(element => {
      if (!element.hasAttribute('aria-label')) {
        element.setAttribute('aria-label', 'Navigation');
      }
      if (!element.hasAttribute('role')) {
        element.setAttribute('role', 'navigation');
      }
    });
  }

  /**
   * Monitor navigation
   * EC-LAND-860: Navigation monitoring
   */
  private static navigationHistory: Array<{ url: string; timestamp: number }> = [];

  static trackNavigation(url: string): void {
    this.navigationHistory.push({ url, timestamp: Date.now() });

    // Limit history size
    if (this.navigationHistory.length > 100) {
      this.navigationHistory.shift();
    }
  }

  static getNavigationHistory(): Array<{ url: string; timestamp: number }> {
    return [...this.navigationHistory];
  }

  /**
   * Recover navigation
   * EC-LAND-859: Navigation recovery
   */
  static recoverNavigation(fallbackUrl: string): void {
    try {
      if (window.location.pathname !== fallbackUrl) {
        this.navigate(fallbackUrl);
      }
    } catch (error) {
      console.warn('Navigation recovery failed:', error);
      window.location.href = fallbackUrl;
    }
  }
}

