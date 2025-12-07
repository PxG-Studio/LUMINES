/**
 * NextAuth.js Configuration
 * 
 * Integrates OIDC SSO with NextAuth.js
 * Provides session management and JWT validation
 */

import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getOIDCConfig } from './oidc';
import { logAuthEvent } from '../monitoring/audit';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role?: string;
}

/**
 * Get NextAuth configuration
 */
export function getNextAuthConfig(): NextAuthOptions {
  const oidcConfig = getOIDCConfig();

  return {
    providers: [
      GoogleProvider({
        clientId: oidcConfig.clientId,
        clientSecret: oidcConfig.clientSecret,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
          },
        },
      }),
    ],
    session: {
      strategy: 'jwt',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    jwt: {
      maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
      async signIn({ user, account, profile }) {
        // Log sign-in attempt
        await logAuthEvent(
          user.id,
          'login',
          true,
          {
            ip_address: undefined, // Will be set by request context
            user_agent: undefined, // Will be set by request context
          }
        );

        // Check if MFA is required (Google handles this)
        // If MFA is not enabled, we can enforce it here
        if (oidcConfig.mfaRequired && !account?.providerAccountId) {
          return false;
        }

        return true;
      },
      async jwt({ token, user, account }) {
        // Initial sign in
        if (account && user) {
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.picture;
        }

        // Return previous token if the access token has not expired yet
        if (Date.now() < (token.accessTokenExpires as number)) {
          return token;
        }

        // Access token has expired, try to update it
        return await refreshAccessToken(token);
      },
      async session({ session, token }) {
        // Send properties to the client
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          picture: token.picture as string,
          role: token.role as string,
        };
        session.accessToken = token.accessToken as string;
        return session;
      },
    },
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
  };
}

/**
 * Refresh access token
 */
async function refreshAccessToken(token: any): Promise<any> {
  try {
    const oidcConfig = getOIDCConfig();

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: oidcConfig.clientId,
        client_secret: oidcConfig.clientSecret,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error refreshing access token', error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

