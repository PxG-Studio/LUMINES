/**
 * IgnitionProvider Component
 * UI-only wrapper that renders error overlay + children
 * In Phase 4, will add WebSocket bridge, HMR events, and runtime injection
 */

'use client';

import React from "react";
import { IgnitionErrorOverlay } from "./IgnitionErrorOverlay";

export interface IgnitionProviderProps {
  children: React.ReactNode;
}

export function IgnitionProvider({ children }: IgnitionProviderProps) {
  return (
    <>
      {children}
      <IgnitionErrorOverlay />
    </>
  );
}

