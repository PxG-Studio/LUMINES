/**
 * Data Validation Utilities
 * EC-LAND-951 to EC-LAND-1000: Data Validation Edge Cases
 */
import { sanitizeInput } from './sanitize';
import { ARIAManager } from './accessibility';

/**
 * Input Validation Manager
 * EC-LAND-951 to EC-LAND-960
 */
export class InputValidationManager {
  /**
   * Validate input
   * EC-LAND-951: Input validation done
   */
  static validateInput(value: string, rules: InputValidationRule[]): ValidationResult {
    const errors: string[] = [];

    rules.forEach(rule => {
      const result = this.validateRule(value, rule);
      if (!result.valid) {
        errors.push(result.error || 'Validation failed');
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Comprehensive validation
   * EC-LAND-952: Comprehensive input validation
   */
  static validateComprehensive(value: string, rules: InputValidationRule[]): ComprehensiveValidationResult {
    const validation = this.validateInput(value, rules);
    const sanitized = sanitizeInput(value);
    const normalized = this.normalizeInput(value);

    return {
      ...validation,
      sanitized,
      normalized,
      original: value,
    };
  }

  /**
   * Real-time validation
   * EC-LAND-953: Real-time input validation
   */
  static validateRealTime(
    value: string,
    rules: InputValidationRule[],
    callback: (result: ValidationResult) => void
  ): () => void {
    let debounceTimer: number | null = null;

    const validate = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }

      debounceTimer = window.setTimeout(() => {
        const result = this.validateInput(value, rules);
        callback(result);
      }, 300);
    };

    validate();

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }

  /**
   * Accessible validation
   * EC-LAND-954: Accessible input validation
   */
  static validateAccessible(
    input: HTMLInputElement | HTMLTextAreaElement,
    rules: InputValidationRule[]
  ): ValidationResult {
    const value = input.value;
    const result = this.validateInput(value, rules);

    // Announce validation errors to screen readers
    if (!result.valid && result.errors.length > 0) {
      ARIAManager.announce(result.errors.join(', '), 'assertive');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', input.id + '-error');
    } else {
      input.setAttribute('aria-invalid', 'false');
      input.removeAttribute('aria-describedby');
    }

    return result;
  }

  /**
   * Localized validation
   * EC-LAND-955: Localized input validation
   */
  static validateLocalized(
    value: string,
    rules: InputValidationRule[],
    _locale: string = 'en'
  ): ValidationResult {
    const result = this.validateInput(value, rules);

    // In a real app, you'd translate error messages based on locale
    const localizedErrors = result.errors.map(error => {
      // Placeholder for localization
      return error;
    });

    return {
      valid: result.valid,
      errors: localizedErrors,
    };
  }

  /**
   * Consistent validation
   * EC-LAND-956: Consistent input validation
   */
  static validateConsistent(
    value: string,
    rules: InputValidationRule[],
    _context?: string
  ): ValidationResult {
    // Ensure consistent validation rules across the app
    const normalizedRules = this.normalizeRules(rules);
    return this.validateInput(value, normalizedRules);
  }

  /**
   * Optimized validation
   * EC-LAND-958: Optimized input validation
   */
  static validateOptimized(value: string, rules: InputValidationRule[]): ValidationResult {
    // Cache validation results
    const cacheKey = `${value}-${JSON.stringify(rules)}`;
    const cached = this.validationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = this.validateInput(value, rules);
    this.validationCache.set(cacheKey, result);

    // Limit cache size
    if (this.validationCache.size > 100) {
      const firstKey = this.validationCache.keys().next().value;
      if (firstKey) {
        this.validationCache.delete(firstKey);
      }
    }

    return result;
  }

  /**
   * Recoverable validation
   * EC-LAND-959: Recoverable input validation
   */
  static validateRecoverable(
    value: string,
    rules: InputValidationRule[],
    fallback: string = ''
  ): ValidationResult {
    try {
      return this.validateInput(value, rules);
    } catch (error) {
      console.warn('Validation error, using fallback:', error);
      return this.validateInput(fallback, rules);
    }
  }

  /**
   * Monitor validation
   * EC-LAND-960: Input validation monitoring
   */
  private static validationMetrics = new Map<string, { validations: number; errors: number }>();

  static trackValidation(fieldName: string, valid: boolean): void {
    const metrics = this.validationMetrics.get(fieldName) || { validations: 0, errors: 0 };
    metrics.validations++;
    if (!valid) metrics.errors++;
    this.validationMetrics.set(fieldName, metrics);
  }

  static getValidationMetrics(fieldName: string) {
    return this.validationMetrics.get(fieldName);
  }

  // Helper methods
  private static validationCache = new Map<string, ValidationResult>();

  private static validateRule(value: string, rule: InputValidationRule): { valid: boolean; error?: string } {
    switch (rule.type) {
      case 'required':
        return { valid: value.trim().length > 0, error: rule.message || 'This field is required' };
      case 'minLength':
        return { valid: value.length >= (rule.min || 0), error: rule.message || `Minimum length is ${rule.min}` };
      case 'maxLength':
        return { valid: value.length <= (rule.max || Infinity), error: rule.message || `Maximum length is ${rule.max}` };
      case 'pattern':
        return { valid: rule.pattern?.test(value) || false, error: rule.message || 'Invalid format' };
      case 'email':
        return { valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), error: rule.message || 'Invalid email address' };
      case 'url':
        return { valid: /^https?:\/\/.+/.test(value), error: rule.message || 'Invalid URL' };
      default:
        return { valid: true };
    }
  }

  private static normalizeInput(value: string): string {
    return value.trim().toLowerCase();
  }

  private static normalizeRules(rules: InputValidationRule[]): InputValidationRule[] {
    // Remove duplicates and normalize rule order
    const seen = new Set<string>();
    return rules.filter(rule => {
      const key = rule.type;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

/**
 * Output Validation Manager
 * EC-LAND-961 to EC-LAND-970
 */
export class OutputValidationManager {
  /**
   * Validate output
   * EC-LAND-961: Output validation done
   */
  static validateOutput(value: any, rules: OutputValidationRule[]): ValidationResult {
    const errors: string[] = [];

    rules.forEach(rule => {
      const result = this.validateRule(value, rule);
      if (!result.valid) {
        errors.push(result.error || 'Validation failed');
      }
    });

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Comprehensive output validation
   * EC-LAND-962: Comprehensive output validation
   */
  static validateComprehensive(value: any, rules: OutputValidationRule[]): ComprehensiveValidationResult {
    const validation = this.validateOutput(value, rules);
    const sanitized = this.sanitizeOutput(value);
    const normalized = this.normalizeOutput(value);

    return {
      ...validation,
      sanitized,
      normalized,
      original: value,
    };
  }

  /**
   * Sanitize output
   * EC-LAND-963: Sanitized output validation
   */
  static sanitizeOutput(value: any): any {
    if (typeof value === 'string') {
      return sanitizeInput(value);
    }
    if (Array.isArray(value)) {
      return value.map(item => this.sanitizeOutput(item));
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: Record<string, any> = {};
      Object.keys(value).forEach(key => {
        sanitized[key] = this.sanitizeOutput(value[key]);
      });
      return sanitized;
    }
    return value;
  }

  /**
   * Accessible output validation
   * EC-LAND-964: Accessible output validation
   */
  static validateAccessible(
    element: HTMLElement,
    value: any,
    rules: OutputValidationRule[]
  ): ValidationResult {
    const result = this.validateOutput(value, rules);

    if (!result.valid && result.errors.length > 0) {
      element.setAttribute('aria-invalid', 'true');
      element.setAttribute('aria-describedby', element.id + '-error');
    } else {
      element.setAttribute('aria-invalid', 'false');
      element.removeAttribute('aria-describedby');
    }

    return result;
  }

  /**
   * Localized output validation
   * EC-LAND-965: Localized output validation
   */
  static validateLocalized(
    value: any,
    rules: OutputValidationRule[],
    _locale: string = 'en'
  ): ValidationResult {
    const result = this.validateOutput(value, rules);

    // In a real app, you'd translate error messages based on locale
    const localizedErrors = result.errors.map(error => {
      // Placeholder for localization
      return error;
    });

    return {
      valid: result.valid,
      errors: localizedErrors,
    };
  }

  /**
   * Consistent output validation
   * EC-LAND-966: Consistent output validation
   */
  static validateConsistent(value: any, rules: OutputValidationRule[]): ValidationResult {
    const normalizedRules = this.normalizeRules(rules);
    return this.validateOutput(value, normalizedRules);
  }

  /**
   * Optimized output validation
   * EC-LAND-968: Optimized output validation
   */
  static validateOptimized(value: any, rules: OutputValidationRule[]): ValidationResult {
    // Cache validation results
    const cacheKey = `${JSON.stringify(value)}-${JSON.stringify(rules)}`;
    const cached = this.validationCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const result = this.validateOutput(value, rules);
    this.validationCache.set(cacheKey, result);

    // Limit cache size
    if (this.validationCache.size > 100) {
      const firstKey = this.validationCache.keys().next().value;
      if (firstKey) {
        this.validationCache.delete(firstKey);
      }
    }

    return result;
  }

  /**
   * Recoverable output validation
   * EC-LAND-969: Recoverable output validation
   */
  static validateRecoverable(
    value: any,
    rules: OutputValidationRule[],
    fallback: any = null
  ): ValidationResult {
    try {
      return this.validateOutput(value, rules);
    } catch (error) {
      console.warn('Output validation error, using fallback:', error);
      return this.validateOutput(fallback, rules);
    }
  }

  /**
   * Monitor output validation
   * EC-LAND-970: Output validation monitoring
   */
  private static validationMetrics = new Map<string, { validations: number; errors: number }>();

  static trackValidation(fieldName: string, valid: boolean): void {
    const metrics = this.validationMetrics.get(fieldName) || { validations: 0, errors: 0 };
    metrics.validations++;
    if (!valid) metrics.errors++;
    this.validationMetrics.set(fieldName, metrics);
  }

  static getValidationMetrics(fieldName: string) {
    return this.validationMetrics.get(fieldName);
  }

  // Helper methods
  private static validationCache = new Map<string, ValidationResult>();

  private static validateRule(value: any, rule: OutputValidationRule): { valid: boolean; error?: string } {
    switch (rule.type) {
      case 'type':
        return { valid: typeof value === rule.expectedType, error: rule.message || `Expected ${rule.expectedType}` };
      case 'notNull':
        return { valid: value !== null && value !== undefined, error: rule.message || 'Value cannot be null' };
      case 'notEmpty':
        return { valid: value !== '' && value !== null && value !== undefined, error: rule.message || 'Value cannot be empty' };
      default:
        return { valid: true };
    }
  }

  private static normalizeOutput(value: any): any {
    if (typeof value === 'string') {
      return value.trim();
    }
    return value;
  }

  private static normalizeRules(rules: OutputValidationRule[]): OutputValidationRule[] {
    const seen = new Set<string>();
    return rules.filter(rule => {
      const key = rule.type;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}

/**
 * Data Type Validation Manager
 * EC-LAND-971 to EC-LAND-980
 */
export class DataTypeValidationManager {
  /**
   * Validate data type
   * EC-LAND-971: Data types validated
   */
  static validateType(value: any, expectedType: string): ValidationResult {
    const actualType = typeof value;
    const isValid = actualType === expectedType;

    return {
      valid: isValid,
      errors: isValid ? [] : [`Expected ${expectedType}, got ${actualType}`],
    };
  }

  /**
   * Check data type
   * EC-LAND-972: Data types checked
   */
  static checkType(value: any): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  /**
   * Convert data type
   * EC-LAND-973: Data types converted
   */
  static convertType(value: any, targetType: string): any {
    try {
      switch (targetType) {
        case 'string':
          return String(value);
        case 'number':
          return Number(value);
        case 'boolean':
          return Boolean(value);
        case 'array':
          return Array.isArray(value) ? value : [value];
        case 'object':
          return typeof value === 'object' ? value : { value };
        default:
          return value;
      }
    } catch (error) {
      console.warn('Type conversion failed:', error);
      return value;
    }
  }

  /**
   * Normalize data type
   * EC-LAND-974: Data types normalized
   */
  static normalizeType(value: any): any {
    if (value === null || value === undefined) return null;
    if (typeof value === 'string') return value.trim();
    if (typeof value === 'number') return isNaN(value) ? 0 : value;
    if (typeof value === 'boolean') return value;
    if (Array.isArray(value)) return value.map(item => this.normalizeType(item));
    if (typeof value === 'object') {
      const normalized: Record<string, any> = {};
      Object.keys(value).forEach(key => {
        normalized[key] = this.normalizeType(value[key]);
      });
      return normalized;
    }
    return value;
  }

  /**
   * Ensure consistent data types
   * EC-LAND-975: Data types consistent
   */
  static ensureConsistency(values: any[], expectedType: string): any[] {
    return values.map(value => {
      const currentType = this.checkType(value);
      if (currentType !== expectedType) {
        return this.convertType(value, expectedType);
      }
      return value;
    });
  }

  /**
   * Monitor data types
   * EC-LAND-980: Data types monitored
   */
  private static typeMetrics = new Map<string, { count: number; types: Record<string, number> }>();

  static trackType(fieldName: string, value: any): void {
    const metrics = this.typeMetrics.get(fieldName) || { count: 0, types: {} };
    metrics.count++;
    const type = this.checkType(value);
    metrics.types[type] = (metrics.types[type] || 0) + 1;
    this.typeMetrics.set(fieldName, metrics);
  }

  static getTypeMetrics(fieldName: string) {
    return this.typeMetrics.get(fieldName);
  }
}

/**
 * Data Format Validation Manager
 * EC-LAND-981 to EC-LAND-990
 */
export class DataFormatValidationManager {
  /**
   * Validate data format
   * EC-LAND-981: Data formats validated
   */
  static validateFormat(value: string, format: string): ValidationResult {
    const patterns: Record<string, RegExp> = {
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      url: /^https?:\/\/.+/,
      phone: /^\+?[\d\s-()]+$/,
      date: /^\d{4}-\d{2}-\d{2}$/,
      time: /^\d{2}:\d{2}(:\d{2})?$/,
      datetime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?/,
      uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
      hex: /^[0-9a-f]+$/i,
      base64: /^[A-Za-z0-9+/]+=*$/,
    };

    const pattern = patterns[format];
    if (!pattern) {
      return { valid: false, errors: [`Unknown format: ${format}`] };
    }

    const isValid = pattern.test(value);
    return {
      valid: isValid,
      errors: isValid ? [] : [`Invalid ${format} format`],
    };
  }

  /**
   * Check data format
   * EC-LAND-982: Data formats checked
   */
  static checkFormat(value: string): string | null {
    const formats = ['email', 'url', 'phone', 'date', 'time', 'datetime', 'uuid', 'hex', 'base64'];
    for (const format of formats) {
      const result = this.validateFormat(value, format);
      if (result.valid) {
        return format;
      }
    }
    return null;
  }

  /**
   * Convert data format
   * EC-LAND-983: Data formats converted
   */
  static convertFormat(value: string, targetFormat: string): string {
    try {
      switch (targetFormat) {
        case 'lowercase':
          return value.toLowerCase();
        case 'uppercase':
          return value.toUpperCase();
        case 'trim':
          return value.trim();
        case 'slug':
          return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        default:
          return value;
      }
    } catch (error) {
      console.warn('Format conversion failed:', error);
      return value;
    }
  }

  /**
   * Normalize data format
   * EC-LAND-984: Data formats normalized
   */
  static normalizeFormat(value: string, format: string): string {
    switch (format) {
      case 'email':
        return value.toLowerCase().trim();
      case 'url':
        return value.trim().toLowerCase();
      case 'phone':
        return value.replace(/\D/g, '');
      case 'date':
        return value.trim();
      default:
        return value.trim();
    }
  }

  /**
   * Ensure consistent data formats
   * EC-LAND-985: Data formats consistent
   */
  static ensureConsistency(values: string[], format: string): string[] {
    return values.map(value => this.normalizeFormat(value, format));
  }

  /**
   * Monitor data formats
   * EC-LAND-990: Data formats monitored
   */
  private static formatMetrics = new Map<string, { count: number; formats: Record<string, number> }>();

  static trackFormat(fieldName: string, value: string): void {
    const metrics = this.formatMetrics.get(fieldName) || { count: 0, formats: {} };
    metrics.count++;
    const format = this.checkFormat(value) || 'unknown';
    metrics.formats[format] = (metrics.formats[format] || 0) + 1;
    this.formatMetrics.set(fieldName, metrics);
  }

  static getFormatMetrics(fieldName: string) {
    return this.formatMetrics.get(fieldName);
  }
}

/**
 * Data Range Validation Manager
 * EC-LAND-991 to EC-LAND-1000
 */
export class DataRangeValidationManager {
  /**
   * Validate data range
   * EC-LAND-991: Data ranges validated
   */
  static validateRange(value: number, min?: number, max?: number): ValidationResult {
    const errors: string[] = [];

    if (min !== undefined && value < min) {
      errors.push(`Value must be at least ${min}`);
    }
    if (max !== undefined && value > max) {
      errors.push(`Value must be at most ${max}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check data range
   * EC-LAND-992: Data ranges checked
   */
  static checkRange(value: number, min?: number, max?: number): boolean {
    const result = this.validateRange(value, min, max);
    return result.valid;
  }

  /**
   * Enforce data range
   * EC-LAND-993: Data ranges enforced
   */
  static enforceRange(value: number, min?: number, max?: number): number {
    if (min !== undefined && value < min) {
      return min;
    }
    if (max !== undefined && value > max) {
      return max;
    }
    return value;
  }

  /**
   * Ensure consistent data ranges
   * EC-LAND-994: Data ranges consistent
   */
  static ensureConsistency(values: number[], min?: number, max?: number): number[] {
    return values.map(value => this.enforceRange(value, min, max));
  }

  /**
   * Accessible data range validation
   * EC-LAND-1000: Data ranges accessible
   */
  static validateAccessible(
    input: HTMLInputElement,
    value: number,
    min?: number,
    max?: number
  ): ValidationResult {
    const result = this.validateRange(value, min, max);

    if (!result.valid && result.errors.length > 0) {
      ARIAManager.announce(result.errors.join(', '), 'assertive');
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', input.id + '-error');
      if (min !== undefined) input.setAttribute('aria-valuemin', String(min));
      if (max !== undefined) input.setAttribute('aria-valuemax', String(max));
      input.setAttribute('aria-valuenow', String(value));
    } else {
      input.setAttribute('aria-invalid', 'false');
      input.removeAttribute('aria-describedby');
      if (min !== undefined) input.setAttribute('aria-valuemin', String(min));
      if (max !== undefined) input.setAttribute('aria-valuemax', String(max));
      input.setAttribute('aria-valuenow', String(value));
    }

    return result;
  }

  /**
   * Monitor data ranges
   * EC-LAND-999: Data ranges monitored
   */
  private static rangeMetrics = new Map<string, { count: number; min: number; max: number; avg: number }>();

  static trackRange(fieldName: string, value: number): void {
    const metrics = this.rangeMetrics.get(fieldName) || { count: 0, min: Infinity, max: -Infinity, avg: 0 };
    metrics.count++;
    metrics.min = Math.min(metrics.min, value);
    metrics.max = Math.max(metrics.max, value);
    metrics.avg = (metrics.avg * (metrics.count - 1) + value) / metrics.count;
    this.rangeMetrics.set(fieldName, metrics);
  }

  static getRangeMetrics(fieldName: string) {
    return this.rangeMetrics.get(fieldName);
  }
}

// Type definitions
export interface InputValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'pattern' | 'email' | 'url';
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
}

export interface OutputValidationRule {
  type: 'type' | 'notNull' | 'notEmpty';
  expectedType?: string;
  message?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ComprehensiveValidationResult extends ValidationResult {
  sanitized: any;
  normalized: any;
  original: any;
}

