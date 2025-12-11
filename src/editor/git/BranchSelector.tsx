/**
 * Branch Selector Component
 * 
 * UI for selecting and creating Git branches
 */

'use client';

import React, { useState, useEffect } from 'react';
import { GitBranch, Plus, Check } from 'lucide-react';
import { useGit } from './GitProvider';

export interface BranchSelectorProps {
  onBranchChange?: (branch: string) => void;
}

export const BranchSelector: React.FC<BranchSelectorProps> = ({
  onBranchChange,
}) => {
  const { status, getBranches, checkout, createBranch, isLoading } = useGit();
  const [branches, setBranches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState('');
  const [showCreateInput, setShowCreateInput] = useState(false);

  useEffect(() => {
    const loadBranches = async () => {
      const branchList = await getBranches();
      setBranches(branchList);
    };
    loadBranches();
  }, [getBranches, status?.current]);

  const handleBranchSelect = async (branch: string) => {
    try {
      await checkout(branch);
      setIsOpen(false);
      onBranchChange?.(branch);
    } catch (error) {
      console.error('Failed to checkout branch:', error);
    }
  };

  const handleCreateBranch = async () => {
    if (!newBranchName.trim()) return;

    try {
      await createBranch(newBranchName.trim());
      setNewBranchName('');
      setShowCreateInput(false);
      const branchList = await getBranches();
      setBranches(branchList);
      await checkout(newBranchName.trim());
      onBranchChange?.(newBranchName.trim());
    } catch (error) {
      console.error('Failed to create branch:', error);
    }
  };

  const currentBranch = status?.current || 'main';

  return (
    <div style={{ position: 'relative' }}>
      {/* Branch Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '6px 12px',
          background: 'var(--slate-panel, #16181d)',
          border: '1px solid var(--slate-border, #26292f)',
          borderRadius: 4,
          color: 'var(--slate-text, #e4e7eb)',
          cursor: 'pointer',
          fontSize: 12,
        }}
      >
        <GitBranch size={14} />
        <span>{currentBranch}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1000,
            }}
            onClick={() => setIsOpen(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              marginTop: 4,
              background: 'var(--slate-panel, #16181d)',
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              zIndex: 1001,
              minWidth: 200,
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            {/* Branch List */}
            {branches.map((branch) => (
              <button
                key={branch}
                onClick={() => handleBranchSelect(branch)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: branch === currentBranch ? 'rgba(63, 140, 255, 0.1)' : 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  color: 'var(--slate-text, #e4e7eb)',
                  cursor: 'pointer',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  if (branch !== currentBranch) {
                    e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (branch !== currentBranch) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{branch}</span>
                {branch === currentBranch && (
                  <Check size={14} style={{ color: 'var(--slate-accent, #3f8cff)' }} />
                )}
              </button>
            ))}

            {/* Divider */}
            <div
              style={{
                height: 1,
                background: 'var(--slate-border, #26292f)',
                margin: '4px 0',
              }}
            />

            {/* Create Branch */}
            {showCreateInput ? (
              <div style={{ padding: 8 }}>
                <input
                  type="text"
                  value={newBranchName}
                  onChange={(e) => setNewBranchName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateBranch();
                    } else if (e.key === 'Escape') {
                      setShowCreateInput(false);
                      setNewBranchName('');
                    }
                  }}
                  placeholder="Branch name..."
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '6px 8px',
                    background: 'var(--slate-bg, #0f1115)',
                    border: '1px solid var(--slate-border, #26292f)',
                    borderRadius: 4,
                    color: 'var(--slate-text, #e4e7eb)',
                    fontSize: 12,
                    outline: 'none',
                    marginBottom: 4,
                  }}
                />
                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={handleCreateBranch}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      background: 'var(--slate-accent, #3f8cff)',
                      border: 'none',
                      borderRadius: 4,
                      color: '#FFFFFF',
                      cursor: 'pointer',
                      fontSize: 11,
                    }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateInput(false);
                      setNewBranchName('');
                    }}
                    style={{
                      flex: 1,
                      padding: '4px 8px',
                      background: 'transparent',
                      border: '1px solid var(--slate-border, #26292f)',
                      borderRadius: 4,
                      color: 'var(--slate-text, #e4e7eb)',
                      cursor: 'pointer',
                      fontSize: 11,
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowCreateInput(true)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  color: 'var(--slate-text, #e4e7eb)',
                  cursor: 'pointer',
                  fontSize: 12,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <Plus size={14} />
                Create new branch
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BranchSelector;

