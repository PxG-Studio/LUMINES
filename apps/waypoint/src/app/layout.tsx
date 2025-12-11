import './globals.css';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Waypoint - Unity Visual Scripting & Deployment | LumenForge.io',
  description: 'Visual node-based programming interface for Unity WebGL. Graph editor, node inspector, and component registry.',
  keywords: ['Visual Scripting', 'Unity', 'Node Editor', 'Deployment', 'LumenForge', 'Waypoint'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

