/**
 * File Preview Component
 * 
 * Simple file content viewer
 */

import React from 'react';

export interface FilePreviewProps {
  content?: string;
  language?: string;
  fileName?: string;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
  content = '// File content will appear here\n\nfunction example() {\n  return true;\n}',
  language = 'javascript',
  fileName = 'file.json',
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: 'var(--slate-bg, #0f1115)',
        overflow: 'auto',
        padding: 16,
        fontFamily: 'var(--font-mono, monospace)',
      }}
    >
      <div
        style={{
          color: 'var(--slate-text-muted, #9ba1aa)',
          fontSize: 11,
          marginBottom: 12,
          borderBottom: '1px solid var(--slate-border, #26292f)',
          paddingBottom: 8,
        }}
      >
        {fileName} ({language})
      </div>
      <pre
        style={{
          margin: 0,
          color: 'var(--slate-text, #e4e7eb)',
          fontSize: 12,
          lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {content}
      </pre>
    </div>
  );
};

export default FilePreview;

