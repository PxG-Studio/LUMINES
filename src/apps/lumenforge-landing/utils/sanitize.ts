/**
 * Input Sanitization Utilities
 * EC-146, EC-150, EC-158: XSS prevention and input sanitization
 * EC-LAND-001 to EC-LAND-010: Enhanced XSS prevention
 */

// Import and re-export from security.ts for backward compatibility
import { sanitizeInput as secureSanitize, encodeHtmlEntities as secureEncode } from './security';

// Re-export with original names for backward compatibility
export const sanitizeInput = secureSanitize;
export const encodeHtmlEntities = secureEncode;

/**
 * Validate input length
 * EC-LAND-041: Maximum length validation
 */
export function validateInputLength(input: string, maxLength: number = 1000): boolean {
  if (typeof input !== 'string') return false;
  return input.length <= maxLength && input.length > 0;
}

/**
 * Validate input for null bytes and control characters
 * EC-LAND-042, EC-LAND-043
 */
export function validateInputCharacters(input: string): boolean {
  if (typeof input !== 'string') return false;
  
  // Check for null bytes
  if (input.includes('\0')) return false;
  
  // Check for control characters (except newline, tab, carriage return)
  if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/.test(input)) return false;
  
  return true;
}

