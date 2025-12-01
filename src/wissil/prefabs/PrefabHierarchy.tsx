/**
 * Prefab Hierarchy Viewer
 * Displays prefab hierarchy tree
 */

'use client';

import React, { useState } from "react";
import { usePrefabStore } from "./PrefabStore";
import { PrefabData } from "./PrefabTypes";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { ChevronRight } from "@/design-system/icons/ChevronRight";
import { Folder } from "@/design-system/icons/Folder";

interface NodeViewProps {
  node: PrefabData;
  depth?: number;
  onSelect?: (nodeId: string) => void;
  selectedNodeId?: string | null;
}

function NodeView({ node, depth = 0, onSelect, selectedNodeId }: NodeViewProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedNodeId === node.id;

  return (
    <div>
      <div
        onClick={() => {
          onSelect?.(node.id);
          if (hasChildren) setExpanded(!expanded);
        }}
        style={{
          display: "flex",
          alignItems: "center",
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          paddingLeft: depth * 16 + theme.spacing.sm,
          cursor: "pointer",
          background: isSelected ? theme.colors.bg2 : "transparent",
          borderRadius: theme.radii.sm,
          fontSize: theme.typography.size.sm,
          color: isSelected ? theme.colors.text0 : theme.colors.text1,
          userSelect: "none",
          transition: "background 0.15s ease"
        }}
        onMouseEnter={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = theme.colors.bg1;
          }
        }}
        onMouseLeave={(e) => {
          if (!isSelected) {
            e.currentTarget.style.background = "transparent";
          }
        }}
      >
        {hasChildren ? (
          <div
            style={{
              marginRight: theme.spacing.xs,
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease",
              display: "flex",
              alignItems: "center"
            }}
          >
            <ChevronRight size={12} />
          </div>
        ) : (
          <div style={{ width: 12, marginRight: theme.spacing.xs }} />
        )}
        <Folder size={14} style={{ marginRight: theme.spacing.xs, opacity: 0.6 }} />
        <span style={{ flex: 1 }}>{node.name}</span>
        {node.components && node.components.length > 0 && (
          <span
            style={{
              fontSize: theme.typography.size.xs,
              color: theme.colors.text2,
              marginLeft: theme.spacing.xs
            }}
          >
            {node.components.length}
          </span>
        )}
      </div>
      {hasChildren && expanded && (
        <div>
          {node.children.map((child, i) => (
            <NodeView
              key={child.id || i}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selectedNodeId={selectedNodeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface PrefabHierarchyProps {
  prefabId?: string | null;
  onNodeSelect?: (nodeId: string) => void;
  selectedNodeId?: string | null;
  className?: string;
  style?: React.CSSProperties;
}

export function PrefabHierarchy({
  prefabId,
  onNodeSelect,
  selectedNodeId,
  className,
  style
}: PrefabHierarchyProps) {
  const theme = useTheme();
  const selectedPrefab = usePrefabStore((state) => state.selected);
  const prefab = usePrefabStore((state) =>
    (prefabId || selectedPrefab) ? state.getPrefab(prefabId || selectedPrefab || "") : undefined
  );

  if (!prefab) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          textAlign: "center",
          ...style
        }}
      >
        Select a prefab to view hierarchy
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      <NodeView node={prefab} onSelect={onNodeSelect} selectedNodeId={selectedNodeId} />
    </div>
  );
}

