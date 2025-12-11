import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LumenForge.io - Browser-Based Unity IDE | WIS2L Framework',
  description: 'A comprehensive Unity development IDE running entirely in the browser. Spark, Slate, Ignis, and Waypoint - all in one platform.',
  keywords: ['Unity IDE', 'Browser IDE', 'Code Editor', 'AI Code Generation', 'LumenForge', 'WIS2L'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

