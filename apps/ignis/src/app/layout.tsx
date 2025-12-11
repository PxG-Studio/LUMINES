import './globals.css';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ignis - Runtime Engine & Build Pipeline | LumenForge.io',
  description: 'WebContainer-powered execution environment with instant hot reload. Full NPM ecosystem support and browser-native runtime.',
  keywords: ['Runtime', 'WebContainer', 'Hot Reload', 'Build Pipeline', 'LumenForge', 'Ignis'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

