/**
 * TemplateCard Component
 * Individual template card for the template gallery
 */

'use client';

import React from "react";
import { Card } from "@/design-system/primitives/Card";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface TemplateCardProps {
  icon: string;
  name: string;
  description: string;
  onSelect: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function TemplateCard({
  icon,
  name,
  description,
  onSelect,
  className,
  style
}: TemplateCardProps) {
  const theme = useTheme();

  return (
    <Card
      className={className}
      style={{
        cursor: "pointer",
        transition: "all 0.15s ease",
        background: theme.colors.bg1,
        padding: theme.spacing.lg,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...style
      }}
      onClick={onSelect}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = theme.shadows.strong;
        e.currentTarget.style.borderColor = theme.colors.accent;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = theme.shadows.subtle;
        e.currentTarget.style.borderColor = theme.colors.border;
      }}
    >
      <div
        style={{
          fontSize: 32,
          marginBottom: theme.spacing.md,
          lineHeight: 1
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          margin: 0,
          fontSize: theme.typography.size.lg,
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0,
          marginBottom: theme.spacing.sm
        }}
      >
        {name}
      </h3>
      <p
        style={{
          margin: 0,
          marginTop: theme.spacing.xs,
          color: theme.colors.text2,
          fontSize: theme.typography.size.sm,
          lineHeight: 1.6,
          flex: 1
        }}
      >
        {description}
      </p>
    </Card>
  );
}

