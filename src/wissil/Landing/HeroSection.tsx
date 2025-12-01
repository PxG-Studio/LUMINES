/**
 * HeroSection Component
 * Main hero section for landing page
 */

'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/design-system/primitives/Button";

type HeroSectionProps = {
  /**
   * Optional callback used by Storybook to log navigation actions.
   * In the Next.js app this is typically undefined.
   */
  onNavigation?: (href: string, label: string) => void;
};

export function HeroSection({ onNavigation }: HeroSectionProps) {
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

    // In the real Next.js app, perform actual navigation
    if (router && isNextJs) {
      router.push(href);
    }
    // In Storybook (no Next.js router), we ONLY log and fire actions.
    // We intentionally do NOT change the current story so you stay on Canvas.
  };

  return (
    <div
      style={{
        padding: "100px 32px",
        textAlign: "center"
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "48px",
          fontWeight: 600,
          color: "var(--nv-text-0)"
        }}
      >
        Your Entire Creative Pipeline in One Workspace
      </h1>

      <p
        style={{
          marginTop: 20,
          maxWidth: 600,
          marginLeft: "auto",
          marginRight: "auto",
          fontSize: "18px",
          color: "var(--nv-text-0)",
          opacity: 0.9
        }}
      >
        Lumenforge.io unifies AI generation, design tokens, blueprint editing, live previews,
        and deployment into a single, high-velocity development environment built for modern teams.
      </p>

      <div style={{ marginTop: 40, display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        <Button
          style={{ fontSize: "16px", padding: "14px 28px" }}
          variant="accent"
          onClick={() => handleNavigation('/slate/ide', 'Start Coding')}
        >
          Start Coding
        </Button>
        <Button 
          style={{ fontSize: "16px", padding: "14px 28px" }}
          onClick={() => handleNavigation('/spark', 'Try AI Generator')}
        >
          Try AI Generator
        </Button>
      </div>
    </div>
  );
}

