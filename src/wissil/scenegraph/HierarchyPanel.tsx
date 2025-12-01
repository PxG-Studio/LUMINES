/**
 * Hierarchy Panel
 * Unity-style hierarchy tree view
 * Real-time scene graph display
 */

'use client';

import React from "react";
import { useSceneGraph } from "./SceneGraphStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { ChevronRight } from "@/design-system/icons/ChevronRight";
import { Folder } from "@/design-system/icons/Folder";
import { selectInUnity, hoverInUnity } from "./SelectionSync";

interface HierarchyNodeProps {
  nodeId: string;
  depth: number;
}

function HierarchyNode({ nodeId, depth }: HierarchyNodeProps) {
  const theme = useTheme();
  const node = useSceneGraph((state) => state.getNode(nodeId));
  const selectedId = useSceneGraph((state) => state.selectedId);
  const hoveredId = useSceneGraph((state) => state.hoveredId);
  const expandedNodes = useSceneGraph((state) => state.expandedNodes);
  const children = useSceneGraph((state) => state.getChildren(nodeId));
  const toggleExpanded = useSceneGraph((state) => state.toggleExpanded);

  if (!node) return null;

  const isSelected = selectedId === nodeId;
  const isHovered = hoveredId === nodeId;
  const isExpanded = expandedNodes.has(nodeId);
  const hasChildren = children.length > 0;

  const handleClick = () => {
    selectInUnity(nodeId);
  };

  const handleDoubleClick = () => {
    if (hasChildren) {
      toggleExpanded(nodeId);
    }
  };

  const handleMouseEnter = () => {
    hoverInUnity(nodeId);
  };

  const handleMouseLeave = () => {
    hoverInUnity(null);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleExpanded(nodeId);
  };

  return (
    <div>
      {/* Node Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: depth * theme.spacing.md,
          paddingRight: theme.spacing.sm,
          paddingTop: 2,
          paddingBottom: 2,
          cursor: "pointer",
          backgroundColor:
            isSelected
              ? theme.colors.accent + "40" || theme.colors.bg2
              : isHovered
              ? theme.colors.bg2
              : "transparent",
          borderLeft:
            isSelected
              ? `3px solid ${theme.colors.accent || theme.colors.text0}`
              : "3px solid transparent",
          fontSize: theme.typography.size.sm,
          userSelect: "none"
        }}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren ? (
          <div
            style={{
              marginRight: theme.spacing.xs,
              display: "flex",
              alignItems: "center",
              cursor: "pointer"
            }}
            onClick={handleToggle}
          >
            <ChevronRight
              size={14}
              style={{
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
                color: theme.colors.text2
              }}
            />
          </div>
        ) : (
          <div style={{ width: 18, marginRight: theme.spacing.xs }} />
        )}

        {/* Node Icon */}
        <div
          style={{
            marginRight: theme.spacing.xs,
            display: "flex",
            alignItems: "center",
            opacity: node.active === false ? 0.5 : 1
          }}
        >
          <Folder size={14} style={{ color: theme.colors.text2 }} />
        </div>

        {/* Node Name */}
        <span
          style={{
            color: isSelected
              ? theme.colors.accent || theme.colors.text0
              : theme.colors.text1,
            fontWeight: isSelected ? theme.typography.weight.semibold : theme.typography.weight.regular,
            opacity: node.active === false ? 0.5 : 1
          }}
        >
          {node.name || "Unnamed"}
        </span>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div>
          {children.map((child) => (
            <HierarchyNode key={child.id} nodeId={child.id} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export interface HierarchyPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function HierarchyPanel({ className, style }: HierarchyPanelProps) {
  const theme = useTheme();
  const rootNodes = useSceneGraph((state) => state.getRootNodes());

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
      {/* Header */}
      <div
        style={{
          padding: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.border}`,
          fontSize: theme.typography.size.sm,
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0
        }}
      >
        Hierarchy
      </div>

      {/* Tree */}
      <div style={{ padding: theme.spacing.xs }}>
        {rootNodes.length === 0 ? (
          <div
            style={{
              padding: theme.spacing.md,
              textAlign: "center",
              color: theme.colors.text2,
              opacity: 0.6,
              fontSize: theme.typography.size.sm
            }}
          >
            No scene objects loaded
          </div>
        ) : (
          rootNodes.map((node) => (
            <HierarchyNode key={node.id} nodeId={node.id} depth={0} />
          ))
        )}
      </div>
    </div>
  );
}

