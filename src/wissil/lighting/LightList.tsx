/**
 * Light Selector
 * List of all lights in the scene
 */

'use client';

import React from "react";
import { useLightStore } from "./LightStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface LightListProps {
  className?: string;
  style?: React.CSSProperties;
}

export function LightList({ className, style }: LightListProps) {
  const theme = useTheme();
  const lights = useLightStore((state) => state.lights);
  const selected = useLightStore((state) => state.selected);
  const select = useLightStore((state) => state.select);

  const lightList = Object.values(lights);

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
          Lights ({lightList.length})
        </h3>
      </div>

      {/* Light List */}
      <div style={{ padding: theme.spacing.md }}>
        {lightList.length === 0 ? (
          <div
            style={{
              padding: theme.spacing.md,
              textAlign: "center",
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm,
              opacity: 0.6
            }}
          >
            No lights in scene
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
            {lightList.map((light) => (
              <Card
                key={light.id}
                onClick={() => select(light.id)}
                style={{
                  padding: theme.spacing.sm,
                  background: selected === light.id ? theme.colors.bg2 : theme.colors.bg1,
                  border: `1px solid ${
                    selected === light.id ? theme.colors.accent || theme.colors.border : theme.colors.border
                  }`,
                  cursor: "pointer",
                  transition: "background 0.15s ease"
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.size.sm,
                    fontWeight:
                      selected === light.id
                        ? theme.typography.weight.semibold
                        : theme.typography.weight.regular,
                    color: theme.colors.text0,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  {light.name}
                </div>
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2,
                    marginBottom: theme.spacing.xs
                  }}
                >
                  Type: {light.type}
                </div>
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2
                  }}
                >
                  Intensity: {light.intensity.toFixed(2)}
                </div>
                <div
                  style={{
                    display: "inline-block",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: `rgb(${Math.round(light.color.r * 255)}, ${Math.round(light.color.g * 255)}, ${Math.round(light.color.b * 255)})`,
                    border: `2px solid ${theme.colors.border}`,
                    marginTop: theme.spacing.xs
                  }}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

