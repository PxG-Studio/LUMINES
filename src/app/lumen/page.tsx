'use client';

import React from 'react';
import { LandingLayout } from '@/wissil/Landing/LandingLayout';
import type { Metadata } from 'next';

/**
 * LUMEN - Production Landing Page
 *
 * The main marketing landing page for WISSIL IDE
 * Bolt.new / StackBlitz-style clean design
 *
 * Domain: lumenforge.io, www.lumenforge.io
 * Network: Helios Control (192.168.86.114)
 * Port: 3000
 * Auth: Public facing, nocturnaID integration via Cloudflare Zero Trust
 */
export default function LandingPage() {
  return <LandingLayout />;
}
