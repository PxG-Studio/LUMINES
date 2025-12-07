# Authentication Setup Guide
## GitHub and Google OAuth for LUMEN Landing Page

**Date:** December 2024  
**Status:** ✅ **CONFIGURED**

---

## Overview

LUMEN landing page now supports authentication via **GitHub** and **Google** OAuth providers using NextAuth.js. Users can sign in with either provider to access SPARK and SLATE.

---

## Configuration

### 1. Environment Variables

Add the following environment variables to your `.env` file:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here-generate-with-openssl-rand-base64-32
NEXTAUTH_URL=http://localhost:3000  # or https://lumenforge.io for production

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 2. Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
openssl rand -base64 32
```

---

## OAuth Provider Setup

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Configure:
   - **Application type:** Web application
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (development)
     - `https://lumenforge.io` (production)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google` (development)
     - `https://lumenforge.io/api/auth/callback/google` (production)
6. Copy **Client ID** and **Client Secret** to `.env`

### GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Configure:
   - **Application name:** Lumenforge.io
   - **Homepage URL:**
     - `http://localhost:3000` (development)
     - `https://lumenforge.io` (production)
   - **Authorization callback URL:**
     - `http://localhost:3000/api/auth/callback/github` (development)
     - `https://lumenforge.io/api/auth/callback/github` (production)
4. Copy **Client ID** and **Client Secret** to `.env`

---

## Implementation Details

### Files Created/Modified

1. **`src/lib/auth.config.ts`**
   - Added GitHub provider configuration
   - Updated JWT callback to handle GitHub profile data
   - Updated signIn callback to handle GitHub authentication

2. **`src/components/auth/GitHubSignInButton.tsx`** (NEW)
   - GitHub OAuth sign-in button component
   - Matches GoogleSignInButton styling
   - Handles loading states and errors

3. **`src/components/auth/AuthButtons.tsx`** (NEW)
   - Combined component showing both GitHub and Google buttons
   - Shows user info when logged in
   - Handles sign out functionality

4. **`src/app/layout.tsx`**
   - Added SessionProvider wrapper for NextAuth

5. **`src/wissil/Landing/SimpleNav.tsx`**
   - Added AuthButtons component to navigation
   - Shows authentication status and user info

### Authentication Flow

1. User clicks "Continue with GitHub" or "Continue with Google"
2. Redirects to OAuth provider (GitHub/Google)
3. User authorizes application
4. OAuth provider redirects back to `/api/auth/callback/[provider]`
5. NextAuth creates/updates user session
6. User is redirected back to `/landing` with active session
7. User info displayed in navigation

### Session Management

- **Strategy:** JWT (JSON Web Tokens)
- **Session Duration:** 30 days
- **Storage:** Client-side (HTTP-only cookies)
- **Token Refresh:** Automatic via NextAuth

---

## Usage

### In Components

```tsx
'use client';

import { useSession } from 'next-auth/react';

export function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div>Loading...</div>;
  }
  
  if (session?.user) {
    return <div>Welcome, {session.user.name}!</div>;
  }
  
  return <div>Please sign in</div>;
}
```

### In API Routes

```tsx
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  const session = await auth();
  
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  
  // Access user data
  const userId = session.user.id;
  const userEmail = session.user.email;
  
  return Response.json({ message: 'Authenticated', userId });
}
```

---

## User Data Structure

After authentication, user data is available in the session:

```typescript
{
  user: {
    id: string;           // User ID
    email: string;        // User email
    name: string;         // User name
    image: string;        // Avatar URL
  },
  accessToken: string;    // OAuth access token
  provider: 'google' | 'github';
  roles: string[];        // User roles (if configured)
}
```

---

## Integration with Existing System

### nocturnaID Integration

The authentication system is designed to work alongside the existing nocturnaID system:

- OAuth users can be linked to nocturnaID accounts
- JWT tokens are compatible with existing middleware
- User roles can be synced from nocturnaID

### Database Integration

Users authenticated via OAuth are automatically created in the database:

- User record created on first sign-in
- Email used as unique identifier
- Avatar and name synced from OAuth provider

---

## Security Considerations

1. **HTTPS Required in Production**
   - OAuth callbacks must use HTTPS
   - Set `NEXTAUTH_URL` to production domain

2. **Secret Management**
   - Never commit `.env` file
   - Use secure secret generation
   - Rotate secrets periodically

3. **Token Security**
   - Tokens stored in HTTP-only cookies
   - JWT tokens signed with secret
   - Automatic token refresh

4. **Rate Limiting**
   - Already configured in middleware
   - Protects against brute force

---

## Testing

### Local Development

1. Set up OAuth apps with `http://localhost:3000` callback
2. Add environment variables to `.env.local`
3. Start development server: `npm run dev`
4. Navigate to `/lumen`
5. Click "Continue with GitHub" or "Continue with Google"
6. Complete OAuth flow
7. Verify user info appears in navigation

### Production Deployment

1. Set up OAuth apps with production domain
2. Add environment variables to production environment
3. Ensure `NEXTAUTH_URL` is set to production domain
4. Deploy application
5. Test authentication flow

---

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI"**
   - Check callback URL matches OAuth app configuration
   - Ensure protocol (http/https) matches

2. **"Missing environment variables"**
   - Verify all required env vars are set
   - Check `.env` file is loaded

3. **"Session not persisting"**
   - Check `NEXTAUTH_SECRET` is set
   - Verify cookies are enabled
   - Check domain configuration

4. **"Provider not found"**
   - Verify provider is added to `auth.config.ts`
   - Check environment variables are correct

---

## Next Steps

1. ✅ GitHub OAuth configured
2. ✅ Google OAuth configured
3. ✅ Auth buttons added to LUMEN landing page
4. ⚠️ User database integration (optional enhancement)
5. ⚠️ Role-based access control (optional enhancement)
6. ⚠️ Account linking (GitHub + Google to same account)

---

**Status:** ✅ Authentication Ready for Production  
**Last Updated:** December 2024

