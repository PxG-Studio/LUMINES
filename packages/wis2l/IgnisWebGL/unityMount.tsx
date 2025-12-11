/**
 * Unity Mount Component
 * React component that mounts Unity WebGL player into Ignis container
 */

'use client';

import React, { useEffect, useRef, useState } from "react";
import { UnityBridge } from "./unityBridge";
import { setupUnityMessaging } from "./unityMessaging";
import { useEditorState } from "@/state/editorState";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface UnityMountProps {
  buildUrl?: string;
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function UnityMount({
  buildUrl = "/UnityBuild",
  enabled = true,
  className,
  style
}: UnityMountProps) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setRuntimeError = useEditorState((s) => s.setRuntimeError);
  const pushMessage = useEditorState((s) => s.pushMessage);

  useEffect(() => {
    if (!enabled) return;
    if (!containerRef.current) return;

    let active = true;
    setLoading(true);
    setError(null);

    async function start() {
      try {
        pushMessage(`[Unity] Loading Unity WebGL build from ${buildUrl}...`);
        
        setupUnityMessaging(); // Attach log/error bridging
        
        await UnityBridge.loadInto(containerRef.current!, buildUrl);
        
        if (active) {
          setLoading(false);
          pushMessage(`[Unity] Unity WebGL loaded successfully`);
        }
      } catch (err: any) {
        if (active) {
          const errorMsg = err?.message || String(err);
          setError(errorMsg);
          setRuntimeError(`Unity Load Error: ${errorMsg}`);
          pushMessage(`❌ [Unity] Load failed: ${errorMsg}`);
          setLoading(false);
        }
      }
    }

    start();

    return () => {
      active = false;
      if (enabled) {
        UnityBridge.destroy();
      }
    };
  }, [buildUrl, enabled, setRuntimeError, pushMessage]);

  if (!enabled) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        overflow: "hidden",
        background: theme.colors.bg2,
        ...style
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
            color: theme.colors.text2,
            fontSize: theme.typography.size.md
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
            color: theme.colors.error,
            fontSize: theme.typography.size.md,
            padding: theme.spacing.lg
          }}
        >
          Unity Load Error: {error}
        </div>
      )}
    </div>
  );
}

