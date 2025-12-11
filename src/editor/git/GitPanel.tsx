/**
 * Git Panel Component
 * 
 * Complete Git UI panel with status, commit, branch, history, and diff
 */

'use client';

import React, { useState } from 'react';
import { GitBranch, GitCommit, History, FileDiff, RefreshCw } from 'lucide-react';
import { GitProvider } from './GitProvider';
import { GitStatus } from './GitStatus';
import { CommitPanel } from './CommitPanel';
import { BranchSelector } from './BranchSelector';
import { GitHistory } from './GitHistory';
import { GitDiffViewer } from './GitDiffViewer';

export interface GitPanelProps {
  workingDir?: string;
}

type GitView = 'status' | 'commit' | 'history' | 'diff';

export const GitPanel: React.FC<GitPanelProps> = ({
  workingDir = process.cwd(),
}) => {
  const [view, setView] = useState<GitView>('status');

  return (
    <GitProvider workingDir={workingDir}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--slate-panel, #16181d)',
          borderLeft: '1px solid var(--slate-border, #26292f)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: '1px solid var(--slate-border, #26292f)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GitBranch size={16} style={{ color: 'var(--slate-text, #e4e7eb)' }} />
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'var(--slate-text, #e4e7eb)',
              }}
            >
              Git
            </span>
          </div>
          <BranchSelector />
        </div>

        {/* View Tabs */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--slate-border, #26292f)',
          }}
        >
          {[
            { id: 'status' as GitView, label: 'Status', icon: GitBranch },
            { id: 'commit' as GitView, label: 'Commit', icon: GitCommit },
            { id: 'history' as GitView, label: 'History', icon: History },
            { id: 'diff' as GitView, label: 'Diff', icon: FileDiff },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = view === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setView(tab.id)}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  background: isActive ? 'var(--slate-bg, #0f1115)' : 'transparent',
                  border: 'none',
                  borderBottom: isActive ? '2px solid var(--slate-accent, #3f8cff)' : '2px solid transparent',
                  color: isActive ? 'var(--slate-text, #e4e7eb)' : 'var(--slate-text-muted, #9ba1aa)',
                  cursor: 'pointer',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 16,
          }}
        >
          {view === 'status' && <GitStatus showFiles={true} />}
          {view === 'commit' && <CommitPanel />}
          {view === 'history' && <GitHistory />}
          {view === 'diff' && <GitDiffViewer />}
        </div>
      </div>
    </GitProvider>
  );
};

export default GitPanel;

