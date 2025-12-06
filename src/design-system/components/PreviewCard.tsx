import React from 'react';
import { FileText, Image, Box, Code, File } from 'lucide-react';
import { Panel } from './Panel';
import { lumenForgeColors } from '../tokens';

interface PreviewCardProps {
  type: 'Prefab' | 'Material' | 'Script' | 'Texture' | 'Mesh' | 'Unknown';
  name: string;
  size: number;
  previewUrl?: string;
  onClick?: () => void;
}

export const PreviewCard: React.FC<PreviewCardProps> = ({
  type,
  name,
  size,
  previewUrl,
  onClick,
}) => {
  const getIcon = () => {
    const iconStyle = { color: lumenForgeColors.accent.primary };
    switch (type) {
      case 'Script':
        return <Code size={32} style={iconStyle} />;
      case 'Texture':
        return <Image size={32} style={iconStyle} />;
      case 'Mesh':
      case 'Prefab':
        return <Box size={32} style={iconStyle} />;
      case 'Material':
        return <FileText size={32} style={iconStyle} />;
      default:
        return <File size={32} style={iconStyle} />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Panel variant="glass" padding="md" glowOnHover={!!onClick}>
      <div
        onClick={onClick}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          cursor: onClick ? 'pointer' : 'default',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '120px',
            background: previewUrl
              ? `url(${previewUrl}) center/cover`
              : lumenForgeColors.background.tertiary,
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {!previewUrl && getIcon()}
        </div>

        <div>
          <p
            style={{
              color: lumenForgeColors.text.primary,
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.25rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                color: lumenForgeColors.text.tertiary,
                fontSize: '0.75rem',
              }}
            >
              {type}
            </span>
            <span
              style={{
                color: lumenForgeColors.text.tertiary,
                fontSize: '0.75rem',
              }}
            >
              {formatSize(size)}
            </span>
          </div>
        </div>
      </div>
    </Panel>
  );
};
