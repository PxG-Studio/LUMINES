/**
 * Templates API Integration Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db/client';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

describe('Templates API', () => {
  let testTemplateId: string;

  beforeAll(async () => {
    // Create test template
    const template = await prisma.template.create({
      data: {
        name: 'Test Template',
        slug: `test-template-${Date.now()}`,
        engine: 'unity',
        category: 'starter',
        structure: {
          files: [],
        },
      },
    });
    testTemplateId = template.id;
  });

  afterAll(async () => {
    // Cleanup
    if (testTemplateId) {
      await prisma.template.delete({ where: { id: testTemplateId } }).catch(() => {});
    }
  });

  describe('GET /api/templates', () => {
    it('should return templates list (public)', async () => {
      const response = await fetch(`${baseUrl}/api/templates`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      // Can be array (backward compatible) or paginated
      expect(Array.isArray(data) || data.data).toBeTruthy();
    });

    it('should filter by engine', async () => {
      const response = await fetch(`${baseUrl}/api/templates?engine=unity`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        expect(data.every((t: any) => t.engine === 'unity')).toBe(true);
      } else {
        expect(data.data.every((t: any) => t.engine === 'unity')).toBe(true);
      }
    });

    it('should support pagination', async () => {
      const response = await fetch(`${baseUrl}/api/templates?page=1&limit=5`);
      
      expect(response.status).toBe(200);
      const data = await response.json();
      
      if (data.pagination) {
        expect(data.pagination.page).toBe(1);
        expect(data.pagination.limit).toBe(5);
      }
    });

    it('should include cache headers', async () => {
      const response = await fetch(`${baseUrl}/api/templates`);
      
      const cacheControl = response.headers.get('Cache-Control');
      expect(cacheControl).toBeTruthy();
      expect(cacheControl).toContain('max-age');
    });
  });

  describe('GET /api/templates/[id]', () => {
    it('should get template by ID', async () => {
      const response = await fetch(`${baseUrl}/api/templates/${testTemplateId}`);
      
      expect(response.status).toBe(200);
      const template = await response.json();
      
      expect(template).toHaveProperty('id', testTemplateId);
    });

    it('should get template by slug', async () => {
      const template = await prisma.template.findUnique({ where: { id: testTemplateId } });
      if (!template) return;

      const response = await fetch(`${baseUrl}/api/templates/${template.slug}`);
      
      expect(response.status).toBe(200);
      const result = await response.json();
      
      expect(result).toHaveProperty('slug', template.slug);
    });
  });
});

