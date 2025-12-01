/**
 * Lazy Image Component
 * EC-091, EC-092, EC-093: Lazy loading and image optimization
 */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export interface LazyImageProps {
  src: string;
  alt: string;
  srcSet?: string;
  sizes?: string;
  placeholder?: string;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  srcSet,
  sizes,
  placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E',
  className = '',
  onLoad,
  onError,
}) => {
  const [imageSrc, setImageSrc] = useState<string>(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [ref, isIntersecting] = useIntersectionObserver<HTMLImageElement>({
    threshold: 0.1,
    rootMargin: '50px',
  });

  useEffect(() => {
    if (isIntersecting && !isLoaded && !hasError) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
        onLoad?.();
      };

      img.onerror = () => {
        setHasError(true);
        onError?.();
      };

      img.src = src;
    }
  }, [isIntersecting, src, isLoaded, hasError, onLoad, onError]);

  return (
    <motion.img
      ref={ref}
      src={imageSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0.3 }}
      transition={{ duration: 0.3 }}
      loading="lazy"
      decoding="async"
    />
  );
};

