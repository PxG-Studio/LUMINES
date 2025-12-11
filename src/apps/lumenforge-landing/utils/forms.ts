/**
 * Forms Utilities
 * EC-LAND-861 to EC-LAND-870: Forms & Inputs
 */
import { sanitizeInput } from './sanitize';

// Simple validation rules
const validationRules: Record<string, ((value: string) => boolean) | ((...args: any[]) => (value: string) => boolean)> = {
  required: (value: string) => value.trim().length > 0,
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (min: number) => (value: string) => value.length >= min,
  maxLength: (max: number) => (value: string) => value.length <= max,
  pattern: (pattern: RegExp) => (value: string) => pattern.test(value),
};

/**
 * Form Manager
 * EC-LAND-861 to EC-LAND-870
 */
export class FormManager {
  /**
   * Make form accessible
   * EC-LAND-861: Accessible forms
   */
  static makeAccessible(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll<HTMLElement>('input, textarea, select');
    
    inputs.forEach((input, index) => {
      const id = input.id || `form-input-${index}`;
      input.id = id;

      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        const label = form.querySelector(`label[for="${id}"]`);
        if (label) {
          input.setAttribute('aria-labelledby', id);
          label.id = `${id}-label`;
        } else {
          input.setAttribute('aria-label', input.getAttribute('placeholder') || 'Form input');
        }
      }

      if (input.hasAttribute('required')) {
        input.setAttribute('aria-required', 'true');
      }
    });
  }

  /**
   * Validate form
   * EC-LAND-862: Form validation
   */
  static validateForm(form: HTMLFormElement): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');

    inputs.forEach(input => {
      const value = input.value;
      const rules = input.getAttribute('data-validation')?.split(',') || [];

      rules.forEach(rule => {
        const trimmedRule = rule.trim();
        let isValid = true;

        // Handle rule with parameters (e.g., "minLength:5")
        if (trimmedRule.includes(':')) {
          const [ruleName, param] = trimmedRule.split(':');
          if (ruleName === 'minLength') {
            const min = parseInt(param, 10);
            isValid = value.length >= min;
          } else if (ruleName === 'maxLength') {
            const max = parseInt(param, 10);
            isValid = value.length <= max;
          }
        } else {
          const ruleFn = validationRules[trimmedRule as keyof typeof validationRules];
          if (typeof ruleFn === 'function') {
            // Check if it's a direct validator (takes 1 string arg) or factory function
            if (ruleFn.length === 1) {
              isValid = (ruleFn as (value: string) => boolean)(value);
            }
          }
        }

        if (!isValid) {
          const fieldName = input.name || input.id || 'field';
          errors[fieldName] = errors[fieldName] || `${fieldName} validation failed: ${trimmedRule}`;
        }
      });

      if (input.hasAttribute('required') && !value.trim()) {
        const fieldName = input.name || input.id || 'field';
        errors[fieldName] = errors[fieldName] || `${fieldName} is required`;
      }
    });

    return {
      valid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Make form user-friendly
   * EC-LAND-863: User-friendly forms
   */
  static makeUserFriendly(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');

    inputs.forEach(input => {
      // Add helpful placeholder if missing
      if (!input.placeholder && input.type !== 'submit' && input.type !== 'button') {
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (label) {
          input.placeholder = `Enter ${label.textContent?.toLowerCase() || 'value'}`;
        }
      }

      // Add autocomplete hints
      if (input.type === 'email' && !input.hasAttribute('autocomplete')) {
        input.setAttribute('autocomplete', 'email');
      } else if (input.type === 'password' && !input.hasAttribute('autocomplete')) {
        input.setAttribute('autocomplete', 'current-password');
      }
    });
  }

  /**
   * Make form mobile-friendly
   * EC-LAND-864: Mobile-friendly forms
   */
  static makeMobileFriendly(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');

    inputs.forEach(input => {
      // Set appropriate input mode for mobile keyboards
      if (input.type === 'email' && !input.hasAttribute('inputmode')) {
        input.setAttribute('inputmode', 'email');
      } else if (input.type === 'tel' && !input.hasAttribute('inputmode')) {
        input.setAttribute('inputmode', 'tel');
      } else if (input.type === 'number' && !input.hasAttribute('inputmode')) {
        input.setAttribute('inputmode', 'numeric');
      }

      // Ensure touch targets are large enough
      if (input.offsetHeight < 44) {
        input.style.minHeight = '44px';
      }
    });
  }

  /**
   * Localize form
   * EC-LAND-865: Localized forms
   */
  static localizeForm(form: HTMLFormElement, locale: string): void {
    // In a real app, you'd translate labels, placeholders, and error messages
    form.setAttribute('lang', locale);
  }

  /**
   * Optimize form
   * EC-LAND-867: Optimized forms
   */
  static optimizeForm(form: HTMLFormElement): void {
    // Debounce validation
    const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea');
    let debounceTimer: number | null = null;

    inputs.forEach(input => {
      input.addEventListener('input', () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = window.setTimeout(() => {
          const value = input.value;
          const sanitized = sanitizeInput(value);
          if (value !== sanitized) {
            input.value = sanitized;
          }
        }, 300);
      });
    });
  }

  /**
   * Ensure form consistency
   * EC-LAND-868: Consistent forms
   */
  static ensureConsistency(forms: HTMLFormElement[]): void {
    forms.forEach(form => {
      if (!form.hasAttribute('novalidate')) {
        form.setAttribute('novalidate', 'true'); // Use custom validation
      }

      const submitButton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
      if (submitButton && !submitButton.hasAttribute('aria-label')) {
        submitButton.setAttribute('aria-label', 'Submit form');
      }
    });
  }

  /**
   * Recover form
   * EC-LAND-869: Form recovery
   */
  static recoverForm(form: HTMLFormElement): void {
    try {
      const formData = new FormData(form);
      const data: Record<string, string> = {};

      formData.forEach((value, key) => {
        data[key] = value.toString();
      });

      // Save to session storage
      sessionStorage.setItem(`form-recovery-${form.id || 'default'}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Form recovery failed:', error);
    }
  }

  /**
   * Restore form
   * EC-LAND-869: Form recovery
   */
  static restoreForm(form: HTMLFormElement): void {
    try {
      const stored = sessionStorage.getItem(`form-recovery-${form.id || 'default'}`);
      if (!stored) return;

      const data = JSON.parse(stored) as Record<string, string>;

      Object.keys(data).forEach(key => {
        const input = form.querySelector<HTMLInputElement | HTMLTextAreaElement>(`[name="${key}"]`);
        if (input) {
          input.value = data[key];
        }
      });
    } catch (error) {
      console.warn('Form restoration failed:', error);
    }
  }

  /**
   * Monitor form
   * EC-LAND-870: Form monitoring
   */
  private static formMetrics = new Map<string, { submissions: number; errors: number; startTime: number }>();

  static trackForm(form: HTMLFormElement): void {
    const formId = form.id || 'default';
    if (!this.formMetrics.has(formId)) {
      this.formMetrics.set(formId, { submissions: 0, errors: 0, startTime: Date.now() });
    }

    form.addEventListener('submit', () => {
      const metrics = this.formMetrics.get(formId);
      if (metrics) {
        metrics.submissions++;
      }
    });
  }

  static trackFormError(form: HTMLFormElement): void {
    const formId = form.id || 'default';
    const metrics = this.formMetrics.get(formId);
    if (metrics) {
      metrics.errors++;
    }
  }

  static getFormMetrics(formId: string) {
    return this.formMetrics.get(formId);
  }
}

