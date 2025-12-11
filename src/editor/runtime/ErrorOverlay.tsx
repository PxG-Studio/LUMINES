/**
 * Error Overlay Component
 * 
 * Displays runtime errors in an overlay
 */

'use client';

import React from 'react';
import { X, AlertCircle, Copy, RefreshCw } from 'lucide-react';

export interface ErrorOverlayProps {
  error?: Error | string | null;
  onClose?: () => void;
  onRetry?: () => void;
  show?: boolean;
}

export const ErrorOverlay: React.FC<ErrorOverlayProps> = ({
  error,
  onClose,
  onRetry,
  show = true,
}) => {
  if (!show || !error) return null;

  const errorMessage = error instanceof Error ? error.message : error;
  const errorStack = error instanceof Error ? error.stack : undefined;

  const handleCopy = () => {
    const text = errorStack || errorMessage;
    navigator.clipboard.writeText(text);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        padding: 20,
      }}
    >
      <div
        style={{
          background: 'var(--slate-panel, #16181d)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 8,
          maxWidth: 600,
          width: '100%',
          maxHeight: '80vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--slate-border, #26292f)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertCircle size={20} style={{ color: '#ef4444' }} />
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#ef4444',
              }}
            >
              Runtime Error
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {onRetry && (
              <button
                onClick={onRetry}
                style={{
                  padding: '6px 12px',
                  background: 'var(--slate-accent, #3f8cff)',
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
                <RefreshCw size={14} />
                Retry
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  padding: '6px 12px',
                  background: 'transparent',
                  border: '1px solid var(--slate-border, #26292f)',
                  borderRadius: 4,
                  color: 'var(--slate-text, #e4e7eb)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: 12,
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Error Message */}
        <div style={{ padding: '20px' }}>
          <div
            style={{
              fontSize: 14,
              color: '#ef4444',
              marginBottom: 12,
              fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
            }}
          >
            {errorMessage}
          </div>

          {/* Stack Trace */}
          {errorStack && (
            <div style={{ marginTop: 16 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--slate-text-muted, #9ba1aa)',
                  }}
                >
                  Stack Trace
                </span>
                <button
                  onClick={handleCopy}
                  style={{
                    padding: '4px 8px',
                    background: 'transparent',
                    border: '1px solid var(--slate-border, #26292f)',
                    borderRadius: 4,
                    color: 'var(--slate-text-muted, #9ba1aa)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 11,
                  }}
                >
                  <Copy size={12} />
                  Copy
                </button>
              </div>
              <pre
                style={{
                  background: 'var(--slate-bg, #0f1115)',
                  border: '1px solid var(--slate-border, #26292f)',
                  borderRadius: 4,
                  padding: 12,
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
                  color: 'var(--slate-text, #e4e7eb)',
                  overflow: 'auto',
                  maxHeight: 300,
                  lineHeight: 1.5,
                }}
              >
                {errorStack}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorOverlay;

