import React, { useEffect, useState } from 'react';
import { isAuthenticated, login, validateToken } from '../../lib/auth/client';
import { Panel } from '../../design-system/components/Panel';
import { lumenForgeColors } from '../../design-system/tokens';
import { LogIn, Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated()) {
        setAuthenticated(true);
        setChecking(false);
        return;
      }

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        const user = await validateToken(token);
        if (user) {
          setAuthenticated(true);
          window.history.replaceState({}, '', window.location.pathname);
        }
      }

      setChecking(false);
    };

    checkAuth();
  }, []);

  if (checking) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: lumenForgeColors.background.primary,
        }}
      >
        <Panel variant="glass" padding="lg" style={{ textAlign: 'center' }}>
          <Loader2
            size={48}
            style={{
              color: lumenForgeColors.accent.primary,
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem',
            }}
          />
          <p style={{ color: lumenForgeColors.text.secondary, margin: 0 }}>
            Authenticating...
          </p>
          <style>
            {`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}
          </style>
        </Panel>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: lumenForgeColors.background.primary,
          padding: '2rem',
        }}
      >
        <Panel variant="glass" padding="lg" style={{ textAlign: 'center', maxWidth: '500px' }}>
          <div
            style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              background: `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`,
              borderRadius: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <LogIn size={40} style={{ color: lumenForgeColors.text.primary }} />
          </div>

          <h2
            style={{
              color: lumenForgeColors.text.primary,
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
              margin: 0,
            }}
          >
            Welcome to SLATE
          </h2>

          <p
            style={{
              color: lumenForgeColors.text.secondary,
              fontSize: '1rem',
              marginBottom: '2rem',
              margin: '0.5rem 0 2rem 0',
              lineHeight: '1.6',
            }}
          >
            The professional Unity development environment
          </p>

          <button
            onClick={login}
            style={{
              padding: '1rem 2rem',
              background: `linear-gradient(135deg, ${lumenForgeColors.accent.primary}, ${lumenForgeColors.accent.secondary})`,
              color: lumenForgeColors.text.primary,
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.75rem',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LogIn size={20} />
            Sign In
          </button>

          <div
            style={{
              marginTop: '2rem',
              padding: '1rem',
              background: lumenForgeColors.background.tertiary,
              borderRadius: '0.5rem',
              border: `1px solid ${lumenForgeColors.border.subtle}`,
            }}
          >
            <p
              style={{
                color: lumenForgeColors.text.tertiary,
                fontSize: '0.75rem',
                margin: 0,
                lineHeight: '1.5',
              }}
            >
              {import.meta.env.DEV
                ? 'Development mode: Mock authentication enabled'
                : 'Secured with Cloudflare Zero Trust + nocturnaID'}
            </p>
          </div>
        </Panel>
      </div>
    );
  }

  return <>{children}</>;
};
