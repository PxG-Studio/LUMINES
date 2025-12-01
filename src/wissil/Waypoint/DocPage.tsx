/**
 * DocPage Component
 * MDX renderer for documentation pages using MDXRunner
 */

'use client';

import React from "react";
import { useWaypointState } from "./waypointState";
import { MDXRunner } from "./MDXRunner";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { ScrollArea } from "@/design-system/layouts/ScrollArea";

export interface DocPageProps {
  className?: string;
  style?: React.CSSProperties;
}

export function DocPage({ className, style }: DocPageProps) {
  const theme = useTheme();
  const currentDoc = useWaypointState((s) => s.currentDoc);

  // Convert old doc IDs to new format if needed
  const docId = currentDoc.includes('/') ? currentDoc : `intro/${currentDoc}`;

  return (
    <ScrollArea
      className={className}
      style={{
        width: "100%",
        height: "100%",
        ...style
      }}
    >
      <MDXRunner docId={docId} />
    </ScrollArea>
  );
}

