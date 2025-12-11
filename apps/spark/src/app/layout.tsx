import './globals.css';
import React from 'react';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/design-system/themes/ThemeProvider';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Spark - AI-Powered Unity C# Script Generator | LumenForge.io',
  description: 'Generate Unity C# scripts with AI. Spark provides intelligent code generation for Unity development with support for Claude and OpenAI.',
  keywords: ['Unity', 'C#', 'AI', 'Code Generation', 'LumenForge', 'Spark'],
};

export const dynamicParams = true;
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

