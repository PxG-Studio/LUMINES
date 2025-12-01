/**
 * WaypointLayout Component
 * Full documentation browser layout
 */

'use client';

import React from "react";
import { SidebarNav } from "./SidebarNav";
import { DocPage } from "./DocPage";
import { Breadcrumbs } from "./Breadcrumbs";
import { SearchBar } from "./SearchBar";
import { useWaypointState } from "./waypointState";
import { useTheme } from "@/design-system/themes/ThemeProvider";

export interface WaypointLayoutProps {
  className?: string;
  style?: React.CSSProperties;
}

export function WaypointLayout({ className, style }: WaypointLayoutProps) {
  const theme = useTheme();
  const query = useWaypointState((s) => s.query);
  const setQuery = useWaypointState((s) => s.setQuery);

  return (
    <div
      className={className}
      style={{
        width: "100vw",
        height: "100vh",
        background: theme.colors.bg0,
        color: theme.colors.text0,
        display: "flex",
        overflow: "hidden",
        ...style
      }}
    >
      {/* Sidebar */}
      <SidebarNav />

      {/* Main docs area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div
          style={{
            padding: theme.spacing.lg,
            borderBottom: `1px solid ${theme.colors.border}`,
            background: theme.colors.bg1
          }}
        >
          <SearchBar query={query} setQuery={setQuery} />
          <Breadcrumbs />
        </div>

        <div style={{ flex: 1, overflow: "hidden" }}>
          <DocPage />
        </div>
      </div>
    </div>
  );
}

