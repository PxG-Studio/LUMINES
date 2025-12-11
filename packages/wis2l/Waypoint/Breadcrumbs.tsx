/**
 * Breadcrumbs Component
 * Shows navigation path to current document
 */

'use client';

import React from "react";
import { useWaypointState } from "./waypointState";
import { WaypointTree, type WaypointDoc } from "./waypointSchema";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface BreadcrumbsProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Breadcrumbs({ className, style }: BreadcrumbsProps) {
  const theme = useTheme();
  const current = useWaypointState((s) => s.currentDoc);

  function findPath(id: string, nodes: WaypointDoc[] = WaypointTree, path: WaypointDoc[] = []): WaypointDoc[] | null {
    for (const node of nodes) {
      const currentPath = [...path, node];
      
      if (node.id === id) {
        return currentPath;
      }
      
      if (node.children) {
        const result = findPath(id, node.children, currentPath);
        if (result) return result;
      }
    }
    return null;
  }

  const path = findPath(current) || [];

  return (
    <div
      className={className}
      style={{
        fontSize: theme.typography.size.sm,
        marginBottom: theme.spacing.md,
        color: theme.colors.text2,
        display: "flex",
        alignItems: "center",
        gap: theme.spacing.xs,
        ...style
      }}
    >
      <span>Documentation</span>
      {path.map((doc, index) => (
        <React.Fragment key={doc.id}>
          <span style={{ color: theme.colors.border }}>/</span>
          <span style={{ color: index === path.length - 1 ? theme.colors.text1 : theme.colors.text2 }}>
            {doc.title}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

