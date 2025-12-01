/**
 * Unity Preview Decorator
 * Storybook decorator that embeds Unity WebGL builds in stories
 */

'use client';

import React, { useEffect, useRef, useState } from "react";
import { UnityBridge } from "@/wissil/IgnisWebGL/unityBridge";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface UnityPreviewDecoratorProps {
  buildUrl?: string;
  enabled?: boolean;
  height?: string | number;
  children?: React.ReactNode;
}

/**
 * Unity Preview Decorator for Storybook stories
 * Wraps stories with Unity WebGL preview
 */
export function UnityPreviewDecorator({
  buildUrl = "/UnityBuild",
  enabled = true,
  height = 500,
  children
}: UnityPreviewDecoratorProps) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (!containerRef.current) return;

    let active = true;
    setLoading(true);
    setError(null);

    async function loadUnity() {
      try {
        await UnityBridge.loadInto(containerRef.current!, buildUrl);
        
        if (active) {
          setLoading(false);
        }
      } catch (err: any) {
        if (active) {
          setError(err?.message || String(err));
          setLoading(false);
        }
      }
    }

    loadUnity();

    return () => {
      active = false;
      UnityBridge.destroy();
    };
  }, [buildUrl, enabled]);

  return (
    <div style={{ padding: 20 }}>
      {/* Unity WebGL Preview */}
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: typeof height === "number" ? `${height}px` : height,
          background: theme.colors.bg2 || "#111",
          borderRadius: theme.radii?.md || 8,
          border: `1px solid ${theme.colors.border || "#333"}`,
          position: "relative",
          overflow: "hidden",
          marginBottom: 20
        }}
      >
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.text2 || "#888",
              fontSize: 14
            }}
          >
            Loading Unity WebGL...
          </div>
        )}
        {error && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme.colors.error || "#f44",
              fontSize: 14,
              padding: 20,
              textAlign: "center"
            }}
          >
            Unity Load Error: {error}
          </div>
        )}
      </div>

      {/* Story Content */}
      {children && (
        <div style={{ marginTop: 20 }}>
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Storybook decorator function
 */
export function withUnityPreview(Story: any, context: any) {
  const buildUrl = context.args?.buildUrl || "/UnityBuild";
  const enabled = context.args?.unityEnabled !== false;

  return (
    <UnityPreviewDecorator buildUrl={buildUrl} enabled={enabled}>
      <Story {...context} />
    </UnityPreviewDecorator>
  );
}

