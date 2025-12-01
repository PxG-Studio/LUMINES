# Google OAuth Authentication Setup Guide

This guide explains how to set up Google OAuth authentication for Lumenforge.io using NextAuth.js.

## Prerequisites

- Google Cloud Platform account
- Access to Google Cloud Console
- Next.js application running (this project)

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. If prompted, configure the OAuth consent screen:
   - Choose **External** (for testing) or **Internal** (for Google Workspace)
   - Fill in required fields:
     - App name: `Lumenforge.io`
     - User support email: Your email
     - Developer contact: Your email
   - Add scopes: `email`, `profile`
   - Save and continue

6. Create OAuth client:
   - Application type: **Web application**
   - Name: `Lumenforge.io Web Client`
   - Authorized JavaScript origins:
     - `http://localhost:3000` (for development)
     - `https://lumenforge.io` (for production)
     - `https://storybook.lumenforge.io` (for Storybook if needed)
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google`
     - `https://lumenforge.io/api/auth/callback/google`
     - `https://storybook.lumenforge.io/api/auth/callback/google` (if needed)
   - Click **Create**

7. Copy the **Client ID** and **Client Secret**

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root of your project (or update existing one):

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# For production, also set:
# NEXTAUTH_URL=https://lumenforge.io
```

### Generate NextAuth Secret

Generate a secure secret for NextAuth:

```bash
# Using OpenSSL
openssl rand -base64 32

# Or using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

## Step 3: Verify Installation

1. Install dependencies (already done):
   ```bash
   npm install next-auth@beta
   ```

2. Check that the auth route is accessible:
   - Visit: `http://localhost:3000/api/auth/providers`
   - You should see Google listed as a provider

## Step 4: Test Google Sign-In

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a page with the `GoogleSignInButton` component (e.g., landing page)

3. Click "Continue with Google"

4. You should be redirected to Google's sign-in page

5. After signing in, you'll be redirected back to your app

## Integration with Existing nocturnaID System

The current implementation is designed to work alongside your existing nocturnaID authentication:

- **Google OAuth**: Handled by NextAuth.js (client-side flow)
- **nocturnaID**: Existing JWT-based system (can be integrated later)

### Future Integration Options

1. **Link Google account to nocturnaID**: When a user signs in with Google, check if they have an existing nocturnaID account and link them
2. **Unified session**: Use NextAuth session for both Google and nocturnaID users
3. **Role synchronization**: Sync user roles/permissions from nocturnaID when linking accounts

## Usage Examples

### In a Component

```tsx
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <div>Welcome, {user?.name}!</div>;
  }

  return (
    <GoogleSignInButton
      onSuccess={() => {
        console.log('Signed in successfully!');
      }}
    />
  );
}
```

### Checking Authentication Status

```tsx
import { useAuth } from '@/hooks/useAuth';

export function ProtectedContent() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please sign in to continue.</div>;
  }

  return <div>Welcome, {user?.email}!</div>;
}
```

### Server-Side Authentication

```tsx
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function ServerComponent() {
  const session = await auth();

  if (!session) {
    redirect('/landing');
  }

  return <div>Protected content for {session.user?.email}</div>;
}
```

## Troubleshooting

### "Invalid Client" Error

- Check that `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are correct
- Verify the redirect URI matches exactly what's configured in Google Console
- Ensure `NEXTAUTH_URL` matches your current domain

### Redirect URI Mismatch

- Make sure the redirect URI in Google Console exactly matches: `{NEXTAUTH_URL}/api/auth/callback/google`
- Include both `http://localhost:3000` (dev) and production URL

### Session Not Persisting

- Check that `NEXTAUTH_SECRET` is set
- Ensure cookies are enabled in the browser
- Check browser console for cookie-related errors

### CORS Issues

- Verify `NEXTAUTH_URL` is correctly set
- Check that authorized origins in Google Console match your domain

## Security Considerations

1. **Never commit `.env.local`**: Keep credentials secret
2. **Use different credentials for dev/staging/prod**
3. **Rotate secrets regularly**: Especially if compromised
4. **Use HTTPS in production**: Required for secure cookies
5. **Validate user email domains**: If needed for your organization

## Next Steps

- [ ] Set up database integration for user storage
- [ ] Add user profile management
- [ ] Implement account linking (Google + nocturnaID)
- [ ] Add role-based access control
- [ ] Set up email verification
- [ ] Configure production credentials

## Additional Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

