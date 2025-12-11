import './globals.css';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slate IDE - Browser-Based Unity Development Environment | LumenForge.io',
  description: 'Complete IDE experience in your browser. Code editor, preview panel, and AI assistant integration for Unity development.',
  keywords: ['IDE', 'Code Editor', 'Unity', 'Browser IDE', 'LumenForge', 'Slate'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

