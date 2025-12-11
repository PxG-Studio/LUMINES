/**
 * Validation Utilities
 * EC-195, EC-196, EC-197: Advanced validation
 */
export type Validator<T = any> = (value: T) => boolean | string;

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class ValidatorBuilder<T = any> {
  private validators: Validator<T>[] = [];

  required(message = 'This field is required'): this {
    this.validators.push((value) => {
      if (value === null || value === undefined || value === '') {
        return message;
      }
      return true;
    });
    return this;
  }

  minLength(min: number, message?: string): this {
    this.validators.push((value) => {
      if (typeof value === 'string' && value.length < min) {
        return message || `Must be at least ${min} characters`;
      }
      return true;
    });
    return this;
  }

  maxLength(max: number, message?: string): this {
    this.validators.push((value) => {
      if (typeof value === 'string' && value.length > max) {
        return message || `Must be no more than ${max} characters`;
      }
      return true;
    });
    return this;
  }

  email(message = 'Please enter a valid email address'): this {
    this.validators.push((value) => {
      if (typeof value === 'string' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return message;
      }
      return true;
    });
    return this;
  }

  url(message = 'Please enter a valid URL'): this {
    this.validators.push((value) => {
      if (typeof value === 'string') {
        try {
          new URL(value);
          return true;
        } catch {
          return message;
        }
      }
      return true;
    });
    return this;
  }

  pattern(regex: RegExp, message = 'Invalid format'): this {
    this.validators.push((value) => {
      if (typeof value === 'string' && !regex.test(value)) {
        return message;
      }
      return true;
    });
    return this;
  }

  custom(validator: Validator<T>): this {
    this.validators.push(validator);
    return this;
  }

  validate(value: T): ValidationResult {
    const errors: string[] = [];

    for (const validator of this.validators) {
      const result = validator(value);
      if (result !== true) {
        errors.push(typeof result === 'string' ? result : 'Validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export function createValidator<T = any>(): ValidatorBuilder<T> {
  return new ValidatorBuilder<T>();
}

