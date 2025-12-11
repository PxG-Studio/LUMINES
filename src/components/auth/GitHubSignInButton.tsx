'use client';

/**
 * GitHub Sign In Button Component
 * Uses NextAuth to handle GitHub OAuth authentication
 */
import { signIn } from 'next-auth/react';
import React from 'react';
import { motion } from 'framer-motion';

export interface GitHubSignInButtonProps {
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
   * Button text (default: "Continue with GitHub")
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

export function GitHubSignInButton({
  onStart,
  onSuccess,
  onError,
  text = 'Continue with GitHub',
  variant = 'default',
  fullWidth = false,
}: GitHubSignInButtonProps) {
  const [loading, setLoading] = React.useState(false);

  const handleGitHubSignIn = async () => {
    try {
      setLoading(true);
      onStart?.();

      const result = await signIn('github', {
        redirect: true,
        callbackUrl: '/lumen', // Redirect to LUMEN marketing page after successful login
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign in with GitHub';
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
        bg-[#24292e]
        text-white
        hover:bg-[#2f363d]
        focus:ring-gray-500
      `;

  return (
    <motion.button
      type="button"
      onClick={handleGitHubSignIn}
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variantStyles}`}
      aria-label="Sign in with GitHub"
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
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>{text}</span>
        </>
      )}
    </motion.button>
  );
}

