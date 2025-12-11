'use client';

import { redirect } from 'next/navigation';

/**
 * Alias route for legacy docs linking to /landing.
 * Redirects to the canonical marketing page at /lumen to avoid 404 drift.
 */
export default function LandingAliasPage() {
  redirect('/lumen');
}

