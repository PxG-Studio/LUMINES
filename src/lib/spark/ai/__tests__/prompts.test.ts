/**
 * Unit Tests for Prompt Generation
 * Target: 8-10 tests
 */

import { describe, it, expect } from 'vitest';
import {
  UNITY_SYSTEM_PROMPT,
  UNITY_USER_PROMPT_TEMPLATE,
  UNITY_COMPONENT_PROMPT,
  UNITY_SCRIPTABLE_OBJECT_PROMPT,
  UNITY_EDITOR_SCRIPT_PROMPT,
  UNITY_UTILITY_PROMPT,
  getPromptForScriptType,
  VALIDATION_PROMPT,
  IMPROVEMENT_PROMPT,
  type ScriptType,
} from '../prompts';

describe('Prompt Generation', () => {
  describe('UNITY_SYSTEM_PROMPT', () => {
    it('should contain Unity-specific instructions', () => {
      expect(UNITY_SYSTEM_PROMPT).toContain('Unity');
      expect(UNITY_SYSTEM_PROMPT).toContain('C#');
    });

    it('should include using statements requirement', () => {
      expect(UNITY_SYSTEM_PROMPT).toContain('using');
    });

    it('should mention MonoBehaviour', () => {
      expect(UNITY_SYSTEM_PROMPT).toContain('MonoBehaviour');
    });

    it('should include Unity naming conventions', () => {
      expect(UNITY_SYSTEM_PROMPT).toContain('PascalCase');
    });
  });

  describe('UNITY_USER_PROMPT_TEMPLATE', () => {
    it('should include user request in prompt', () => {
      const request = 'Create a player controller';
      const prompt = UNITY_USER_PROMPT_TEMPLATE(request);

      expect(prompt).toContain(request);
      expect(prompt).toContain('Generate');
    });

    it('should handle empty requests', () => {
      const prompt = UNITY_USER_PROMPT_TEMPLATE('');
      expect(prompt).toBeDefined();
    });

    it('should handle special characters in requests', () => {
      const request = 'Create a script with <angle brackets> and "quotes"';
      const prompt = UNITY_USER_PROMPT_TEMPLATE(request);

      expect(prompt).toContain(request);
    });
  });

  describe('getPromptForScriptType', () => {
    it('should return component prompt for component type', () => {
      const prompt = getPromptForScriptType('component');
      expect(prompt).toBe(UNITY_COMPONENT_PROMPT);
    });

    it('should return scriptable object prompt for scriptableobject type', () => {
      const prompt = getPromptForScriptType('scriptableobject');
      expect(prompt).toBe(UNITY_SCRIPTABLE_OBJECT_PROMPT);
    });

    it('should return editor prompt for editor type', () => {
      const prompt = getPromptForScriptType('editor');
      expect(prompt).toBe(UNITY_EDITOR_SCRIPT_PROMPT);
    });

    it('should return utility prompt for utility type', () => {
      const prompt = getPromptForScriptType('utility');
      expect(prompt).toBe(UNITY_UTILITY_PROMPT);
    });

    it('should return default prompt for default type', () => {
      const prompt = getPromptForScriptType('default');
      expect(prompt).toBe(UNITY_SYSTEM_PROMPT);
    });
  });

  describe('Specialized Prompts', () => {
    it('UNITY_COMPONENT_PROMPT should mention MonoBehaviour', () => {
      expect(UNITY_COMPONENT_PROMPT).toContain('MonoBehaviour');
      expect(UNITY_COMPONENT_PROMPT).toContain('GameObject');
    });

    it('UNITY_SCRIPTABLE_OBJECT_PROMPT should mention ScriptableObject', () => {
      expect(UNITY_SCRIPTABLE_OBJECT_PROMPT).toContain('ScriptableObject');
      expect(UNITY_SCRIPTABLE_OBJECT_PROMPT).toContain('CreateAssetMenu');
    });

    it('UNITY_EDITOR_SCRIPT_PROMPT should mention UnityEditor', () => {
      expect(UNITY_EDITOR_SCRIPT_PROMPT).toContain('UnityEditor');
      expect(UNITY_EDITOR_SCRIPT_PROMPT).toContain('Editor');
    });

    it('UNITY_UTILITY_PROMPT should mention static/singleton', () => {
      expect(UNITY_UTILITY_PROMPT).toContain('static');
      expect(UNITY_UTILITY_PROMPT).toContain('singleton');
    });
  });

  describe('Validation and Improvement Prompts', () => {
    it('VALIDATION_PROMPT should contain validation checklist', () => {
      expect(VALIDATION_PROMPT).toContain('syntax');
      expect(VALIDATION_PROMPT).toContain('errors');
      expect(VALIDATION_PROMPT).toContain('VALID');
    });

    it('IMPROVEMENT_PROMPT should contain improvement areas', () => {
      expect(IMPROVEMENT_PROMPT).toContain('performance');
      expect(IMPROVEMENT_PROMPT).toContain('optimization');
      expect(IMPROVEMENT_PROMPT).toContain('best practices');
    });
  });
});

