import React, { useState } from 'react';
import { Download, Package, FileJson } from 'lucide-react';
import { ParsedUnityAsset, ReconstructedAsset } from './types';
import { DeconstructedComponent } from './AssetDeconstructor';
import { Panel } from '../../../design-system/components/Panel';
import { lumenForgeColors, transitions } from '../../../design-system/tokens';

interface AssetReconstructorProps {
  asset: ParsedUnityAsset | null;
  components: DeconstructedComponent[];
  onReconstruct?: (reconstructed: ReconstructedAsset) => void;
}

export const AssetReconstructor: React.FC<AssetReconstructorProps> = ({
  asset,
  components,
  onReconstruct,
}) => {
  const [exportFormat, setExportFormat] = useState<'json' | 'unitypackage'>('json');
  const [reconstructing, setReconstructing] = useState(false);
  const [modifiedProperties] = useState<Record<string, unknown>>({});

  const handleReconstruct = async () => {
    if (!asset) return;

    setReconstructing(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const reconstructedData = {
      asset: {
        name: asset.name,
        type: asset.type,
        guid: asset.metadata?.guid,
      },
      components: components.map((comp) => ({
        name: comp.name,
        type: comp.type,
        properties: comp.properties,
      })),
      modifications: modifiedProperties,
      reconstructedAt: new Date().toISOString(),
    };

    const jsonString = JSON.stringify(reconstructedData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const reconstructed: ReconstructedAsset = {
      originalId: asset.id,
      name: `${asset.name.split('.')[0]}_reconstructed`,
      type: asset.type,
      modifiedProperties,
      exportFormat,
      data: blob,
    };

    setReconstructing(false);
    onReconstruct?.(reconstructed);

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reconstructed.name}.${exportFormat === 'json' ? 'json' : 'unitypackage'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!asset || components.length === 0) {
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
        <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p>Deconstruct an asset first to reconstruct it</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '1rem' }}>
      <Panel variant="glass" padding="lg">
        <div style={{ marginBottom: '1.5rem' }}>
          <h3
            style={{
              color: lumenForgeColors.text.primary,
              fontSize: '1.25rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            Reconstruct Asset
          </h3>
          <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
            Rebuild <strong>{asset.name}</strong> with modifications
          </p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label
            style={{
              display: 'block',
              color: lumenForgeColors.text.primary,
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            Export Format
          </label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <FormatButton
              active={exportFormat === 'json'}
              onClick={() => setExportFormat('json')}
              icon={<FileJson size={20} />}
              label="JSON"
            />
            <FormatButton
              active={exportFormat === 'unitypackage'}
              onClick={() => setExportFormat('unitypackage')}
              icon={<Package size={20} />}
              label="Unity Package"
            />
          </div>
        </div>

        <div
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: lumenForgeColors.background.tertiary,
            borderRadius: '0.5rem',
          }}
        >
          <h4
            style={{
              color: lumenForgeColors.text.primary,
              fontSize: '0.875rem',
              fontWeight: 600,
              marginBottom: '0.5rem',
            }}
          >
            Reconstruction Summary
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            <li style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
              {components.length} components will be included
            </li>
            <li style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
              {Object.keys(modifiedProperties).length} properties modified
            </li>
            <li style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
              Export as: <strong>{exportFormat === 'json' ? 'JSON' : 'Unity Package'}</strong>
            </li>
          </ul>
        </div>

        <button
          onClick={handleReconstruct}
          disabled={reconstructing}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`,
            color: lumenForgeColors.text.primary,
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: reconstructing ? 'not-allowed' : 'pointer',
            transition: transitions.normal,
            opacity: reconstructing ? 0.6 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <Download size={20} />
          {reconstructing ? 'Reconstructing...' : 'Reconstruct & Download'}
        </button>

        <p
          style={{
            marginTop: '1rem',
            color: lumenForgeColors.text.tertiary,
            fontSize: '0.75rem',
            textAlign: 'center',
          }}
        >
          This will generate a {exportFormat === 'json' ? 'JSON file' : 'mock Unity package'} with all
          component data
        </p>
      </Panel>
    </div>
  );
};

const FormatButton: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: '0.75rem',
      background: active
        ? `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`
        : lumenForgeColors.background.tertiary,
      color: lumenForgeColors.text.primary,
      border: active ? `1px solid ${lumenForgeColors.accent.primary}` : `1px solid ${lumenForgeColors.border.subtle}`,
      borderRadius: '0.5rem',
      cursor: 'pointer',
      transition: transitions.normal,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      fontSize: '0.875rem',
      fontWeight: 600,
    }}
  >
    {icon}
    {label}
  </button>
);
