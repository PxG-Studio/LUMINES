/**
 * Git History Component
 * 
 * Displays commit history
 */

'use client';

import React, { useEffect, useState } from 'react';
import { GitCommit, Calendar, User } from 'lucide-react';
import { useGit, GitCommit as GitCommitType } from './GitProvider';

export interface GitHistoryProps {
  limit?: number;
  onCommitSelect?: (commit: GitCommitType) => void;
}

export const GitHistory: React.FC<GitHistoryProps> = ({
  limit = 50,
  onCommitSelect,
}) => {
  const { getCommits } = useGit();
  const [commits, setCommits] = useState<GitCommitType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCommits = async () => {
      setIsLoading(true);
      try {
        const commitList = await getCommits(limit);
        setCommits(commitList);
      } catch (error) {
        console.error('Failed to load commits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommits();
  }, [getCommits, limit]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
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
        Loading commit history...
      </div>
    );
  }

  if (commits.length === 0) {
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
        No commits found
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        padding: 16,
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
        maxHeight: 400,
        overflowY: 'auto',
      }}
    >
      {commits.map((commit) => (
        <div
          key={commit.hash}
          onClick={() => onCommitSelect?.(commit)}
          style={{
            padding: 12,
            background: 'var(--slate-bg, #0f1115)',
            border: '1px solid var(--slate-border, #26292f)',
            borderRadius: 4,
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
          }}
        >
          {/* Commit Hash */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 8,
            }}
          >
            <GitCommit size={14} style={{ color: 'var(--slate-text-muted, #9ba1aa)' }} />
            <code
              style={{
                fontSize: 11,
                color: 'var(--slate-accent, #3f8cff)',
                fontFamily: 'JetBrains Mono, Menlo, Monaco, "Courier New", monospace',
              }}
            >
              {commit.hash.substring(0, 7)}
            </code>
          </div>

          {/* Commit Message */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--slate-text, #e4e7eb)',
              marginBottom: 8,
            }}
          >
            {commit.message}
          </div>

          {/* Commit Metadata */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 11,
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <User size={12} />
              <span>{commit.author}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={12} />
              <span>{formatDate(commit.date)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GitHistory;

