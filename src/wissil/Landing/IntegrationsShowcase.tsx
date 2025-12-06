/**
 * IntegrationsShowcase Component
 * Works with logos, integration list
 */

'use client';

import React from "react";

const integrations = [
  "GitHub",
  "GitLab",
  "Unity",
  "Vercel",
  "Netlify",
  "AWS",
  "Figma",
  "Notion"
];

export function IntegrationsShowcase() {
  return (
    <section
      style={{
        padding: "60px 32px",
        background: "var(--nv-bg-0)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{
            fontSize: "14px",
            color: "var(--nv-text-2)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            marginBottom: 24
          }}>
            Works with your favorite tools
          </p>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            gap: "48px",
            opacity: 0.7
          }}>
            {integrations.map((integration, index) => (
              <div
                key={index}
                style={{
                  fontSize: "18px",
                  fontWeight: 500,
                  color: "var(--nv-text-1)"
                }}
              >
                {integration}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
