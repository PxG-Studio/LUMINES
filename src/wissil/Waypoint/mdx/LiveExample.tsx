/**
 * Live Example Component
 * Runnable code examples inside MDX documentation
 */

'use client';

import React, { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { IgnitionController } from "@/wissil/runtime/projects/ignitionController";
import { useWissilFS } from "@/wissil/runtime/fs/wissilFs";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { Button } from "@/design-system/primitives/Button";

export interface LiveExampleProps {
  code: string;
  language?: string;
  height?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function LiveExample({
  code,
  language = "typescript",
  height = "200px",
  className,
  style
}: LiveExampleProps) {
  const theme = useTheme();
  const fs = useWissilFS.getState();
  const [value, setValue] = useState(code || "");
  const [running, setRunning] = useState(false);

  // Write initial code to FS
  useEffect(() => {
    if (value) {
      fs.writeFile("playground.ts", value);
    }
  }, []);

  const handleRun = async () => {
    setRunning(true);
    try {
      fs.writeFile("playground.ts", value);
      await IgnitionController.run("playground.ts");
    } catch (err) {
      console.error("Live example error:", err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div
      className={className}
      style={{
        border: `1px solid ${theme.colors.border}`,
        borderRadius: theme.radii.md,
        overflow: "hidden",
        marginBottom: theme.spacing.lg,
        ...style
      }}
    >
      <div
        style={{
          background: theme.colors.bg2,
          padding: theme.spacing.sm,
          borderBottom: `1px solid ${theme.colors.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}
      >
        <span
          style={{
            fontSize: theme.typography.size.sm,
            color: theme.colors.text2,
            textTransform: "uppercase"
          }}
        >
          Live Example
        </span>
        <Button
          variant="accent"
          onClick={handleRun}
          disabled={running}
          style={{ padding: "4px 12px", fontSize: theme.typography.size.sm }}
        >
          {running ? "Running..." : "Run"}
        </Button>
      </div>
      <Editor
        height={height}
        defaultLanguage={language}
        value={value}
        onChange={(v) => setValue(v ?? "")}
        theme="nocturna-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false
        }}
      />
    </div>
  );
}

