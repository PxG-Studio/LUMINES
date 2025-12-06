/**
 * SidebarNav Component
 * Nested navigation tree with highlight + expand/collapse
 */

'use client';

import React, { useState } from "react";
import { docTree, type DocNavSection, type DocNavItem } from "./nav/tree";
import { useWaypointState } from "./waypointState";
import { useTheme } from "@/design-system/themes/ThemeProvider";
import { ScrollArea } from "@/design-system/layouts/ScrollArea";

interface NavItemProps {
  item: DocNavItem;
  isActive: boolean;
  onClick: () => void;
}

function NavItem({ item, isActive, onClick }: NavItemProps) {
  const theme = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
        cursor: "pointer",
        borderRadius: theme.radii.sm,
        background: isActive ? `${theme.colors.accent}25` : "transparent",
        color: isActive ? theme.colors.text0 : theme.colors.text1,
        fontSize: theme.typography.size.sm,
        transition: "all 0.15s ease",
        marginBottom: theme.spacing.xs
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = theme.colors.bg2;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = "transparent";
        }
      }}
    >
      {item.label}
    </div>
  );
}

export interface SidebarNavProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SidebarNav({ className, style }: SidebarNavProps) {
  const theme = useTheme();
  const { currentDoc, setCurrentDoc } = useWaypointState();

  return (
    <div
      className={className}
      style={{
        width: 260,
        borderRight: `1px solid ${theme.colors.border}`,
        background: theme.colors.bg1,
        display: "flex",
        flexDirection: "column",
        ...style
      }}
    >
      <ScrollArea style={{ flex: 1, padding: theme.spacing.md }}>
        {docTree.map((section) => (
          <div key={section.label} style={{ marginBottom: theme.spacing.lg }}>
            <div
              style={{
                fontSize: theme.typography.size.xs,
                opacity: 0.5,
                marginBottom: theme.spacing.sm,
                textTransform: "uppercase",
                fontWeight: theme.typography.weight.semibold,
                letterSpacing: "0.5px",
                color: theme.colors.text2
              }}
            >
              {section.label}
            </div>
            {section.items.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                isActive={currentDoc === item.id}
                onClick={() => setCurrentDoc(item.id)}
              />
            ))}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}

