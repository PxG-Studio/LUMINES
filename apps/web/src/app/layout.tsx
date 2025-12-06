import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LumenForge.io - Browser-Based Unity IDE',
  description: 'A comprehensive Unity development IDE running entirely in the browser',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

