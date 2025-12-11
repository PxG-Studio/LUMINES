import type { Metadata } from 'next';
import React from 'react';

/**
 * LUMEN Landing Page Metadata
 * Production SEO and Open Graph configuration for lumenforge.io
 */
export const metadata: Metadata = {
  title: 'Lumenforge.io - Your Entire Creative Pipeline in One Workspace',
  description: 'Lumenforge.io unifies AI generation, design tokens, blueprint editing, live previews, and deployment into a single, high-velocity development environment built for modern teams.',
  keywords: [
    'Lumenforge',
    'IDE',
    'development environment',
    'AI code generation',
    'SPARK',
    'SLATE',
    'browser-based IDE',
    'Unity development',
    'game development',
    'code editor',
  ],
  authors: [{ name: 'Lumenforge.io' }],
  creator: 'Lumenforge.io',
  publisher: 'Lumenforge.io',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_LUMENFORGE_DOMAIN 
    ? `https://${process.env.NEXT_PUBLIC_LUMENFORGE_DOMAIN}` 
    : 'https://lumenforge.io'),
  alternates: {
    canonical: '/lumen',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/lumen',
    siteName: 'Lumenforge.io',
    title: 'Lumenforge.io - Your Entire Creative Pipeline in One Workspace',
    description: 'Lumenforge.io unifies AI generation, design tokens, blueprint editing, live previews, and deployment into a single, high-velocity development environment built for modern teams.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Lumenforge.io - Development Environment',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lumenforge.io - Your Entire Creative Pipeline in One Workspace',
    description: 'Lumenforge.io unifies AI generation, design tokens, blueprint editing, live previews, and deployment into a single, high-velocity development environment built for modern teams.',
    images: ['/og-image.png'],
    creator: '@lumenforge',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add verification codes when available
    // google: 'verification-code',
    // yandex: 'verification-code',
  },
};

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

