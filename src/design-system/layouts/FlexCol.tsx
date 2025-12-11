/**
 * FlexCol Layout Component
 */

'use client';

import React from "react";

export interface FlexColProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function FlexCol({ children, style, ...props }: FlexColProps) {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        ...style
      }}
    >
      {children}
    </div>
  );
}

