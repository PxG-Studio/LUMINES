/**
 * SparkLayout Component
 * Main layout for the Spark template gallery
 */

'use client';

import React from "react";
import { TemplateGrid } from "./TemplateGrid";
import { QuickActionsBar } from "./QuickActionsBar";
import { getAllTemplates } from "./loader/sparkActions";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface SparkLayoutProps {
  onTemplateSelect?: (id: string, template: any) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function SparkLayout({ onTemplateSelect, className, style }: SparkLayoutProps) {
  const theme = useTheme();

  function handleTemplateSelect(id: string) {
    const templates = getAllTemplates();
    const template = templates.find((t) => t.id === id);
    
    if (!template) {
      console.warn(`Template "${id}" not found`);
      return;
    }

    // Load template using sparkActions
    if (onTemplateSelect) {
      onTemplateSelect(id, template);
    } else {
      // Default: use sparkActions to load template
      import("./loader/sparkActions").then(({ startTemplateById }) => {
        startTemplateById(id);
      });
    }
  }

  return (
    <div
      className={className}
      style={{
        minHeight: "100vh",
        width: "100%",
        background: theme.colors.bg0,
        color: theme.colors.text0,
        padding: `${theme.spacing.xl * 2}px ${theme.spacing.xl}`,
        ...style
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "36px",
          fontWeight: theme.typography.weight.semibold,
          color: theme.colors.text0
        }}
      >
        Starter Templates
      </h1>

      <p
        style={{
          color: theme.colors.text2,
          marginTop: theme.spacing.md,
          fontSize: theme.typography.size.md,
          maxWidth: "600px"
        }}
      >
        Choose a starting point. Spark lets you bootstrap a working environment instantly.
      </p>

      <QuickActionsBar />

      <TemplateGrid onSelect={handleTemplateSelect} />
    </div>
  );
}

