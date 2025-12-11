/**
 * SplitView Component
 * Draggable divider (horizontal or vertical)
 */

'use client';

import React, { useRef, useState } from "react";
import { useTheme } from "../themes/ThemeProvider";

export interface SplitViewProps {
  direction?: "horizontal" | "vertical";
  initial?: number;
  min?: number;
  max?: number;
  children: [React.ReactNode, React.ReactNode];
  style?: React.CSSProperties;
}

export function SplitView({
  direction = "vertical",
  initial = 300,
  min = 120,
  max = 800,
  children,
  style
}: SplitViewProps) {
  const theme = useTheme();
  const [size, setSize] = useState(initial);
  const ref = useRef<HTMLDivElement>(null);
  const initialSizeRef = useRef(initial);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    initialSizeRef.current = size;
    const start = direction === "vertical" ? e.clientX : e.clientY;

    const onMove = (evt: MouseEvent) => {
      const delta =
        direction === "vertical"
          ? evt.clientX - start
          : evt.clientY - start;

      let newSize = initialSizeRef.current + delta;
      newSize = Math.max(min, Math.min(max, newSize));
      setSize(newSize);
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        flexDirection: direction === "vertical" ? "row" : "column",
        height: "100%",
        width: "100%",
        ...style
      }}
    >
      <div
        style={{
          flex: "none",
          width: direction === "vertical" ? `${size}px` : "100%",
          height: direction === "vertical" ? "100%" : `${size}px`,
          overflow: "hidden"
        }}
      >
        {children[0]}
      </div>

      <div
        role="separator"
        aria-orientation={direction}
        aria-label={`Resize ${direction === "vertical" ? "panels horizontally" : "panels vertically"}`}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={size}
        tabIndex={0}
        onMouseDown={onMouseDown}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft" && direction === "vertical") {
            e.preventDefault();
            setSize(Math.max(min, size - 10));
          } else if (e.key === "ArrowRight" && direction === "vertical") {
            e.preventDefault();
            setSize(Math.min(max, size + 10));
          } else if (e.key === "ArrowUp" && direction === "horizontal") {
            e.preventDefault();
            setSize(Math.max(min, size - 10));
          } else if (e.key === "ArrowDown" && direction === "horizontal") {
            e.preventDefault();
            setSize(Math.min(max, size + 10));
          } else if (e.key === "Home") {
            e.preventDefault();
            setSize(min);
          } else if (e.key === "End") {
            e.preventDefault();
            setSize(max);
          }
        }}
        style={{
          background: theme.colors.border,
          cursor: direction === "vertical" ? "col-resize" : "row-resize",
          width: direction === "vertical" ? "4px" : "100%",
          height: direction === "vertical" ? "100%" : "4px",
          transition: "background 0.15s ease",
          outline: "none"
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = theme.colors.accent;
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = theme.colors.border;
        }}
        onFocus={(e) => {
          e.currentTarget.style.outline = `2px solid ${theme.colors.accent}`;
          e.currentTarget.style.outlineOffset = "2px";
        }}
        onBlur={(e) => {
          e.currentTarget.style.outline = "none";
        }}
      />

      <div style={{ flex: 1, overflow: "hidden" }}>{children[1]}</div>
    </div>
  );
}

