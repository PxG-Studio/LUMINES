/**
 * TemplateGrid Component
 * Responsive grid layout for template cards
 */

'use client';

import React from "react";
import { TemplateCard } from "./TemplateCard";
import { getAllTemplates } from "./loader/sparkActions";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface TemplateGridProps {
  onSelect: (id: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function TemplateGrid({ onSelect, className, style }: TemplateGridProps) {
  const theme = useTheme();
  const templates = getAllTemplates();

  return (
    <div
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: theme.spacing.xl,
        paddingTop: theme.spacing.lg,
        ...style
      }}
    >
      {templates.map((t) => (
        <TemplateCard
          key={t.id}
          icon={t.icon || "📄"}
          name={t.label}
          description={t.description}
          onSelect={() => onSelect(t.id)}
        />
      ))}
    </div>
  );
}

