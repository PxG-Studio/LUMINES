/**
 * ProductDemo Component
 * Product screenshots, video, interactive demo showcase
 */

'use client';

import React, { useState } from "react";
import { Button } from "@/design-system/primitives/Button";
import { PlayIcon } from "@/design-system/icons/Play";

export interface ProductDemoProps {
  videoUrl?: string;
  screenshots?: string[];
  demoUrl?: string;
}

export function ProductDemo({ 
  videoUrl,
  screenshots = [],
  demoUrl = "/slate/ide"
}: ProductDemoProps) {
  const [showVideo, setShowVideo] = useState(false);

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
            See Lumenforge.io in Action
          </h2>
          <p style={{
            fontSize: "18px",
            color: "var(--nv-text-1)",
            maxWidth: 600,
            margin: "0 auto"
          }}>
            Watch how teams use Lumenforge.io to build faster, ship sooner, and iterate better.
          </p>
        </div>

        {/* Video/Demo Section */}
        <div style={{
          position: "relative",
          borderRadius: "12px",
          overflow: "hidden",
          background: "var(--nv-bg-0)",
          border: "1px solid var(--nv-border)",
          marginBottom: 40,
          aspectRatio: "16/9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          {showVideo && videoUrl ? (
            <iframe
              src={videoUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "none"
              }}
              allowFullScreen
              title="Product Demo Video"
            />
          ) : (
            <div style={{
              textAlign: "center",
              padding: "60px"
            }}>
              <div style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: "var(--nv-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                cursor: "pointer",
                transition: "transform 0.2s"
              }}
              onClick={() => videoUrl ? setShowVideo(true) : window.open(demoUrl, '_blank')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
              >
                <PlayIcon size={32} style={{ color: "#fff", marginLeft: 4 }} />
              </div>
              <p style={{
                fontSize: "18px",
                color: "var(--nv-text-0)",
                marginBottom: 16
              }}>
                {videoUrl ? "Watch Product Demo" : "Try Interactive Demo"}
              </p>
              <p style={{
                fontSize: "14px",
                color: "var(--nv-text-2)"
              }}>
                {videoUrl ? "Click to play video" : "Launch the IDE"}
              </p>
            </div>
          )}
        </div>

        {/* Screenshots Grid */}
        {screenshots.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            marginTop: 40
          }}>
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  border: "1px solid var(--nv-border)",
                  background: "var(--nv-bg-0)",
                  aspectRatio: "16/10"
                }}
              >
                <div style={{
                  width: "100%",
                  height: "100%",
                  background: "var(--nv-bg-2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--nv-text-2)",
                  fontSize: "14px"
                }}>
                  Screenshot {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CTA Buttons */}
        <div style={{
          display: "flex",
          gap: "16px",
          justifyContent: "center",
          marginTop: 40,
          flexWrap: "wrap"
        }}>
          <Button
            variant="accent"
            onClick={() => window.open(demoUrl, '_blank')}
            style={{ fontSize: "16px", padding: "14px 28px" }}
          >
            Try Interactive Demo
          </Button>
          <Button
            onClick={() => window.open("/slate/ide", '_blank')}
            style={{ fontSize: "16px", padding: "14px 28px" }}
          >
            Open Editor
          </Button>
        </div>
      </div>
    </section>
  );
}
