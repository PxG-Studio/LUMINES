/**
 * ScrollArea Layout Component
 */

'use client';

import React from "react";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ScrollArea({ children, style, ...props }: ScrollAreaProps) {
  return (
    <div
      {...props}
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        ...style
      }}
    >
      {children}
    </div>
  );
}

