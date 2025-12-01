/**
 * Image Optimization Utilities
 * EC-091, EC-092, EC-093: Image loading and optimization
 */
export interface ImageLoadOptions {
  src: string;
  srcSet?: string;
  sizes?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  placeholder?: string;
}

export class ImageLoader {
  private static cache = new Map<string, HTMLImageElement>();

  static async load(options: ImageLoadOptions): Promise<HTMLImageElement> {
    const { src, onLoad, onError } = options;

    // Check cache
    if (this.cache.has(src)) {
      const cached = this.cache.get(src)!;
      onLoad?.();
      return cached;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.cache.set(src, img);
        onLoad?.();
        resolve(img);
      };

      img.onerror = () => {
        const err = new Error(`Failed to load image: ${src}`);
        onError?.(err);
        reject(err);
      };

      img.src = src;
    });
  }

  static preload(src: string): Promise<HTMLImageElement> {
    return this.load({ src });
  }

  static clearCache(): void {
    this.cache.clear();
  }
}

/**
 * Generate responsive image srcSet
 */
export function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map((width) => `${baseUrl}?w=${width} ${width}w`)
    .join(', ');
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizes(breakpoints: Record<string, string>): string {
  return Object.entries(breakpoints)
    .map(([query, size]) => `(${query}) ${size}`)
    .join(', ');
}

