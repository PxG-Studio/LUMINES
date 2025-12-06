/**
 * SocialProof Component
 * Customer testimonials, user count, trust badges, customer logos
 */

'use client';

import React from "react";
import { Card } from "@/design-system/primitives/Card";

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

export interface SocialProofProps {
  userCount?: number;
  testimonials?: Testimonial[];
  customerLogos?: string[];
}

const defaultTestimonials: Testimonial[] = [
  {
    quote: "Lumenforge.io has completely transformed our development workflow. The AI-assisted coding and instant previews save us hours every day.",
    author: "Alex Chen",
    role: "Senior Developer",
    company: "Tech Startup",
  },
  {
    quote: "Finally, a platform that brings together everything we need. The blueprint editor and live previews are game-changers for our team.",
    author: "Sarah Martinez",
    role: "Lead Designer",
    company: "Creative Agency",
  },
  {
    quote: "The integration between AI generation and design tokens is seamless. This is the future of development tools.",
    author: "Michael Park",
    role: "Engineering Manager",
    company: "Enterprise Corp",
  },
];

export function SocialProof({ 
  userCount = 5000, 
  testimonials = defaultTestimonials,
  customerLogos = []
}: SocialProofProps) {
  return (
    <section
      style={{
        padding: "80px 32px",
        background: "var(--nv-bg-0)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* User Count Badge */}
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ 
            fontSize: "48px", 
            fontWeight: 700, 
            color: "var(--nv-accent)",
            marginBottom: 8
          }}>
            {userCount.toLocaleString()}+
          </div>
          <p style={{ 
            fontSize: "18px", 
            color: "var(--nv-text-1)",
            margin: 0
          }}>
            Developers building with Lumenforge.io
          </p>
        </div>

        {/* Testimonials */}
        <div style={{ marginBottom: 60 }}>
          <h2 style={{
            fontSize: "32px",
            fontWeight: 600,
            color: "var(--nv-text-0)",
            textAlign: "center",
            marginBottom: 40
          }}>
            Loved by developers worldwide
          </h2>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px"
          }}>
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                style={{
                  padding: "32px",
                  background: "var(--nv-bg-1)",
                  border: "1px solid var(--nv-border)",
                }}
              >
                <p style={{
                  fontSize: "16px",
                  lineHeight: 1.6,
                  color: "var(--nv-text-1)",
                  marginBottom: 24,
                  fontStyle: "italic"
                }}>
                  "{testimonial.quote}"
                </p>
                <div>
                  <div style={{
                    fontWeight: 600,
                    color: "var(--nv-text-0)",
                    marginBottom: 4
                  }}>
                    {testimonial.author}
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: "var(--nv-text-2)"
                  }}>
                    {testimonial.role}
                    {testimonial.company && ` · ${testimonial.company}`}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Customer Logos */}
        {customerLogos.length > 0 && (
          <div>
            <p style={{
              fontSize: "14px",
              color: "var(--nv-text-2)",
              textAlign: "center",
              marginBottom: 24,
              textTransform: "uppercase",
              letterSpacing: "0.5px"
            }}>
              Trusted by teams at
            </p>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              gap: "40px",
              opacity: 0.6
            }}>
              {customerLogos.map((logo, index) => (
                <div key={index} style={{ fontSize: "20px", fontWeight: 600 }}>
                  {logo}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
