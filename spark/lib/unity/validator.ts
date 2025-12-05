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

  // Check for MonoBehaviour (common for Unity scripts)
  const hasMonoBehaviour = code.includes("MonoBehaviour");
  const hasScriptableObject = code.includes("ScriptableObject");

  if (!hasMonoBehaviour && !hasScriptableObject) {
    // This is just a warning, not an error
    // Some scripts might not derive from these
  }

  // Check for semicolons in likely places (basic check)
  const statements = code.match(/\w+\s*=\s*[^;]+$/gm);
  if (statements && statements.length > 0) {
    errors.push("Possible missing semicolons");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function extractScriptName(code: string): string | null {
  const match = code.match(/class\s+(\w+)/);
  return match ? match[1] : null;
}
