/**
 * Custom Authentication Client
 * Uses Cloudflare Zero Trust + nocturnaID
 * NO Supabase Auth
 */

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  roles?: string[];
}

export interface AuthSession {
  user: AuthUser;
  token: string;
  expiresAt: string;
}

let currentSession: AuthSession | null = null;

/**
 * Initialize authentication
 */
export function initAuth(): void {
  const stored = localStorage.getItem('slate_session');
  if (stored) {
    try {
      currentSession = JSON.parse(stored);

      if (new Date(currentSession!.expiresAt) < new Date()) {
        currentSession = null;
        localStorage.removeItem('slate_session');
      }
    } catch (error) {
      console.error('Failed to parse stored session:', error);
      localStorage.removeItem('slate_session');
    }
  }
}

/**
 * Get current user
 */
export function getCurrentUser(): AuthUser | null {
  return currentSession?.user || null;
}

/**
 * Get current session
 */
export function getCurrentSession(): AuthSession | null {
  return currentSession;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return currentSession !== null && new Date(currentSession.expiresAt) > new Date();
}

/**
 * Validate JWT token from Cloudflare Zero Trust
 */
export async function validateToken(token: string): Promise<AuthUser | null> {
  try {
    const zeroTrustUrl = import.meta.env.VITE_CLOUDFLARE_ZERO_TRUST_URL;

    if (!zeroTrustUrl) {
      console.warn('Cloudflare Zero Trust URL not configured');
      return createMockUser();
    }

    const response = await fetch(`${zeroTrustUrl}/cdn-cgi/access/get-identity`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Token validation failed');
    }

    const identity = await response.json();

    const nocturnaIdUrl = import.meta.env.VITE_NOCTURNA_ID_API_URL;
    if (!nocturnaIdUrl) {
      console.warn('nocturnaID API URL not configured');
      return createMockUser();
    }

    const userResponse = await fetch(`${nocturnaIdUrl}/users/${identity.email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();

    const user: AuthUser = {
      id: identity.id || userData.id,
      email: identity.email,
      name: userData.name || identity.name,
      avatar: userData.avatar,
      roles: userData.roles || [],
    };

    const session: AuthSession = {
      user,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };

    currentSession = session;
    localStorage.setItem('slate_session', JSON.stringify(session));

    await storeSessionInDatabase(session);

    return user;
  } catch (error) {
    console.error('Token validation failed:', error);

    if (import.meta.env.DEV) {
      return createMockUser();
    }

    return null;
  }
}

/**
 * Login (redirect to Cloudflare Zero Trust)
 */
export function login(): void {
  const zeroTrustUrl = import.meta.env.VITE_CLOUDFLARE_ZERO_TRUST_URL;

  if (zeroTrustUrl) {
    window.location.href = `${zeroTrustUrl}/cdn-cgi/access/login`;
  } else if (import.meta.env.DEV) {
    console.warn('Development mode: Creating mock session');
    const mockUser = createMockUser();
    const mockSession: AuthSession = {
      user: mockUser,
      token: 'mock-token-' + Date.now(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    currentSession = mockSession;
    localStorage.setItem('slate_session', JSON.stringify(mockSession));
    window.location.reload();
  } else {
    console.error('Cloudflare Zero Trust URL not configured');
  }
}

/**
 * Logout
 */
export function logout(): void {
  if (currentSession) {
    removeSessionFromDatabase(currentSession.token).catch(console.error);
  }

  currentSession = null;
  localStorage.removeItem('slate_session');

  const zeroTrustUrl = import.meta.env.VITE_CLOUDFLARE_ZERO_TRUST_URL;
  if (zeroTrustUrl) {
    window.location.href = `${zeroTrustUrl}/cdn-cgi/access/logout`;
  } else {
    window.location.href = '/';
  }
}

/**
 * Get auth token for API requests
 */
export function getAuthToken(): string | null {
  return currentSession?.token || null;
}

/**
 * Refresh session
 */
export async function refreshSession(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) {
    return false;
  }

  const user = await validateToken(token);
  return user !== null;
}

/**
 * Store session in database
 */
async function storeSessionInDatabase(session: AuthSession): Promise<void> {
  try {
    await fetch('/api/auth/session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify({
        userId: session.user.id,
        token: session.token,
        expiresAt: session.expiresAt,
      }),
    });
  } catch (error) {
    console.error('Failed to store session in database:', error);
  }
}

/**
 * Remove session from database
 */
async function removeSessionFromDatabase(token: string): Promise<void> {
  try {
    await fetch('/api/auth/session', {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Failed to remove session from database:', error);
  }
}

/**
 * Create mock user for development
 */
function createMockUser(): AuthUser {
  return {
    id: 'mock-user-id-' + Math.random().toString(36).substr(2, 9),
    email: 'developer@slate.local',
    name: 'Local Developer',
    avatar: undefined,
    roles: ['developer', 'admin'],
  };
}

initAuth();
