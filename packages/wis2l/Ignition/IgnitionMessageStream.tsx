/**
 * IgnitionMessageStream Component
 * Displays runtime messages/logs stream
 */

'use client';

import React, { useRef, useEffect } from "react";
import { useEditorState } from "@/state/editorState";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface IgnitionMessageStreamProps {
  className?: string;
  style?: React.CSSProperties;
}

export function IgnitionMessageStream({ className, style }: IgnitionMessageStreamProps) {
  const theme = useTheme();
  const msgs = useEditorState((s) => s.runtimeMessages);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [msgs]);

  return (
    <div
      ref={scrollRef}
      className={className}
      style={{
        padding: theme.spacing.sm,
        height: "100%",
        overflowY: "auto",
        overflowX: "hidden",
        ...style
      }}
    >
      {msgs.length === 0 && (
        <div
          style={{
            opacity: 0.7,
            color: theme.colors.text1,
            fontSize: theme.typography.size.sm
          }}
        >
          No runtime logs — run a program to begin.
        </div>
      )}

      {msgs.map((message, i) => (
        <pre
          key={i}
          style={{
            margin: 0,
            marginBottom: theme.spacing.xs,
            fontSize: theme.typography.size.sm,
            color: theme.colors.text1,
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word"
          }}
        >
          {message}
        </pre>
      ))}
    </div>
  );
}

