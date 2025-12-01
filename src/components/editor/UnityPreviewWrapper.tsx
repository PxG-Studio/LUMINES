'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { usePreviewState } from '@/state/previewState';
import { Panel } from '@/design-system/primitives/Panel';

export interface UnityPreviewWrapperProps {
  buildUrl?: string;
  loaderUrl?: string;
  width?: number;
  height?: number;
  onUnityLoaded?: () => void;
  onUnityError?: (error: Error) => void;
}

export const UnityPreviewWrapper: React.FC<UnityPreviewWrapperProps> = ({
  buildUrl,
  loaderUrl,
  width = 1280,
  height = 720,
  onUnityLoaded,
  onUnityError,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLoading, setUnityLoaded, setCanvasSize } = usePreviewState();

  // Throttle resize events
  const handleResize = useCallback(() => {
    if (canvasRef.current && containerRef.current) {
      const container = containerRef.current;
      const newWidth = Math.min(width, container.clientWidth - 32);
      const newHeight = Math.min(height, container.clientHeight - 32);
      
      canvasRef.current.width = newWidth;
      canvasRef.current.height = newHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
    }
  }, [width, height, setCanvasSize]);

  // Lazy load Unity loader
  useEffect(() => {
    if (!buildUrl || !loaderUrl) return;

    let isMounted = true;
    let resizeObserver: ResizeObserver | null = null;

    const loadUnity = async () => {
      setIsLoading(true);
      setLoading(true);
      setError(null);

      try {
        // Create shadow DOM for canvas isolation
        if (containerRef.current && !shadowRootRef.current) {
          shadowRootRef.current = containerRef.current.attachShadow({ mode: 'open' });
          
          // Create canvas in shadow DOM
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          canvas.style.width = '100%';
          canvas.style.height = '100%';
          canvas.style.display = 'block';
          canvasRef.current = canvas;
          
          shadowRootRef.current.appendChild(canvas);
          
          // Prevent Storybook CSS from interfering
          const style = document.createElement('style');
          style.textContent = `
            :host {
              display: block;
              width: 100%;
              height: 100%;
            }
            canvas {
              display: block;
              image-rendering: -webkit-optimize-contrast;
              image-rendering: crisp-edges;
            }
          `;
          shadowRootRef.current.appendChild(style);
        }

        // Dynamically load Unity loader script
        if (!window.createUnityInstance) {
          const script = document.createElement('script');
          script.src = loaderUrl;
          script.async = true;
          
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        if (!isMounted) return;

        // Initialize Unity
        if (window.createUnityInstance && canvasRef.current) {
          const instance = await window.createUnityInstance(
            canvasRef.current,
            {
              dataUrl: `${buildUrl}/Build.data`,
              frameworkUrl: `${buildUrl}/Build.framework.js`,
              codeUrl: `${buildUrl}/Build.wasm`,
            },
            (progress: number) => {
              console.log(`Unity loading: ${Math.round(progress * 100)}%`);
            }
          );

          if (isMounted) {
            setIsLoading(false);
            setLoading(false);
            setUnityLoaded(true);
            onUnityLoaded?.();
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load Unity';
        console.error('Unity load error:', err);
        setError(errorMessage);
        setIsLoading(false);
        setLoading(false);
        onUnityError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    };

    loadUnity();

    // Set up resize observer
    if (containerRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      isMounted = false;
      resizeObserver?.disconnect();
    };
  }, [buildUrl, loaderUrl, width, height, setLoading, setUnityLoaded, onUnityLoaded, onUnityError, handleResize]);

  return (
    <Panel title="Unity Preview" className="w-full h-full">
      <div
        ref={containerRef}
        className="relative w-full h-full min-h-[400px] bg-black rounded overflow-hidden"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--nv-bg-1)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--nv-accent)] mx-auto mb-4" />
              <p className="text-[var(--nv-text-2)]">Loading Unity...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--nv-bg-1)]">
            <div className="text-center p-4">
              <p className="text-[var(--nv-error)] mb-2">Error loading Unity</p>
              <p className="text-sm text-[var(--nv-text-2)]">{error}</p>
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
};

// Extend window type for Unity
declare global {
  interface Window {
    createUnityInstance?: (
      canvas: HTMLCanvasElement,
      config: {
        dataUrl: string;
        frameworkUrl: string;
        codeUrl: string;
      },
      onProgress?: (progress: number) => void
    ) => Promise<any>;
  }
}

