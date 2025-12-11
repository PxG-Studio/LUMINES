/**
 * UseCasesSection Component
 * Perfect for, industry-specific solutions, use case scenarios
 */

'use client';

import React from "react";
import { Card } from "@/design-system/primitives/Card";
import { Gamepad2, Globe, Code2, Paintbrush, Rocket, Users } from "lucide-react";

export interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
  industries: string[];
}

const useCases: UseCase[] = [
  {
    icon: <Gamepad2 size={32} />,
    title: "Game Development",
    description: "Build games faster with Unity integration, visual scripting, and real-time previews.",
    industries: ["Indie Game Studios", "Game Publishers", "VR/AR Developers"]
  },
  {
    icon: <Globe size={32} />,
    title: "Web Applications",
    description: "Create modern web apps with React, Next.js, Vue, and instant deployment.",
    industries: ["SaaS Companies", "Agencies", "Startups"]
  },
  {
    icon: <Code2 size={32} />,
    title: "Open Source Projects",
    description: "Collaborate on open source with built-in Git, code review, and community tools.",
    industries: ["OSS Maintainers", "Developer Communities", "Contributors"]
  },
  {
    icon: <Paintbrush size={32} />,
    title: "Design Systems",
    description: "Build and maintain design systems with token management and component libraries.",
    industries: ["Design Teams", "Product Teams", "Agencies"]
  },
  {
    icon: <Rocket size={32} />,
    title: "Rapid Prototyping",
    description: "Go from idea to prototype in minutes with AI assistance and pre-built templates.",
    industries: ["Product Teams", "Founders", "Innovation Labs"]
  },
  {
    icon: <Users size={32} />,
    title: "Team Collaboration",
    description: "Work together seamlessly with real-time collaboration and shared workspaces.",
    industries: ["Development Teams", "Remote Teams", "Cross-functional Teams"]
  }
];

export function UseCasesSection() {
  return (
    <section
      style={{
        padding: "80px 32px",
        background: "var(--nv-bg-0)",
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
            Perfect for Teams Like Yours
          </h2>
          <p style={{
            fontSize: "18px",
            color: "var(--nv-text-1)",
            maxWidth: 600,
            margin: "0 auto"
          }}>
            Whether you're building games, web apps, or design systems, Lumenforge.io adapts to your workflow.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "32px"
        }}>
          {useCases.map((useCase, index) => (
            <Card
              key={index}
              style={{
                padding: "32px",
                background: "var(--nv-bg-1)",
                border: "1px solid var(--nv-border)",
                height: "100%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div style={{
                color: "var(--nv-accent)",
                marginBottom: 20
              }}>
                {useCase.icon}
              </div>
              
              <h3 style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "var(--nv-text-0)",
                marginBottom: 12,
                marginTop: 0
              }}>
                {useCase.title}
              </h3>
              
              <p style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--nv-text-1)",
                marginBottom: 24,
                flex: 1
              }}>
                {useCase.description}
              </p>
              
              <div>
                <p style={{
                  fontSize: "12px",
                  color: "var(--nv-text-1)", // Changed from --nv-text-2 for better contrast
                  backgroundColor: "var(--nv-bg-1)", // Explicit background
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  marginBottom: 12
                }}>
                  Perfect for:
                </p>
                <div style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px"
                }}>
                  {useCase.industries.map((industry, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: "14px",
                        color: "var(--nv-text-1)", // Changed from --nv-text-2 for better contrast
                        padding: "4px 12px",
                        background: "var(--nv-bg-0)",
                        backgroundColor: "var(--nv-bg-0)", // Explicit background
                        borderRadius: "12px",
                        border: "1px solid var(--nv-border)"
                      }}
                    >
                      {industry}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
