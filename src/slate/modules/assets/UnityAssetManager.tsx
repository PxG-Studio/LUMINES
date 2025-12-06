import React, { useState } from 'react';
import { UploadDropzone } from '../../../design-system/components/UploadDropzone';
import { AssetTreeView } from './AssetTreeView';
import { AssetPreview } from './AssetPreview';
import { AssetDeconstructor, DeconstructedComponent } from './AssetDeconstructor';
import { AssetReconstructor } from './AssetReconstructor';
import { useUnityAssetParser } from './useUnityAssetParser';
import { ParsedUnityAsset } from './types';
import { Panel } from '../../../design-system/components/Panel';
import { lumenForgeColors } from '../../../design-system/tokens';

interface UnityAssetManagerProps {
  mode?: 'upload' | 'preview' | 'deconstruct' | 'reconstruct';
}

export const UnityAssetManager: React.FC<UnityAssetManagerProps> = ({ mode = 'upload' }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [assets, setAssets] = useState<ParsedUnityAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<ParsedUnityAsset | null>(null);
  const [deconstructedComponents, setDeconstructedComponents] = useState<DeconstructedComponent[]>([]);
  const { parseMultipleAssets, parsing } = useUnityAssetParser();

  const handleFilesSelected = async (files: File[]) => {
    const parsed = await parseMultipleAssets(files);
    setAssets((prev) => [...prev, ...parsed]);
    if (parsed.length > 0) {
      setCurrentMode('preview');
    }
  };

  const handleAssetSelect = (asset: ParsedUnityAsset) => {
    setSelectedAsset(asset);
  };

  const handleDeconstructComplete = (components: DeconstructedComponent[]) => {
    setDeconstructedComponents(components);
  };

  const renderContent = () => {
    switch (currentMode) {
      case 'upload':
        return (
          <div style={{ padding: '2rem' }}>
            <UploadDropzone onFileSelect={handleFilesSelected} />
            {parsing && (
              <p
                style={{
                  textAlign: 'center',
                  color: lumenForgeColors.text.secondary,
                  marginTop: '1rem',
                }}
              >
                Parsing assets...
              </p>
            )}
          </div>
        );

      case 'preview':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              height: '100%',
              gap: '1rem',
              padding: '1rem',
            }}
          >
            <Panel variant="glass" padding="md" style={{ height: '100%', overflow: 'hidden' }}>
              <h3
                style={{
                  color: lumenForgeColors.text.primary,
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                Assets
              </h3>
              <AssetTreeView
                assets={assets}
                onAssetSelect={handleAssetSelect}
                selectedAssetId={selectedAsset?.id}
              />
            </Panel>
            <AssetPreview asset={selectedAsset} />
          </div>
        );

      case 'deconstruct':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              height: '100%',
              gap: '1rem',
              padding: '1rem',
            }}
          >
            <Panel variant="glass" padding="md" style={{ height: '100%', overflow: 'hidden' }}>
              <h3
                style={{
                  color: lumenForgeColors.text.primary,
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                Assets
              </h3>
              <AssetTreeView
                assets={assets}
                onAssetSelect={handleAssetSelect}
                selectedAssetId={selectedAsset?.id}
              />
            </Panel>
            <AssetDeconstructor asset={selectedAsset} onDeconstructComplete={handleDeconstructComplete} />
          </div>
        );

      case 'reconstruct':
        return (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              height: '100%',
              gap: '1rem',
              padding: '1rem',
            }}
          >
            <Panel variant="glass" padding="md" style={{ height: '100%', overflow: 'hidden' }}>
              <h3
                style={{
                  color: lumenForgeColors.text.primary,
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '1rem',
                }}
              >
                Assets
              </h3>
              <AssetTreeView
                assets={assets}
                onAssetSelect={handleAssetSelect}
                selectedAssetId={selectedAsset?.id}
              />
            </Panel>
            <AssetReconstructor
              asset={selectedAsset}
              components={deconstructedComponents}
            />
          </div>
        );
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          padding: '1rem',
          borderBottom: `1px solid ${lumenForgeColors.border.subtle}`,
          display: 'flex',
          gap: '0.5rem',
        }}
      >
        {(['upload', 'preview', 'deconstruct', 'reconstruct'] as const).map((m) => (
          <button
            key={m}
            onClick={() => setCurrentMode(m)}
            style={{
              padding: '0.5rem 1rem',
              background:
                currentMode === m
                  ? `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`
                  : lumenForgeColors.background.tertiary,
              color: lumenForgeColors.text.primary,
              border:
                currentMode === m
                  ? `1px solid ${lumenForgeColors.accent.primary}`
                  : `1px solid ${lumenForgeColors.border.subtle}`,
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'capitalize',
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>{renderContent()}</div>
    </div>
  );
};
