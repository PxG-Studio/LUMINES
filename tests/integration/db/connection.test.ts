/**
 * Database Integration Tests
 * Tests Prisma client connection and basic operations
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma, checkDatabaseHealth } from '@/lib/db/client';
import { userQueries, projectQueries, componentQueries } from '@/lib/db/queries';

describe('Database Integration', () => {
  beforeAll(async () => {
    // Ensure database is healthy before tests
    const healthy = await checkDatabaseHealth();
    if (!healthy) {
      throw new Error('Database connection failed - cannot run integration tests');
    }
  });

  afterAll(async () => {
    // Cleanup: Disconnect Prisma
    await prisma.$disconnect();
  });

  describe('Connection Health', () => {
    it('should connect to database successfully', async () => {
      const healthy = await checkDatabaseHealth();
      expect(healthy).toBe(true);
    });

    it('should execute raw SQL queries', async () => {
      const result = await prisma.$queryRaw`SELECT 1 as value`;
      expect(result).toBeDefined();
    });
  });

  describe('User Queries', () => {
    it('should create and find user by email', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      
      // Create user
      const user = await userQueries.create({
        email: testEmail,
        name: 'Test User',
        roles: ['user'],
      });

      expect(user).toBeDefined();
      expect(user.email).toBe(testEmail);

      // Find by email
      const found = await userQueries.findByEmail(testEmail);
      expect(found).toBeDefined();
      expect(found?.email).toBe(testEmail);

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should find user by ID', async () => {
      const testEmail = `test-${Date.now()}@example.com`;
      
      const user = await userQueries.create({
        email: testEmail,
        name: 'Test User',
        roles: ['user'],
      });

      const found = await userQueries.findById(user.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(user.id);

      // Cleanup
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('Project Queries', () => {
    it('should create project for user', async () => {
      // Create test user
      const user = await userQueries.create({
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        roles: ['user'],
      });

      // Create project
      const project = await projectQueries.create({
        name: 'Test Project',
        slug: `test-project-${Date.now()}`,
        description: 'Test description',
        engine: 'unity',
        user: {
          connect: { id: user.id },
        },
      });

      expect(project).toBeDefined();
      expect(project.userId).toBe(user.id);

      // Cleanup
      await prisma.project.delete({ where: { id: project.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });

    it('should find projects by user', async () => {
      // Create test user
      const user = await userQueries.create({
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        roles: ['user'],
      });

      // Create projects
      const project1 = await projectQueries.create({
        name: 'Project 1',
        slug: `project-1-${Date.now()}`,
        user: { connect: { id: user.id } },
      });

      const project2 = await projectQueries.create({
        name: 'Project 2',
        slug: `project-2-${Date.now()}`,
        user: { connect: { id: user.id } },
      });

      // Find all projects for user
      const projects = await projectQueries.findAll(user.id);
      expect(projects.length).toBeGreaterThanOrEqual(2);

      // Cleanup
      await prisma.project.deleteMany({ where: { userId: user.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('Component Queries (SPARK)', () => {
    it('should create component for project', async () => {
      // Create test user and project
      const user = await userQueries.create({
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        roles: ['user'],
      });

      const project = await projectQueries.create({
        name: 'Test Project',
        slug: `test-project-${Date.now()}`,
        user: { connect: { id: user.id } },
      });

      // Create component
      const component = await componentQueries.create({
        name: 'TestComponent',
        type: 'script',
        content: 'public class TestComponent { }',
        language: 'csharp',
        user: { connect: { id: user.id } },
        project: { connect: { id: project.id } },
      });

      expect(component).toBeDefined();
      expect(component.projectId).toBe(project.id);

      // Cleanup
      await prisma.component.delete({ where: { id: component.id } });
      await prisma.project.delete({ where: { id: project.id } });
      await prisma.user.delete({ where: { id: user.id } });
    });
  });

  describe('Transaction Support', () => {
    it('should support database transactions', async () => {
      await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: `test-${Date.now()}@example.com`,
            name: 'Test User',
            roles: ['user'],
          },
        });

        const project = await tx.project.create({
          data: {
            name: 'Test Project',
            slug: `test-project-${Date.now()}`,
            userId: user.id,
          },
        });

        expect(user).toBeDefined();
        expect(project).toBeDefined();

        // Cleanup within transaction
        await tx.project.delete({ where: { id: project.id } });
        await tx.user.delete({ where: { id: user.id } });
      });
    });
  });
});

