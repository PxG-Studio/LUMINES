/**
 * Cloudflare Zero Trust Integration
 * Integrates Cloudflare Access for zero-trust security
 */

import { jwtVerify, importSPKI } from 'jose';
import { logger } from '../monitoring/logger';

export interface CloudflareAccessPayload {
  email: string;
  sub: string;
  aud: string[];
  iss: string;
  iat: number;
  exp: number;
  country?: string;
  ip?: string;
}

/**
 * Verify Cloudflare Access JWT token
 */
export async function verifyCloudflareAccessToken(
  token: string,
  teamDomain: string
): Promise<CloudflareAccessPayload | null> {
  try {
    // Get Cloudflare Access public key
    const certsUrl = `https://${teamDomain}.cloudflareaccess.com/cdn-cgi/access/certs`;
    const response = await fetch(certsUrl);
    
    if (!response.ok) {
      logger.error('Failed to fetch Cloudflare Access certs', {
        status: response.status,
      });
      return null;
    }

    const { public_certs } = await response.json();
    
    // Try each public key until one works
    for (const cert of public_certs) {
      try {
        const publicKey = await importSPKI(cert.public_cert, 'RS256');
        const { payload } = await jwtVerify(token, publicKey, {
          issuer: `https://${teamDomain}.cloudflareaccess.com`,
        });

        return payload as CloudflareAccessPayload;
      } catch (err) {
        // Try next key
        continue;
      }
    }

    logger.warn('No valid Cloudflare Access key found for token');
    return null;
  } catch (error) {
    logger.error('Failed to verify Cloudflare Access token', error);
    return null;
  }
}

/**
 * Middleware to validate Cloudflare Access token from headers
 */
export async function validateCloudflareAccess(
  request: Request
): Promise<CloudflareAccessPayload | null> {
  const teamDomain = process.env.CLOUDFLARE_TEAM_DOMAIN;
  
  if (!teamDomain) {
    logger.warn('CLOUDFLARE_TEAM_DOMAIN not configured');
    return null;
  }

  // Get token from Cf-Access-Jwt-Assertion header
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  
  if (!token) {
    logger.debug('No Cloudflare Access token found in headers');
    return null;
  }

  return verifyCloudflareAccessToken(token, teamDomain);
}

/**
 * Check if request is from Cloudflare Access
 */
export function isCloudflareAccessRequest(request: Request): boolean {
  return request.headers.has('Cf-Access-Jwt-Assertion');
}
