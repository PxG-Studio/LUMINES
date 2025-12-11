/**
 * Git Diff Viewer Component
 * 
 * Displays Git diff for files or entire repository
 */

'use client';

import React, { useState, useEffect } from 'react';
import { FileDiff, ChevronDown, ChevronRight } from 'lucide-react';
import { useGit } from './GitProvider';
import Editor from '@monaco-editor/react';

export interface GitDiffViewerProps {
  file?: string;
  commitHash?: string;
}

export const GitDiffViewer: React.FC<GitDiffViewerProps> = ({
  file,
  commitHash,
}) => {
  const { getDiff, status } = useGit();
  const [diff, setDiff] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadDiff = async () => {
      setIsLoading(true);
      try {
        const diffText = await getDiff(file);
        setDiff(diffText);
      } catch (error) {
        console.error('Failed to load diff:', error);
        setDiff('');
      } finally {
        setIsLoading(false);
      }
    };

    loadDiff();
  }, [getDiff, file, commitHash]);

  // Parse diff into file chunks
  const parseDiff = (diffText: string) => {
    const chunks: Array<{
      file: string;
      header: string;
      content: string;
    }> = [];

    const lines = diffText.split('\n');
    let currentFile = '';
    let currentHeader = '';
    let currentContent: string[] = [];

    for (const line of lines) {
      if (line.startsWith('diff --git')) {
        if (currentFile) {
          chunks.push({
            file: currentFile,
            header: currentHeader,
            content: currentContent.join('\n'),
          });
        }
        currentFile = line.split(' ')[3] || '';
        currentHeader = line;
        currentContent = [];
      } else if (line.startsWith('---') || line.startsWith('+++')) {
        currentHeader += '\n' + line;
      } else {
        currentContent.push(line);
      }
    }

    if (currentFile) {
      chunks.push({
        file: currentFile,
        header: currentHeader,
        content: currentContent.join('\n'),
      });
    }

    return chunks;
  };

  const diffChunks = parseDiff(diff);

  const toggleFile = (file: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(file)) {
        next.delete(file);
      } else {
        next.add(file);
      }
      return next;
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
        Loading diff...
      </div>
    );
  }

  if (!diff) {
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
        No changes to display
      </div>
    );
  }

  // If single file, show in editor
  if (file && diffChunks.length === 1) {
    return (
      <div style={{ height: '100%' }}>
        <Editor
          value={diff}
          language="diff"
          height="100%"
          theme="vs-dark"
          options={{
            readOnly: true,
            wordWrap: 'on',
            lineNumbers: 'on',
          }}
        />
      </div>
    );
  }

  // Multiple files, show collapsible list
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
        maxHeight: '100%',
        overflowY: 'auto',
      }}
    >
      {diffChunks.map((chunk) => {
        const isExpanded = expandedFiles.has(chunk.file);

        return (
          <div
            key={chunk.file}
            style={{
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            {/* File Header */}
            <button
              onClick={() => toggleFile(chunk.file)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                background: 'var(--slate-bg, #0f1115)',
                border: 'none',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {isExpanded ? (
                <ChevronDown size={14} style={{ color: 'var(--slate-text-muted, #9ba1aa)' }} />
              ) : (
                <ChevronRight size={14} style={{ color: 'var(--slate-text-muted, #9ba1aa)' }} />
              )}
              <FileDiff size={14} style={{ color: 'var(--slate-text-muted, #9ba1aa)' }} />
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: 'var(--slate-text, #e4e7eb)',
                }}
              >
                {chunk.file}
              </span>
            </button>

            {/* File Content */}
            {isExpanded && (
              <div style={{ borderTop: '1px solid var(--slate-border, #26292f)' }}>
                <Editor
                  value={chunk.header + '\n' + chunk.content}
                  language="diff"
                  height="300px"
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                  }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default GitDiffViewer;

