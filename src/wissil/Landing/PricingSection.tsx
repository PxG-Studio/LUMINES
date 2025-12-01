/**
 * PricingSection Component
 * Pricing tiers, free trial, enterprise pricing
 */

'use client';

import React from "react";
import { Button } from "@/design-system/primitives/Button";
import { Card } from "@/design-system/primitives/Card";
import { Check } from "lucide-react";

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  ctaLink: string;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal projects and trying out Lumenforge.io",
    features: [
      "5 projects",
      "50MB storage",
      "Public repositories",
      "Community support",
      "Basic AI assistance",
      "Standard templates"
    ],
    cta: "Get Started Free",
    ctaLink: "/slate/ide"
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "For professional developers and small teams",
    features: [
      "Unlimited projects",
      "100GB storage",
      "Private repositories",
      "Priority support",
      "Advanced AI features",
      "Premium templates",
      "Team collaboration (up to 5)",
      "Custom domains"
    ],
    cta: "Start Free Trial",
    ctaLink: "/slate/ide",
    popular: true
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large teams and organizations",
    features: [
      "Everything in Pro",
      "Unlimited storage",
      "Self-hosted option",
      "Dedicated support",
      "Custom integrations",
      "Advanced security",
      "SLA guarantees",
      "On-premise deployment",
      "Custom training"
    ],
    cta: "Contact Sales",
    ctaLink: "/contact"
  }
];

export function PricingSection() {
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
            Simple, Transparent Pricing
          </h2>
          <p style={{
            fontSize: "18px",
            color: "var(--nv-text-1)",
            maxWidth: 600,
            margin: "0 auto"
          }}>
            Start free, upgrade when you need more. No credit card required for free tier.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "32px",
          marginBottom: 40
        }}>
          {pricingTiers.map((tier, index) => (
            <Card
              key={index}
              style={{
                padding: "40px 32px",
                background: tier.popular ? "var(--nv-bg-0)" : "var(--nv-bg-1)",
                border: tier.popular ? "2px solid var(--nv-accent)" : "1px solid var(--nv-border)",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%"
              }}
            >
              {tier.popular && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--nv-accent)",
                  color: "#000",
                  padding: "4px 16px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 600
                }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ marginBottom: 24 }}>
                <h3 style={{
                  fontSize: "28px",
                  fontWeight: 600,
                  color: "var(--nv-text-0)",
                  marginBottom: 8,
                  marginTop: tier.popular ? 12 : 0
                }}>
                  {tier.name}
                </h3>
                <div style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 8,
                  marginBottom: 8
                }}>
                  <span style={{
                    fontSize: "48px",
                    fontWeight: 700,
                    color: "var(--nv-text-0)"
                  }}>
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span style={{
                      fontSize: "16px",
                      color: "var(--nv-text-1)" // Changed from --nv-text-2 for better contrast
                    }}>
                      /{tier.period}
                    </span>
                  )}
                </div>
                <p style={{
                  fontSize: "14px",
                  color: "var(--nv-text-2)",
                  margin: 0
                }}>
                  {tier.description}
                </p>
              </div>
              
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: "0 0 32px 0",
                flex: 1
              }}>
                {tier.features.map((feature, i) => (
                  <li
                    key={i}
                    style={{
                      fontSize: "16px",
                      color: "var(--nv-text-1)",
                      backgroundColor: tier.popular ? "var(--nv-bg-0)" : "var(--nv-bg-1)", // Explicit background
                      marginBottom: 12,
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 12
                    }}
                  >
                    <Check size={20} style={{ 
                      color: "var(--nv-text-0)", // Changed to white for better contrast (was --nv-accent)
                      flexShrink: 0, 
                      marginTop: 2,
                      backgroundColor: tier.popular ? "var(--nv-bg-0)" : "var(--nv-bg-1)", // Explicit background
                      strokeWidth: 2.5 // Make checkmark bolder for better visibility
                    }} />
                    <span style={{
                      color: "var(--nv-text-1)", // Explicit text color
                      backgroundColor: tier.popular ? "var(--nv-bg-0)" : "var(--nv-bg-1)" // Explicit background
                    }}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button
                variant={tier.popular ? "accent" : "default"}
                onClick={() => window.open(tier.ctaLink, '_blank')}
                style={{
                  width: "100%",
                  fontSize: "16px",
                  padding: "14px 28px"
                }}
              >
                {tier.cta}
              </Button>
            </Card>
          ))}
        </div>

        <div style={{
          textAlign: "center",
          padding: "24px",
          background: "var(--nv-bg-0)",
          borderRadius: "8px",
          border: "1px solid var(--nv-border)"
        }}>
                <p style={{
                  fontSize: "14px",
                  color: "var(--nv-text-1)", // Changed from --nv-text-2 for better contrast
                  backgroundColor: "var(--nv-bg-0)", // Explicit background
                  margin: 0
                }}>
                  💳 All plans include a 14-day free trial. No credit card required. Cancel anytime.
                </p>
        </div>
      </div>
    </section>
  );
}
