# Authentication Integration Plan
**Cloudflare Zero Trust + nocturnaID Integration**

## Overview

SPARK currently uses a temporary default user ID system for MVP. This document outlines the plan to integrate production-grade authentication using Cloudflare Zero Trust JWT validation and nocturnaID user management.

## Current State (MVP)

- **User Context**: Default user ID from environment variable (`DEFAULT_USER_ID`)
- **Authentication**: None - all requests are anonymous
- **Session Management**: None
- **Rate Limiting**: Basic in-memory rate limiting by user ID
- **Database RLS**: Not fully functional without proper user context

## Target State (Production)

- **User Context**: Extracted from validated JWT tokens
- **Authentication**: Cloudflare Zero Trust JWT validation
- **User Management**: nocturnaID integration for user profiles and preferences
- **Session Management**: Secure session handling with refresh tokens
- **Rate Limiting**: Per-user rate limiting with Redis backend
- **Database RLS**: Fully functional with proper user context

## Integration Components

### 1. Cloudflare Zero Trust JWT Validation

**Purpose**: Validate JWT tokens issued by Cloudflare Zero Trust Access

**Implementation Steps**:

1. **Install Dependencies**
   ```bash
   npm install jose jsonwebtoken
   npm install --save-dev @types/jsonwebtoken
   ```

2. **Create JWT Validator** (`spark/lib/auth/jwt-validator.ts`)
   - Fetch Cloudflare Zero Trust public keys
   - Validate JWT signature
   - Verify token expiration
   - Extract user claims (email, user_id, groups, etc.)

3. **Update Middleware** (`spark/lib/auth/middleware.ts`)
   - Extract JWT from Authorization header or cookies
   - Validate JWT using validator
   - Set user context from validated claims
   - Handle token refresh

4. **Environment Variables**
   ```env
   CLOUDFLARE_ZERO_TRUST_AUDIENCE=your-audience
   CLOUDFLARE_ZERO_TRUST_ISSUER=https://your-team.cloudflareaccess.com
   CLOUDFLARE_ZERO_TRUST_JWKS_URL=https://your-team.cloudflareaccess.com/cdn-cgi/access/certs
   ```

### 2. nocturnaID User Management

**Purpose**: Manage user profiles, preferences, and identity

**Implementation Steps**:

1. **Create nocturnaID Client** (`spark/lib/auth/nocturnaid-client.ts`)
   - API client for nocturnaID service
   - User profile fetching
   - User preference synchronization
   - User creation/update

2. **User Profile Sync**
   - Sync user profile from nocturnaID on first login
   - Cache user profile in database
   - Update profile on changes

3. **Environment Variables**
   ```env
   NOCTURNAID_API_URL=https://nocturnaid.example.com/api
   NOCTURNAID_API_KEY=your-api-key
   ```

### 3. Session Management

**Purpose**: Secure session handling with refresh tokens

**Implementation Steps**:

1. **Create Session Store** (`spark/lib/auth/session-store.ts`)
   - Redis-based session storage
   - Session expiration handling
   - Refresh token management

2. **Session Middleware**
   - Create session on successful authentication
   - Refresh session on token refresh
   - Invalidate session on logout

3. **Environment Variables**
   ```env
   REDIS_URL=redis://localhost:6379
   SESSION_SECRET=your-session-secret
   SESSION_TTL=86400  # 24 hours
   ```

### 4. Database RLS Integration

**Purpose**: Enable Row Level Security with proper user context

**Implementation Steps**:

1. **Update Database Client** (`spark/lib/database/client.ts`)
   - Set `app.current_user_id` on connection
   - Use SECURITY DEFINER functions for RLS
   - Handle user context in transactions

2. **Update User Context Helper** (`spark/lib/auth/user-context.ts`)
   - Extract user ID from validated JWT
   - Set user context in database connections
   - Handle anonymous users

## Implementation Phases

### Phase 1: JWT Validation (Week 1)
- [ ] Install dependencies
- [ ] Create JWT validator
- [ ] Update middleware to validate JWTs
- [ ] Test with Cloudflare Zero Trust tokens
- [ ] Update user context helper

### Phase 2: nocturnaID Integration (Week 2)
- [ ] Create nocturnaID client
- [ ] Implement user profile sync
- [ ] Update user preferences to use nocturnaID
- [ ] Test user profile operations

### Phase 3: Session Management (Week 3)
- [ ] Set up Redis session store
- [ ] Implement session creation/refresh
- [ ] Add logout functionality
- [ ] Test session lifecycle

### Phase 4: Database RLS (Week 4)
- [ ] Update database client for RLS
- [ ] Test RLS policies with authenticated users
- [ ] Handle anonymous user access
- [ ] Verify data isolation

## Security Considerations

1. **JWT Validation**
   - Always validate JWT signature
   - Check token expiration
   - Verify audience and issuer
   - Handle token refresh securely

2. **Session Security**
   - Use secure cookies (HttpOnly, Secure, SameSite)
   - Implement CSRF protection
   - Rotate session secrets regularly
   - Set appropriate session TTL

3. **Rate Limiting**
   - Move rate limiting to Redis for distributed systems
   - Implement per-user and per-IP limits
   - Add abuse detection and blocking

4. **Database Security**
   - Use RLS policies for data isolation
   - Never trust client-provided user IDs
   - Audit all database operations
   - Use parameterized queries

## Testing Strategy

1. **Unit Tests**
   - JWT validation logic
   - nocturnaID client operations
   - Session management functions
   - User context helpers

2. **Integration Tests**
   - End-to-end authentication flow
   - Session refresh flow
   - User profile sync
   - Database RLS with authenticated users

3. **Security Tests**
   - JWT tampering attempts
   - Session hijacking attempts
   - Rate limit bypass attempts
   - SQL injection attempts

## Migration Plan

1. **MVP → Phase 1**
   - Deploy JWT validation alongside default user ID
   - Gradually migrate endpoints to require authentication
   - Keep default user ID as fallback

2. **Phase 1 → Phase 2**
   - Sync existing users to nocturnaID
   - Migrate user preferences
   - Update all user lookups

3. **Phase 2 → Phase 3**
   - Implement session management
   - Migrate existing sessions
   - Update client-side auth handling

4. **Phase 3 → Phase 4**
   - Enable RLS policies
   - Migrate data with proper user context
   - Remove default user ID fallback

## Rollback Plan

If issues arise during integration:

1. **Phase 1 Rollback**: Disable JWT validation, revert to default user ID
2. **Phase 2 Rollback**: Disable nocturnaID sync, use local user data
3. **Phase 3 Rollback**: Disable session management, use stateless auth
4. **Phase 4 Rollback**: Disable RLS policies, use application-level security

## Success Criteria

- [ ] All API endpoints require valid JWT authentication
- [ ] User profiles sync from nocturnaID successfully
- [ ] Sessions persist and refresh correctly
- [ ] Database RLS policies enforce data isolation
- [ ] Rate limiting works per authenticated user
- [ ] All tests pass
- [ ] No security vulnerabilities introduced

## References

- Cloudflare Zero Trust Access: https://developers.cloudflare.com/cloudflare-one/policies/access/
- nocturnaID Documentation: (to be provided)
- Next.js Authentication: https://nextjs.org/docs/authentication
- PostgreSQL RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html

