/**
 * Keyframe Inspector
 * View and edit animation keyframes
 */

'use client';

import React from "react";
import { useAnimationStore, AnimationKeyframe } from "./AnimationStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface KeyframeInspectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function KeyframeInspector({
  className,
  style
}: KeyframeInspectorProps) {
  const theme = useTheme();
  const selectedClip = useAnimationStore((state) => state.selectedClip);
  const keyframes = useAnimationStore((state) =>
    selectedClip ? state.keyframes[selectedClip] || [] : []
  );

  if (!selectedClip) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          ...style
        }}
      >
        Select an animation clip to view keyframes
      </div>
    );
  }

  // Group keyframes by property
  const keyframesByProperty: Record<string, AnimationKeyframe[]> = {};
  keyframes.forEach((kf) => {
    if (!keyframesByProperty[kf.property]) {
      keyframesByProperty[kf.property] = [];
    }
    keyframesByProperty[kf.property].push(kf);
  });

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.md,
        height: "100%",
        overflow: "auto",
        background: theme.colors.bg0,
        ...style
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.border}`
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
          Keyframes ({keyframes.length})
        </h3>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2,
            marginTop: theme.spacing.xs
          }}
        >
          {selectedClip}
        </div>
      </div>

      {/* Keyframes by Property */}
      {Object.keys(keyframesByProperty).length > 0 ? (
        Object.entries(keyframesByProperty).map(([property, kfs]) => (
          <div
            key={property}
            style={{
              marginBottom: theme.spacing.md,
              padding: theme.spacing.md,
              background: theme.colors.bg1,
              borderRadius: theme.radii.md,
              border: `1px solid ${theme.colors.border}`
            }}
          >
            <div
              style={{
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.semibold,
                color: theme.colors.text0,
                marginBottom: theme.spacing.sm
              }}
            >
              {property}
            </div>
            {kfs
              .sort((a, b) => a.time - b.time)
              .map((kf, i) => (
                <div
                  key={i}
                  style={{
                    padding: theme.spacing.sm,
                    marginBottom: theme.spacing.xs,
                    background: theme.colors.bg2,
                    borderRadius: theme.radii.sm,
                    fontSize: theme.typography.size.xs,
                    fontFamily: "monospace"
                  }}
                >
                  <div style={{ color: theme.colors.text0, marginBottom: theme.spacing.xs }}>
                    <strong>Time:</strong> {kf.time.toFixed(3)}s
                  </div>
                  <div style={{ color: theme.colors.text1 }}>
                    <strong>Value:</strong> {JSON.stringify(kf.value)}
                  </div>
                  {(kf.inTangent !== undefined || kf.outTangent !== undefined) && (
                    <div style={{ color: theme.colors.text2, fontSize: theme.typography.size.xs }}>
                      Tangents: In={kf.inTangent?.toFixed(2) || "—"}, Out={kf.outTangent?.toFixed(2) || "—"}
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))
      ) : (
        <div
          style={{
            padding: theme.spacing.md,
            textAlign: "center",
            color: theme.colors.text2,
            fontSize: theme.typography.size.sm,
            opacity: 0.6
          }}
        >
          No keyframes loaded. Request keyframes from Unity to view.
        </div>
      )}
    </div>
  );
}

