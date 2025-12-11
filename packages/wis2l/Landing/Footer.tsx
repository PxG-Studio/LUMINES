/**
 * Footer Component
 * Enhanced footer with links, social media, newsletter
 */

'use client';

import React, { useState } from "react";
import { Button } from "@/design-system/primitives/Button";

export function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Newsletter signup logic here
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  const footerLinks = {
    Product: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Templates", href: "/ignition" },
      { label: "Roadmap", href: "/roadmap" }
    ],
    Resources: [
      { label: "Documentation", href: "/waypoint" },
      { label: "Blog", href: "/blog" },
      { label: "Tutorials", href: "/tutorials" },
      { label: "API Docs", href: "/api" }
    ],
    Company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "/careers" },
      { label: "Press Kit", href: "/press" }
    ],
    Legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Security", href: "/security" }
    ]
  };

  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "60px 32px 40px",
        background: "var(--nv-bg-0)",
        borderTop: "1px solid var(--nv-border)"
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Newsletter Section */}
        <div style={{
          marginBottom: "60px",
          paddingBottom: "40px",
          borderBottom: "1px solid var(--nv-border)"
        }}>
          <div style={{
            maxWidth: 500,
            margin: "0 auto",
            textAlign: "center"
          }}>
            <h3 style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--nv-text-0)",
              marginBottom: 12
            }}>
              Stay Updated
            </h3>
            <p style={{
              fontSize: "16px",
              color: "var(--nv-text-2)",
              marginBottom: 24
            }}>
              Get the latest updates, features, and tutorials delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} style={{
              display: "flex",
              gap: "12px",
              maxWidth: 400,
              margin: "0 auto"
            }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  background: "var(--nv-bg-1)",
                  border: "1px solid var(--nv-border)",
                  borderRadius: "8px",
                  color: "var(--nv-text-0)",
                  fontSize: "16px"
                }}
              />
              <Button type="submit" variant="accent">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Links Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
          marginBottom: "40px"
        }}>
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--nv-text-0)",
                marginBottom: "16px",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}>
                {category}
              </h4>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0
              }}>
                {links.map((link, index) => (
                  <li key={index} style={{ marginBottom: "12px" }}>
                    <a
                      href={link.href}
                      style={{
                        fontSize: "14px",
                        color: "var(--nv-text-2)",
                        textDecoration: "none",
                        transition: "color 0.2s"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--nv-accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--nv-text-2)";
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: "40px",
          borderTop: "1px solid var(--nv-border)",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div style={{
            fontSize: "14px",
            color: "var(--nv-text-2)"
          }}>
            © {new Date().getFullYear()} Studio PxG · Lumenforge.io
          </div>
          
          <div style={{
            display: "flex",
            gap: "24px",
            alignItems: "center"
          }}>
            <a
              href="https://twitter.com/lumenforge"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "14px",
                color: "var(--nv-text-2)",
                textDecoration: "none"
              }}
            >
              Twitter
            </a>
            <a
              href="https://github.com/lumenforge"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "14px",
                color: "var(--nv-text-2)",
                textDecoration: "none"
              }}
            >
              GitHub
            </a>
            <a
              href="https://discord.gg/lumenforge"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "14px",
                color: "var(--nv-text-2)",
                textDecoration: "none"
              }}
            >
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

