/**
 * JWT Verification
 * Verifies JWT tokens from nocturnaID.org using JWKS
 */

import * as jose from 'jose';
import { getJWK } from './jwks';
import { env } from '@/lib/config/environment';

export interface JWTClaims {
  sub: string; // Subject (user ID from nocturnaID)
  email: string;
  roles: string[];
  iat?: number; // Issued at
  exp?: number; // Expiration
  iss?: string; // Issuer
  aud?: string; // Audience
}

/**
 * Verify JWT token
 * Validates signature, expiration, issuer, and audience
 */
export async function verifyJWT(token: string): Promise<JWTClaims | null> {
  try {
    // Decode token header to get key ID (kid)
    const decoded = jose.decodeProtectedHeader(token);
    
    if (!decoded.kid) {
      console.error('JWT missing kid in header');
      return null;
    }

    // Get public key from JWKS
    const jwk = await getJWK(decoded.kid);
    if (!jwk) {
      console.error(`JWK not found for kid: ${decoded.kid}`);
      return null;
    }

    // Import public key
    const publicKey = await jose.importJWK(jwk, decoded.alg || 'RS256');

    // Verify token
    const nocturnaIdUrl = env.NEXT_PUBLIC_NOCTURNA_ID_URL || 'https://nocturnaID.org';
    const audience = env.NOCTURNA_JWT_AUDIENCE || 'lumines.nocturna.network';

    const { payload } = await jose.jwtVerify(token, publicKey, {
      issuer: nocturnaIdUrl,
      audience: audience,
      algorithms: ['RS256'],
    });

    // Extract claims
    const claims: JWTClaims = {
      sub: payload.sub as string,
      email: payload.email as string,
      roles: (payload.roles as string[]) || [],
      iat: payload.iat as number | undefined,
      exp: payload.exp as number | undefined,
      iss: payload.iss as string | undefined,
      aud: payload.aud as string | undefined,
    };

    // Validate required claims
    if (!claims.sub || !claims.email) {
      console.error('JWT missing required claims (sub or email)');
      return null;
    }

    return claims;
  } catch (error) {
    if (error instanceof jose.errors.JWTExpired) {
      console.error('JWT token expired');
      return null;
    }
    if (error instanceof jose.errors.JWTInvalid) {
      console.error('JWT token invalid:', error.message);
      return null;
    }
    if (error instanceof jose.errors.JWSSignatureVerificationFailed) {
      console.error('JWT signature verification failed');
      return null;
    }
    
    console.error('JWT verification error:', error);
    return null;
  }
}

/**
 * Decode JWT without verification (for inspection only)
 */
export function decodeJWT(token: string): any {
  try {
    return jose.decodeJwt(token);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

