/**
 * FlexRow Layout Component
 */

'use client';

import React from "react";

export interface FlexRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FlexRow({ children, style, ...props }: FlexRowProps) {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "row",
        ...style
      }}
    >
      {children}
    </div>
  );
}

