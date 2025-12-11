/**
 * MDX Runner Component
 * Loads, compiles, and renders MDX documentation
 */

'use client';

import React, { useEffect, useState } from "react";
import { compileMDX } from "./mdx/mdxCompiler";
import { mdxComponents } from "./mdx/mdxComponents";
import docsDb from "./docsDb";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface MDXRunnerProps {
  docId: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MDXRunner({ docId, className, style }: MDXRunnerProps) {
  const theme = useTheme();
  const [Component, setComponent] = useState<React.ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      setComponent(null);

      try {
        const source = docsDb[docId];
        if (!source) {
          throw new Error(`Documentation not found: ${docId}`);
        }

        const compiled = await compileMDX(source);
        if (!compiled || !compiled.default) {
          throw new Error("Failed to compile MDX: no default export");
        }

        setComponent(() => compiled.default);
      } catch (err: any) {
        console.error("MDX compilation error:", err);
        setError(err?.message || String(err));
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [docId]);

  if (loading) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.xl,
          color: theme.colors.text2,
          textAlign: "center",
          ...style
        }}
      >
        Loading documentation...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.xl,
          color: theme.colors.error,
          ...style
        }}
      >
        <h2>Error loading documentation</h2>
        <pre style={{ marginTop: theme.spacing.md, whiteSpace: "pre-wrap" }}>
          {error}
        </pre>
      </div>
    );
  }

  if (!Component) {
    return (
      <div
        className={className}
        style={{
          padding: theme.spacing.xl,
          color: theme.colors.text2,
          ...style
        }}
      >
        No content available
      </div>
    );
  }

  return (
    <div
      className={className}
      style={{
        padding: theme.spacing.xl,
        maxWidth: 900,
        margin: "0 auto",
        ...style
      }}
    >
      <Component components={mdxComponents} />
    </div>
  );
}

