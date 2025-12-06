/**
 * Production Environment Validation
 * Validates production environment before deployment
 */

import { env } from './environment';
import { logger } from '../monitoring/logger';

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate production environment
 */
export function validateProductionEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical validations
  if (env.NODE_ENV !== 'production') {
    errors.push('NODE_ENV must be "production" in production builds');
  }

  if (!env.DATABASE_URL && (!env.DATABASE_USER || !env.DATABASE_PASSWORD)) {
    errors.push('DATABASE_URL or DATABASE_USER and DATABASE_PASSWORD must be provided');
  }

  if (!env.NOCTURNA_JWT_SECRET) {
    errors.push('NOCTURNA_JWT_SECRET is required for authentication');
  }

  if (env.NOCTURNA_JWT_SECRET === 'your-jwt-secret-key-change-in-production') {
    errors.push('NOCTURNA_JWT_SECRET must be changed from default value');
  }

  // NextAuth validation (warnings only - OAuth is optional)
  if (!env.NEXTAUTH_SECRET) {
    warnings.push('NEXTAUTH_SECRET not set - GitHub/Google OAuth will not work');
  }

  if (!env.NEXTAUTH_URL) {
    warnings.push('NEXTAUTH_URL not set - OAuth callbacks may fail');
  }

  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
    warnings.push('Google OAuth credentials not set - Google sign-in will not work');
  }

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    warnings.push('GitHub OAuth credentials not set - GitHub sign-in will not work');
  }

  // Warnings
  if (!env.SENTRY_DSN) {
    warnings.push('SENTRY_DSN not set - error tracking disabled');
  }

  if (!env.CHROMATIC_PROJECT_TOKEN) {
    warnings.push('CHROMATIC_PROJECT_TOKEN not set - visual regression testing disabled');
  }

  if (!env.PERCY_TOKEN) {
    warnings.push('PERCY_TOKEN not set - visual testing disabled');
  }

  if (env.LOG_LEVEL === 'debug') {
    warnings.push('LOG_LEVEL is set to debug in production - consider using "info" or "warn"');
  }

  const valid = errors.length === 0;

  return {
    valid,
    errors,
    warnings,
  };
}

/**
 * Validate and log production environment
 * Called during Docker build
 */
export function validateAndLogProductionEnvironment(): void {
  const result = validateProductionEnvironment();

  if (result.errors.length > 0) {
    logger.error('Production environment validation failed:', {
      errors: result.errors,
    });
    console.error('\n❌ Production Environment Validation Failed:');
    result.errors.forEach((error) => {
      console.error(`  - ${error}`);
    });
    console.error('\nPlease fix the errors above before deploying to production.\n');
    process.exit(1);
  }

  if (result.warnings.length > 0) {
    logger.warn('Production environment validation warnings:', {
      warnings: result.warnings,
    });
    console.warn('\n⚠️  Production Environment Validation Warnings:');
    result.warnings.forEach((warning) => {
      console.warn(`  - ${warning}`);
    });
    console.warn('');
  }

  if (result.valid) {
    logger.info('Production environment validation passed');
    console.log('✅ Production environment validation passed\n');
  }
}
