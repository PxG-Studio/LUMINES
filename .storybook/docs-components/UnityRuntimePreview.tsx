/**
 * Unity WebGL Runtime Preview Component
 * 
 * Embeds Unity WebGL builds in Storybook documentation
 */

import React from 'react';

interface UnityRuntimePreviewProps {
  buildUrl: string;
  width?: string;
  height?: string;
  title?: string;
}

export const UnityRuntimePreview: React.FC<UnityRuntimePreviewProps> = ({ 
  buildUrl, 
  width = "100%", 
  height = "600px",
  title = "Unity WebGL Runtime Preview"
}) => {
  return (
    <div style={{ 
      border: "1px solid var(--slate-border)", 
      borderRadius: 8,
      overflow: "hidden",
      margin: "16px 0",
      background: "var(--slate-bg)"
    }}>
      <iframe
        src={buildUrl}
        width={width}
        height={height}
        style={{ 
          border: 0, 
          display: "block"
        }}
        title={title}
        allow="autoplay; fullscreen; microphone; camera"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  );
};

