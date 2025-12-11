/**
 * Build Status Component
 * 
 * Displays build status, progress, and errors
 */

'use client';

import React from 'react';
import { CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';

export type BuildStatusType = 'idle' | 'building' | 'success' | 'error' | 'warning';

export interface BuildStatusProps {
  status: BuildStatusType;
  message?: string;
  progress?: number;
  errors?: string[];
  warnings?: string[];
  buildTime?: number;
}

export const BuildStatus: React.FC<BuildStatusProps> = ({
  status,
  message,
  progress,
  errors = [],
  warnings = [],
  buildTime,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'building':
        return <Loader2 size={16} className="animate-spin" />;
      case 'success':
        return <CheckCircle2 size={16} style={{ color: '#10b981' }} />;
      case 'error':
        return <XCircle size={16} style={{ color: '#ef4444' }} />;
      case 'warning':
        return <AlertCircle size={16} style={{ color: '#f59e0b' }} />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'building':
        return '#3b82f6';
      case 'success':
        return '#10b981';
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      default:
        return 'var(--slate-text-muted, #9ba1aa)';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 12px',
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
      }}
    >
      {/* Status Icon */}
      <div style={{ display: 'flex', alignItems: 'center' }}>{getStatusIcon()}</div>

      {/* Status Text */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: getStatusColor(),
          }}
        >
          {message || status.charAt(0).toUpperCase() + status.slice(1)}
        </div>

        {/* Progress Bar */}
        {status === 'building' && progress !== undefined && (
          <div
            style={{
              width: '100%',
              height: 2,
              background: 'var(--slate-bg, #0f1115)',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                background: getStatusColor(),
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        )}

        {/* Build Time */}
        {buildTime !== undefined && status === 'success' && (
          <div
            style={{
              fontSize: 10,
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          >
            Built in {buildTime.toFixed(2)}s
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <div style={{ marginTop: 4 }}>
            {errors.map((error, index) => (
              <div
                key={index}
                style={{
                  fontSize: 11,
                  color: '#ef4444',
                  marginTop: 2,
                }}
              >
                {error}
              </div>
            ))}
          </div>
        )}

        {/* Warnings */}
        {warnings.length > 0 && (
          <div style={{ marginTop: 4 }}>
            {warnings.map((warning, index) => (
              <div
                key={index}
                style={{
                  fontSize: 11,
                  color: '#f59e0b',
                  marginTop: 2,
                }}
              >
                {warning}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildStatus;

