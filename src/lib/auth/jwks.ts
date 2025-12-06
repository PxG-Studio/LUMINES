/**
 * JWKS (JSON Web Key Set) Client
 * Fetches and caches public keys from nocturnaID.org
 */

import { env } from '@/lib/config/environment';

interface JWK {
  kty: string;
  use: string;
  kid: string;
  alg: string;
  n?: string;
  e?: string;
  x?: string;
  y?: string;
}

interface JWKS {
  keys: JWK[];
}

// Cache for JWKS (refresh every hour)
let jwksCache: JWKS | null = null;
let jwksCacheExpiry: number = 0;
const JWKS_CACHE_TTL = 60 * 60 * 1000; // 1 hour

/**
 * Fetch JWKS from nocturnaID.org
 */
async function fetchJWKS(): Promise<JWKS> {
  const nocturnaIdUrl = env.NEXT_PUBLIC_NOCTURNA_ID_URL || 'https://nocturnaID.org';
  const jwksUrl = `${nocturnaIdUrl}/.well-known/jwks.json`;

  try {
    const response = await fetch(jwksUrl, {
      cache: 'no-store', // Always fetch fresh for security
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch JWKS: ${response.status} ${response.statusText}`);
    }

    const jwks: JWKS = await response.json();
    return jwks;
  } catch (error) {
    console.error('Error fetching JWKS:', error);
    throw new Error('Failed to fetch JWKS from nocturnaID.org');
  }
}

/**
 * Get JWKS (cached)
 */
export async function getJWKS(): Promise<JWKS> {
  const now = Date.now();

  // Return cached JWKS if still valid
  if (jwksCache && now < jwksCacheExpiry) {
    return jwksCache;
  }

  // Fetch fresh JWKS
  jwksCache = await fetchJWKS();
  jwksCacheExpiry = now + JWKS_CACHE_TTL;

  return jwksCache;
}

/**
 * Get specific key by kid (key ID)
 */
export async function getJWK(kid: string): Promise<JWK | null> {
  const jwks = await getJWKS();
  return jwks.keys.find(key => key.kid === kid) || null;
}

/**
 * Invalidate JWKS cache (force refresh)
 */
export function invalidateJWKSCache(): void {
  jwksCache = null;
  jwksCacheExpiry = 0;
}

