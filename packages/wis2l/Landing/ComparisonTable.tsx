/**
 * ComparisonTable Component
 * vs. Bolt.new, StackBlitz, CodeSandbox
 */

'use client';

import React from "react";
import { Card } from "@/design-system/primitives/Card";
import { Check, X } from "lucide-react";

interface ComparisonFeature {
  feature: string;
  lumenforge: boolean | string;
  bolt: boolean | string;
  stackblitz: boolean | string;
  codesandbox: boolean | string;
}

const features: ComparisonFeature[] = [
  { feature: "Browser-based IDE", lumenforge: true, bolt: true, stackblitz: true, codesandbox: true },
  { feature: "AI Code Generation", lumenforge: true, bolt: "Limited", stackblitz: false, codesandbox: false },
  { feature: "Design Token Management", lumenforge: true, bolt: false, stackblitz: false, codesandbox: false },
  { feature: "Blueprint Editor", lumenforge: true, bolt: false, stackblitz: false, codesandbox: false },
  { feature: "Unity Integration", lumenforge: true, bolt: false, stackblitz: false, codesandbox: false },
  { feature: "Game Development", lumenforge: true, bolt: false, stackblitz: false, codesandbox: false },
  { feature: "One-Click Deployment", lumenforge: true, bolt: true, stackblitz: "Manual", codesandbox: true },
  { feature: "Private Repositories", lumenforge: true, bolt: "Paid", stackblitz: "Paid", codesandbox: "Paid" },
  { feature: "Real-time Collaboration", lumenforge: true, bolt: true, stackblitz: true, codesandbox: true },
  { feature: "NPM Ecosystem", lumenforge: true, bolt: true, stackblitz: true, codesandbox: true }
];

export function ComparisonTable() {
  const renderValue = (value: boolean | string) => {
    if (value === true) {
      return <Check size={20} style={{ 
        color: "var(--nv-text-0)", // Changed to white for better contrast (was --nv-accent)
        backgroundColor: "var(--nv-bg-0)",
        strokeWidth: 2.5 // Make checkmark bolder
      }} />;
    }
    if (value === false) {
      return <X size={20} style={{ 
        color: "var(--nv-text-1)", // Changed from --nv-text-3 for better contrast
        backgroundColor: "var(--nv-bg-0)",
        strokeWidth: 2.5 // Make X bolder
      }} />;
    }
    return <span style={{ 
      fontSize: "14px", 
      color: "var(--nv-text-1)", // Changed from --nv-text-2 for better contrast
      backgroundColor: "var(--nv-bg-0)" // Explicit background
    }}>{value}</span>;
  };

  return (
    <section
      style={{
        padding: "80px 32px",
        background: "var(--nv-bg-1)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <h2 style={{
            fontSize: "40px",
            fontWeight: 600,
            color: "var(--nv-text-0)",
            marginBottom: 16
          }}>
            Compare to Alternatives
          </h2>
          <p style={{
            fontSize: "18px",
            color: "var(--nv-text-1)",
            maxWidth: 600,
            margin: "0 auto"
          }}>
            See how Lumenforge.io stacks up against the competition
          </p>
        </div>

        <Card style={{
          padding: 0,
          background: "var(--nv-bg-0)",
          border: "1px solid var(--nv-border)",
          overflow: "hidden"
        }}>
          <div
            style={{ overflowX: "auto" }}
            tabIndex={0}
            role="region"
            aria-label="Feature comparison table (horizontally scrollable). Use arrow keys to scroll."
          >
            <table style={{
              width: "100%",
              borderCollapse: "collapse"
            }}>
              <thead>
                <tr style={{
                  background: "var(--nv-bg-1)",
                  borderBottom: "2px solid var(--nv-border)"
                }}>
                  <th style={{
                    padding: "20px",
                    textAlign: "left",
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--nv-text-2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                  }}>
                    Feature
                  </th>
                  <th style={{
                    padding: "20px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--nv-accent)"
                  }}>
                    Lumenforge.io
                  </th>
                  <th style={{
                    padding: "20px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--nv-text-0)"
                  }}>
                    Bolt.new
                  </th>
                  <th style={{
                    padding: "20px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--nv-text-0)"
                  }}>
                    StackBlitz
                  </th>
                  <th style={{
                    padding: "20px",
                    textAlign: "center",
                    fontSize: "16px",
                    fontWeight: 600,
                    color: "var(--nv-text-0)"
                  }}>
                    CodeSandbox
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((row, index) => (
                  <tr
                    key={index}
                    style={{
                      borderBottom: "1px solid var(--nv-border)",
                      background: index % 2 === 0 ? "var(--nv-bg-0)" : "transparent"
                    }}
                  >
                    <td style={{
                      padding: "20px",
                      fontSize: "16px",
                      color: "var(--nv-text-0)",
                      fontWeight: 500
                    }}>
                      {row.feature}
                    </td>
                    <td style={{
                      padding: "20px",
                      textAlign: "center"
                    }}>
                      {renderValue(row.lumenforge)}
                    </td>
                    <td style={{
                      padding: "20px",
                      textAlign: "center"
                    }}>
                      {renderValue(row.bolt)}
                    </td>
                    <td style={{
                      padding: "20px",
                      textAlign: "center"
                    }}>
                      {renderValue(row.stackblitz)}
                    </td>
                    <td style={{
                      padding: "20px",
                      textAlign: "center"
                    }}>
                      {renderValue(row.codesandbox)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </section>
  );
}
