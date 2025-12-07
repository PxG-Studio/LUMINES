interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validateCSharp(code: string): ValidationResult {
  const errors: string[] = [];

  // Basic syntax checks
  if (!code.trim()) {
    errors.push("Code is empty");
    return { isValid: false, errors };
  }

  // Check for balanced braces
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push("Mismatched braces");
  }

  // Check for using statements
  if (!code.includes("using")) {
    errors.push("Missing using statements");
  }

  // Check for class definition
  if (!code.match(/class\s+\w+/)) {
    errors.push("No class definition found");
  }

  // Check for Unity-specific requirements
  if (!code.includes("UnityEngine")) {
    errors.push("Missing UnityEngine namespace");
  }

  // Removed: Semicolon validation is too error-prone
  // Unity compiler will catch these errors during compilation

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function extractScriptName(code: string): string | null {
  // Match class name, including escaped keywords with @ prefix
  const match = code.match(/class\s+(@?\w+)/);
  return match ? match[1] : null;
}
