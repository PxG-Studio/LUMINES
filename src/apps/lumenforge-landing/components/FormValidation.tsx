/**
 * Form Validation Utilities
 * EC-061, EC-063, EC-064: Form validation and error handling
 */
import React from 'react';

export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validationRules = {
  required: (message = 'This field is required'): ValidationRule => ({
    test: (value) => value.trim().length > 0,
    message,
  }),
  
  minLength: (min: number, message?: string): ValidationRule => ({
    test: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),
  
  maxLength: (max: number, message?: string): ValidationRule => ({
    test: (value) => value.length <= max,
    message: message || `Must be no more than ${max} characters`,
  }),
  
  email: (message = 'Please enter a valid email address'): ValidationRule => ({
    test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  
  url: (message = 'Please enter a valid URL'): ValidationRule => ({
    test: (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),
  
  noSpecialChars: (message = 'Special characters not allowed'): ValidationRule => ({
    test: (value) => /^[a-zA-Z0-9\s]+$/.test(value),
    message,
  }),
};

export function validateInput(value: string, rules: ValidationRule[]): ValidationResult {
  const errors: string[] = [];
  
  for (const rule of rules) {
    if (!rule.test(value)) {
      errors.push(rule.message);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function useFormValidation<T extends Record<string, string>>(
  initialValues: T,
  validationSchema: Record<keyof T, ValidationRule[]>
) {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string[]>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({});

  const validate = React.useCallback((fieldName?: keyof T) => {
    const fieldsToValidate = fieldName ? [fieldName] : (Object.keys(validationSchema) as Array<keyof T>);
    const newErrors: Partial<Record<keyof T, string[]>> = {};

    for (const field of fieldsToValidate) {
      const rules = validationSchema[field];
      if (rules) {
        const result = validateInput(values[field] || '', rules);
        if (!result.isValid) {
          newErrors[field] = result.errors;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationSchema]);

  const handleChange = React.useCallback((fieldName: keyof T, value: string) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));
    if (touched[fieldName]) {
      validate(fieldName);
    }
  }, [touched, validate]);

  const handleBlur = React.useCallback((fieldName: keyof T) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    validate(fieldName);
  }, [validate]);

  const handleSubmit = React.useCallback((onSubmit: (values: T) => void) => {
    setTouched(Object.keys(validationSchema).reduce((acc, key) => {
      acc[key as keyof T] = true;
      return acc;
    }, {} as Partial<Record<keyof T, boolean>>));
    
    if (validate()) {
      onSubmit(values);
    }
  }, [values, validate, validationSchema]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
  };
}

