/**
 * Preview Frame Component
 * 
 * Iframe for displaying live preview of running application
 */

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { RefreshCw, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

export interface PreviewFrameProps {
  url?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  height?: string;
  width?: string;
  showControls?: boolean;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  url,
  onLoad,
  onError,
  height = '100%',
  width = '100%',
  showControls = true,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (url) {
      setIsLoading(true);
      setError(null);
    }
  }, [url]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    const error = new Error('Failed to load preview');
    setIsLoading(false);
    setError('Failed to load preview');
    onError?.(error);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
    }
  };

  const handleFullscreen = () => {
    if (!iframeRef.current) return;

    if (!isFullscreen) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  if (!url) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          width,
          background: 'var(--slate-bg, #0f1115)',
          color: 'var(--slate-text-muted, #9ba1aa)',
          fontSize: 14,
        }}
      >
        No preview URL available
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        height,
        width,
        background: 'var(--slate-bg, #0f1115)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Controls */}
      {showControls && (
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
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isLoading ? '#fbbf24' : '#10b981',
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: 'var(--slate-text-muted, #9ba1aa)',
              }}
            >
              {isLoading ? 'Loading...' : 'Running'}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <button
              onClick={handleRefresh}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: '1px solid var(--slate-border, #26292f)',
                borderRadius: 4,
                color: 'var(--slate-text, #e4e7eb)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
              title="Refresh"
            >
              <RefreshCw size={12} />
            </button>
            <button
              onClick={handleFullscreen}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: '1px solid var(--slate-border, #26292f)',
                borderRadius: 4,
                color: 'var(--slate-text, #e4e7eb)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
            </button>
            <button
              onClick={handleOpenInNewTab}
              style={{
                padding: '4px 8px',
                background: 'transparent',
                border: '1px solid var(--slate-border, #26292f)',
                borderRadius: 4,
                color: 'var(--slate-text, #e4e7eb)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
              title="Open in new tab"
            >
              <ExternalLink size={12} />
            </button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          style={{
            padding: 16,
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 4,
            margin: 12,
            color: '#ef4444',
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && !error && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            color: 'var(--slate-text-muted, #9ba1aa)',
            fontSize: 12,
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: '2px solid var(--slate-border, #26292f)',
              borderTopColor: 'var(--slate-accent, #3f8cff)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span>Loading preview...</span>
        </div>
      )}

      {/* Iframe */}
      <iframe
        ref={iframeRef}
        src={url}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          flex: 1,
          border: 'none',
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
        title="Preview"
      />

      <style jsx>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default PreviewFrame;

