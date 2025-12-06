/**
 * StickyCTA Component
 * Sticky call-to-action bar that appears on scroll
 */

'use client';

import React, { useState, useEffect } from "react";
import { Button } from "@/design-system/primitives/Button";
import { X } from "lucide-react";

export function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 400px
      if (window.scrollY > 400 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--nv-bg-1)",
        borderTop: "1px solid var(--nv-border)",
        padding: "16px 32px",
        zIndex: 1000,
        boxShadow: "0 -4px 12px rgba(0, 0, 0, 0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        flexWrap: "wrap"
      }}
    >
      <div style={{ flex: 1, minWidth: 200 }}>
        <p style={{
          fontSize: "16px",
          fontWeight: 600,
          color: "var(--nv-text-0)",
          margin: 0
        }}>
          Ready to build faster?
        </p>
        <p style={{
          fontSize: "14px",
          color: "var(--nv-text-2)",
          margin: "4px 0 0 0"
        }}>
          Start coding in seconds. No credit card required.
        </p>
      </div>
      
      <div style={{
        display: "flex",
        gap: "12px",
        alignItems: "center"
      }}>
        <Button
          variant="accent"
          onClick={() => window.open("/slate/ide", '_blank')}
          style={{ fontSize: "16px", padding: "12px 24px" }}
        >
          Start Coding
        </Button>
        <button
          onClick={() => {
            setIsDismissed(true);
            setIsVisible(false);
          }}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--nv-text-2)",
            cursor: "pointer",
            padding: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          aria-label="Dismiss"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
