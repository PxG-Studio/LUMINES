/**
 * Material Inspector Panel
 * Unity-style material inspector for selected objects
 * Shows material properties and shader parameters
 */

'use client';

import React, { useEffect } from "react";
import { useMaterialStore } from "./MaterialStore";
import { ShaderParamEditor } from "./ShaderParamEditor";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { requestMaterialSnapshot, requestMaterialPreview } from "./MaterialSync";
import { useSceneGraph } from "../scenegraph/SceneGraphStore";

export interface MaterialInspectorPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function MaterialInspectorPanel({
  className,
  style
}: MaterialInspectorPanelProps) {
  const theme = useTheme();
  const selectedId = useMaterialStore((state) => state.selectedId);
  const material = useMaterialStore((state) =>
    selectedId ? state.getMaterial(selectedId) : undefined
  );
  const sceneSelectedId = useSceneGraph((state) => state.selectedId);

  // Request material snapshot when scene object is selected
  useEffect(() => {
    if (sceneSelectedId) {
      // Auto-select material when scene object is selected
      useMaterialStore.getState().select(sceneSelectedId);
      requestMaterialSnapshot(sceneSelectedId);
      requestMaterialPreview(sceneSelectedId);
    }
  }, [sceneSelectedId]);

  if (!material) {
    return (
      <div
        className={className}
        style={{
          height: "100%",
          padding: theme.spacing.md,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          ...style
        }}
      >
        Select an object with a material to inspect
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
      {/* Header */}
      <div
        style={{
          padding: theme.spacing.md,
          borderBottom: `1px solid ${theme.colors.border}`,
          background: theme.colors.bg1
        }}
      >
        <div
          style={{
            fontSize: theme.typography.size.md,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0,
            marginBottom: theme.spacing.xs
          }}
        >
          {material.materialName || "Unnamed Material"}
        </div>
        <div
          style={{
            fontSize: theme.typography.size.xs,
            color: theme.colors.text2
          }}
        >
          Shader: {material.shaderName || "Unknown Shader"}
        </div>
      </div>

      {/* Parameters */}
      <div style={{ padding: theme.spacing.md }}>
        <div
          style={{
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text1,
            marginBottom: theme.spacing.md,
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}
        >
          Shader Properties
        </div>

        {material.parameters && material.parameters.length > 0 ? (
          material.parameters.map((param) => (
            <ShaderParamEditor key={param.name} objectId={material.objectId} param={param} />
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
            No shader properties found
          </div>
        )}
      </div>
    </div>
  );
}

