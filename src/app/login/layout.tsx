import type { Metadata } from 'next';
import React from 'react';

/**
 * Login Page Metadata
 * SEO configuration for login page
 */
export const metadata: Metadata = {
  title: 'Sign In - Lumenforge.io',
  description: 'Sign in to Lumenforge.io with your GitHub or Google account to access SPARK and SLATE.',
  robots: {
    index: false, // Don't index login page
    follow: false,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

