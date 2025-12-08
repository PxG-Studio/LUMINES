/**
 * nocturnaID Integration
 * Custom OAuth provider for nocturnaID identity system
 */

import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers/oauth';
import { logger } from '../monitoring/logger';

export interface NocturnaIDProfile {
  sub: string;
  email: string;
  email_verified: boolean;
  name: string;
  picture?: string;
  roles?: string[];
  permissions?: string[];
  metadata?: Record<string, any>;
}

/**
 * nocturnaID OAuth Provider Configuration
 */
export function NocturnaIDProvider(
  options: OAuthUserConfig<NocturnaIDProfile>
): OAuthConfig<NocturnaIDProfile> {
  const nocturnaIDUrl = process.env.NOCTURNAID_URL || 'https://id.nocturna.io';
  
  return {
    id: 'nocturna',
    name: 'nocturnaID',
    type: 'oauth',
    version: '2.0',
    
    authorization: {
      url: `${nocturnaIDUrl}/oauth/authorize`,
      params: {
        scope: 'openid email profile roles',
        response_type: 'code',
      },
    },
    
    token: {
      url: `${nocturnaIDUrl}/oauth/token`,
    },
    
    userinfo: {
      url: `${nocturnaIDUrl}/oauth/userinfo`,
    },
    
    profile(profile: NocturnaIDProfile) {
      logger.info('nocturnaID profile received', {
        sub: profile.sub,
        email: profile.email,
      });
      
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        image: profile.picture,
        roles: profile.roles || [],
        permissions: profile.permissions || [],
        metadata: profile.metadata || {},
      };
    },
    
    style: {
      logo: '/logos/nocturna.svg',
      logoDark: '/logos/nocturna-dark.svg',
      bg: '#1a1a2e',
      text: '#ffffff',
      bgDark: '#0f0f1e',
      textDark: '#ffffff',
    },
    
    ...options,
  };
}

/**
 * Validate nocturnaID token
 */
export async function validateNocturnaToken(
  token: string
): Promise<NocturnaIDProfile | null> {
  try {
    const nocturnaIDUrl = process.env.NOCTURNAID_URL || 'https://id.nocturna.io';
    
    const response = await fetch(`${nocturnaIDUrl}/oauth/userinfo`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      logger.error('Failed to validate nocturnaID token', {
        status: response.status,
      });
      return null;
    }

    return await response.json();
  } catch (error) {
    logger.error('Error validating nocturnaID token', error);
    return null;
  }
}

/**
 * Check if user has required roles
 */
export function hasRole(
  user: { roles?: string[] },
  requiredRoles: string[]
): boolean {
  if (!user.roles || user.roles.length === 0) {
    return false;
  }

  return requiredRoles.some(role => user.roles!.includes(role));
}

/**
 * Check if user has required permissions
 */
export function hasPermission(
  user: { permissions?: string[] },
  requiredPermissions: string[]
): boolean {
  if (!user.permissions || user.permissions.length === 0) {
    return false;
  }

  return requiredPermissions.every(perm => user.permissions!.includes(perm));
}
