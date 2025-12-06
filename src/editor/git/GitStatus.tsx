/**
 * Git Status Component
 * 
 * Displays Git repository status and file changes
 */

'use client';

import React from 'react';
import { GitBranch, GitCommit, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGit } from './GitProvider';

export interface GitStatusProps {
  showFiles?: boolean;
  compact?: boolean;
}

export const GitStatus: React.FC<GitStatusProps> = ({
  showFiles = true,
  compact = false,
}) => {
  const { status, isLoading, error } = useGit();

  if (isLoading) {
    return (
      <div
        style={{
          padding: compact ? '4px 8px' : '8px 12px',
          background: 'var(--slate-panel, #16181d)',
          border: '1px solid var(--slate-border, #26292f)',
          borderRadius: 4,
          fontSize: 12,
          color: 'var(--slate-text-muted, #9ba1aa)',
        }}
      >
        Loading Git status...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: compact ? '4px 8px' : '8px 12px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: 4,
          fontSize: 12,
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <AlertCircle size={14} />
        {error.message}
      </div>
    );
  }

  if (!status) {
    return (
      <div
        style={{
          padding: compact ? '4px 8px' : '8px 12px',
          background: 'var(--slate-panel, #16181d)',
          border: '1px solid var(--slate-border, #26292f)',
          borderRadius: 4,
          fontSize: 12,
          color: 'var(--slate-text-muted, #9ba1aa)',
        }}
      >
        Not a Git repository
      </div>
    );
  }

  const hasChanges =
    status.staged.length > 0 ||
    status.not_added.length > 0 ||
    status.modified.length > 0 ||
    status.created.length > 0 ||
    status.deleted.length > 0;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 4 : 8,
        padding: compact ? '4px 8px' : '8px 12px',
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 4,
      }}
    >
      {/* Branch Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <GitBranch size={14} style={{ color: 'var(--slate-text-muted, #9ba1aa)' }} />
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--slate-text, #e4e7eb)',
          }}
        >
          {status.current || 'main'}
        </span>
        {status.tracking && (
          <span
            style={{
              fontSize: 11,
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          >
            → {status.tracking}
          </span>
        )}
        {status.ahead > 0 && (
          <span
            style={{
              fontSize: 11,
              color: '#10b981',
            }}
          >
            ↑ {status.ahead}
          </span>
        )}
        {status.behind > 0 && (
          <span
            style={{
              fontSize: 11,
              color: '#f59e0b',
            }}
          >
            ↓ {status.behind}
          </span>
        )}
      </div>

      {/* Changes Summary */}
      {hasChanges && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            fontSize: 11,
            color: 'var(--slate-text-muted, #9ba1aa)',
          }}
        >
          {status.staged.length > 0 && (
            <span style={{ color: '#10b981' }}>
              <CheckCircle2 size={12} style={{ display: 'inline', marginRight: 4 }} />
              {status.staged.length} staged
            </span>
          )}
          {status.modified.length > 0 && (
            <span style={{ color: '#f59e0b' }}>
              {status.modified.length} modified
            </span>
          )}
          {status.created.length > 0 && (
            <span style={{ color: '#3b82f6' }}>
              {status.created.length} created
            </span>
          )}
          {status.deleted.length > 0 && (
            <span style={{ color: '#ef4444' }}>
              {status.deleted.length} deleted
            </span>
          )}
        </div>
      )}

      {/* File List */}
      {showFiles && hasChanges && (
        <div
          style={{
            marginTop: 4,
            paddingTop: 8,
            borderTop: '1px solid var(--slate-border, #26292f)',
          }}
        >
          {/* Staged Files */}
          {status.staged.length > 0 && (
            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: '#10b981',
                  marginBottom: 4,
                }}
              >
                Staged
              </div>
              {status.staged.map((file) => (
                <div
                  key={file}
                  style={{
                    fontSize: 11,
                    color: 'var(--slate-text, #e4e7eb)',
                    padding: '2px 0',
                    paddingLeft: 8,
                  }}
                >
                  {file}
                </div>
              ))}
            </div>
          )}

          {/* Unstaged Files */}
          {(status.not_added.length > 0 ||
            status.modified.length > 0 ||
            status.created.length > 0 ||
            status.deleted.length > 0) && (
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  color: 'var(--slate-text-muted, #9ba1aa)',
                  marginBottom: 4,
                }}
              >
                Changes
              </div>
              {[...status.modified, ...status.created, ...status.deleted].map((file) => (
                <div
                  key={file}
                  style={{
                    fontSize: 11,
                    color: 'var(--slate-text, #e4e7eb)',
                    padding: '2px 0',
                    paddingLeft: 8,
                  }}
                >
                  {file}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!hasChanges && (
        <div
          style={{
            fontSize: 11,
            color: 'var(--slate-text-muted, #9ba1aa)',
            fontStyle: 'italic',
          }}
        >
          No changes
        </div>
      )}
    </div>
  );
};

export default GitStatus;

