/**
 * Input Sanitization and Prompt Injection Protection
 * 
 * Protects against prompt injection attacks and sanitizes user input
 */

export interface SanitizationResult {
  sanitized: string;
  warnings: string[];
  blocked: boolean;
  reason?: string;
}

/**
 * Known prompt injection patterns
 */
const PROMPT_INJECTION_PATTERNS = [
  // Direct instruction overrides
  /ignore\s+(previous|above|all)\s+(instructions|prompts?|commands?)/i,
  /forget\s+(everything|all|previous)/i,
  /disregard\s+(previous|above|all)/i,
  /override\s+(previous|system|instructions)/i,
  
  // System prompt manipulation
  /you\s+are\s+now\s+(a|an)\s+/i,
  /act\s+as\s+(if\s+)?(you\s+are\s+)?/i,
  /pretend\s+(to\s+be|that\s+you)/i,
  
  // Token manipulation
  /\[SYSTEM\]|\[INST\]|\[\/ASSISTANT\]/i,
  /<\|system\|>|<\|user\|>|<\|assistant\|>/i,
  
  // Encoding attempts
  /%[0-9A-F]{2}/i, // URL encoding
  /\\x[0-9A-F]{2}/i, // Hex encoding
  /\\u[0-9A-F]{4}/i, // Unicode encoding
  
  // Base64 attempts
  /[A-Za-z0-9+\/]{40,}={0,2}/, // Base64 encoded strings
  
  // Command injection
  /(exec|eval|system|shell_exec|passthru)\s*\(/i,
  /`[^`]+`/, // Backtick execution
  /\$\{[^}]+\}/, // Variable expansion
  
  // SQL injection patterns (if used in prompts)
  /(union|select|insert|update|delete|drop|create|alter)\s+.*(from|into|table|database)/i,
  /'(\s*or\s*|\s*and\s*)'?\d+'?\s*=\s*'?\d+'?/i,
  
  // XSS patterns
  /<script[^>]*>/i,
  /javascript:/i,
  /on\w+\s*=/i, // Event handlers
];

/**
 * Suspicious patterns (warnings, not blocked)
 */
const SUSPICIOUS_PATTERNS = [
  /password|secret|key|token|api[_-]?key/i,
  /http[s]?:\/\/[^\s]+/i, // URLs
  /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i, // Email addresses
  /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/, // IP addresses
];

/**
 * Maximum input size (characters)
 */
const MAX_INPUT_SIZE = 10000; // 10k characters

/**
 * Maximum line length
 */
const MAX_LINE_LENGTH = 500;

/**
 * Sanitize user input for AI prompts
 */
export function sanitizeInput(input: string): SanitizationResult {
  const warnings: string[] = [];
  let sanitized = input;

  // Check size
  if (input.length > MAX_INPUT_SIZE) {
    return {
      sanitized: input.slice(0, MAX_INPUT_SIZE),
      warnings: [`Input truncated from ${input.length} to ${MAX_INPUT_SIZE} characters`],
      blocked: false,
    };
  }

  // Check for prompt injection patterns
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(sanitized)) {
      return {
        sanitized: '',
        warnings: [],
        blocked: true,
        reason: `Detected prompt injection pattern: ${pattern.source}`,
      };
    }
  }

  // Check for suspicious patterns (warnings only)
  for (const pattern of SUSPICIOUS_PATTERNS) {
    if (pattern.test(sanitized)) {
      warnings.push(`Suspicious pattern detected: ${pattern.source}`);
    }
  }

  // Normalize whitespace (prevent hidden characters)
  sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Zero-width characters
  sanitized = sanitized.replace(/\r\n/g, '\n'); // Normalize line endings
  sanitized = sanitized.replace(/\r/g, '\n');

  // Check line length
  const lines = sanitized.split('\n');
  const longLines = lines.filter(line => line.length > MAX_LINE_LENGTH);
  if (longLines.length > 0) {
    warnings.push(`Found ${longLines.length} lines exceeding ${MAX_LINE_LENGTH} characters`);
  }

  // Remove control characters (except newlines and tabs)
  sanitized = sanitized.replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');

  // Trim excessive whitespace
  sanitized = sanitized.trim();

  return {
    sanitized,
    warnings,
    blocked: false,
  };
}

/**
 * Validate prompt doesn't contain injection attempts
 */
export function validatePrompt(prompt: string): { valid: boolean; error?: string } {
  const result = sanitizeInput(prompt);
  
  if (result.blocked) {
    return {
      valid: false,
      error: result.reason || 'Prompt contains potentially malicious content',
    };
  }

  if (result.sanitized.length === 0) {
    return {
      valid: false,
      error: 'Prompt is empty after sanitization',
    };
  }

  return { valid: true };
}

/**
 * Escape special characters for safe display
 */
export function escapeForDisplay(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

