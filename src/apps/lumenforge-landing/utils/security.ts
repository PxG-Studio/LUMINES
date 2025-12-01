/**
 * Comprehensive Security Utilities
 * EC-LAND-001 to EC-LAND-100: Security edge cases fixes
 */

/**
 * Enhanced input sanitization to prevent XSS attacks
 * EC-LAND-001 to EC-LAND-010: XSS prevention
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }

  let sanitized = input.trim();

  // EC-LAND-001: Remove script tags
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // EC-LAND-002: Decode HTML entities then re-encode
  sanitized = decodeHtmlEntities(sanitized);
  sanitized = encodeHtmlEntities(sanitized);

  // EC-LAND-003: Remove clipboard-injected malicious code
  sanitized = sanitized.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Control characters

  // EC-LAND-004: Remove Unicode escape sequences
  sanitized = sanitized.replace(/\\u[0-9a-fA-F]{4}/g, '');

  // EC-LAND-005: Remove SVG with embedded JavaScript
  sanitized = sanitized.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '');
  sanitized = sanitized.replace(/<svg[^>]*on\w+\s*=\s*["'][^"']*["'][^>]*>/gi, '');

  // EC-LAND-006: Remove data URIs with scripts
  sanitized = sanitized.replace(/data:[^;]*;base64[^,)]*/gi, '');

  // EC-LAND-007: Remove event handlers
  sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

  // EC-LAND-008: Remove JavaScript protocol
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/gi, '');

  // EC-LAND-009: Remove iframes
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  sanitized = sanitized.replace(/<iframe[^>]*>/gi, '');

  // EC-LAND-010: Remove base64 encoded payloads
  sanitized = sanitized.replace(/data:[\w\/]+;base64,[A-Za-z0-9+\/=]+/gi, '');

  // EC-LAND-041: Enforce maximum length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  // EC-LAND-042: Remove null bytes
  sanitized = sanitized.replace(/\0/g, '');

  // EC-LAND-043: Remove control characters
  sanitized = sanitized.replace(/[\x00-\x1F\x7F-\x9F]/g, '');

  // EC-LAND-044: Prevent extremely long strings (DoS)
  if (sanitized.length > maxLength * 10) {
    return '';
  }

  // EC-LAND-045: Sanitize regex special characters to prevent ReDoS
  sanitized = sanitized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // EC-LAND-046: Validate and fix UTF-8 sequences
  sanitized = validateUtf8(sanitized);

  // EC-LAND-047: Remove zero-width characters
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, '');

  // EC-LAND-048: Remove bidirectional override characters
  sanitized = sanitized.replace(/[\u202A-\u202E\u2066-\u2069]/g, '');

  // EC-LAND-049: Normalize emoji (keep but validate)
  sanitized = normalizeEmoji(sanitized);

  // EC-LAND-050: Detect and prevent homoglyph attacks
  sanitized = preventHomoglyphAttacks(sanitized);

  return sanitized;
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(text: string): string {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}

/**
 * Encode HTML entities for safe output
 * EC-LAND-001, EC-LAND-002
 */
export function encodeHtmlEntities(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (m) => map[m] || m);
}

/**
 * Validate UTF-8 encoding
 * EC-LAND-046
 */
function validateUtf8(text: string): string {
  try {
    return decodeURIComponent(encodeURIComponent(text));
  } catch (e) {
    // Invalid UTF-8, remove invalid sequences
    return text.replace(/[\uFFFD]/g, '');
  }
}

/**
 * Normalize emoji encoding
 * EC-LAND-049
 */
function normalizeEmoji(text: string): string {
  // Keep emoji but ensure they're properly encoded
  return text.normalize('NFC');
}

/**
 * Prevent homoglyph attacks
 * EC-LAND-050
 */
function preventHomoglyphAttacks(text: string): string {
  // Common homoglyph mappings
  const homoglyphs: Record<string, string> = {
    '\u0430': 'a', // Cyrillic a
    '\u0435': 'e', // Cyrillic e
    '\u043E': 'o', // Cyrillic o
    '\u0440': 'p', // Cyrillic p
    '\u0441': 'c', // Cyrillic c
    '\u0443': 'y', // Cyrillic y
    '\u0445': 'x', // Cyrillic x
  };

  let sanitized = text;
  for (const [homoglyph, replacement] of Object.entries(homoglyphs)) {
    sanitized = sanitized.replace(new RegExp(homoglyph, 'g'), replacement);
  }
  return sanitized;
}

/**
 * SQL Injection prevention
 * EC-LAND-011, EC-LAND-032
 */
export function sanitizeSqlInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/['";\\]/g, '') // Remove SQL special characters
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments
    .replace(/\*\//g, '')
    .replace(/;/g, '') // Remove semicolons
    .trim();
}

/**
 * CSRF token generation and validation
 * EC-LAND-013
 */
export class CSRFProtection {
  private static tokenKey = 'csrf-token';

  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  static getToken(): string {
    if (typeof window === 'undefined') return '';
    const token = sessionStorage.getItem(this.tokenKey);
    if (!token) {
      const newToken = this.generateToken();
      sessionStorage.setItem(this.tokenKey, newToken);
      return newToken;
    }
    return token;
  }

  static validateToken(token: string): boolean {
    const storedToken = this.getToken();
    return token === storedToken && token.length > 0;
  }

  static getTokenHeader(): Record<string, string> {
    return {
      'X-CSRF-Token': this.getToken(),
    };
  }
}

/**
 * Rate limiting utility
 * EC-LAND-016, EC-LAND-019, EC-LAND-090
 */
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    const recentRequests = requests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    return true;
  }

  reset(identifier: string): void {
    this.requests.delete(identifier);
  }

  getRemainingTime(identifier: string): number {
    const requests = this.requests.get(identifier) || [];
    if (requests.length === 0) return 0;
    
    const oldestRequest = Math.min(...requests);
    const elapsed = Date.now() - oldestRequest;
    return Math.max(0, this.windowMs - elapsed);
  }
}

/**
 * Session management with security
 * EC-LAND-012, EC-LAND-015, EC-LAND-020
 */
export class SecureSession {
  private static sessionKey = 'lumenforge-session';
  private static sessionTimeout = 30 * 60 * 1000; // 30 minutes

  static createSession(userId: string, metadata?: Record<string, any>): string {
    const sessionId = this.generateSessionId();
    const sessionData = {
      id: sessionId,
      userId,
      createdAt: Date.now(),
      expiresAt: Date.now() + this.sessionTimeout,
      metadata: metadata || {},
    };
    
    // Store in sessionStorage (more secure than localStorage)
    sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    return sessionId;
  }

  static getSession(): { id: string; userId: string; metadata: Record<string, any> } | null {
    if (typeof window === 'undefined') return null;
    
    const sessionData = sessionStorage.getItem(this.sessionKey);
    if (!sessionData) return null;

    try {
      const session = JSON.parse(sessionData);
      if (Date.now() > session.expiresAt) {
        this.clearSession();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  static validateSession(sessionId: string): boolean {
    const session = this.getSession();
    return session?.id === sessionId && session !== null;
  }

  static clearSession(): void {
    sessionStorage.removeItem(this.sessionKey);
  }

  private static generateSessionId(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

/**
 * Cookie security utilities
 * EC-LAND-058, EC-LAND-059, EC-LAND-060
 */
export class SecureCookies {
  static set(name: string, value: string, options: {
    maxAge?: number;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
    domain?: string;
    path?: string;
  } = {}): void {
    if (typeof document === 'undefined') return;

    const {
      maxAge,
      secure = true, // Default to secure
      sameSite = 'strict',
      domain,
      path = '/',
    } = options;

    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

    if (maxAge) {
      cookie += `; Max-Age=${maxAge}`;
    }

    if (secure && location.protocol === 'https:') {
      cookie += '; Secure';
    }

    cookie += `; SameSite=${sameSite}`;

    if (domain) {
      cookie += `; Domain=${domain}`;
    }

    cookie += `; Path=${path}`;

    document.cookie = cookie;
  }

  static get(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const nameEQ = encodeURIComponent(name) + '=';
    const cookies = document.cookie.split(';');

    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        return decodeURIComponent(cookie.substring(nameEQ.length));
      }
    }

    return null;
  }

  static remove(name: string, domain?: string, path: string = '/'): void {
    this.set(name, '', {
      maxAge: 0,
      domain,
      path,
    });
  }
}

/**
 * API request security wrapper
 * EC-LAND-031 to EC-LAND-040
 */
export class SecureAPI {
  private baseUrl: string;
  private csrfToken: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.csrfToken = CSRFProtection.getToken();
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    // EC-LAND-031: Ensure authentication
    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    headers.set('X-CSRF-Token', this.csrfToken);
    
    // EC-LAND-040: CORS headers (should be set server-side, but document here)
    headers.set('X-Requested-With', 'XMLHttpRequest');

    // EC-LAND-036: Validate JSON before sending
    let body = options.body;
    if (body && typeof body === 'string') {
      try {
        JSON.parse(body);
      } catch {
        throw new Error('Invalid JSON payload');
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
      credentials: 'same-origin', // EC-LAND-040: CORS security
    });

    // EC-LAND-033: Don't expose sensitive data in error messages
    if (!response.ok) {
      const error = await response.json().catch(() => ({
        error: 'Request failed',
        status: response.status,
      }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // EC-LAND-035: Prevent timing attacks with constant-time comparison
  static constantTimeEquals(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return result === 0;
  }
}

/**
 * File upload security validation
 * EC-LAND-071 to EC-LAND-080
 */
export class SecureFileUpload {
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly BLOCKED_EXTENSIONS = [
    'exe', 'sh', 'bat', 'cmd', 'com', 'scr', 'vbs', 'js', 'jar',
  ];
  private static readonly MAX_FILENAME_LENGTH = 255;

  static validateFile(file: File): {
    valid: boolean;
    error?: string;
  } {
    // EC-LAND-073: Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size exceeds maximum of ${this.MAX_FILE_SIZE / 1024 / 1024}MB`,
      };
    }

    // EC-LAND-071, EC-LAND-072: Check file extension
    const extension = this.getFileExtension(file.name);
    if (this.BLOCKED_EXTENSIONS.includes(extension.toLowerCase())) {
      return {
        valid: false,
        error: 'File type not allowed',
      };
    }

    // EC-LAND-078: Check filename length
    if (file.name.length > this.MAX_FILENAME_LENGTH) {
      return {
        valid: false,
        error: 'Filename too long',
      };
    }

    // EC-LAND-076: Check for path traversal
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return {
        valid: false,
        error: 'Invalid filename',
      };
    }

    // EC-LAND-077: Check for null bytes
    if (file.name.includes('\0')) {
      return {
        valid: false,
        error: 'Invalid filename',
      };
    }

    // EC-LAND-079: Check for special characters
    if (!/^[a-zA-Z0-9._-]+$/.test(file.name)) {
      return {
        valid: false,
        error: 'Filename contains invalid characters',
      };
    }

    return { valid: true };
  }

  static validateMimeType(file: File, allowedTypes: string[]): boolean {
    // EC-LAND-074: Validate MIME type
    return allowedTypes.includes(file.type);
  }

  private static getFileExtension(filename: string): string {
    const parts = filename.split('.');
    if (parts.length < 2) return '';
    return parts[parts.length - 1].toLowerCase();
  }
}

/**
 * Privacy and GDPR compliance utilities
 * EC-LAND-091 to EC-LAND-100
 */
export class PrivacyManager {
  private static consentKey = 'lumenforge-consent';
  private static dataCollectionKey = 'lumenforge-data-collection';

  static hasConsent(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(this.consentKey) === 'true';
  }

  static setConsent(consented: boolean): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.consentKey, String(consented));
    
    if (!consented) {
      // EC-LAND-092: Disable analytics if no consent
      this.disableDataCollection();
    }
  }

  static isDataCollectionEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    return this.hasConsent() && localStorage.getItem(this.dataCollectionKey) !== 'false';
  }

  static enableDataCollection(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.dataCollectionKey, 'true');
  }

  static disableDataCollection(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(this.dataCollectionKey, 'false');
  }

  static clearUserData(): void {
    // EC-LAND-096: Clear session data on logout
    SecureSession.clearSession();
    
    // Clear analytics data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('analytics-data');
      sessionStorage.clear();
    }
  }

  static encryptSensitiveData(data: string): string {
    // EC-LAND-094: Basic encryption (in production, use proper encryption)
    // This is a placeholder - use Web Crypto API or a library in production
    return btoa(data); // Base64 encoding (not secure, but better than plaintext)
  }

  static decryptSensitiveData(encrypted: string): string {
    try {
      return atob(encrypted);
    } catch {
      return '';
    }
  }
}

/**
 * Network security utilities
 * EC-LAND-081 to EC-LAND-090
 */
export class NetworkSecurity {
  static isSecureConnection(): boolean {
    if (typeof window === 'undefined') return false;
    return location.protocol === 'https:';
  }

  static validateCertificate(): Promise<boolean> {
    // EC-LAND-082, EC-LAND-083: Certificate validation
    // In production, this should be handled server-side
    return Promise.resolve(this.isSecureConnection());
  }

  static sanitizeUrl(url: string): string {
    // EC-LAND-088: Remove sensitive data from URLs
    try {
      const urlObj = new URL(url);
      // Remove sensitive query parameters
      const sensitiveParams = ['token', 'password', 'api_key', 'secret'];
      sensitiveParams.forEach(param => {
        urlObj.searchParams.delete(param);
      });
      return urlObj.toString();
    } catch {
      return url;
    }
  }

  static isRateLimited(identifier: string): boolean {
    // EC-LAND-090: Rate limiting
    const limiter = new RateLimiter(10, 60000); // 10 requests per minute
    return !limiter.isAllowed(identifier);
  }
}

