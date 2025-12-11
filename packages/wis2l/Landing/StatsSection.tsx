/**
 * StatsSection Component
 * Metrics, user counts, statistics
 */

'use client';

import React from "react";

export interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

const stats: Stat[] = [
  { value: "5,000+", label: "Active Developers" },
  { value: "50,000+", label: "Projects Created" },
  { value: "10M+", label: "Lines of Code Generated" },
  { value: "99.9%", label: "Uptime" }
];

export function StatsSection() {
  return (
    <section
      style={{
        padding: "60px 32px",
        background: "var(--nv-bg-0)",
        borderTop: "1px solid var(--nv-border)",
        borderBottom: "1px solid var(--nv-border)"
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          textAlign: "center"
        }}>
          {stats.map((stat, index) => (
            <div key={index}>
              <div style={{
                fontSize: "48px",
                fontWeight: 700,
                color: "var(--nv-accent)",
                marginBottom: 8,
                lineHeight: 1
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: "16px",
                color: "var(--nv-text-2)",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
