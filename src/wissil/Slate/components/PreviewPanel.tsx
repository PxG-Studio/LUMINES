/**
 * PreviewPanel Component
 * Where Ignis (Unity WebGL wrapper) will mount
 */

'use client';

import React from "react";
import { IgnisContainer } from "@/wissil/Ignis/IgnisContainer";

export interface PreviewPanelProps {
  className?: string;
  style?: React.CSSProperties;
}

export function PreviewPanel({ className, style }: PreviewPanelProps) {
  return (
    <IgnisContainer className={className} style={style} />
  );
}

