/**
 * Drag and Drop Import Component
 * UI component for drag-and-drop ZIP file import
 */

'use client';

import React, { useState } from "react";
import { importProjectZip } from "./importProject";
import { isValidZip } from "./zipUtils";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface DragDropImportProps {
  onImportStart?: () => void;
  onImportComplete?: () => void;
  onImportError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

export function DragDropImport({
  onImportStart,
  onImportComplete,
  onImportError,
  className,
  style
}: DragDropImportProps) {
  const theme = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    // Check if it's a ZIP file
    if (!file.name.endsWith(".zip") && !file.name.endsWith(".wissil.zip")) {
      const error = new Error("Please drop a ZIP file (.zip or .wissil.zip)");
      onImportError?.(error);
      return;
    }

    // Validate ZIP
    const blob = file.slice(0, file.size, file.type);
    if (!(await isValidZip(blob))) {
      const error = new Error("Invalid ZIP file. Please provide a valid WISSIL project ZIP.");
      onImportError?.(error);
      return;
    }

    setIsImporting(true);
    onImportStart?.();

    try {
      await importProjectZip(file);
      onImportComplete?.();
    } catch (err: any) {
      console.error("Import error:", err);
      onImportError?.(err);
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    onImportStart?.();

    try {
      await importProjectZip(file);
      onImportComplete?.();
    } catch (err: any) {
      console.error("Import error:", err);
      onImportError?.(err);
    } finally {
      setIsImporting(false);
      // Reset input
      e.target.value = "";
    }
  };

  if (!isDragging && !isImporting) {
    return null;
  }

  return (
    <div
      className={className}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: isDragging ? `${theme.colors.accent}15` : `${theme.colors.bg0}E6`,
        border: `2px dashed ${isDragging ? theme.colors.accent : theme.colors.border}`,
        borderRadius: theme.radii.lg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontSize: theme.typography.size.lg,
        color: theme.colors.text1,
        backdropFilter: "blur(4px)",
        ...style
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        style={{
          textAlign: "center",
          padding: theme.spacing.xl,
          maxWidth: 400
        }}
      >
        {isImporting ? (
          <>
            <div
              style={{
                fontSize: 48,
                marginBottom: theme.spacing.md
              }}
            >
              ⏳
            </div>
            <div style={{ marginBottom: theme.spacing.sm, fontWeight: theme.typography.weight.semibold }}>
              Importing project...
            </div>
            <div
              style={{
                fontSize: theme.typography.size.sm,
                color: theme.colors.text2
              }}
            >
              Please wait
            </div>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 48,
                marginBottom: theme.spacing.md
              }}
            >
              📦
            </div>
            <div style={{ marginBottom: theme.spacing.sm, fontWeight: theme.typography.weight.semibold }}>
              Drop WISSIL project ZIP to import
            </div>
            <div
              style={{
                fontSize: theme.typography.size.sm,
                color: theme.colors.text2,
                marginBottom: theme.spacing.md
              }}
            >
              Or click to browse files
            </div>
            <input
              type="file"
              accept=".zip,.wissil.zip"
              onChange={handleFileInput}
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0,
                cursor: "pointer"
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}

