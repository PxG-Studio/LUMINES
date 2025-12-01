/**
 * BenefitsSection Component
 * Why choose, ROI, value proposition
 */

'use client';

import React from "react";
import { Card } from "@/design-system/primitives/Card";
import { Clock, DollarSign, Users, TrendingUp } from "lucide-react";

export interface Benefit {
  icon: React.ReactNode;
  title: string;
  description: string;
  metric: string;
}

const benefits: Benefit[] = [
  {
    icon: <Clock size={32} />,
    title: "Save 10+ Hours Per Week",
    description: "Automate repetitive tasks with AI assistance and instant previews. Focus on building, not configuring.",
    metric: "10+ hours saved weekly"
  },
  {
    icon: <DollarSign size={32} />,
    title: "Reduce Development Costs",
    description: "One platform replaces multiple tools. Lower subscription costs and less context switching.",
    metric: "60% cost reduction"
  },
  {
    icon: <Users size={32} />,
    title: "Ship Faster Together",
    description: "Real-time collaboration means faster feedback loops and quicker time-to-market.",
    metric: "2x faster shipping"
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Scale Without Limits",
    description: "From solo projects to enterprise teams. Built to grow with your needs.",
    metric: "Unlimited scale"
  }
];

export function BenefitsSection() {
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
            Why Choose Lumenforge.io?
          </h2>
          <p style={{
            fontSize: "18px",
            color: "var(--nv-text-1)",
            maxWidth: 600,
            margin: "0 auto"
          }}>
            See the real impact on your team's productivity and bottom line.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "32px"
        }}>
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              style={{
                padding: "32px",
                background: "var(--nv-bg-0)",
                border: "1px solid var(--nv-border)",
                textAlign: "center"
              }}
            >
              <div style={{
                color: "var(--nv-accent)",
                marginBottom: 20,
                display: "flex",
                justifyContent: "center"
              }}>
                {benefit.icon}
              </div>
              
              <div style={{
                fontSize: "32px",
                fontWeight: 700,
                color: "var(--nv-accent)",
                marginBottom: 12
              }}>
                {benefit.metric}
              </div>
              
              <h3 style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--nv-text-0)",
                marginBottom: 12,
                marginTop: 0
              }}>
                {benefit.title}
              </h3>
              
              <p style={{
                fontSize: "16px",
                lineHeight: 1.6,
                color: "var(--nv-text-1)",
                margin: 0
              }}>
                {benefit.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
