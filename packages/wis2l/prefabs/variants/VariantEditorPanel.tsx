/**
 * Variant Editor Panel
 * View inheritance chain, edit overrides, apply/revert
 */

'use client';

import React, { useState, useMemo } from "react";
import { useVariantRegistry } from "./VariantRegistry";
import { PrefabVariantResolver } from "./PrefabVariantResolver";
import { OverrideDiffEngine } from "./OverrideDiffEngine";
import { VariantHotReload } from "./VariantHotReload";
import { VariantCreator } from "./VariantCreator";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Card } from "@/design-system/primitives/Card";
import { Button } from "@/design-system/primitives/Button";
import { OverrideIndicator } from "./OverrideIndicator";
import { ChevronRight } from "@/design-system/icons/ChevronRight";

export interface VariantEditorPanelProps {
  variantId?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function VariantEditorPanel({
  variantId: propVariantId,
  className,
  style
}: VariantEditorPanelProps) {
  const theme = useTheme();
  const selected = useVariantRegistry((state) => state.selected);
  const variants = useVariantRegistry((state) => state.variants);
  const select = useVariantRegistry((state) => state.select);
  const getVariant = useVariantRegistry((state) => state.getVariant);
  const getVariantChain = useVariantRegistry((state) => state.getVariantChain);

  const variantId = propVariantId || selected;
  const variant = variantId ? getVariant(variantId) : null;

  const chain = useMemo(() => {
    if (!variantId) return null;
    const c = getVariantChain(variantId);
    c.resolved = PrefabVariantResolver.resolve(c);
    return c;
  }, [variantId, variants]);

  const overrides = useMemo(() => {
    if (!chain || !variant) return {};
    return variant.overrides;
  }, [chain, variant]);

  const handleApply = () => {
    if (!variantId) return;
    VariantHotReload.apply(variantId);
  };

  const handleRevert = () => {
    if (!variantId) return;
    VariantHotReload.revert(variantId);
  };

  const handleCreateVariant = () => {
    if (!variant) return;
    const newId = VariantCreator.createFromVariant(variantId!, `${variant.name} Copy`);
    select(newId);
  };

  if (!variant) {
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
        Select or create a prefab variant to edit
      </div>
    );
  }

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
      {/* Header */}
      <div
        style={{
          marginBottom: theme.spacing.md,
          paddingBottom: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.border}`
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: theme.spacing.sm
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
            {variant.name}
          </h3>
          <div style={{ display: "flex", gap: theme.spacing.xs }}>
            <Button variant="accent" onClick={handleApply} style={{ fontSize: theme.typography.size.xs }}>
              Apply
            </Button>
            <Button variant="ghost" onClick={handleRevert} style={{ fontSize: theme.typography.size.xs }}>
              Revert
            </Button>
          </div>
        </div>
      </div>

      {/* Inheritance Chain */}
      <Card style={{ padding: theme.spacing.md, marginBottom: theme.spacing.md }}>
        <h4
          style={{
            margin: 0,
            marginBottom: theme.spacing.sm,
            fontSize: theme.typography.size.sm,
            fontWeight: theme.typography.weight.semibold,
            color: theme.colors.text0
          }}
        >
          Inheritance Chain
        </h4>
        {chain && chain.variants.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: theme.spacing.xs }}>
            {chain.variants.map((v, i) => (
              <div
                key={v.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: theme.spacing.xs,
                  background: v.id === variantId ? theme.colors.bg2 : "transparent",
                  borderRadius: theme.radii.sm
                }}
              >
                {i < chain.variants.length - 1 && (
                  <ChevronRight size={16} style={{ marginRight: theme.spacing.xs, opacity: 0.5 }} />
                )}
                <span
                  style={{
                    fontSize: theme.typography.size.sm,
                    color: theme.colors.text0,
                    fontWeight: v.id === variantId ? theme.typography.weight.semibold : theme.typography.weight.regular
                  }}
                >
                  {v.name}
                </span>
                {v.id === variantId && Object.keys(v.overrides || {}).length > 0 && (
                  <span
                    style={{
                      marginLeft: theme.spacing.xs,
                      fontSize: theme.typography.size.xs,
                      color: theme.colors.text2
                    }}
                  >
                    ({Object.keys(v.overrides).length} overrides)
                  </span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: theme.spacing.sm,
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm
            }}
          >
            No inheritance chain found
          </div>
        )}
      </Card>

      {/* Overrides */}
      <Card style={{ padding: theme.spacing.md }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.sm
          }}
        >
          <h4
            style={{
              margin: 0,
              fontSize: theme.typography.size.sm,
              fontWeight: theme.typography.weight.semibold,
              color: theme.colors.text0
            }}
          >
            Overrides ({Object.keys(overrides).length})
          </h4>
          <Button
            variant="ghost"
            onClick={handleCreateVariant}
            style={{ fontSize: theme.typography.size.xs }}
          >
            Create Variant
          </Button>
        </div>
        {Object.keys(overrides).length > 0 ? (
          <div
            style={{
              maxHeight: 400,
              overflow: "auto",
              background: theme.colors.bg1,
              borderRadius: theme.radii.sm,
              padding: theme.spacing.sm
            }}
          >
            {Object.entries(overrides).map(([path, value]) => (
              <div
                key={path}
                style={{
                  padding: theme.spacing.xs,
                  marginBottom: theme.spacing.xs,
                  background: theme.colors.bg2,
                  borderRadius: theme.radii.sm,
                  fontSize: theme.typography.size.xs
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: theme.spacing.xs }}>
                  <span
                    style={{
                      fontFamily: "monospace",
                      color: theme.colors.text0,
                      fontWeight: theme.typography.weight.medium
                    }}
                  >
                    {path}
                  </span>
                  <OverrideIndicator isOverridden={true} variantId={variantId || undefined} />
                </div>
                <div
                  style={{
                    color: theme.colors.text2,
                    fontFamily: "monospace",
                    fontSize: theme.typography.size.xs,
                    wordBreak: "break-all"
                  }}
                >
                  {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: theme.spacing.sm,
              color: theme.colors.text2,
              fontSize: theme.typography.size.sm,
              textAlign: "center"
            }}
          >
            No overrides
          </div>
        )}
      </Card>
    </div>
  );
}

