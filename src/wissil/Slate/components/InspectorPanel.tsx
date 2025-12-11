import React from 'react';
import { File, Folder, Calendar, Hash, Code, Image, FileText, Package } from 'lucide-react';
import { lumenForgeColors, transitions } from '../../../design-system/tokens';
import { Panel } from '../../../design-system/components/Panel';

export interface InspectorPanelProps {
  selectedItem?: {
    name: string;
    path: string;
    type: 'file' | 'folder';
    fileType?: string;
    size?: number;
    created?: Date;
    modified?: Date;
    metadata?: Record<string, any>;
  };
}

const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) return 'Unknown';
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const formatDate = (date?: Date): string => {
  if (!date) return 'Unknown';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getFileIcon = (type?: string, itemType?: 'file' | 'folder') => {
  if (itemType === 'folder') return <Folder size={16} />;
  
  if (!type) return <File size={16} />;
  
  const lowerType = type.toLowerCase();
  if (lowerType.includes('image') || ['png', 'jpg', 'jpeg', 'gif', 'svg'].includes(lowerType)) {
    return <Image size={16} />;
  }
  if (['cs', 'js', 'ts', 'tsx', 'jsx', 'py', 'cpp', 'c', 'h'].includes(lowerType)) {
    return <Code size={16} />;
  }
  if (['json', 'xml', 'yaml', 'yml', 'md', 'txt'].includes(lowerType)) {
    return <FileText size={16} />;
  }
  if (['prefab', 'mat', 'asset', 'unity'].includes(lowerType)) {
    return <Package size={16} />;
  }
  return <File size={16} />;
};

const PropertyRow: React.FC<{ label: string; value: React.ReactNode; icon?: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div
    style={{
      marginBottom: '0.75rem',
      paddingBottom: '0.75rem',
      borderBottom: `1px solid ${lumenForgeColors.border.subtle}`,
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.25rem',
      }}
    >
      {icon && (
        <div style={{ color: lumenForgeColors.text.tertiary }}>
          {icon}
        </div>
      )}
      <label
        style={{
          color: lumenForgeColors.text.tertiary,
          fontSize: '0.625rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}
      >
        {label}
      </label>
    </div>
    <div
      style={{
        color: lumenForgeColors.text.primary,
        fontSize: '0.875rem',
        paddingLeft: icon ? '1.5rem' : '0',
        wordBreak: 'break-word',
      }}
    >
      {value}
    </div>
  </div>
);

export const InspectorPanel: React.FC<InspectorPanelProps> = ({ selectedItem }) => {
  if (!selectedItem) {
    return (
      <div
        data-testid="inspector-panel"
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: lumenForgeColors.background.primary,
          padding: '1rem',
        }}
      >
        <h3
          style={{
            color: lumenForgeColors.text.primary,
            fontSize: '0.875rem',
            fontWeight: 600,
            marginBottom: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Inspector
        </h3>
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: lumenForgeColors.text.tertiary,
            fontSize: '0.875rem',
            textAlign: 'center',
            padding: '2rem',
          }}
        >
          <div>
            <File size={48} style={{ opacity: 0.3, marginBottom: '1rem', margin: '0 auto 1rem' }} />
            <p style={{ margin: 0 }}>Select a file or folder to view properties</p>
          </div>
        </div>
      </div>
    );
  }

  const fileExtension = selectedItem.type === 'file' 
    ? selectedItem.path.split('.').pop()?.toLowerCase() || ''
    : '';

  return (
    <div
      data-testid="inspector-panel"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: lumenForgeColors.background.primary,
        padding: '1rem',
        overflowY: 'auto',
      }}
    >
      <h3
        style={{
          color: lumenForgeColors.text.primary,
          fontSize: '0.875rem',
          fontWeight: 600,
          marginBottom: '1rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
        }}
      >
        Inspector
      </h3>

      <Panel variant="glass" padding="md" style={{ marginBottom: '1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1rem',
          }}
        >
          <div
            style={{
              padding: '0.5rem',
              background: lumenForgeColors.background.secondary,
              borderRadius: '0.375rem',
              color: lumenForgeColors.accent.primary,
            }}
          >
            {getFileIcon(selectedItem.fileType || fileExtension, selectedItem.type)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: lumenForgeColors.text.primary,
                fontSize: '0.875rem',
                fontWeight: 600,
                marginBottom: '0.25rem',
                wordBreak: 'break-word',
              }}
            >
              {selectedItem.name}
            </div>
            <div
              style={{
                color: lumenForgeColors.text.tertiary,
                fontSize: '0.75rem',
                wordBreak: 'break-word',
              }}
            >
              {selectedItem.path}
            </div>
          </div>
        </div>
      </Panel>

      <Panel variant="secondary" padding="md">
        <PropertyRow
          label="Type"
          value={
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.25rem 0.5rem',
                background: lumenForgeColors.background.tertiary,
                borderRadius: '0.25rem',
                fontSize: '0.75rem',
              }}
            >
              {selectedItem.type === 'folder' ? 'Folder' : selectedItem.fileType || fileExtension || 'File'}
            </div>
          }
          icon={<File size={14} />}
        />

        {selectedItem.size !== undefined && (
          <PropertyRow
            label="Size"
            value={formatFileSize(selectedItem.size)}
            icon={<Hash size={14} />}
          />
        )}

        {selectedItem.created && (
          <PropertyRow
            label="Created"
            value={formatDate(selectedItem.created)}
            icon={<Calendar size={14} />}
          />
        )}

        {selectedItem.modified && (
          <PropertyRow
            label="Modified"
            value={formatDate(selectedItem.modified)}
            icon={<Calendar size={14} />}
          />
        )}

        {selectedItem.metadata && Object.keys(selectedItem.metadata).length > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <label
              style={{
                display: 'block',
                color: lumenForgeColors.text.tertiary,
                fontSize: '0.625rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                fontWeight: 600,
                marginBottom: '0.75rem',
              }}
            >
              Metadata
            </label>
            {Object.entries(selectedItem.metadata).map(([key, value]) => (
              <PropertyRow
                key={key}
                label={key}
                value={
                  typeof value === 'object' ? (
                    <pre
                      style={{
                        margin: 0,
                        padding: '0.5rem',
                        background: lumenForgeColors.background.tertiary,
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        overflow: 'auto',
                        maxHeight: '200px',
                      }}
                    >
                      {JSON.stringify(value, null, 2)}
                    </pre>
                  ) : (
                    String(value)
                  )
                }
              />
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
};

export default InspectorPanel;
