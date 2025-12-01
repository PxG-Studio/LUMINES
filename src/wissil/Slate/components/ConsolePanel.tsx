/**
 * ConsolePanel Component
 * Console log viewer with auto-scroll
 */

'use client';

import React from "react";
import { IgnitionMessageStream } from "@/wissil/Ignition/IgnitionMessageStream";

export interface ConsolePanelProps {
  logs?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export function ConsolePanel({ logs, className, style }: ConsolePanelProps) {
  // Use IgnitionMessageStream which has auto-scroll built-in
  // It will use runtimeMessages from editorState
  return (
    <IgnitionMessageStream className={className} style={style} />
  );
}

