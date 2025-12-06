/**
 * Middleware Exports
 * Central export for all middleware functions
 */

export {
  authenticate,
  requireAuth,
  requireRole,
  extractJWT,
  type AuthenticatedRequest,
} from './auth';

export {
  checkRateLimit,
  rateLimit,
  type RateLimitResult,
} from './rate-limit';

