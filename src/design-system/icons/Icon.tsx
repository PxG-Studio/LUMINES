/**
 * Base Icon Component
 * SVG wrapper for all icons
 */

'use client';

import React from "react";

export interface IconProps {
  size?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function Icon({
  size = 16,
  children,
  style,
  className
}: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={style}
      className={className}
    >
      {children}
    </svg>
  );
}

