/**
 * Texture Inspector Component
 * Displays texture preview and metadata
 */

'use client';

import React, { useState } from "react";
import { useWissilFS } from "@/wis2l/runtime/fs/wissilFs";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface TextureInspectorProps {
  filePath: string;
  className?: string;
  style?: React.CSSProperties;
}

export function TextureInspector({ filePath, className, style }: TextureInspectorProps) {
  const theme = useTheme();
  const fs = useWissilFS.getState();
  const [imageError, setImageError] = useState(false);

  // Try to get image data from filesystem
  // For binary images, we'd need to convert base64 or use blob URLs
  // For now, we'll try to create a data URL if it's base64 encoded
  const imageContent = fs.readFile(filePath);
  
  let imageUrl: string | null = null;
  
  if (imageContent) {
    // Check if it's a data URL
    if (imageContent.startsWith("data:image")) {
      imageUrl = imageContent;
    } else if (imageContent.startsWith("http://") || imageContent.startsWith("https://")) {
      imageUrl = imageContent;
    } else {
      // Try to create data URL from base64 or raw content
      // This is a simplified approach - in production you'd handle binary properly
      try {
        // If content looks like base64, try to decode
        if (/^[A-Za-z0-9+/=]+$/.test(imageContent.trim())) {
          imageUrl = `data:image/png;base64,${imageContent}`;
        }
      } catch {
        // Fallback
      }
    }
  }

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
        Texture Preview
      </h2>

      <div
        style={{
          marginBottom: theme.spacing.md,
          padding: theme.spacing.sm,
          background: theme.colors.bg1,
          borderRadius: theme.radii.md,
          border: `1px solid ${theme.colors.border}`,
          fontSize: theme.typography.size.sm,
          color: theme.colors.text2
        }}
      >
        <strong>Path:</strong> {filePath}
      </div>

      {imageUrl && !imageError ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: theme.spacing.md,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          <img
            src={imageUrl}
            alt={filePath}
            style={{
              maxWidth: "100%",
              maxHeight: "400px",
              borderRadius: theme.radii.sm,
              border: `1px solid ${theme.colors.border}`
            }}
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div
          style={{
            padding: theme.spacing.xl,
            textAlign: "center",
            color: theme.colors.text2,
            background: theme.colors.bg1,
            borderRadius: theme.radii.md,
            border: `1px solid ${theme.colors.border}`
          }}
        >
          {imageError
            ? "Failed to load texture preview"
            : "Texture preview not available (binary file or unsupported format)"}
        </div>
      )}
    </div>
  );
}

