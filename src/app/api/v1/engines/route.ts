/**
 * API v1 Engines Endpoint
 * 
 * List available game engines
 */

import { NextRequest, NextResponse } from 'next/server';
import { withAuth } from '@/lib/auth/middleware';
import { getEngineRegistry } from '@/lib/engines/registry';

export const GET = withAuth(async (request: NextRequest, context) => {
  const registry = getEngineRegistry();
  const engines = registry.getSupportedEngines();

  return NextResponse.json({
    engines: engines.map((e) => ({
      id: e.id,
      name: e.name,
      extensions: e.extensions,
    })),
  });
});

