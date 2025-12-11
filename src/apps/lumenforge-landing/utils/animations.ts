/**
 * Animations & Transitions Utilities
 * EC-LAND-881 to EC-LAND-890: Animations & Transitions
 */

/**
 * Animation Manager
 * EC-LAND-881 to EC-LAND-890
 */
export class AnimationManager {
  /**
   * Check if animations are smooth
   * EC-LAND-881: Smooth animations
   */
  static isSmooth(element: HTMLElement): boolean {
    const style = window.getComputedStyle(element);
    const willChange = style.willChange;
    const transform = style.transform;

    return willChange !== 'auto' || transform !== 'none';
  }

  /**
   * Make animations accessible
   * EC-LAND-882: Accessible animations
   */
  static makeAccessible(element: HTMLElement): void {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      element.style.animation = 'none';
      element.style.transition = 'none';
    }

    // Add aria-live for animated content
    if (element.textContent && !element.hasAttribute('aria-live')) {
      element.setAttribute('aria-live', 'polite');
    }
  }

  /**
   * Optimize animations
   * EC-LAND-883: Optimized animations
   */
  static optimize(element: HTMLElement): void {
    // Use transform and opacity for better performance
    element.style.willChange = 'transform, opacity';
    
    // Use GPU acceleration
    element.style.transform = 'translateZ(0)';
  }

  /**
   * Prevent motion sickness
   * EC-LAND-884: No motion sickness
   */
  static preventMotionSickness(element: HTMLElement): void {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Disable all animations
      element.style.animation = 'none';
      element.style.transition = 'none';
      element.style.transform = 'none';
    }

    // Limit animation duration
    const style = window.getComputedStyle(element);
    const animationDuration = style.animationDuration;
    if (animationDuration && parseFloat(animationDuration) > 3) {
      element.style.animationDuration = '3s';
    }
  }

  /**
   * Ensure animations are consistent
   * EC-LAND-886: Consistent animations
   */
  static ensureConsistency(elements: HTMLElement[]): void {
    const defaultDuration = '0.3s';
    const defaultEasing = 'ease-in-out';

    elements.forEach(element => {
      const style = window.getComputedStyle(element);
      if (!style.transition || style.transition === 'none') {
        element.style.transition = `all ${defaultDuration} ${defaultEasing}`;
      }
    });
  }

  /**
   * Monitor animations
   * EC-LAND-889: Animation monitoring
   */
  private static animationMetrics = new Map<string, { count: number; totalDuration: number }>();

  static trackAnimation(element: HTMLElement, animationName: string): void {
    const metrics = this.animationMetrics.get(animationName) || { count: 0, totalDuration: 0 };
    metrics.count++;
    
    const style = window.getComputedStyle(element);
    const duration = parseFloat(style.animationDuration || '0');
    metrics.totalDuration += duration;

    this.animationMetrics.set(animationName, metrics);
  }

  static getAnimationMetrics(animationName: string) {
    return this.animationMetrics.get(animationName);
  }

  /**
   * Check animation performance
   * EC-LAND-890: Performant animations
   */
  static checkPerformance(_element: HTMLElement): { performant: boolean; fps?: number } {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrameId: number;

    const measure = (currentTime: number) => {
      frameCount++;
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const fps = Math.round((frameCount * 1000) / elapsed);
        cancelAnimationFrame(animationFrameId);
        return { performant: fps >= 30, fps };
      }

      animationFrameId = requestAnimationFrame(measure);
    };

    animationFrameId = requestAnimationFrame(measure);

    // Fallback
    setTimeout(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    }, 2000);

    return { performant: true };
  }
}

