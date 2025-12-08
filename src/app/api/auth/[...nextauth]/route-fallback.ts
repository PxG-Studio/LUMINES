/**
 * NextAuth Route Handler (Fallback)
 * 
 * This is a fallback implementation to avoid build errors.
 * The actual NextAuth route should be configured separately.
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * GET handler for NextAuth
 */
export async function GET(request: NextRequest) {
  // Return a simple response indicating NextAuth is not configured
  // In production, this should be replaced with actual NextAuth handler
  return NextResponse.json(
    { error: 'NextAuth not configured for SPARK MVP 1' },
    { status: 501 }
  );
}

/**
 * POST handler for NextAuth
 */
export async function POST(request: NextRequest) {
  // Return a simple response indicating NextAuth is not configured
  // In production, this should be replaced with actual NextAuth handler
  return NextResponse.json(
    { error: 'NextAuth not configured for SPARK MVP 1' },
    { status: 501 }
  );
}

