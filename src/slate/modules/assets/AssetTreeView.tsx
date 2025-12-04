import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { ParsedUnityAsset } from './types';
import { lumenForgeColors, transitions } from '../../../design-system/tokens';

interface AssetTreeViewProps {
  assets: ParsedUnityAsset[];
  onAssetSelect?: (asset: ParsedUnityAsset) => void;
  selectedAssetId?: string;
}

export const AssetTreeView: React.FC<AssetTreeViewProps> = ({
  assets,
  onAssetSelect,
  selectedAssetId,
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const AssetNode: React.FC<{ asset: ParsedUnityAsset; depth: number }> = ({ asset, depth }) => {
    const hasChildren = asset.children && asset.children.length > 0;
    const isExpanded = expandedIds.has(asset.id);
    const isSelected = selectedAssetId === asset.id;

    return (
      <div>
        <div
          onClick={() => {
            if (hasChildren) {
              toggleExpand(asset.id);
            }
            onAssetSelect?.(asset);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            paddingLeft: `${depth * 1.5 + 0.5}rem`,
            cursor: 'pointer',
            background: isSelected ? lumenForgeColors.accent.primary + '20' : 'transparent',
            borderLeft: isSelected ? `2px solid ${lumenForgeColors.accent.primary}` : '2px solid transparent',
            transition: transitions.fast,
          }}
          onMouseEnter={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = lumenForgeColors.background.tertiary;
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown size={16} style={{ color: lumenForgeColors.text.secondary }} />
            ) : (
              <ChevronRight size={16} style={{ color: lumenForgeColors.text.secondary }} />
            )
          ) : (
            <div style={{ width: '16px' }} />
          )}

          {hasChildren ? (
            <Folder size={16} style={{ color: lumenForgeColors.accent.secondary }} />
          ) : (
            <File size={16} style={{ color: lumenForgeColors.text.tertiary }} />
          )}

          <span
            style={{
              color: isSelected ? lumenForgeColors.accent.primary : lumenForgeColors.text.primary,
              fontSize: '0.875rem',
              fontWeight: isSelected ? 600 : 400,
            }}
          >
            {asset.name}
          </span>

          <span
            style={{
              color: lumenForgeColors.text.tertiary,
              fontSize: '0.75rem',
              marginLeft: 'auto',
            }}
          >
            {asset.type}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {asset.children!.map((child) => (
              <AssetNode key={child.id} asset={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {assets.length === 0 ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: lumenForgeColors.text.tertiary,
            fontSize: '0.875rem',
          }}
        >
          No assets loaded
        </div>
      ) : (
        assets.map((asset) => <AssetNode key={asset.id} asset={asset} depth={0} />)
      )}
    </div>
  );
};
