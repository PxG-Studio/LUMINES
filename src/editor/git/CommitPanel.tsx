/**
 * Commit Panel Component
 * 
 * UI for staging files and committing changes
 */

'use client';

import React, { useState } from 'react';
import { GitCommit, Plus, Minus, Check } from 'lucide-react';
import { useGit } from './GitProvider';

export interface CommitPanelProps {
  onCommit?: (message: string) => void;
}

export const CommitPanel: React.FC<CommitPanelProps> = ({
  onCommit,
}) => {
  const { status, add, commit, isLoading } = useGit();
  const [commitMessage, setCommitMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  if (!status) {
    return (
      <div
        style={{
          padding: 16,
          background: 'var(--slate-panel, #16181d)',
          border: '1px solid var(--slate-border, #26292f)',
          borderRadius: 8,
          color: 'var(--slate-text-muted, #9ba1aa)',
          fontSize: 12,
        }}
      >
        Not a Git repository
      </div>
    );
  }

  const allChangedFiles = [
    ...status.modified,
    ...status.created,
    ...status.deleted,
    ...status.not_added,
  ];

  const handleStageFile = async (file: string) => {
    try {
      await add([file]);
      setSelectedFiles((prev) => {
        const next = new Set(prev);
        next.add(file);
        return next;
      });
    } catch (error) {
      console.error('Failed to stage file:', error);
    }
  };

  const handleUnstageFile = async (file: string) => {
    try {
      // Note: simple-git doesn't have unstage, would need git.reset(['--', file])
      // For now, we'll just remove from selection
      setSelectedFiles((prev) => {
        const next = new Set(prev);
        next.delete(file);
        return next;
      });
    } catch (error) {
      console.error('Failed to unstage file:', error);
    }
  };

  const handleStageAll = async () => {
    try {
      await add(allChangedFiles);
      setSelectedFiles(new Set(allChangedFiles));
    } catch (error) {
      console.error('Failed to stage all files:', error);
    }
  };

  const handleCommit = async () => {
    if (!commitMessage.trim()) return;

    try {
      await commit(commitMessage);
      setCommitMessage('');
      setSelectedFiles(new Set());
      onCommit?.(commitMessage);
    } catch (error) {
      console.error('Failed to commit:', error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        padding: 16,
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <GitCommit size={16} style={{ color: 'var(--slate-text, #e4e7eb)' }} />
        <span
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--slate-text, #e4e7eb)',
          }}
        >
          Commit Changes
        </span>
      </div>

      {/* Staged Files */}
      {status.staged.length > 0 && (
        <div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: '#10b981',
              marginBottom: 8,
            }}
          >
            Staged ({status.staged.length})
          </div>
          <div
            style={{
              maxHeight: 200,
              overflowY: 'auto',
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              padding: 8,
            }}
          >
            {status.staged.map((file) => (
              <div
                key={file}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  fontSize: 11,
                  color: 'var(--slate-text, #e4e7eb)',
                }}
              >
                <span>{file}</span>
                <button
                  onClick={() => handleUnstageFile(file)}
                  style={{
                    padding: '2px 6px',
                    background: 'transparent',
                    border: '1px solid var(--slate-border, #26292f)',
                    borderRadius: 4,
                    color: 'var(--slate-text-muted, #9ba1aa)',
                    cursor: 'pointer',
                    fontSize: 10,
                  }}
                >
                  <Minus size={10} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unstaged Files */}
      {allChangedFiles.length > 0 && (
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--slate-text-muted, #9ba1aa)',
              }}
            >
              Changes ({allChangedFiles.length})
            </div>
            <button
              onClick={handleStageAll}
              style={{
                padding: '4px 8px',
                background: 'var(--slate-accent, #3f8cff)',
                border: 'none',
                borderRadius: 4,
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Plus size={12} />
              Stage All
            </button>
          </div>
          <div
            style={{
              maxHeight: 200,
              overflowY: 'auto',
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              padding: 8,
            }}
          >
            {allChangedFiles.map((file) => {
              const isStaged = status.staged.includes(file);
              return (
                <div
                  key={file}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '4px 8px',
                    fontSize: 11,
                    color: 'var(--slate-text, #e4e7eb)',
                    background: isStaged
                      ? 'rgba(16, 185, 129, 0.1)'
                      : 'transparent',
                  }}
                >
                  <span>{file}</span>
                  {!isStaged && (
                    <button
                      onClick={() => handleStageFile(file)}
                      style={{
                        padding: '2px 6px',
                        background: 'transparent',
                        border: '1px solid var(--slate-border, #26292f)',
                        borderRadius: 4,
                        color: 'var(--slate-text-muted, #9ba1aa)',
                        cursor: 'pointer',
                        fontSize: 10,
                      }}
                    >
                      <Plus size={10} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Commit Message */}
      <div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: 'var(--slate-text, #e4e7eb)',
            marginBottom: 8,
          }}
        >
          Commit Message
        </div>
        <textarea
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Enter commit message..."
          style={{
            width: '100%',
            minHeight: 80,
            padding: 8,
            background: 'var(--slate-bg, #0f1115)',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            color: 'var(--slate-text, #e4e7eb)',
            fontSize: 12,
            fontFamily: 'inherit',
            resize: 'vertical',
            outline: 'none',
          }}
        />
      </div>

      {/* Commit Button */}
      <button
        onClick={handleCommit}
        disabled={!commitMessage.trim() || status.staged.length === 0 || isLoading}
        style={{
          padding: '8px 16px',
          background:
            !commitMessage.trim() || status.staged.length === 0 || isLoading
              ? 'var(--slate-border, #26292f)'
              : 'var(--slate-accent, #3f8cff)',
          border: 'none',
          borderRadius: 4,
          color: '#FFFFFF',
          cursor:
            !commitMessage.trim() || status.staged.length === 0 || isLoading
              ? 'not-allowed'
              : 'pointer',
          fontSize: 12,
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
        }}
      >
        <Check size={14} />
        Commit {status.staged.length > 0 && `(${status.staged.length} file${status.staged.length > 1 ? 's' : ''})`}
      </button>
    </div>
  );
};

export default CommitPanel;

