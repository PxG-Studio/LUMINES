/**
 * Material Browser UI
 * Browse and select materials
 * Shows material previews and properties
 */

'use client';

import React, { useState } from "react";
import { useMaterialStore } from "./MaterialStore";
import { useMaterialPreview } from "./MaterialPreviewStore";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { requestMaterialPreview } from "./MaterialSync";

export interface MaterialBrowserPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function MaterialBrowserPanel({
  className,
  style
}: MaterialBrowserPanelProps) {
  const theme = useTheme();
  const materials = useMaterialStore((state) => state.materials);
  const selectedId = useMaterialStore((state) => state.selectedId);
  const select = useMaterialStore((state) => state.select);
  const [selectedForPreview, setSelectedForPreview] = useState<string | null>(null);
  const preview = useMaterialPreview((state) =>
    selectedForPreview ? state.getPreview(selectedForPreview) : null
  );

  const materialList = Object.values(materials);

  const handleSelect = (objectId: string) => {
    select(objectId);
    setSelectedForPreview(objectId);
    requestMaterialPreview(objectId);
  };

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
          Materials ({materialList.length})
        </h3>
      </div>

      {/* Material List */}
      <div style={{ padding: theme.spacing.md }}>
        {materialList.length === 0 ? (
          <div
            style={{
              padding: theme.spacing.md,
              textAlign: "center",
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm,
              opacity: 0.6
            }}
          >
            No materials loaded. Select an object with a material to inspect.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.sm }}>
            {materialList.map((material) => (
              <div
                key={material.objectId}
                onClick={() => handleSelect(material.objectId)}
                style={{
                  padding: theme.spacing.sm,
                  background:
                    selectedId === material.objectId
                      ? theme.colors.accent + "40" || theme.colors.bg2
                      : theme.colors.bg1,
                  borderRadius: theme.radii.sm,
                  border: `1px solid ${
                    selectedId === material.objectId
                      ? theme.colors.accent || theme.colors.border
                      : theme.colors.border
                  }`,
                  cursor: "pointer",
                  transition: "background 0.15s ease"
                }}
              >
                <div
                  style={{
                    fontSize: theme.typography.size.sm,
                    fontWeight:
                      selectedId === material.objectId
                        ? theme.typography.weight.semibold
                        : theme.typography.weight.regular,
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
                  {material.shaderName || "Unknown Shader"}
                </div>
                <div
                  style={{
                    fontSize: theme.typography.size.xs,
                    color: theme.colors.text2,
                    marginTop: theme.spacing.xs
                  }}
                >
                  {material.parameters?.length || 0} properties
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div
          style={{
            padding: theme.spacing.md,
            borderTop: `1px solid ${theme.colors.border}`,
            background: theme.colors.bg1
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
            Preview
          </div>
          <img
            src={`data:image/png;base64,${preview}`}
            alt="Material preview"
            style={{
              width: "100%",
              maxWidth: 256,
              height: "auto",
              border: `1px solid ${theme.colors.border}`,
              borderRadius: theme.radii.sm
            }}
          />
        </div>
      )}
    </div>
  );
}

