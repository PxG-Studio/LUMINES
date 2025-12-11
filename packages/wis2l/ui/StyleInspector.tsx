/**
 * Style Inspector
 * Colors, text, fonts, images
 */

'use client';

import React from "react";
import { useCanvasStore } from "./CanvasStore";
import { CanvasPatcher } from "./CanvasPatcher";
import { UIStyle } from "./UITypes";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";

export interface StyleInspectorProps {
  className?: string;
  style?: React.CSSProperties;
}

export function StyleInspector({ className, style }: StyleInspectorProps) {
  const theme = useTheme();
  const selected = useCanvasStore((state) => state.selected);
  const styles = useCanvasStore((state) => state.styles);
  const setStyle = useCanvasStore((state) => state.setStyle);

  const currentStyle = selected ? styles[selected] || {} : null;

  if (!selected) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.md,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          textAlign: "center",
          ...style
        }}
      >
        Select a UI element to edit style
      </div>
    );
  }

  const handleUpdateStyle = (field: string, value: any) => {
    const updated = { ...currentStyle, [field]: value };
    setStyle(selected, updated);
    CanvasPatcher.updateStyle(selected, { [field]: value });
  };

  return (
    <div
      className={className}
      style={{
        height: "100%",
        overflow: "auto",
        padding: theme.spacing.md,
        background: theme.colors.bg0,
        ...style
      }}
    >
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <h3
          style={{
            margin: 0,
            marginBottom: theme.spacing.md,
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Style
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.md }}>
          {/* Background Color */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0,
                marginBottom: theme.spacing.xs
              }}
            >
              Background Color
            </label>
            <input
              type="color"
              value={currentStyle?.backgroundColor || "#000000"}
              onChange={(e) => handleUpdateStyle("backgroundColor", e.target.value)}
              style={{
                width: "100%",
                height: 40,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                cursor: "pointer"
              }}
            />
          </div>

          {/* Text Color */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0,
                marginBottom: theme.spacing.xs
              }}
            >
              Text Color
            </label>
            <input
              type="color"
              value={currentStyle?.textColor || "#ffffff"}
              onChange={(e) => handleUpdateStyle("textColor", e.target.value)}
              style={{
                width: "100%",
                height: 40,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                cursor: "pointer"
              }}
            />
          </div>

          {/* Font Size */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0,
                marginBottom: theme.spacing.xs
              }}
            >
              Font Size
            </label>
            <input
              type="number"
              value={currentStyle?.fontSize || 14}
              onChange={(e) => handleUpdateStyle("fontSize", parseInt(e.target.value) || 14)}
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

          {/* Font Family */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0,
                marginBottom: theme.spacing.xs
              }}
            >
              Font Family
            </label>
            <select
              value={currentStyle?.fontFamily || "Arial"}
              onChange={(e) => handleUpdateStyle("fontFamily", e.target.value)}
              style={{
                width: "100%",
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                background: theme.colors.bg2,
                border: `1px solid ${theme.colors.border}`,
                borderRadius: theme.radii.sm,
                color: theme.colors.text0,
                fontSize: theme.typography.size.sm
              }}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>

          {/* Border Width */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: theme.typography.size.sm,
                fontWeight: theme.typography.weight.medium,
                color: theme.colors.text0,
                marginBottom: theme.spacing.xs
              }}
            >
              Border Width
            </label>
            <input
              type="number"
              min={0}
              value={currentStyle?.borderWidth || 0}
              onChange={(e) => handleUpdateStyle("borderWidth", parseFloat(e.target.value) || 0)}
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

          {/* Border Color */}
          {currentStyle?.borderWidth && currentStyle.borderWidth > 0 && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: theme.typography.size.sm,
                  fontWeight: theme.typography.weight.medium,
                  color: theme.colors.text0,
                  marginBottom: theme.spacing.xs
                }}
              >
                Border Color
              </label>
              <input
                type="color"
                value={currentStyle?.borderColor || "#ffffff"}
                onChange={(e) => handleUpdateStyle("borderColor", e.target.value)}
                style={{
                  width: "100%",
                  height: 40,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.radii.sm,
                  cursor: "pointer"
                }}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

