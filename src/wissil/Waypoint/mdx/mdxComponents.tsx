/**
 * MDX Custom Components
 * Custom components used inside documentation MDX files
 */

'use client';

import React from "react";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { LiveExample } from "./LiveExample";

export interface MDXComponentProps {
  children?: React.ReactNode;
  [key: string]: any;
}

export const mdxComponents = {
  h1: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <h1
        style={{
          marginTop: 32,
          marginBottom: 16,
          fontSize: 28,
          fontWeight: 600,
          color: theme.colors.text0
        }}
        {...props}
      />
    );
  },

  h2: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <h2
        style={{
          marginTop: 24,
          marginBottom: 12,
          fontSize: 22,
          fontWeight: 600,
          color: theme.colors.text0
        }}
        {...props}
      />
    );
  },

  h3: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <h3
        style={{
          marginTop: 18,
          marginBottom: 8,
          fontSize: 18,
          fontWeight: 600,
          color: theme.colors.text0
        }}
        {...props}
      />
    );
  },

  p: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <p
        style={{
          lineHeight: 1.6,
          marginBottom: 12,
          color: theme.colors.text1
        }}
        {...props}
      />
    );
  },

  code: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <code
        style={{
          background: theme.colors.bg2,
          padding: "2px 6px",
          borderRadius: theme.radii.sm,
          fontSize: "0.9em",
          fontFamily: "monospace",
          color: theme.colors.text1
        }}
        {...props}
      />
    );
  },

  pre: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <pre
        style={{
          background: theme.colors.bg2,
          padding: theme.spacing.md,
          borderRadius: theme.radii.md,
          overflowX: "auto",
          marginBottom: 16,
          border: `1px solid ${theme.colors.border}`
        }}
        {...props}
      />
    );
  },

  ul: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <ul
        style={{
          marginLeft: 20,
          marginBottom: 12,
          color: theme.colors.text1
        }}
        {...props}
      />
    );
  },

  ol: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <ol
        style={{
          marginLeft: 20,
          marginBottom: 12,
          color: theme.colors.text1
        }}
        {...props}
      />
    );
  },

  li: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <li
        style={{
          marginBottom: 4,
          color: theme.colors.text1
        }}
        {...props}
      />
    );
  },

  blockquote: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <blockquote
        style={{
          borderLeft: `4px solid ${theme.colors.border}`,
          paddingLeft: theme.spacing.md,
          marginLeft: 0,
          marginBottom: 12,
          opacity: 0.8
        }}
        {...props}
      />
    );
  },

  Note: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <div
        style={{
          background: theme.colors.bg2,
          padding: theme.spacing.md,
          borderLeft: `4px solid ${theme.colors.accent}`,
          borderRadius: theme.radii.sm,
          marginBottom: 16
        }}
        {...props}
      />
    );
  },

  Tip: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <div
        style={{
          background: theme.colors.bg2,
          padding: theme.spacing.md,
          borderLeft: `4px solid ${theme.colors.success}`,
          borderRadius: theme.radii.sm,
          marginBottom: 16
        }}
        {...props}
      />
    );
  },

  Warning: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <div
        style={{
          background: theme.colors.bg2,
          padding: theme.spacing.md,
          borderLeft: `4px solid ${theme.colors.warning}`,
          borderRadius: theme.radii.sm,
          marginBottom: 16
        }}
        {...props}
      />
    );
  },

  a: (props: MDXComponentProps) => {
    const theme = useTheme();
    return (
      <a
        style={{
          color: theme.colors.accent,
          textDecoration: "none"
        }}
        {...props}
      />
    );
  },

  LiveExample: (props: MDXComponentProps) => {
    return <LiveExample {...props} />;
  }
};

