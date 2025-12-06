import React, { useState, useEffect } from 'react';
import { UploadDropzone } from '../../../design-system/components/UploadDropzone';
import { AssetTreeView } from './AssetTreeView';
import { AssetPreview } from './AssetPreview';
import { AssetDeconstructor, DeconstructedComponent } from './AssetDeconstructor';
import { AssetReconstructor } from './AssetReconstructor';
import { useUnityAssetParser } from './useUnityAssetParser';
import { ParsedUnityAsset } from './types';
import { Panel } from '../../../design-system/components/Panel';
import { lumenForgeColors } from '../../../design-system/tokens';
import { useAssets } from '../../../hooks/useAssets';
import { useProjectContext } from '../../context/ProjectContext';

interface UnityAssetManagerConnectedProps {
  mode?: 'upload' | 'preview' | 'deconstruct' | 'reconstruct';
}

export const UnityAssetManagerConnected: React.FC<UnityAssetManagerConnectedProps> = ({ mode = 'upload' }) => {
  const { projectId } = useProjectContext();
  const [currentMode, setCurrentMode] = useState(mode);
  const [localAssets, setLocalAssets] = useState<ParsedUnityAsset[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<ParsedUnityAsset | null>(null);
  const [deconstructedComponents, setDeconstructedComponents] = useState<DeconstructedComponent[]>([]);
  const { parseMultipleAssets, parsing } = useUnityAssetParser();
  const { assets: dbAssets, createAsset, loading: loadingAssets } = useAssets(projectId);

  useEffect(() => {
    const parsedAssets: ParsedUnityAsset[] = dbAssets.map((asset) => ({
      id: asset.id,
      name: asset.name,
      type: asset.type as any,
      path: asset.file_path || '',
      content: '',
      size: 0,
      metadata: asset.metadata as any,
      guid: asset.guid || undefined,
      fileID: asset.file_id !== null ? Number(asset.file_id) : undefined,
    }));
    setLocalAssets(parsedAssets);
  }, [dbAssets]);

  const handleFilesSelected = async (files: File[]) => {
    if (!projectId) {
      alert('Please select a project first');
      return;
    }

    const parsed = await parseMultipleAssets(files);

    for (const asset of parsed) {
      try {
        await createAsset({
          project_id: projectId,
          name: asset.name,
          type: asset.type,
          metadata: asset.metadata || {},
          file_path: asset.path,
          guid: asset.guid,
          file_id: asset.fileID ? BigInt(asset.fileID) : null,
        });
      } catch (error) {
        console.error(`Failed to save asset ${asset.name}:`, error);
      }
    }

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
    if (!projectId) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            padding: '2rem',
          }}
        >
          <p style={{ color: lumenForgeColors.text.secondary, textAlign: 'center' }}>
            No project selected. Create or select a project to manage Unity assets.
          </p>
        </div>
      );
    }

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
                Parsing and saving assets...
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
                Assets ({localAssets.length})
              </h3>
              {loadingAssets ? (
                <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>Loading assets...</p>
              ) : localAssets.length === 0 ? (
                <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
                  No assets in this project. Upload some to get started.
                </p>
              ) : (
                <AssetTreeView
                  assets={localAssets}
                  onAssetSelect={handleAssetSelect}
                  selectedAssetId={selectedAsset?.id}
                />
              )}
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
                Assets ({localAssets.length})
              </h3>
              {loadingAssets ? (
                <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>Loading assets...</p>
              ) : (
                <AssetTreeView
                  assets={localAssets}
                  onAssetSelect={handleAssetSelect}
                  selectedAssetId={selectedAsset?.id}
                />
              )}
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
                Assets ({localAssets.length})
              </h3>
              {loadingAssets ? (
                <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>Loading assets...</p>
              ) : (
                <AssetTreeView
                  assets={localAssets}
                  onAssetSelect={handleAssetSelect}
                  selectedAssetId={selectedAsset?.id}
                />
              )}
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
