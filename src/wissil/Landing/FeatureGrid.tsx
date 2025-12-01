/**
 * FeatureGrid Component
 * Grid of feature cards
 */

'use client';

import React from "react";
import { FeatureCard } from "./FeatureCard";
import { PlayIcon } from "@/design-system/icons/Play";
import { FolderIcon } from "@/design-system/icons/Folder";
import { FileIcon } from "@/design-system/icons/File";

export function FeatureGrid() {
  const features = [
    {
      icon: <PlayIcon size={32} />,
      title: "Instant Preview",
      text: "Lightning-fast live preview powered by Vite & the Ignition runtime."
    },
    {
      icon: <FolderIcon size={32} />,
      title: "Clean Project Explorer",
      text: "A minimal file tree shaped for indie creators and collaborative teams."
    },
    {
      icon: <FileIcon size={32} />,
      title: "Code-First Workflow",
      text: "Built for iteration. Edit → Save → Preview instantly."
    }
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        backgroundColor: "var(--nv-bg-0)", // Explicit background for parent
      }}
    >
      {features.map((f, i) => (
        <div
          key={i}
          style={{
            flex: "1 1 260px",
            minWidth: "260px",
            maxWidth: "100%",
          }}
        >
          <FeatureCard {...f} />
        </div>
      ))}
    </div>
  );
}

