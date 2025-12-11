/**
 * FeatureCard Component
 * Individual feature card for FeatureGrid
 */

'use client';

import React from "react";

export interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  text: string;
}

export function FeatureCard({ icon, title, text }: FeatureCardProps) {
  // Use explicit hex color for A11y tool background detection
  // --nv-bg-1: #111421 (dark blue-gray background)
  const cardBackgroundColor = "#111421";
  const borderColor = "#1f2334"; // --nv-border

  return (
    <article
      role="article"
      style={{
        padding: "32px",
        height: "100%",
        width: "100%",
        background: cardBackgroundColor,
        backgroundColor: cardBackgroundColor,
        border: `1px solid ${borderColor}`,
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
        contain: "layout style paint", // Isolate this card to prevent overlap detection
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        margin: 0,
        isolation: "isolate", // Create new stacking context
      }}
    >
      <div 
        style={{ 
          fontSize: 32, 
          marginBottom: 16, 
          color: "var(--nv-accent)",
          backgroundColor: cardBackgroundColor,
        }}
      >
        {icon}
      </div>
      <h2 
        style={{ 
          margin: 0, 
          fontSize: 20, 
          fontWeight: 600, 
          color: "#ffffff",
          backgroundColor: cardBackgroundColor,
          padding: 0,
          display: "block",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {title}
      </h2>
      <p 
        style={{ 
          marginTop: 12, 
          color: "rgba(255, 255, 255, 0.85)",
          backgroundColor: cardBackgroundColor,
          padding: 0,
          margin: "12px 0 0 0",
          display: "block",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {text}
      </p>
    </article>
  );
}

