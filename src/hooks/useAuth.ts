import { useState, useEffect, useCallback } from 'react';
import {
  getCurrentUser,
  isAuthenticated,
  login as authLogin,
  logout as authLogout,
  refreshSession,
  getAuthToken,
} from '../lib/auth/client';
import type { AuthUser } from '../lib/auth/client';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setUser(getCurrentUser());
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
      setLoading(false);
    };

    checkAuth();

    const interval = setInterval(async () => {
      const success = await refreshSession();
      if (success) {
        setUser(getCurrentUser());
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const login = useCallback(() => {
    authLogin();
  }, []);

  const logout = useCallback(() => {
    authLogout();
    setUser(null);
    setAuthenticated(false);
  }, []);

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.roles?.includes(role) || false;
    },
    [user]
  );

  return {
    user,
    isAuthenticated: authenticated,
    loading,
    login,
    logout,
    token: getAuthToken(),
    hasRole,
  };
}
