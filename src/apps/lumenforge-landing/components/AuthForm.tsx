/**
 * Secure Authentication Form Component
 * EC-LAND-011 to EC-LAND-020: Authentication security
 * Now includes Google OAuth sign-in option
 */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { sanitizeSqlInput, CSRFProtection, RateLimiter, SecureSession } from '../utils/security';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';

export interface AuthFormProps {
  mode: 'login' | 'signup' | 'reset';
  onSubmit: (email: string, password: string) => Promise<void>;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSubmit,
  onSuccess,
  onError,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);

  // EC-LAND-016: Rate limiting
  const rateLimiter = new RateLimiter(5, 60000); // 5 attempts per minute

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string): boolean => {
    if (mode === 'signup') {
      return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /\d/.test(password);
    }
    return password.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // EC-LAND-016: Check rate limiting
    const identifier = email || 'anonymous';
    if (!rateLimiter.isAllowed(identifier)) {
      const remaining = rateLimiter.getRemainingTime(identifier);
      setRateLimited(true);
      setError(`Too many attempts. Please wait ${Math.ceil(remaining / 1000)} seconds.`);
      setTimeout(() => setRateLimited(false), rateLimiter.getRemainingTime(identifier));
      return;
    }

    // EC-LAND-011: Sanitize SQL injection attempts
    const sanitizedEmail = sanitizeSqlInput(email);
    const sanitizedPassword = sanitizeSqlInput(password);

    // Validate inputs
    if (!validateEmail(sanitizedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(sanitizedPassword)) {
      if (mode === 'signup') {
        setError('Password must be at least 8 characters with uppercase, lowercase, and numbers');
      } else {
        setError('Password is required');
      }
      return;
    }

    setLoading(true);

    try {
      // EC-LAND-013: CSRF protection is handled by the token in the form
      await onSubmit(sanitizedEmail, sanitizedPassword);

      // EC-LAND-012: Create secure session
      if (mode === 'login') {
        const sessionId = SecureSession.createSession(sanitizedEmail);
        // Store session ID securely
        sessionStorage.setItem('session-id', sessionId);
      }

      onSuccess?.();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Google Sign-In Button */}
      <GoogleSignInButton
        fullWidth
        onStart={() => {
          setLoading(true);
          setError(null);
        }}
        onSuccess={() => {
          setLoading(false);
          onSuccess?.();
        }}
        onError={(err) => {
          setLoading(false);
          setError(err);
          onError?.(err);
        }}
      />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* EC-LAND-013: CSRF token (hidden) */}
        <input type="hidden" name="csrf-token" value={CSRFProtection.getToken()} />

        <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your@email.com"
            disabled={loading || rateLimited}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="••••••••"
            disabled={loading || rateLimited}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          type="error"
          onDismiss={() => setError(null)}
          autoDismiss={true}
          dismissAfter={5000}
        />
      )}

      <motion.button
        type="submit"
        disabled={loading || rateLimited}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner text="" fullScreen={false} className="w-5 h-5" />
            <span>Processing...</span>
          </>
        ) : (
          <span>{mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}</span>
        )}
      </motion.button>
      </form>
    </div>
  );
};

