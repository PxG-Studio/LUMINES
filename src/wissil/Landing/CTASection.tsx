/**
 * CTASection Component
 * Call-to-action sections for mid-page and end-of-page
 */

'use client';

import React from "react";
import { Button } from "@/design-system/primitives/Button";

interface CTASectionProps {
  variant?: "default" | "accent";
  title: string;
  description: string;
  primaryCTA: string;
  primaryLink: string;
  secondaryCTA?: string;
  secondaryLink?: string;
}

export function CTASection({
  variant = "default",
  title,
  description,
  primaryCTA,
  primaryLink,
  secondaryCTA,
  secondaryLink
}: CTASectionProps) {
  const isAccent = variant === "accent";
  
  return (
    <section
      style={{
        padding: "80px 32px",
        background: isAccent ? "var(--nv-bg-1)" : "var(--nv-bg-0)",
        textAlign: "center"
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <h2 style={{
          fontSize: "40px",
          fontWeight: 600,
          color: "var(--nv-text-0)",
          marginBottom: 16
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: "18px",
          color: "var(--nv-text-1)",
          marginBottom: 40,
          lineHeight: 1.6
        }}>
          {description}
        </p>
        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <Button
            variant={isAccent ? "accent" : "default"}
            onClick={() => window.open(primaryLink, '_blank')}
            style={{ fontSize: "16px", padding: "14px 28px" }}
          >
            {primaryCTA}
          </Button>
          {secondaryCTA && secondaryLink && (
            <Button
              variant="ghost"
              onClick={() => window.open(secondaryLink, '_blank')}
              style={{ fontSize: "16px", padding: "14px 28px" }}
            >
              {secondaryCTA}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
