export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  line?: number;
  column?: number;
  message: string;
  severity: 'error';
  code?: string;
}

export interface ValidationWarning {
  line?: number;
  column?: number;
  message: string;
  severity: 'warning';
  code?: string;
}

export class CSharpValidator {
  static validate(code: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    this.validateBraces(code, errors);
    this.validateParentheses(code, errors);
    this.validateSemicolons(code, errors, warnings);
    this.validateUnityAPIs(code, warnings);
    this.validateNamingConventions(code, warnings);
    this.validateEmptyBlocks(code, warnings);

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  private static validateBraces(code: string, errors: ValidationError[]): void {
    const lines = code.split('\n');
    let braceCount = 0;
    let lineNumber = 0;

    for (const line of lines) {
      lineNumber++;
      const stripped = this.stripComments(line);

      for (let i = 0; i < stripped.length; i++) {
        if (stripped[i] === '{') {
          braceCount++;
        } else if (stripped[i] === '}') {
          braceCount--;
          if (braceCount < 0) {
            errors.push({
              line: lineNumber,
              column: i + 1,
              message: 'Unexpected closing brace',
              severity: 'error',
              code: 'CS1002',
            });
          }
        }
      }
    }

    if (braceCount > 0) {
      errors.push({
        message: `Missing ${braceCount} closing brace(s)`,
        severity: 'error',
        code: 'CS1513',
      });
    } else if (braceCount < 0) {
      errors.push({
        message: `${Math.abs(braceCount)} extra closing brace(s)`,
        severity: 'error',
        code: 'CS1513',
      });
    }
  }

  private static validateParentheses(code: string, errors: ValidationError[]): void {
    const lines = code.split('\n');
    let parenCount = 0;
    let lineNumber = 0;

    for (const line of lines) {
      lineNumber++;
      const stripped = this.stripComments(line);

      for (let i = 0; i < stripped.length; i++) {
        if (stripped[i] === '(') {
          parenCount++;
        } else if (stripped[i] === ')') {
          parenCount--;
          if (parenCount < 0) {
            errors.push({
              line: lineNumber,
              column: i + 1,
              message: 'Unexpected closing parenthesis',
              severity: 'error',
              code: 'CS1026',
            });
          }
        }
      }
    }

    if (parenCount !== 0) {
      errors.push({
        message: 'Mismatched parentheses',
        severity: 'error',
        code: 'CS1026',
      });
    }
  }

  private static validateSemicolons(
    code: string,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): void {
    const lines = code.split('\n');
    const statementKeywords = [
      'return', 'break', 'continue', 'throw',
      'var', 'int', 'string', 'bool', 'float', 'double',
    ];

    lines.forEach((line, index) => {
      const stripped = this.stripComments(line).trim();

      if (!stripped || stripped.endsWith('{') || stripped.endsWith('}')) {
        return;
      }

      const hasStatementKeyword = statementKeywords.some((kw) =>
        stripped.startsWith(kw + ' ')
      );

      if (hasStatementKeyword && !stripped.endsWith(';')) {
        warnings.push({
          line: index + 1,
          message: 'Statement may be missing semicolon',
          severity: 'warning',
          code: 'CS1002',
        });
      }
    });
  }

  private static validateUnityAPIs(code: string, warnings: ValidationWarning[]): void {
    const unityAPIs = [
      { api: 'Debug.Log', requires: 'using UnityEngine;' },
      { api: 'GameObject', requires: 'using UnityEngine;' },
      { api: 'Transform', requires: 'using UnityEngine;' },
      { api: 'Vector3', requires: 'using UnityEngine;' },
      { api: 'Quaternion', requires: 'using UnityEngine;' },
      { api: 'Time.deltaTime', requires: 'using UnityEngine;' },
      { api: 'Input.', requires: 'using UnityEngine;' },
    ];

    unityAPIs.forEach(({ api, requires }) => {
      if (code.includes(api) && !code.includes(requires)) {
        warnings.push({
          message: `'${api}' used but '${requires}' not imported`,
          severity: 'warning',
          code: 'CS0246',
        });
      }
    });
  }

  private static validateNamingConventions(
    code: string,
    warnings: ValidationWarning[]
  ): void {
    const classPattern = /class\s+([a-z][a-zA-Z0-9]*)/g;
    let match;

    while ((match = classPattern.exec(code)) !== null) {
      warnings.push({
        message: `Class name '${match[1]}' should start with uppercase letter (PascalCase)`,
        severity: 'warning',
        code: 'CS1591',
      });
    }

    const methodPattern = /\s+(public|private|protected)\s+\w+\s+([a-z][a-zA-Z0-9]*)\s*\(/g;
    while ((match = methodPattern.exec(code)) !== null) {
      warnings.push({
        message: `Method name '${match[2]}' should start with uppercase letter (PascalCase)`,
        severity: 'warning',
        code: 'CS1591',
      });
    }
  }

  private static validateEmptyBlocks(code: string, warnings: ValidationWarning[]): void {
    const emptyBlockPattern = /\{\s*\}/g;
    const matches = code.match(emptyBlockPattern);

    if (matches && matches.length > 0) {
      warnings.push({
        message: `Found ${matches.length} empty code block(s)`,
        severity: 'warning',
        code: 'CS0642',
      });
    }
  }

  private static stripComments(line: string): string {
    let result = '';
    let inString = false;
    let stringChar = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (!inString) {
        if ((char === '"' || char === "'") && line[i - 1] !== '\\') {
          inString = true;
          stringChar = char;
          result += char;
        } else if (char === '/' && nextChar === '/') {
          break;
        } else {
          result += char;
        }
      } else {
        result += char;
        if (char === stringChar && line[i - 1] !== '\\') {
          inString = false;
        }
      }
    }

    return result;
  }
}

export class ShaderValidator {
  static validate(code: string): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    if (!code.includes('Shader ')) {
      errors.push({
        message: 'Shader definition not found',
        severity: 'error',
      });
    }

    if (!code.includes('SubShader')) {
      errors.push({
        message: 'SubShader block required',
        severity: 'error',
      });
    }

    if (code.includes('CGPROGRAM') && !code.includes('ENDCG')) {
      errors.push({
        message: 'CGPROGRAM block not closed with ENDCG',
        severity: 'error',
      });
    }

    if (!code.includes('Pass') && code.includes('CGPROGRAM')) {
      warnings.push({
        message: 'CGPROGRAM should be inside Pass block',
        severity: 'warning',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
