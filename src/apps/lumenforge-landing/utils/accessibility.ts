/**
 * Comprehensive Accessibility Utilities
 * EC-LAND-251 to EC-LAND-350: Accessibility edge cases fixes
 */

/**
 * Keyboard Navigation Manager
 * EC-LAND-251 to EC-LAND-260: Keyboard navigation fixes
 */
export class KeyboardNavigation {
  private static focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  /**
   * Get all focusable elements in a container
   * EC-LAND-251: Logical tab order
   */
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const elements = Array.from(
      container.querySelectorAll<HTMLElement>(this.focusableSelectors)
    );
    
    // Filter out hidden elements
    return elements.filter(el => {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  /**
   * Focus trap for modals
   * EC-LAND-252
   */
  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return () => {};

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTab);
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }

  /**
   * Restore focus to previous element
   * EC-LAND-260
   */
  private static previousFocus: HTMLElement | null = null;

  static saveFocus(): void {
    this.previousFocus = document.activeElement as HTMLElement;
  }

  static restoreFocus(): void {
    if (this.previousFocus) {
      this.previousFocus.focus();
      this.previousFocus = null;
    }
  }

  /**
   * Handle arrow key navigation
   * EC-LAND-256
   */
  static handleArrowKeys(
    container: HTMLElement,
    orientation: 'horizontal' | 'vertical' | 'both' = 'both'
  ): () => void {
    const focusableElements = this.getFocusableElements(container);

    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = focusableElements.indexOf(
        document.activeElement as HTMLElement
      );

      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % focusableElements.length;
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            e.preventDefault();
            nextIndex =
              (currentIndex - 1 + focusableElements.length) %
              focusableElements.length;
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            nextIndex = (currentIndex + 1) % focusableElements.length;
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            e.preventDefault();
            nextIndex =
              (currentIndex - 1 + focusableElements.length) %
              focusableElements.length;
          }
          break;
      }

      if (nextIndex !== currentIndex) {
        focusableElements[nextIndex].focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  /**
   * Check for keyboard shortcut conflicts
   * EC-LAND-255
   */
  static checkShortcutConflict(
    key: string,
    modifiers: { ctrl?: boolean; alt?: boolean; shift?: boolean; meta?: boolean } = {}
  ): boolean {
    // Common browser shortcuts that should not be overridden
    const browserShortcuts = [
      { key: 'f', ctrl: true }, // Find
      { key: 'r', ctrl: true }, // Reload
      { key: 'w', ctrl: true }, // Close tab
      { key: 't', ctrl: true }, // New tab
      { key: 'n', ctrl: true }, // New window
      { key: 'p', ctrl: true }, // Print
      { key: 's', ctrl: true }, // Save
      { key: 'a', ctrl: true }, // Select all
    ];

    return browserShortcuts.some(shortcut => {
      const hasCtrl = (shortcut as any).ctrl === modifiers.ctrl;
      const hasAlt = (shortcut as any).alt === modifiers.alt;
      const hasShift = (shortcut as any).shift === modifiers.shift;
      const hasMeta = (shortcut as any).meta === modifiers.meta;
      
      return (
        shortcut.key === key.toLowerCase() &&
        (hasCtrl || hasAlt || hasShift || hasMeta)
      );
    });
  }
}

/**
 * ARIA Utilities
 * EC-LAND-261 to EC-LAND-270: Screen reader support
 */
export class ARIAManager {
  /**
   * Create ARIA live region for announcements
   * EC-LAND-264, EC-LAND-270
   */
  static createLiveRegion(
    politeness: 'polite' | 'assertive' | 'off' = 'polite'
  ): HTMLElement {
    let liveRegion = document.getElementById('aria-live-region');
    
    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.id = 'aria-live-region';
      liveRegion.setAttribute('role', 'status');
      liveRegion.setAttribute('aria-live', politeness);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    } else {
      liveRegion.setAttribute('aria-live', politeness);
    }

    return liveRegion;
  }

  /**
   * Announce message to screen readers
   * EC-LAND-264, EC-LAND-268, EC-LAND-269, EC-LAND-270
   */
  static announce(
    message: string,
    politeness: 'polite' | 'assertive' = 'polite'
  ): void {
    const liveRegion = this.createLiveRegion(politeness);
    
    // Clear previous message
    liveRegion.textContent = '';
    
    // Use setTimeout to ensure the message is announced
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }

  /**
   * Update ARIA state
   * EC-LAND-263
   */
  static updateState(
    element: HTMLElement,
    state: Record<string, string | boolean>
  ): void {
    Object.entries(state).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) {
          element.setAttribute(`aria-${key}`, 'true');
        } else {
          element.removeAttribute(`aria-${key}`);
        }
      } else {
        element.setAttribute(`aria-${key}`, String(value));
      }
    });
  }

  /**
   * Set ARIA label
   * EC-LAND-261
   */
  static setLabel(element: HTMLElement, label: string): void {
    element.setAttribute('aria-label', label);
  }

  /**
   * Associate label with input
   * EC-LAND-267
   */
  static associateLabel(input: HTMLElement, label: HTMLElement): void {
    const inputId = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const labelId = label.id || `label-${Math.random().toString(36).substr(2, 9)}`;

    input.id = inputId;
    label.id = labelId;
    label.setAttribute('for', inputId);
    input.setAttribute('aria-labelledby', labelId);
  }

  /**
   * Mark image as decorative
   * EC-LAND-266
   */
  static markDecorative(img: HTMLImageElement): void {
    img.setAttribute('role', 'presentation');
    img.setAttribute('aria-hidden', 'true');
    img.removeAttribute('alt');
  }

  /**
   * Set error message association
   * EC-LAND-268
   */
  static associateErrorMessage(
    input: HTMLElement,
    errorMessage: HTMLElement
  ): void {
    const inputId = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const errorId = errorMessage.id || `error-${Math.random().toString(36).substr(2, 9)}`;

    input.id = inputId;
    errorMessage.id = errorId;
    input.setAttribute('aria-describedby', errorId);
    input.setAttribute('aria-invalid', 'true');
    errorMessage.setAttribute('role', 'alert');
  }
}

/**
 * Color & Contrast Utilities
 * EC-LAND-271 to EC-LAND-280: Color and contrast fixes
 */
export class ContrastChecker {
  /**
   * Calculate relative luminance
   */
  private static getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(val => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }

  /**
   * Get RGB values from hex color
   */
  private static hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : null;
  }

  /**
   * Calculate contrast ratio
   * EC-LAND-271, EC-LAND-272, EC-LAND-273
   */
  static getContrastRatio(
    color1: string,
    color2: string
  ): number | null {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return null;

    const lum1 = this.getLuminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = this.getLuminance(rgb2[0], rgb2[1], rgb2[2]);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Check if contrast meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
   * EC-LAND-271, EC-LAND-272
   */
  static meetsWCAGAA(
    foreground: string,
    background: string,
    isLargeText: boolean = false
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    if (!ratio) return false;

    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }

  /**
   * Check if contrast meets WCAG AAA (7:1 for normal text, 4.5:1 for large text)
   * EC-LAND-271, EC-LAND-272
   */
  static meetsWCAGAAA(
    foreground: string,
    background: string,
    isLargeText: boolean = false
  ): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    if (!ratio) return false;

    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }

  /**
   * Ensure color is not the only indicator
   * EC-LAND-274
   */
  static ensureNonColorIndicator(
    element: HTMLElement,
    indicator: 'icon' | 'text' | 'pattern' | 'shape'
  ): void {
    // Add additional visual indicator beyond color
    switch (indicator) {
      case 'icon':
        element.setAttribute('aria-label', element.textContent || '');
        break;
      case 'text':
        // Text already provides non-color indicator
        break;
      case 'pattern':
        element.style.backgroundImage = 'repeating-linear-gradient(45deg, transparent, transparent 10px, currentColor 10px, currentColor 20px)';
        break;
      case 'shape':
        element.style.borderLeft = '4px solid currentColor';
        break;
    }
  }
}

/**
 * Form Accessibility Utilities
 * EC-LAND-281 to EC-LAND-290: Form accessibility
 */
export class FormAccessibility {
  /**
   * Mark required fields
   * EC-LAND-281
   */
  static markRequired(input: HTMLElement, label: HTMLElement): void {
    input.setAttribute('aria-required', 'true');
    const requiredText = document.createTextNode(' (required)');
    label.appendChild(requiredText);
    label.setAttribute('aria-label', label.textContent || '');
  }

  /**
   * Associate error message with field
   * EC-LAND-282
   */
  static associateError(
    input: HTMLElement,
    errorElement: HTMLElement
  ): void {
    ARIAManager.associateErrorMessage(input, errorElement);
  }

  /**
   * Announce validation error
   * EC-LAND-283
   */
  static announceValidation(
    input: HTMLElement,
    errorMessage: string
  ): void {
    ARIAManager.announce(errorMessage, 'assertive');
    input.setAttribute('aria-invalid', 'true');
  }

  /**
   * Set autocomplete attribute
   * EC-LAND-284
   */
  static setAutocomplete(
    input: HTMLInputElement,
    type: string
  ): void {
    input.setAttribute('autocomplete', type);
  }

  /**
   * Group form fields
   * EC-LAND-288
   */
  static groupFields(
    fields: HTMLElement[],
    groupLabel: string
  ): HTMLFieldSetElement {
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.textContent = groupLabel;
    fieldset.appendChild(legend);
    fields.forEach(field => fieldset.appendChild(field));
    return fieldset;
  }
}

/**
 * Motion & Animation Accessibility
 * EC-LAND-291 to EC-LAND-300: Motion accessibility
 */
export class MotionAccessibility {
  /**
   * Check if user prefers reduced motion
   * EC-LAND-291
   */
  static prefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Disable animations if reduced motion preferred
   * EC-LAND-291
   */
  static disableAnimationsIfNeeded(): void {
    if (this.prefersReducedMotion()) {
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Check flash frequency
   * EC-LAND-294
   */
  static checkFlashFrequency(element: HTMLElement): boolean {
    // Check if element flashes more than 3 times per second
    let flashCount = 0;
    const startTime = Date.now();

    const observer = new MutationObserver(() => {
      flashCount++;
      const elapsed = (Date.now() - startTime) / 1000;
      const frequency = flashCount / elapsed;

      if (frequency > 3) {
        console.warn('Element flashes more than 3 times per second');
        observer.disconnect();
      }
    });

    observer.observe(element, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });

    return true;
  }

  /**
   * Make auto-scrolling content pausable
   * EC-LAND-298
   */
  static makePausable(
    element: HTMLElement,
    scrollFunction: () => void
  ): () => void {
    let isPaused = false;
    let scrollInterval: number | null = null;

    const pauseButton = document.createElement('button');
    pauseButton.textContent = 'Pause';
    pauseButton.setAttribute('aria-label', 'Pause auto-scrolling');
    pauseButton.onclick = () => {
      isPaused = !isPaused;
      pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
      pauseButton.setAttribute('aria-label', isPaused ? 'Resume auto-scrolling' : 'Pause auto-scrolling');
      
      if (isPaused && scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
      } else if (!isPaused) {
        scrollInterval = window.setInterval(scrollFunction, 100);
      }
    };

    element.insertBefore(pauseButton, element.firstChild);

    return () => {
      if (scrollInterval) clearInterval(scrollInterval);
    };
  }
}

/**
 * Semantic HTML Utilities
 * EC-LAND-301 to EC-LAND-310: Semantic HTML
 */
export class SemanticHTML {
  /**
   * Validate heading hierarchy
   * EC-LAND-301
   */
  static validateHeadingHierarchy(): boolean {
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
    let previousLevel = 0;

    for (const heading of headings) {
      const level = parseInt(heading.tagName.charAt(1));
      
      if (level > previousLevel + 1) {
        console.warn(`Heading hierarchy skipped: ${heading.tagName} after h${previousLevel}`);
        return false;
      }

      previousLevel = level;
    }

    return true;
  }

  /**
   * Ensure proper landmark usage
   * EC-LAND-302
   */
  static ensureLandmarks(): void {
    if (!document.querySelector('nav')) {
      console.warn('No <nav> element found');
    }
    if (!document.querySelector('main')) {
      console.warn('No <main> element found');
    }
  }

  /**
   * Mark lists properly
   * EC-LAND-303
   */
  static markList(items: HTMLElement[], ordered: boolean = false): HTMLElement {
    const list = document.createElement(ordered ? 'ol' : 'ul');
    items.forEach(item => {
      const li = document.createElement('li');
      li.appendChild(item);
      list.appendChild(li);
    });
    return list;
  }
}

// Initialize motion accessibility
if (typeof window !== 'undefined') {
  MotionAccessibility.disableAnimationsIfNeeded();
}
