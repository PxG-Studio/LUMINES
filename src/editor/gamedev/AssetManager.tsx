/**
 * Asset Manager Component
 * 
 * Manages game assets (textures, models, audio, scripts)
 * For Unity and general game development
 */

'use client';

import React, { useState, useCallback } from 'react';
import { Folder, File, Image, Music, FileCode, Package, Search, Upload, Download } from 'lucide-react';

export interface GameAsset {
  id: string;
  name: string;
  type: 'texture' | 'model' | 'audio' | 'script' | 'prefab' | 'scene' | 'other';
  path: string;
  size: number;
  lastModified: Date;
  thumbnail?: string;
}

export interface AssetManagerProps {
  assets?: GameAsset[];
  onAssetSelect?: (asset: GameAsset) => void;
  onAssetUpload?: (files: File[]) => void;
  onAssetDelete?: (asset: GameAsset) => void;
}

export const AssetManager: React.FC<AssetManagerProps> = ({
  assets = [],
  onAssetSelect,
  onAssetUpload,
  onAssetDelete,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const getAssetIcon = (type: GameAsset['type']) => {
    switch (type) {
      case 'texture':
        return <Image size={20} />;
      case 'audio':
        return <Music size={20} />;
      case 'script':
        return <FileCode size={20} />;
      case 'prefab':
      case 'scene':
        return <Package size={20} />;
      default:
        return <File size={20} />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || asset.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onAssetUpload?.(files);
  }, [onAssetUpload]);

  const assetTypes = ['all', 'texture', 'model', 'audio', 'script', 'prefab', 'scene'] as const;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: 'var(--slate-panel, #16181d)',
        border: '1px solid var(--slate-border, #26292f)',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--slate-border, #26292f)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <h3
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--slate-text, #e4e7eb)',
            }}
          >
            Assets
          </h3>
          <div style={{ display: 'flex', gap: 4 }}>
            <label
              style={{
                padding: '4px 8px',
                background: 'var(--slate-accent, #3f8cff)',
                border: 'none',
                borderRadius: 4,
                color: '#FFFFFF',
                cursor: 'pointer',
                fontSize: 11,
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Upload size={12} />
              Upload
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--slate-text-muted, #9ba1aa)',
            }}
          />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 8px 6px 32px',
              background: 'var(--slate-bg, #0f1115)',
              border: '1px solid var(--slate-border, #26292f)',
              borderRadius: 4,
              color: 'var(--slate-text, #e4e7eb)',
              fontSize: 12,
              outline: 'none',
            }}
          />
        </div>

        {/* Type Filter */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {assetTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                padding: '4px 8px',
                background: selectedType === type ? 'var(--slate-accent, #3f8cff)' : 'transparent',
                border: '1px solid var(--slate-border, #26292f)',
                borderRadius: 4,
                color: selectedType === type ? '#FFFFFF' : 'var(--slate-text, #e4e7eb)',
                cursor: 'pointer',
                fontSize: 11,
                textTransform: 'capitalize',
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Asset List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 12,
        }}
      >
        {filteredAssets.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 40,
              color: 'var(--slate-text-muted, #9ba1aa)',
              fontSize: 12,
            }}
          >
            No assets found
          </div>
        ) : viewMode === 'grid' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
              gap: 12,
            }}
          >
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onAssetSelect?.(asset)}
                style={{
                  padding: 12,
                  background: 'var(--slate-bg, #0f1115)',
                  border: '1px solid var(--slate-border, #26292f)',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
                  e.currentTarget.style.borderColor = 'var(--slate-accent, #3f8cff)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
                  e.currentTarget.style.borderColor = 'var(--slate-border, #26292f)';
                }}
              >
                {asset.thumbnail ? (
                  <img
                    src={asset.thumbnail}
                    alt={asset.name}
                    style={{
                      width: '100%',
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 4,
                      marginBottom: 8,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: 80,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'var(--slate-panel, #16181d)',
                      borderRadius: 4,
                      marginBottom: 8,
                      color: 'var(--slate-text-muted, #9ba1aa)',
                    }}
                  >
                    {getAssetIcon(asset.type)}
                  </div>
                )}
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--slate-text, #e4e7eb)',
                    marginBottom: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {asset.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: 'var(--slate-text-muted, #9ba1aa)',
                  }}
                >
                  {formatSize(asset.size)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                onClick={() => onAssetSelect?.(asset)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: 8,
                  background: 'var(--slate-bg, #0f1115)',
                  border: '1px solid var(--slate-border, #26292f)',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--slate-panel-hover, #1e2127)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'var(--slate-bg, #0f1115)';
                }}
              >
                <div style={{ color: 'var(--slate-text-muted, #9ba1aa)' }}>
                  {getAssetIcon(asset.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: 'var(--slate-text, #e4e7eb)',
                    }}
                  >
                    {asset.name}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--slate-text-muted, #9ba1aa)',
                    }}
                  >
                    {asset.path} • {formatSize(asset.size)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetManager;

