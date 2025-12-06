/**
 * NextAuth Configuration for Lumenforge.io
 * Supports Google OAuth and integrates with existing nocturnaID system
 */

import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig = {
  pages: {
    signIn: '/landing',
    signOut: '/landing',
    error: '/landing',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnLanding = nextUrl.pathname.startsWith('/landing');
      
      // Allow access to landing page without auth
      if (isOnLanding) {
        return true;
      }
      
      // Require auth for other protected routes
      if (!isLoggedIn && !isOnLanding) {
        return false; // Redirect to sign in
      }
      return true;
    },
    async signIn({ user, account, profile }) {
      // If using Google OAuth
      if (account?.provider === 'google') {
        // You can add custom logic here, e.g.:
        // - Check if user exists in your database
        // - Create user if they don't exist
        // - Link Google account to existing nocturnaID account
        // - Sync roles/permissions
        
        // For now, allow all Google sign-ins
        return true;
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        
        // If user comes from Google, add Google profile info
        if (account.provider === 'google' && profile) {
          token.email = profile.email;
          token.picture = profile.picture;
          token.name = profile.name;
        }
        
        // If user comes from nocturnaID (existing system), merge data
        if (account.provider === 'nocturnaID' && user) {
          token.email = user.email;
          token.roles = (user as any).roles || [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session as any).accessToken = token.accessToken;
        (session as any).provider = token.provider;
        (session as any).roles = (token as any).roles || [];
      }
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    // You can add nocturnaID provider here later if needed
  ],
  session: {
    strategy: 'jwt', // Use JWT instead of database sessions (compatible with existing JWT system)
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

