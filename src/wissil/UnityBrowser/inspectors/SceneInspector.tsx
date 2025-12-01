/**
 * Scene Inspector Component
 * Displays Unity scene hierarchy and game objects
 */

'use client';

import React, { useState } from "react";
import { parseUnityScene } from "../parsers/unityYaml";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { ChevronRight } from "@/design-system/icons/ChevronRight";

export interface SceneInspectorProps {
  content: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SceneInspector({ content, className, style }: SceneInspectorProps) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState<Set<string | number>>(new Set());

  const sceneData = parseUnityScene(content);
  const { gameObjects, hierarchy } = sceneData;

  const toggleExpand = (id: string | number) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpanded(newExpanded);
  };

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        ...style
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: theme.spacing.md,
          fontSize: theme.typography.size.lg,
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0
        }}
      >
        Scene Hierarchy
      </h2>

      {gameObjects.length === 0 ? (
        <div
          style={{
            padding: theme.spacing.md,
            color: theme.colors.text2,
            opacity: 0.6
          }}
        >
          No GameObjects found in scene
        </div>
      ) : (
        <div>
          {hierarchy.map((obj) => (
            <div
              key={obj.id}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderBottom: `1px solid ${theme.colors.border}`,
                opacity: obj.active ? 1 : 0.5,
                cursor: "pointer"
              }}
              onClick={() => toggleExpand(obj.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = theme.colors.bg2;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: theme.spacing.xs }}>
                <ChevronRight
                  size={12}
                  style={{
                    transform: expanded.has(obj.id) ? "rotate(90deg)" : "rotate(0)",
                    transition: "transform 0.15s ease",
                    color: theme.colors.text2
                  }}
                />
                <strong style={{ color: theme.colors.text0 }}>{obj.name}</strong>
                {!obj.active && (
                  <span
                    style={{
                      fontSize: theme.typography.size.xs,
                      color: theme.colors.text2,
                      opacity: 0.6
                    }}
                  >
                    (inactive)
                  </span>
                )}
              </div>

              {expanded.has(obj.id) && (
                <div
                  style={{
                    marginLeft: theme.spacing.lg,
                    marginTop: theme.spacing.xs,
                    paddingLeft: theme.spacing.md,
                    borderLeft: `2px solid ${theme.colors.border}`,
                    fontSize: theme.typography.size.sm,
                    color: theme.colors.text2
                  }}
                >
                  <div>ID: {String(obj.id)}</div>
                  {obj.position && (
                    <div>
                      Position: ({obj.position[0]}, {obj.position[1]}, {obj.position[2]})
                    </div>
                  )}
                  {obj.rotation && (
                    <div>
                      Rotation: ({obj.rotation[0]}, {obj.rotation[1]}, {obj.rotation[2]})
                    </div>
                  )}
                  {obj.scale && (
                    <div>
                      Scale: ({obj.scale[0]}, {obj.scale[1]}, {obj.scale[2]})
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

