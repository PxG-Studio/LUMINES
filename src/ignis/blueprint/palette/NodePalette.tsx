/**
 * Node Palette
 * Searchable palette for adding nodes
 */

'use client';

import React, { useState, useMemo } from "react";
import { NodeLibrary } from "../library/NodeLibrary";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface NodePaletteProps {
  onSelectNode?: (nodeType: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function NodePalette({ onSelectNode, className, style }: NodePaletteProps) {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allNodes = NodeLibrary.getAll();
  const categories = useMemo(() => {
    const cats = new Set<string>();
    allNodes.forEach((node) => cats.add(node.category));
    return Array.from(cats).sort();
  }, [allNodes]);

  const filteredNodes = useMemo(() => {
    let nodes = allNodes;

    if (selectedCategory) {
      nodes = nodes.filter((node) => node.category === selectedCategory);
    }

    if (searchQuery) {
      nodes = NodeLibrary.search(searchQuery);
      if (selectedCategory) {
        nodes = nodes.filter((node) => node.category === selectedCategory);
      }
    }

    return nodes;
  }, [searchQuery, selectedCategory, allNodes]);

  const handleNodeClick = (nodeType: string) => {
    onSelectNode?.(nodeType);
  };

  return (
    <div
      className={className}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Search */}
      <div style={{ padding: theme.spacing.md, borderBottom: `1px solid ${theme.colors.border}` }}>
        <input
          type="text"
          placeholder="Search nodes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            background: theme.colors.bg2,
            border: `1px solid ${theme.colors.border}`,
            borderRadius: theme.radii.sm,
            color: theme.colors.text0,
            fontSize: theme.typography.size.sm
          }}
        />
      </div>

      {/* Categories */}
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          display: "flex",
          gap: theme.spacing.xs,
          flexWrap: "wrap"
        }}
      >
        <button
          onClick={() => setSelectedCategory(null)}
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
            background: selectedCategory === null ? theme.colors.bg2 : "transparent",
            border: "none",
            borderRadius: theme.radii.sm,
            color: theme.colors.text0,
            fontSize: theme.typography.size.xs,
            cursor: "pointer"
          }}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
              background: selectedCategory === category ? theme.colors.bg2 : "transparent",
              border: "none",
              borderRadius: theme.radii.sm,
              color: theme.colors.text0,
              fontSize: theme.typography.size.xs,
              cursor: "pointer"
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Node List */}
      <div style={{ flex: 1, overflow: "auto", padding: theme.spacing.md }}>
        {filteredNodes.length === 0 ? (
          <div
            style={{
              padding: theme.spacing.md,
              textAlign: "center",
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm,
              opacity: 0.6
            }}
          >
            No nodes found
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
            {filteredNodes.map((nodeDef) => (
              <Card
                key={nodeDef.type}
                onClick={() => handleNodeClick(nodeDef.type)}
                style={{
                  padding: theme.spacing.sm,
                  cursor: "pointer",
                  background: theme.colors.bg1,
                  border: `1px solid ${theme.colors.border}`,
                  transition: "background 0.15s ease"
                }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.background = theme.colors.bg2;
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.background = theme.colors.bg1;
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: theme.spacing.xs,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: nodeDef.color || theme.colors.accent || "#4A90E2"
                    }}
                  />
                  <div
                    style={{
                      fontSize: theme.typography.size.sm,
                      fontWeight: theme.typography.weight.medium,
                      color: theme.colors.text0
                    }}
                  >
                    {nodeDef.title}
                  </div>
                </div>
                {nodeDef.description && (
                  <div
                    style={{
                      fontSize: theme.typography.size.xs,
                      color: theme.colors.text2,
                      marginTop: theme.spacing.xs
                    }}
                  >
                    {nodeDef.description}
                  </div>
                )}
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2,
                    marginTop: theme.spacing.xs,
                    opacity: 0.6
                  }}
                >
                  {nodeDef.category}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

