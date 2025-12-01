/**
 * Optimized Image Component
 * EC-LAND-102, EC-LAND-161, EC-LAND-173, EC-LAND-231 to EC-LAND-240
 */
import React, { useState, useEffect, useRef } from 'react';
import { ImageOptimizer } from '../utils/performance-advanced';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  srcset?: string;
  sizes?: string;
  lazy?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  srcset,
  sizes,
  lazy = true,
  placeholder,
  onLoad,
  onError,
  alt = '',
  className = '',
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState<string | undefined>(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // EC-LAND-102, EC-LAND-205: Lazy loading with Intersection Observer
  const [containerRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.01,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (!lazy || isVisible) {
      // EC-LAND-231: Preload optimized image
      const width = props.width ? Number(props.width) : undefined;
      const height = props.height ? Number(props.height) : undefined;
      ImageOptimizer.preloadImage(src, width || height ? { width, height } : {})
        .then(() => {
          setImageSrc(src);
        })
        .catch(() => {
          setHasError(true);
          onError?.();
        });
    }
  }, [src, isVisible, lazy, props.width, props.height, onError]);

  // EC-LAND-161: Generate srcset if not provided
  const generatedSrcset = srcset || ImageOptimizer.generateSrcset(src);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {placeholder && !isLoaded && (
        <img
          src={placeholder}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-sm"
          aria-hidden="true"
        />
      )}
      <img
        ref={imgRef}
        src={imageSrc || placeholder}
        srcSet={generatedSrcset}
        sizes={sizes}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazy ? 'lazy' : 'eager'}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${hasError ? 'opacity-50' : ''}`}
        {...props}
      />
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-gray-400">
          Failed to load image
        </div>
      )}
    </div>
  );
};

