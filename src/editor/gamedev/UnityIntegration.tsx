/**
 * Unity Integration Component
 * 
 * Integration with Unity WebGL runtime for game development
 * Handles Unity instance, messaging, and scene management
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Square, RefreshCw, Settings } from 'lucide-react';

export interface UnityInstance {
  SendMessage: (gameObject: string, method: string, value?: string | number) => void;
  Quit: () => Promise<void>;
  Module: {
    canvas: HTMLCanvasElement;
  };
}

export interface UnityIntegrationProps {
  buildUrl?: string;
  loaderUrl?: string;
  onReady?: (instance: UnityInstance) => void;
  onError?: (error: Error) => void;
  onProgress?: (progress: number) => void;
}

export const UnityIntegration: React.FC<UnityIntegrationProps> = ({
  buildUrl = '/unity/Build',
  loaderUrl = '/unity/Build.loader.js',
  onReady,
  onError,
  onProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [unityInstance, setUnityInstance] = useState<UnityInstance | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  // Load Unity WebGL
  useEffect(() => {
    if (!containerRef.current) return;

    const loadUnity = async () => {
      try {
        setIsLoading(true);
        
        // Dynamically load Unity WebGL loader
        const script = document.createElement('script');
        script.src = loaderUrl;
        script.async = true;
        
        script.onload = () => {
          // @ts-ignore - Unity WebGL global
          if (window.createUnityInstance) {
            // @ts-ignore
            window.createUnityInstance(containerRef.current!, {
              dataUrl: `${buildUrl}.data`,
              frameworkUrl: `${buildUrl}.framework.js`,
              codeUrl: `${buildUrl}.wasm`,
              streamingAssetsUrl: 'StreamingAssets',
              companyName: 'WISSIL',
              productName: 'Game Dev IDE',
              productVersion: '1.0.0',
            }, (progress: number) => {
              setProgress(progress);
              onProgress?.(progress);
            }).then((instance: UnityInstance) => {
              setUnityInstance(instance);
              setIsLoading(false);
              onReady?.(instance);
            }).catch((error: Error) => {
              setIsLoading(false);
              onError?.(error);
            });
          }
        };

        script.onerror = () => {
          const error = new Error('Failed to load Unity WebGL loader');
          setIsLoading(false);
          onError?.(error);
        };

        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Failed to initialize Unity');
        setIsLoading(false);
        onError?.(err);
      }
    };

    loadUnity();
  }, [buildUrl, loaderUrl, onReady, onError, onProgress]);

  const handlePlay = useCallback(() => {
    if (unityInstance) {
      unityInstance.SendMessage('GameManager', 'Play');
      setIsPlaying(true);
    }
  }, [unityInstance]);

  const handleStop = useCallback(() => {
    if (unityInstance) {
      unityInstance.SendMessage('GameManager', 'Stop');
      setIsPlaying(false);
    }
  }, [unityInstance]);

  const handleReload = useCallback(() => {
    if (unityInstance) {
      unityInstance.SendMessage('GameManager', 'Reload');
    }
  }, [unityInstance]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--slate-bg, #0f1115)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--slate-panel, #16181d)',
          borderBottom: '1px solid var(--slate-border, #26292f)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--slate-text, #e4e7eb)',
            }}
          >
            Unity Runtime
          </span>
          {isLoading && (
            <span
              style={{
                fontSize: 11,
                color: 'var(--slate-text-muted, #9ba1aa)',
              }}
            >
              Loading... {Math.round(progress * 100)}%
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {!isPlaying ? (
            <button
              onClick={handlePlay}
              disabled={!unityInstance || isLoading}
              style={{
                padding: '6px 12px',
                background: 'var(--slate-accent, #3f8cff)',
                border: 'none',
                borderRadius: 4,
                color: '#FFFFFF',
                cursor: unityInstance && !isLoading ? 'pointer' : 'not-allowed',
                opacity: unityInstance && !isLoading ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
              }}
            >
              <Play size={14} />
              Play
            </button>
          ) : (
            <button
              onClick={handleStop}
              style={{
                padding: '6px 12px',
                background: '#ef4444',
                border: 'none',
                borderRadius: 4,
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 12,
              }}
            >
              <Square size={14} />
              Stop
            </button>
          )}
          <button
            onClick={handleReload}
            disabled={!unityInstance || isLoading}
            style={{
              padding: '6px 12px',
              background: 'transparent',
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              color: 'var(--slate-text, #e4e7eb)',
              cursor: unityInstance && !isLoading ? 'pointer' : 'not-allowed',
              opacity: unityInstance && !isLoading ? 1 : 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
            }}
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Unity Canvas Container */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#000000',
          position: 'relative',
        }}
      >
        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: '#FFFFFF',
              fontSize: 14,
            }}
          >
            Loading Unity... {Math.round(progress * 100)}%
          </div>
        )}
      </div>
    </div>
  );
};

export default UnityIntegration;

