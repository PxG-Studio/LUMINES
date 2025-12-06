/**
 * Input Validation and Sanitization
 * Security-focused input validation and sanitization utilities
 */

import { z } from 'zod';
import { logger } from '../monitoring/logger';

/**
 * Common validation schemas
 */
export const validationSchemas = {
  // Email validation
  email: z.string().email('Invalid email format').max(255, 'Email too long'),

  // Password validation (min 8 chars, at least one uppercase, lowercase, number, special char)
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),

  // UUID validation
  uuid: z.string().uuid('Invalid UUID format'),

  // URL validation
  url: z.string().url('Invalid URL format'),

  // Safe string (alphanumeric + spaces, max length)
  safeString: (maxLength: number = 255) =>
    z.string().max(maxLength).regex(/^[a-zA-Z0-9\s\-_]+$/, 'Invalid characters'),

  // SQL injection prevention (no SQL keywords)
  sqlSafe: z.string().refine(
    (val) => {
      const sqlKeywords = [
        'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'CREATE', 'ALTER',
        'EXEC', 'EXECUTE', 'UNION', 'SCRIPT', '--', '/*', '*/',
      ];
      const upper = val.toUpperCase();
      return !sqlKeywords.some((keyword) => upper.includes(keyword));
    },
    { message: 'Input contains potentially dangerous SQL keywords' }
  ),

  // XSS prevention (no script tags or javascript:)
  xssSafe: z.string().refine(
    (val) => {
      const dangerous = [
        '<script', '</script>', 'javascript:', 'onerror=', 'onload=',
        'onclick=', 'onmouseover=', 'eval(', 'expression(',
      ];
      const lower = val.toLowerCase();
      return !dangerous.some((pattern) => lower.includes(pattern));
    },
    { message: 'Input contains potentially dangerous XSS patterns' }
  ),
};

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Remove control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Trim whitespace
  sanitized = sanitized.trim();

  return sanitized;
}

/**
 * Sanitize HTML input
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = sanitizeString(input);

  // Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  sanitized = sanitized.replace(/data:text\/html/gi, '');

  return sanitized;
}

/**
 * Validate and sanitize input
 */
export function validateAndSanitize<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
  options: { sanitize?: boolean; logErrors?: boolean } = {}
): { success: boolean; data?: T; error?: string } {
  const { sanitize = true, logErrors = true } = options;

  try {
    // Sanitize if requested
    let processedInput = input;
    if (sanitize && typeof input === 'string') {
      processedInput = sanitizeString(input as string);
    }

    // Validate
    const result = schema.safeParse(processedInput);

    if (result.success) {
      return { success: true, data: result.data };
    } else {
      const error = result.error.errors.map((e) => e.message).join(', ');
      if (logErrors) {
        logger.warn('Input validation failed', { error, input: String(input).substring(0, 100) });
      }
      return { success: false, error };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown validation error';
    if (logErrors) {
      logger.error('Validation error', { error: errorMessage, input: String(input).substring(0, 100) });
    }
    return { success: false, error: errorMessage };
  }
}

/**
 * Validate request body
 */
export async function validateRequestBody<T>(
  schema: z.ZodSchema<T>,
  request: Request
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const body = await request.json();
    return validateAndSanitize(schema, body);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid JSON';
    logger.error('Request body validation error', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

/**
 * Validate query parameters
 */
export function validateQueryParams<T>(
  schema: z.ZodSchema<T>,
  searchParams: URLSearchParams
): { success: boolean; data?: T; error?: string } {
  try {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return validateAndSanitize(schema, params);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid query parameters';
    logger.error('Query parameter validation error', { error: errorMessage });
    return { success: false, error: errorMessage };
  }
}

