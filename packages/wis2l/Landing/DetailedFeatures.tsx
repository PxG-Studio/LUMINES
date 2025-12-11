/**
 * DetailedFeatures Component
 * Expanded feature explanations with icons and detailed descriptions
 */

'use client';

import React from "react";
import { Card } from "@/design-system/primitives/Card";
import { PlayIcon } from "@/design-system/icons/Play";
import { FolderIcon } from "@/design-system/icons/Folder";
import { FileIcon } from "@/design-system/icons/File";
import { Code, Zap, Globe, Shield, GitBranch, Rocket, Check } from "lucide-react";

export interface DetailedFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}

const detailedFeatures: DetailedFeature[] = [
  {
    icon: <Code size={32} />,
    title: "AI-Powered Code Generation",
    description: "Transform natural language into production-ready code with our advanced AI assistant.",
    benefits: [
      "Generate boilerplate instantly",
      "Context-aware suggestions",
      "Multi-language support",
      "Learn from your codebase"
    ]
  },
  {
    icon: <Zap size={32} />,
    title: "Instant Live Previews",
    description: "See your changes instantly with Vite-powered hot module replacement and the Ignition runtime.",
    benefits: [
      "Sub-100ms update cycles",
      "No page refresh needed",
      "Real-time collaboration",
      "Cross-browser testing"
    ]
  },
  {
    icon: <FolderIcon size={32} />,
    title: "Clean Project Management",
    description: "A minimal, intuitive file tree designed for speed and clarity. Built for indie creators and teams.",
    benefits: [
      "Zero clutter interface",
      "Fast file navigation",
      "Smart search and filtering",
      "Git integration built-in"
    ]
  },
  {
    icon: <Globe size={32} />,
    title: "Universal Runtime",
    description: "Run any code in your browser with WebContainer technology. Full NPM ecosystem support.",
    benefits: [
      "Browser-native execution",
      "No server required",
      "Full Node.js compatibility",
      "Instant deployment"
    ]
  },
  {
    icon: <Shield size={32} />,
    title: "Enterprise-Grade Security",
    description: "Your code and data are protected with industry-leading security measures and compliance.",
    benefits: [
      "End-to-end encryption",
      "SOC 2 compliant",
      "Regular security audits",
      "Private repositories"
    ]
  },
  {
    icon: <GitBranch size={32} />,
    title: "Seamless Git Integration",
    description: "Version control built-in. Push, pull, merge, and collaborate without leaving the platform.",
    benefits: [
      "One-click Git operations",
      "Visual diff viewer",
      "Branch management",
      "Pull request workflow"
    ]
  },
  {
    icon: <Rocket size={32} />,
    title: "One-Click Deployment",
    description: "Deploy to production in seconds. No configuration needed. Supports all major platforms.",
    benefits: [
      "Instant deployments",
      "Zero-downtime updates",
      "Auto-scaling",
      "CDN integration"
    ]
  },
  {
    icon: <FileIcon size={32} />,
    title: "Design Token System",
    description: "Manage design tokens centrally. Sync across all projects. Maintain consistency at scale.",
    benefits: [
      "Centralized token management",
      "Automatic synchronization",
      "Theme generation",
      "Design-Dev handoff"
    ]
  }
];

export function DetailedFeatures() {
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
            Everything You Need to Build Faster
          </h2>
          <p style={{
            fontSize: "18px",
            color: "var(--nv-text-1)",
            maxWidth: 600,
            margin: "0 auto"
          }}>
            A complete development environment with all the tools you need, all in one place.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "32px"
        }}>
          {detailedFeatures.map((feature, index) => (
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
                {feature.icon}
              </div>
              
              <h3 style={{
                fontSize: "24px",
                fontWeight: 600,
                color: "var(--nv-text-0)",
                marginBottom: 12,
                marginTop: 0
              }}>
                {feature.title}
              </h3>
              
              <p style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--nv-text-1)",
                marginBottom: 20,
                flex: 1
              }}>
                {feature.description}
              </p>
              
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0
              }}>
                {feature.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "16px", // Increased to 16px for better contrast ratio (3:1 instead of 4.5:1)
                      color: "#c7cdf5", // Explicit hex (--nv-text-1)
                      backgroundColor: "#111421", // Explicit dark background (--nv-bg-1)
                      marginBottom: 12,
                      paddingLeft: 0,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      lineHeight: 1.6
                    }}
                  >
                    <Check 
                      size={20}
                      style={{ 
                        color: "#ffffff", // Pure white for maximum contrast
                        backgroundColor: "#111421", // Explicit background
                        flexShrink: 0,
                        marginTop: "2px",
                        strokeWidth: 3, // Bolder stroke for better visibility
                        minWidth: "20px",
                        minHeight: "20px"
                      }}
                      aria-hidden="true"
                    />
                    <span style={{
                      color: "#c7cdf5", // Explicit hex (--nv-text-1)
                      backgroundColor: "#111421", // Explicit dark background (--nv-bg-1)
                      flex: 1,
                      fontSize: "16px", // Increased to 16px for better contrast ratio
                      lineHeight: 1.6,
                      fontWeight: 400
                    }}>
                      {benefit}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
