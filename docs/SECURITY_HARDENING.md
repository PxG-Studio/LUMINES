# Security Hardening Guide
## Complete Security Configuration for LUMINES/WIS2L

**Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Status:** ✅ **PRODUCTION READY**

---

## Table of Contents

1. [Overview](#1-overview)
2. [Security Controls](#2-security-controls)
3. [Security Scanning](#3-security-scanning)
4. [Security Headers](#4-security-headers)
5. [Input Validation](#5-input-validation)
6. [Rate Limiting](#6-rate-limiting)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [Security Audit](#8-security-audit)
9. [Compliance](#9-compliance)

---

## 1. Overview

This guide covers the complete security hardening for LUMINES/WIS2L production environment.

### Security Layers

```
┌─────────────────────┐
│  Security Headers   │──► CSP, HSTS, X-Frame-Options
├─────────────────────┤
│  Rate Limiting      │──► Redis-based, per-IP/API-key
├─────────────────────┤
│  Input Validation   │──► Zod schemas, sanitization
├─────────────────────┤
│  Authentication     │──► JWT, session management
├─────────────────────┤
│  Authorization      │──► Role-based access control
├─────────────────────┤
│  Security Scanning  │──► Dependency, code, container
└─────────────────────┘
```

---

## 2. Security Controls

### 2.1 Rate Limiting

**Implementation:** `src/lib/security/rate-limiter.ts`

**Pre-configured Limiters:**
- **Strict:** 10 requests/minute
- **Standard:** 100 requests/15 minutes
- **Relaxed:** 1000 requests/hour
- **API:** 1000 requests/15 minutes (per API key)

**Usage:**
```typescript
import { rateLimiters } from '@/lib/security/rate-limiter';

// In API route
const rateLimitResponse = await rateLimiters.standard.middleware(request);
if (rateLimitResponse) {
  return rateLimitResponse; // Rate limited
}
```

### 2.2 Input Validation

**Implementation:** `src/lib/security/input-validator.ts`

**Features:**
- Zod schema validation
- String sanitization
- HTML sanitization
- SQL injection prevention
- XSS prevention

**Usage:**
```typescript
import { validateAndSanitize, validationSchemas } from '@/lib/security/input-validator';

const schema = z.object({
  email: validationSchemas.email,
  password: validationSchemas.password,
});

const result = validateAndSanitize(schema, input);
if (!result.success) {
  return NextResponse.json({ error: result.error }, { status: 400 });
}
```

### 2.3 Security Headers

**Implementation:** `src/lib/security/security-headers.ts`

**Headers Applied:**
- Content-Security-Policy
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Strict-Transport-Security: max-age=31536000
- Cross-Origin-Embedder-Policy: require-corp
- Cross-Origin-Opener-Policy: same-origin
- Cross-Origin-Resource-Policy: same-origin

**Usage:**
```typescript
import { applySecurityHeaders } from '@/lib/security/security-headers';

const response = NextResponse.json(data);
return applySecurityHeaders(response);
```

---

## 3. Security Scanning

### 3.1 Dependency Scanning

**Tool:** `npm audit`

**Frequency:** On every PR and push

**Command:**
```bash
npm audit --audit-level=moderate
```

**CI Integration:** `.github/workflows/security-scan.yml`

### 3.2 Code Security Scan

**Tool:** ESLint security plugin

**Installation:**
```bash
npm install --save-dev eslint-plugin-security
```

**Configuration:**
```json
{
  "extends": ["plugin:security/recommended"]
}
```

### 3.3 Container Scanning

**Tool:** Trivy

**Frequency:** On production deployments

**Command:**
```bash
trivy image lumines:latest
```

**CI Integration:** `.github/workflows/security-scan.yml`

### 3.4 Security Audit Script

**File:** `scripts/security-audit.sh`

**Checks:**
- Dependency vulnerabilities
- Exposed secrets
- Hardcoded credentials
- SQL injection patterns
- XSS patterns
- Insecure random usage
- Eval usage
- Exposed API keys

**Usage:**
```bash
./scripts/security-audit.sh
```

---

## 4. Security Headers

### 4.1 Content Security Policy (CSP)

**Configuration:**
```
default-src 'self'
script-src 'self' 'unsafe-inline' 'unsafe-eval'
style-src 'self' 'unsafe-inline'
img-src 'self' data: https:
font-src 'self' data:
connect-src 'self' https:
frame-ancestors 'none'
base-uri 'self'
form-action 'self'
upgrade-insecure-requests
```

**Note:** `'unsafe-eval'` may be needed for some libraries. Review and tighten as needed.

### 4.2 HTTP Strict Transport Security (HSTS)

**Configuration:**
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

**Effect:** Forces HTTPS for 1 year

### 4.3 X-Frame-Options

**Configuration:**
```
X-Frame-Options: DENY
```

**Effect:** Prevents clickjacking attacks

---

## 5. Input Validation

### 5.1 Validation Schemas

**Available Schemas:**
- `email` - Email validation
- `password` - Strong password validation
- `uuid` - UUID validation
- `url` - URL validation
- `safeString` - Alphanumeric + spaces
- `sqlSafe` - SQL injection prevention
- `xssSafe` - XSS prevention

### 5.2 Sanitization

**Functions:**
- `sanitizeString()` - Remove control characters, trim
- `sanitizeHtml()` - Remove script tags, event handlers

**Usage:**
```typescript
import { sanitizeString, sanitizeHtml } from '@/lib/security/input-validator';

const clean = sanitizeString(userInput);
const htmlClean = sanitizeHtml(htmlInput);
```

---

## 6. Rate Limiting

### 6.1 Configuration

**Redis-based (Recommended):**
- Distributed rate limiting
- Works across multiple instances
- Persistent across restarts

**In-memory (Fallback):**
- Single instance only
- Lost on restart
- Used if Redis unavailable

### 6.2 Rate Limit Headers

**Response Headers:**
- `X-RateLimit-Limit` - Maximum requests
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset timestamp
- `Retry-After` - Seconds until retry (if limited)

---

## 7. Authentication & Authorization

### 7.1 JWT Authentication

**Implementation:** `src/lib/auth/jwt.ts`

**Features:**
- JWT token generation
- Token verification
- Token refresh
- JWKS support

### 7.2 Session Management

**Implementation:** `src/lib/cache/services/SessionStore.ts`

**Features:**
- Redis-based sessions
- Session expiration
- Session invalidation

### 7.3 Authorization

**Implementation:** `src/lib/middleware/auth.ts`

**Features:**
- Role-based access control
- Permission checking
- Route protection

---

## 8. Security Audit

### 8.1 Automated Audit

**Script:** `scripts/security-audit.sh`

**Checks:**
1. Dependency vulnerabilities
2. Exposed secrets
3. Hardcoded credentials
4. SQL injection patterns
5. XSS patterns
6. Insecure random usage
7. Eval usage
8. Environment variable configuration
9. Exposed API keys

### 8.2 Manual Audit Checklist

- [ ] All dependencies up to date
- [ ] No hardcoded secrets
- [ ] Environment variables properly configured
- [ ] Security headers applied
- [ ] Rate limiting configured
- [ ] Input validation in place
- [ ] Authentication working
- [ ] Authorization enforced
- [ ] Logging configured (no sensitive data)
- [ ] Error messages don't leak information

### 8.3 Penetration Testing

**Recommended:**
- OWASP ZAP
- Burp Suite
- Manual testing

**Frequency:** Quarterly

---

## 9. Compliance

### 9.1 OWASP Top 10

**Coverage:**
- ✅ A01: Broken Access Control (Authorization middleware)
- ✅ A02: Cryptographic Failures (JWT, HTTPS)
- ✅ A03: Injection (Input validation, SQL safe)
- ✅ A04: Insecure Design (Security by design)
- ✅ A05: Security Misconfiguration (Security headers)
- ✅ A06: Vulnerable Components (Dependency scanning)
- ✅ A07: Authentication Failures (JWT, session management)
- ✅ A08: Software and Data Integrity (CI/CD security)
- ✅ A09: Security Logging (Structured logging)
- ✅ A10: Server-Side Request Forgery (Input validation)

### 9.2 GDPR Compliance

**Requirements:**
- Data encryption in transit (HTTPS)
- Data encryption at rest (Database encryption)
- Access controls (Authentication, authorization)
- Audit logging (Security events)
- Data retention policies

---

## Appendix

### A. Security Checklist

**Pre-Deployment:**
- [ ] Security audit passed
- [ ] Dependency scan passed
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Input validation in place
- [ ] Authentication working
- [ ] Authorization enforced
- [ ] Logging configured
- [ ] Error handling secure
- [ ] Secrets management configured

### B. Incident Response

**Security Incident:**
1. Identify and contain
2. Assess impact
3. Notify security team
4. Remediate
5. Post-mortem

### C. Security Contacts

- **Security Team:** [TO BE CONFIGURED]
- **On-Call:** [TO BE CONFIGURED]
- **Emergency:** [TO BE CONFIGURED]

---

**Document Version:** 1.0.0  
**Last Updated:** December 6, 2025  
**Next Review:** January 6, 2026


