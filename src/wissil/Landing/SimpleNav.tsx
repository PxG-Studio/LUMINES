/**
 * SimpleNav Component
 * Clean, minimal navigation for landing page
 */

'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/design-system/primitives/Button";

type SimpleNavProps = {
  /**
   * Optional callback used by Storybook to log navigation actions.
   * In the Next.js app this is typically undefined.
   */
  onNavigation?: (href: string, label: string) => void;
};

export function SimpleNav({ onNavigation }: SimpleNavProps) {
  // Check if we're in Next.js context (not Storybook)
  const isNextJs = typeof window !== 'undefined' && (window as any).__NEXT_DATA__;
  let router: ReturnType<typeof useRouter> | null = null;
  
  try {
    if (isNextJs) {
      router = useRouter();
    }
  } catch (e) {
    // Not in Next.js context (Storybook)
    router = null;
  }

  const handleNavigation = (href: string, label: string) => {
    console.log(`Button clicked - navigating to: ${href}`);

    // Notify Storybook / parent components about navigation intent
    if (onNavigation) {
      onNavigation(href, label);
    }

    // In Next.js app, use router for real navigation
    if (router && isNextJs) {
      router.push(href);
    }
    // In Storybook (no Next.js router), we ONLY log and fire actions.
    // We intentionally do NOT change the current story so you stay on Canvas.
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "20px 32px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom: "1px solid var(--nv-border)"
      }}
    >
      <Link href="/landing" style={{ fontSize: 20, fontWeight: 600, textDecoration: "none", color: "var(--nv-text-0)" }}>
        Lumenforge.io
      </Link>

      <div style={{ display: "flex", gap: 16 }}>
        <Button 
          variant="ghost" 
          onClick={() => handleNavigation('/waypoint', 'Docs')}
        >
          Docs
        </Button>
        <Button 
          variant="accent" 
          onClick={() => handleNavigation('/slate/ide', 'Open Editor')}
        >
          Open Editor
        </Button>
      </div>
    </div>
  );
}

