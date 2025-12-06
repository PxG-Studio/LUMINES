/**
 * Browser Compatibility Utilities
 * EC-076, EC-077, EC-078, EC-083: Browser feature detection
 * EC-LAND-401 to EC-LAND-450: Enhanced browser compatibility
 */

// Re-export from browser-compat for backward compatibility
export { FeatureDetector, PolyfillLoader, CSSFallback, ProgressiveEnhancement, GracefulDegradation } from './browser-compat';

/**
 * Check if backdrop-filter is supported
 * EC-LAND-421
 */
export function supportsBackdropFilter(): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;
  return CSS.supports('backdrop-filter', 'blur(10px)');
}

/**
 * Check if CSS Grid is supported
 * EC-LAND-401
 */
export function supportsGrid(): boolean {
  if (typeof window === 'undefined' || typeof CSS === 'undefined') return false;
  return CSS.supports('display', 'grid');
}

/**
 * Check if IntersectionObserver is supported
 * EC-LAND-404
 */
export function supportsIntersectionObserver(): boolean {
  if (typeof window === 'undefined') return false;
  return 'IntersectionObserver' in window;
}

/**
 * Check if Framer Motion is supported (basic check)
 */
export function supportsFramerMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return 'requestAnimationFrame' in window && 'CSS' in window;
}

/**
 * Get viewport height accounting for mobile browser UI
 * EC-LAND-451
 */
export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0;
  // Use dvh if supported, fallback to vh
  if (typeof CSS !== 'undefined' && CSS.supports('height', '100dvh')) {
    return window.innerHeight;
  }
  return window.innerHeight;
}

/**
 * Check if browser is IE
 * EC-LAND-411
 */
export function isIE(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return ua.includes('MSIE') || ua.includes('Trident');
}

/**
 * Check if browser is Firefox
 * EC-LAND-414
 */
export function isFirefox(): boolean {
  if (typeof navigator === 'undefined') return false;
  return navigator.userAgent.includes('Firefox');
}

