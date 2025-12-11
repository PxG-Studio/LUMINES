/**
 * Split Editor Component
 * 
 * Side-by-side editor view for comparing or editing multiple files
 */

'use client';

import React, { useState } from 'react';
import { MonacoEditor } from '../monaco/MonacoEditor';
import { SplitPane } from '../shell/SplitPane';
import { useWissilFS } from '@/wis2l/runtime/fs/wissilFs';

export interface SplitEditorProps {
  primaryFilePath?: string;
  secondaryFilePath?: string;
  direction?: 'horizontal' | 'vertical';
  defaultSize?: number;
  onPrimaryFileChange?: (path: string) => void;
  onSecondaryFileChange?: (path: string) => void;
}

export const SplitEditor: React.FC<SplitEditorProps> = ({
  primaryFilePath,
  secondaryFilePath,
  direction = 'horizontal',
  defaultSize = 50,
  onPrimaryFileChange,
  onSecondaryFileChange,
}) => {
  const fs = useWissilFS();
  const [primaryFile, setPrimaryFile] = useState<string | undefined>(primaryFilePath);
  const [secondaryFile, setSecondaryFile] = useState<string | undefined>(secondaryFilePath);

  const handlePrimaryFileChange = (path: string) => {
    setPrimaryFile(path);
    onPrimaryFileChange?.(path);
  };

  const handleSecondaryFileChange = (path: string) => {
    setSecondaryFile(path);
    onSecondaryFileChange?.(path);
  };

  return (
    <SplitPane
      direction={direction}
      defaultSize={defaultSize}
      minSize={20}
      maxSize={80}
    >
      {/* Primary Editor */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {primaryFile ? (
          <MonacoEditor
            filePath={primaryFile}
            height="100%"
            onSave={(content) => {
              fs.writeFile(primaryFile, content);
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'var(--slate-bg, #0f1115)',
              color: 'var(--slate-text-muted, #9ba1aa)',
              fontSize: 14,
            }}
          >
            No file open
          </div>
        )}
      </div>

      {/* Secondary Editor */}
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {secondaryFile ? (
          <MonacoEditor
            filePath={secondaryFile}
            height="100%"
            onSave={(content) => {
              fs.writeFile(secondaryFile, content);
            }}
          />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              background: 'var(--slate-bg, #0f1115)',
              color: 'var(--slate-text-muted, #9ba1aa)',
              fontSize: 14,
            }}
          >
            No file open
          </div>
        )}
      </div>
    </SplitPane>
  );
};

export default SplitEditor;

