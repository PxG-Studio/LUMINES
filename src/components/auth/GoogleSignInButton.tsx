'use client';

/**
 * Google Sign In Button Component
 * Uses NextAuth to handle Google OAuth authentication
 */
import { signIn } from 'next-auth/react';
import React from 'react';
import { motion } from 'framer-motion';

export interface GoogleSignInButtonProps {
  /**
   * Optional callback when sign-in starts
   */
  onStart?: () => void;
  
  /**
   * Optional callback when sign-in succeeds
   */
  onSuccess?: () => void;
  
  /**
   * Optional callback when sign-in fails
   */
  onError?: (error: string) => void;
  
  /**
   * Button text (default: "Continue with Google")
   */
  text?: string;
  
  /**
   * Button variant styling
   */
  variant?: 'default' | 'outline';
  
  /**
   * Full width button
   */
  fullWidth?: boolean;
}

export function GoogleSignInButton({
  onStart,
  onSuccess,
  onError,
  text = 'Continue with Google',
  variant = 'default',
  fullWidth = false,
}: GoogleSignInButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      onStart?.();

      const result = await signIn('google', {
        redirect: true,
        callbackUrl: '/landing',
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with Google';
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const baseStyles = `
    ${fullWidth ? 'w-full' : 'w-auto'}
    px-6 py-3
    rounded-lg
    font-semibold
    transition-all
    disabled:opacity-50
    disabled:cursor-not-allowed
    flex items-center justify-center gap-3
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variantStyles =
    variant === 'outline'
      ? `
        bg-transparent
        border-2 border-gray-300
        text-gray-300
        hover:bg-gray-800
        hover:border-white
        focus:ring-gray-500
      `
      : `
        bg-white
        text-gray-900
        hover:bg-gray-100
        focus:ring-gray-500
      `;

  return (
    <motion.button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variantStyles}`}
      aria-label="Sign in with Google"
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Signing in...</span>
        </>
      ) : (
        <>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span>{text}</span>
        </>
      )}
    </motion.button>
  );
}

