/**
 * Responsive Design Utilities
 * EC-LAND-871 to EC-LAND-880: Responsive Design
 */

/**
 * Responsive Manager
 * EC-LAND-871 to EC-LAND-880
 */
export class ResponsiveManager {
  /**
   * Check if responsive on mobile
   * EC-LAND-871: Responsive on mobile
   */
  static isMobile(): boolean {
    return window.matchMedia('(max-width: 768px)').matches;
  }

  /**
   * Check if responsive on tablet
   * EC-LAND-872: Responsive on tablet
   */
  static isTablet(): boolean {
    return window.matchMedia('(min-width: 769px) and (max-width: 1024px)').matches;
  }

  /**
   * Check if responsive on desktop
   * EC-LAND-873: Responsive on desktop
   */
  static isDesktop(): boolean {
    return window.matchMedia('(min-width: 1025px)').matches;
  }

  /**
   * Get optimized breakpoints
   * EC-LAND-874: Optimized breakpoints
   */
  static getBreakpoints(): { mobile: number; tablet: number; desktop: number } {
    return {
      mobile: 768,
      tablet: 1024,
      desktop: 1025,
    };
  }

  /**
   * Ensure touch targets are large enough
   * EC-LAND-875: Touch targets not too small
   */
  static ensureTouchTargets(element: HTMLElement): void {
    const interactiveElements = element.querySelectorAll<HTMLElement>('a, button, input, select, textarea');

    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        el.style.minWidth = '44px';
        el.style.minHeight = '44px';
        el.style.padding = '12px';
      }
    });
  }

  /**
   * Ensure text is readable on mobile
   * EC-LAND-876: Text not too small on mobile
   */
  static ensureReadableText(element: HTMLElement): void {
    if (this.isMobile()) {
      const textElements = element.querySelectorAll<HTMLElement>('p, span, div, a, button');

      textElements.forEach(el => {
        const fontSize = window.getComputedStyle(el).fontSize;
        const fontSizeNum = parseFloat(fontSize);

        if (fontSizeNum < 16) {
          el.style.fontSize = '16px';
        }
      });
    }
  }

  /**
   * Make images responsive
   * EC-LAND-877: Responsive images
   */
  static makeImagesResponsive(element: HTMLElement): void {
    const images = element.querySelectorAll<HTMLImageElement>('img');

    images.forEach(img => {
      if (!img.hasAttribute('srcset') && !img.hasAttribute('sizes')) {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
      }

      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
  }

  /**
   * Fix layout on small screens
   * EC-LAND-878: Layout doesn't break on small screens
   */
  static fixSmallScreenLayout(element: HTMLElement): void {
    if (this.isMobile()) {
      const containers = element.querySelectorAll<HTMLElement>('[class*="container"], [class*="grid"], [class*="flex"]');

      containers.forEach(container => {
        const style = window.getComputedStyle(container);
        if (style.display === 'grid' || style.display === 'flex') {
          container.style.flexWrap = 'wrap';
          container.style.gap = '1rem';
        }
      });
    }
  }

  /**
   * Fix layout on large screens
   * EC-LAND-879: Layout doesn't break on large screens
   */
  static fixLargeScreenLayout(element: HTMLElement): void {
    if (this.isDesktop()) {
      const containers = element.querySelectorAll<HTMLElement>('[class*="container"]');

      containers.forEach(container => {
        const maxWidth = window.getComputedStyle(container).maxWidth;
        if (!maxWidth || maxWidth === 'none') {
          container.style.maxWidth = '1200px';
          container.style.margin = '0 auto';
        }
      });
    }
  }

  /**
   * Test layout on all devices
   * EC-LAND-880: Layout tested on all devices
   */
  static testLayout(element: HTMLElement): { passed: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check touch targets
    const interactiveElements = element.querySelectorAll<HTMLElement>('a, button');
    interactiveElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.width < 44 || rect.height < 44) {
        issues.push(`Touch target too small: ${el.tagName} (${rect.width}x${rect.height}px)`);
      }
    });

    // Check text size
    const textElements = element.querySelectorAll<HTMLElement>('p, span');
    textElements.forEach(el => {
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
      if (fontSize < 14) {
        issues.push(`Text too small: ${fontSize}px`);
      }
    });

    // Check images
    const images = element.querySelectorAll<HTMLImageElement>('img');
    images.forEach(img => {
      if (!img.hasAttribute('alt')) {
        issues.push(`Image missing alt text: ${img.src}`);
      }
    });

    return {
      passed: issues.length === 0,
      issues,
    };
  }
}

