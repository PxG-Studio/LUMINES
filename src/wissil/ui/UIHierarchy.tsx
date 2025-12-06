/**
 * UI Hierarchy Panel
 * Figma-like tree view of UI elements
 */

'use client';

import React from "react";
import { useCanvasStore } from "./CanvasStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { ChevronRight } from "@/design-system/icons/ChevronRight";

export interface UIHierarchyProps {
  className?: string;
  style?: React.CSSProperties;
}

function TreeNode({ rect, depth = 0 }: { rect: any; depth?: number }) {
  const theme = useTheme();
  const selected = useCanvasStore((state) => state.selected);
  const select = useCanvasStore((state) => state.select);
  const rects = useCanvasStore((state) => state.rects);
  const [expanded, setExpanded] = React.useState(true);

  const isSelected = selected === rect.id;
  const children = rect.children || [];

  return (
    <div>
      <div
        onClick={() => select(rect.id)}
        style={{
          display: "flex",
          alignItems: "center",
          paddingLeft: depth * 16,
          padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
          background: isSelected ? theme.colors.bg2 : "transparent",
          border: isSelected
            ? `1px solid ${theme.colors.accent || theme.colors.border}`
            : "1px solid transparent",
          cursor: "pointer",
          fontSize: theme.typography.size.sm,
          color: theme.colors.text0,
          userSelect: "none"
        }}
      >
        {children.length > 0 && (
          <div
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            style={{
              marginRight: theme.spacing.xs,
              transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.15s ease"
            }}
          >
            <ChevronRight size={12} />
          </div>
        )}
        <div
          style={{
            flex: 1,
            fontWeight: isSelected ? theme.typography.weight.semibold : theme.typography.weight.regular
          }}
        >
          {rect.name}
        </div>
      </div>
      {expanded && children.length > 0 && (
        <div>
          {children.map((childId: string) => {
            const childRect = rects[childId];
            return childRect ? (
              <TreeNode key={childId} rect={childRect} depth={depth + 1} />
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

export function UIHierarchy({ className, style }: UIHierarchyProps) {
  const theme = useTheme();
  const rects = useCanvasStore((state) => state.rects);

  // Find root nodes (nodes without parents)
  const rootNodes = Object.values(rects).filter(
    (rect) => !rect.parent || !rects[rect.parent]
  );

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
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          UI Hierarchy ({Object.keys(rects).length})
        </h3>
      </div>

      {/* Tree */}
      <div style={{ padding: theme.spacing.xs }}>
        {rootNodes.length === 0 ? (
          <div
            style={{
              padding: theme.spacing.md,
              textAlign: "center",
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm,
              opacity: 0.6
            }}
          >
            No UI elements found
          </div>
        ) : (
          rootNodes.map((rect) => <TreeNode key={rect.id} rect={rect} depth={0} />)
        )}
      </div>
    </div>
  );
}

