import React, { useState } from 'react';
import { Package, Box, FileText, Layers } from 'lucide-react';
import { ParsedUnityAsset } from './types';
import { Panel } from '../../../design-system/components/Panel';
import { lumenForgeColors, transitions } from '../../../design-system/tokens';

interface AssetDeconstructorProps {
  asset: ParsedUnityAsset | null;
  onDeconstructComplete?: (components: DeconstructedComponent[]) => void;
}

export interface DeconstructedComponent {
  id: string;
  name: string;
  type: string;
  properties: Record<string, unknown>;
  editable: boolean;
}

export const AssetDeconstructor: React.FC<AssetDeconstructorProps> = ({
  asset,
  onDeconstructComplete,
}) => {
  const [deconstructing, setDeconstructing] = useState(false);
  const [components, setComponents] = useState<DeconstructedComponent[]>([]);
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());

  const handleDeconstruct = async () => {
    if (!asset) return;

    setDeconstructing(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    const deconstructed: DeconstructedComponent[] = [];

    if (asset.type === 'Prefab') {
      deconstructed.push(
        {
          id: `${asset.id}-transform`,
          name: 'Transform',
          type: 'Component',
          properties: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          editable: true,
        },
        {
          id: `${asset.id}-mesh`,
          name: 'Mesh Renderer',
          type: 'Component',
          properties: {
            castShadows: true,
            receiveShadows: true,
            materials: ['Material_Main'],
          },
          editable: true,
        },
        {
          id: `${asset.id}-collider`,
          name: 'Box Collider',
          type: 'Component',
          properties: {
            isTrigger: false,
            center: { x: 0, y: 0, z: 0 },
            size: { x: 1, y: 1, z: 1 },
          },
          editable: true,
        }
      );
    } else if (asset.type === 'Material') {
      deconstructed.push({
        id: `${asset.id}-shader`,
        name: 'Shader',
        type: 'Property',
        properties: {
          shader: 'Standard',
          renderQueue: 2000,
        },
        editable: false,
      });
    } else if (asset.type === 'Script') {
      deconstructed.push({
        id: `${asset.id}-code`,
        name: 'Source Code',
        type: 'Content',
        properties: {
          language: 'C#',
          lines: asset.contents?.split('\n').length || 0,
        },
        editable: true,
      });
    }

    deconstructed.push({
      id: `${asset.id}-meta`,
      name: 'Metadata',
      type: 'Meta',
      properties: asset.metadata || {},
      editable: false,
    });

    setComponents(deconstructed);
    setDeconstructing(false);
    onDeconstructComplete?.(deconstructed);
  };

  const toggleComponent = (id: string) => {
    setExpandedComponents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

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
        <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <p>Select an asset to deconstruct</p>
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
            Deconstruct Asset
          </h3>
          <p style={{ color: lumenForgeColors.text.secondary, fontSize: '0.875rem' }}>
            Break down <strong>{asset.name}</strong> into its components
          </p>
        </div>

        <button
          onClick={handleDeconstruct}
          disabled={deconstructing}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`,
            color: lumenForgeColors.text.primary,
            border: 'none',
            borderRadius: '0.5rem',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: deconstructing ? 'not-allowed' : 'pointer',
            transition: transitions.normal,
            opacity: deconstructing ? 0.6 : 1,
          }}
        >
          {deconstructing ? 'Deconstructing...' : 'Deconstruct'}
        </button>

        {components.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h4
              style={{
                color: lumenForgeColors.text.primary,
                fontSize: '1rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Components ({components.length})
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {components.map((component) => {
                const isExpanded = expandedComponents.has(component.id);
                return (
                  <Panel key={component.id} variant="secondary" padding="md">
                    <div
                      onClick={() => toggleComponent(component.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                      }}
                    >
                      {component.type === 'Component' && (
                        <Box size={20} style={{ color: lumenForgeColors.accent.primary }} />
                      )}
                      {component.type === 'Property' && (
                        <Layers size={20} style={{ color: lumenForgeColors.accent.secondary }} />
                      )}
                      {(component.type === 'Content' || component.type === 'Meta') && (
                        <FileText size={20} style={{ color: lumenForgeColors.text.secondary }} />
                      )}

                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            color: lumenForgeColors.text.primary,
                            fontSize: '0.875rem',
                            fontWeight: 600,
                          }}
                        >
                          {component.name}
                        </p>
                        <p
                          style={{
                            color: lumenForgeColors.text.tertiary,
                            fontSize: '0.75rem',
                          }}
                        >
                          {component.type} • {component.editable ? 'Editable' : 'Read-only'}
                        </p>
                      </div>
                    </div>

                    {isExpanded && (
                      <pre
                        style={{
                          marginTop: '0.75rem',
                          background: lumenForgeColors.background.primary,
                          color: lumenForgeColors.text.secondary,
                          padding: '0.75rem',
                          borderRadius: '0.375rem',
                          fontSize: '0.75rem',
                          overflow: 'auto',
                          maxHeight: '200px',
                        }}
                      >
                        {JSON.stringify(component.properties, null, 2)}
                      </pre>
                    )}
                  </Panel>
                );
              })}
            </div>
          </div>
        )}
      </Panel>
    </div>
  );
};
