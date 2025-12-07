import React from 'react';
import { Code, Box, FileText, Image as ImageIcon, File } from 'lucide-react';
import { ParsedUnityAsset } from './types';
import { Panel } from '../../../design-system/components/Panel';
import { lumenForgeColors } from '../../../design-system/tokens';

interface AssetPreviewProps {
  asset: ParsedUnityAsset | null;
}

export const AssetPreview: React.FC<AssetPreviewProps> = ({ asset }) => {
  if (!asset) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: lumenForgeColors.text.tertiary,
        }}
      >
        <File size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p>Select an asset to preview</p>
      </div>
    );
  }

  const getTypeIcon = () => {
    const iconStyle = { color: lumenForgeColors.accent.primary, marginBottom: '1rem' };
    switch (asset.type) {
      case 'Script':
        return <Code size={48} style={iconStyle} />;
      case 'Texture':
        return <ImageIcon size={48} style={iconStyle} />;
      case 'Mesh':
      case 'Prefab':
        return <Box size={48} style={iconStyle} />;
      case 'Material':
        return <FileText size={48} style={iconStyle} />;
      default:
        return <File size={48} style={iconStyle} />;
    }
  };

  const renderPreviewContent = () => {
    if (asset.type === 'Texture' && asset.previewUrl) {
      return (
        <img
          src={asset.previewUrl}
          alt={asset.name}
          style={{
            maxWidth: '100%',
            maxHeight: '400px',
            borderRadius: '0.5rem',
            objectFit: 'contain',
          }}
        />
      );
    }

    if (asset.type === 'Script' && asset.contents) {
      return (
        <pre
          style={{
            background: lumenForgeColors.background.primary,
            color: lumenForgeColors.text.primary,
            padding: '1rem',
            borderRadius: '0.5rem',
            overflow: 'auto',
            maxHeight: '400px',
            fontSize: '0.875rem',
            fontFamily: 'monospace',
          }}
        >
          {asset.contents}
        </pre>
      );
    }

    if (asset.type === 'Mesh' || asset.type === 'Prefab') {
      return (
        <div
          style={{
            width: '100%',
            height: '300px',
            background: lumenForgeColors.background.primary,
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {getTypeIcon()}
          <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
            3D Preview (Mock)
          </p>
          <div
            style={{
              width: '200px',
              height: '200px',
              background: `linear-gradient(135deg, ${lumenForgeColors.accent.primary}20, ${lumenForgeColors.accent.secondary}20)`,
              borderRadius: '0.5rem',
              border: `1px solid ${lumenForgeColors.border.subtle}`,
            }}
          />
        </div>
      );
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        {getTypeIcon()}
        <p style={{ color: lumenForgeColors.text.secondary }}>No preview available</p>
      </div>
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '1rem' }}>
      <Panel variant="glass" padding="lg">
        <h3
          style={{
            color: lumenForgeColors.text.primary,
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          {asset.name}
        </h3>

        <div style={{ marginBottom: '1.5rem' }}>
          <InfoRow label="Type" value={asset.type} />
          <InfoRow label="Size" value={formatSize(asset.size)} />
          {asset.metadata?.guid && typeof asset.metadata.guid === 'string' ? (
            <InfoRow label="GUID" value={asset.metadata.guid} />
          ) : null}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>{renderPreviewContent()}</div>

        {asset.dependencies.length > 0 && (
          <div>
            <h4
              style={{
                color: lumenForgeColors.text.primary,
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              Dependencies
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {asset.dependencies.map((dep, idx) => (
                <li
                  key={idx}
                  style={{
                    color: lumenForgeColors.text.secondary,
                    fontSize: '0.875rem',
                    padding: '0.25rem 0',
                  }}
                >
                  • {dep}
                </li>
              ))}
            </ul>
          </div>
        )}

        {asset.metadata && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4
              style={{
                color: lumenForgeColors.text.primary,
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '0.5rem',
              }}
            >
              Metadata
            </h4>
            <pre
              style={{
                background: lumenForgeColors.background.primary,
                color: lumenForgeColors.text.secondary,
                padding: '1rem',
                borderRadius: '0.5rem',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '200px',
              }}
            >
              {JSON.stringify(asset.metadata, null, 2)}
            </pre>
          </div>
        )}
      </Panel>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '0.5rem 0',
      borderBottom: `1px solid ${lumenForgeColors.border.subtle}`,
    }}
  >
    <span style={{ color: lumenForgeColors.text.tertiary, fontSize: '0.875rem' }}>{label}</span>
    <span
      style={{
        color: lumenForgeColors.text.primary,
        fontSize: '0.875rem',
        fontFamily: label === 'GUID' ? 'monospace' : 'inherit',
      }}
    >
      {value}
    </span>
  </div>
);
