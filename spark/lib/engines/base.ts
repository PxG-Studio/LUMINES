/**
 * Base Engine Adapter Interface
 * 
 * Defines the common interface for all game engine adapters
 */

export interface GenerateResult {
  success: boolean;
  code?: string;
  scriptName?: string;
  error?: string;
  tokensUsed?: number;
  inputTokens?: number;
  outputTokens?: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ line: number; column: number; message: string }>;
  warnings: Array<{ line: number; column: number; message: string }>;
}

export interface ExportOptions {
  format?: 'zip' | 'tar' | 'directory';
  includeAssets?: boolean;
  includeMetadata?: boolean;
}

export interface EngineAdapter {
  /**
   * Engine identifier
   */
  readonly engineId: string;
  
  /**
   * Engine display name
   */
  readonly displayName: string;
  
  /**
   * Supported file extensions
   */
  readonly supportedExtensions: string[];
  
  /**
   * Generate code for this engine
   */
  generate(
    prompt: string,
    options?: {
      provider?: 'claude' | 'openai';
      claudeModel?: string;
      openaiModel?: string;
    }
  ): Promise<GenerateResult>;
  
  /**
   * Validate code syntax
   */
  validate(code: string): ValidationResult;
  
  /**
   * Generate export template/project structure
   */
  generateExportTemplate(scripts: Array<{ name: string; code: string }>): string;
  
  /**
   * Get engine-specific system prompt
   */
  getSystemPrompt(): string;
  
  /**
   * Get user prompt template
   */
  getUserPromptTemplate(): (userRequest: string) => string;
}

/**
 * Base implementation with common functionality
 */
export abstract class BaseEngineAdapter implements EngineAdapter {
  abstract readonly engineId: string;
  abstract readonly displayName: string;
  abstract readonly supportedExtensions: string[];
  
  abstract generate(
    prompt: string,
    options?: {
      provider?: 'claude' | 'openai';
      claudeModel?: string;
      openaiModel?: string;
    }
  ): Promise<GenerateResult>;
  
  abstract validate(code: string): ValidationResult;
  
  abstract generateExportTemplate(scripts: Array<{ name: string; code: string }>): string;
  
  abstract getSystemPrompt(): string;
  
  abstract getUserPromptTemplate(): (userRequest: string) => string;
  
  /**
   * Extract script name from code (default implementation)
   */
  protected extractScriptName(code: string, patterns: RegExp[]): string {
    for (const pattern of patterns) {
      const match = code.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return 'GeneratedScript';
  }
  
  /**
   * Basic validation helper
   */
  protected basicValidation(
    code: string,
    requiredPatterns: RegExp[],
    errorMessages: string[]
  ): ValidationResult {
    const errors: Array<{ line: number; column: number; message: string }> = [];
    const warnings: Array<{ line: number; column: number; message: string }> = [];
    
    if (!code.trim()) {
      errors.push({ line: 1, column: 1, message: 'Code is empty' });
      return { valid: false, errors, warnings };
    }
    
    // Check required patterns
    for (let i = 0; i < requiredPatterns.length; i++) {
      const pattern = requiredPatterns[i];
      const message = errorMessages[i] || 'Required pattern not found';
      
      if (!pattern.test(code)) {
        errors.push({ line: 1, column: 1, message });
      }
    }
    
    // Check for common syntax issues
    const lines = code.split('\n');
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Check for unmatched brackets
      const openBrackets = (line.match(/\(/g) || []).length;
      const closeBrackets = (line.match(/\)/g) || []).length;
      if (openBrackets !== closeBrackets) {
        warnings.push({
          line: lineNum,
          column: 1,
          message: 'Possible unmatched parentheses',
        });
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }
}

