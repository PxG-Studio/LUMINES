/**
 * Production Environment Validation
 * Comprehensive validation of all required production environment variables
 */

import { env } from './environment';
import { logger } from '../monitoring/logger';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate production environment configuration
 */
export function validateProductionEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Critical: Database configuration
  if (!env.DATABASE_URL && (!env.DATABASE_HOST || !env.DATABASE_USER || !env.DATABASE_PASSWORD)) {
    errors.push('Database configuration is required (DATABASE_URL or DATABASE_HOST/USER/PASSWORD)');
  }

  // Critical: Redis configuration
  if (!env.REDIS_URL && (!env.REDIS_HOST || !env.REDIS_PORT)) {
    errors.push('Redis configuration is required (REDIS_URL or REDIS_HOST/PORT)');
  }

  // Critical: Authentication
  if (!env.NOCTURNA_JWT_SECRET) {
    warnings.push('NOCTURNA_JWT_SECRET not set - JWT verification may fail');
  }

  if (!env.NEXT_PUBLIC_NOCTURNA_ID_URL) {
    warnings.push('NEXT_PUBLIC_NOCTURNA_ID_URL not set - JWT verification may fail');
  }

  // Critical: Application URL
  if (!env.NEXT_PUBLIC_APP_URL) {
    warnings.push('NEXT_PUBLIC_APP_URL not set - may cause issues with absolute URLs');
  }

  // Important: NATS (optional but recommended)
  if (!env.NATS_URL && (!env.NATS_HOST || !env.NATS_PORT)) {
    warnings.push('NATS configuration not set - event publishing will be disabled');
  }

  // Important: AI Configuration (for SPARK)
  if (!env.SPARK_AI_ENDPOINT && !env.SPARK_AI_API_KEY) {
    warnings.push('SPARK AI configuration not set - AI features will be disabled');
  }

  // Security: Rate limiting
  if (env.RATE_LIMIT_FREE >= env.RATE_LIMIT_PRO) {
    warnings.push('RATE_LIMIT_FREE should be less than RATE_LIMIT_PRO');
  }

  if (env.RATE_LIMIT_PRO >= env.RATE_LIMIT_ENTERPRISE) {
    warnings.push('RATE_LIMIT_PRO should be less than RATE_LIMIT_ENTERPRISE');
  }

  // Production-specific validations
  if (env.NODE_ENV === 'production') {
    // Ensure HTTPS in production
    if (env.NEXT_PUBLIC_APP_URL && !env.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
      warnings.push('NEXT_PUBLIC_APP_URL should use HTTPS in production');
    }

    // Ensure secure cookies
    if (env.NODE_ENV === 'production' && !env.SECURE_COOKIES) {
      warnings.push('Secure cookies should be enabled in production');
    }

    // Logging level
    if (process.env.LOG_LEVEL === 'debug') {
      warnings.push('LOG_LEVEL is set to debug in production - consider using info or warn');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate on startup and log results
 */
export function validateAndLogProductionEnvironment(): void {
  const result = validateProductionEnvironment();

  if (result.errors.length > 0) {
    logger.error('Production environment validation failed', undefined, {
      errors: result.errors,
    });
    
    console.error('❌ Production Environment Validation Failed:');
    for (const error of result.errors) {
      console.error(`  - ${error}`);
    }
  }

  if (result.warnings.length > 0) {
    logger.warn('Production environment warnings', {
      warnings: result.warnings,
    });
    
    console.warn('⚠️  Production Environment Warnings:');
    for (const warning of result.warnings) {
      console.warn(`  - ${warning}`);
    }
  }

  if (result.valid && result.warnings.length === 0) {
    logger.info('Production environment validation passed');
    console.log('✅ Production environment validation passed');
  }

  // In production, exit on critical errors
  if (process.env.NODE_ENV === 'production' && !result.valid) {
    console.error('Exiting due to critical environment validation errors');
    process.exit(1);
  }
}

