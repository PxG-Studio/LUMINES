/**
 * Storybook Coverage Dashboard Tests
 * Validates 8-Point StackBlitz Parity Metrics
 */

import { describe, it, expect } from 'vitest';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

describe('Storybook Coverage Dashboard - 8-Point StackBlitz Parity', () => {
  const storiesDir = join(process.cwd(), 'src/stories/WIS2L Framework/Slate/Components');
  
  describe('METRIC 1: Component State Parity', () => {
    it('should have all required states for each component', async () => {
      const stories = await findStoryFiles(storiesDir);
      for (const story of stories) {
        const content = await readFile(story, 'utf-8');
        
        // Check for required states
        const requiredStates = [
          'Normal',
          'Focused',
          'Hovered',
          'Empty',
          'LightTheme',
          'DarkTheme',
          'MobileViewport',
        ];
        
        for (const state of requiredStates) {
          expect(content).toContain(`export const ${state}`);
        }
      }
    });
  });
  
  describe('METRIC 2: Controls Coverage', () => {
    it('should have argTypes for all props', async () => {
      const stories = await findStoryFiles(storiesDir);
      for (const story of stories) {
        const content = await readFile(story, 'utf-8');
        expect(content).toContain('argTypes:');
      }
    });
  });
  
  describe('METRIC 3: Action Emission Coverage', () => {
    it('should have action handlers for events', async () => {
      const stories = await findStoryFiles(storiesDir);
      for (const story of stories) {
        const content = await readFile(story, 'utf-8');
        // Check for action handlers
        expect(content).toMatch(/on[A-Z]\w+.*fn\(\)/);
      }
    });
  });
  
  describe('METRIC 4: Interaction Test Coverage', () => {
    it('should have play functions for interactions', async () => {
      const stories = await findStoryFiles(storiesDir);
      let hasInteractions = false;
      for (const story of stories) {
        const content = await readFile(story, 'utf-8');
        if (content.includes('play: async')) {
          hasInteractions = true;
          break;
        }
      }
      expect(hasInteractions).toBe(true);
    });
  });
  
  describe('METRIC 5: Accessibility Coverage', () => {
    it('should have a11y parameters', async () => {
      const stories = await findStoryFiles(storiesDir);
      for (const story of stories) {
        const content = await readFile(story, 'utf-8');
        expect(content).toContain('a11y:');
      }
    });
  });
  
  describe('METRIC 6: Visual Regression Coverage', () => {
    it('should have chromatic parameters', async () => {
      const stories = await findStoryFiles(storiesDir);
      for (const story of stories) {
        const content = await readFile(story, 'utf-8');
        expect(content).toContain('chromatic:');
      }
    });
  });
  
  describe('METRIC 7: API Contract Coverage', () => {
    it('should have docs parameters', async () => {
      const stories = await findStoryFiles(storiesDir);
      for (const story of stories) {
        const content = await readFile(story, 'utf-8');
        expect(content).toContain('docs:');
      }
    });
  });
  
  describe('METRIC 8: Integration Coverage', () => {
    it('should have integration stories', async () => {
      const stories = await findStoryFiles(storiesDir);
      let hasIntegration = false;
      for (const story of stories) {
        const content = await readFile(story, 'utf-8');
        if (content.includes('Integration') || content.includes('WithFileSystem')) {
          hasIntegration = true;
          break;
        }
      }
      expect(hasIntegration).toBe(true);
    });
  });
});

async function findStoryFiles(dir: string): Promise<string[]> {
  try {
    const files = await readdir(dir, { recursive: true });
    return files
      .filter(file => file.endsWith('.stories.tsx'))
      .map(file => join(dir, file));
  } catch {
    return [];
  }
}


