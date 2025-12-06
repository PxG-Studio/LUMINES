/**
 * Optimized Database Queries
 * Performance-optimized query functions with proper indexing and query patterns
 */

import { prisma } from '../client';
import { Prisma } from '@prisma/client';

/**
 * Optimized user queries
 */
export const optimizedUserQueries = {
  /**
   * Find user by email (uses index)
   */
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
        // Exclude relations unless needed
      },
    });
  },

  /**
   * Find users with pagination (optimized)
   */
  async findManyPaginated(
    page: number,
    limit: number,
    where?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput
  ) {
    const skip = (page - 1) * limit;

    // Use Promise.all for parallel execution
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: orderBy || { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          roles: true,
          createdAt: true,
          updatedAt: true,
          // Only include count, not full relations
          _count: {
            select: {
              projects: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total };
  },
};

/**
 * Optimized project queries
 */
export const optimizedProjectQueries = {
  /**
   * Find projects by user and engine (uses composite index)
   */
  async findByUserAndEngine(userId: string, engine: string) {
    return prisma.project.findMany({
      where: {
        userId,
        engine,
      },
      orderBy: {
        updatedAt: 'desc', // Uses index
      },
      select: {
        id: true,
        name: true,
        slug: true,
        engine: true,
        updatedAt: true,
        _count: {
          select: {
            components: true,
            builds: true,
            deployments: true,
          },
        },
      },
    });
  },

  /**
   * Find projects with pagination (optimized)
   */
  async findManyPaginated(
    page: number,
    limit: number,
    where?: Prisma.ProjectWhereInput,
    orderBy?: Prisma.ProjectOrderByWithRelationInput
  ) {
    const skip = (page - 1) * limit;

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: orderBy || { updatedAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          engine: true,
          platform: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
          // Only include minimal user data
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
          // Use count instead of loading relations
          _count: {
            select: {
              components: true,
              builds: true,
              deployments: true,
            },
          },
        },
      }),
      prisma.project.count({ where }),
    ]);

    return { projects, total };
  },
};

/**
 * Optimized component queries
 */
export const optimizedComponentQueries = {
  /**
   * Find components by user and project (uses composite index)
   */
  async findByUserAndProject(userId: string, projectId: string) {
    return prisma.component.findMany({
      where: {
        userId,
        projectId,
      },
      orderBy: {
        createdAt: 'desc', // Uses index
      },
      select: {
        id: true,
        name: true,
        type: true,
        language: true,
        createdAt: true,
        updatedAt: true,
        // Exclude content unless needed
      },
    });
  },

  /**
   * Find components without content (for listings)
   */
  async findManyWithoutContent(
    where?: Prisma.ComponentWhereInput,
    orderBy?: Prisma.ComponentOrderByWithRelationInput,
    take?: number
  ) {
    return prisma.component.findMany({
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      take: take || 50,
      select: {
        id: true,
        name: true,
        type: true,
        language: true,
        userId: true,
        projectId: true,
        createdAt: true,
        updatedAt: true,
        // Don't select content field (can be large)
      },
    });
  },
};

/**
 * Optimized build queries
 */
export const optimizedBuildQueries = {
  /**
   * Find builds by project and status (uses composite index)
   */
  async findByProjectAndStatus(projectId: string, status: string) {
    return prisma.build.findMany({
      where: {
        projectId,
        status,
      },
      orderBy: {
        createdAt: 'desc', // Uses index
      },
      take: 50, // Limit results
      select: {
        id: true,
        status: true,
        progress: true,
        target: true,
        configuration: true,
        createdAt: true,
        startedAt: true,
        completedAt: true,
        // Exclude large fields
      },
    });
  },

  /**
   * Find recent builds (optimized)
   */
  async findRecent(limit: number = 20) {
    return prisma.build.findMany({
      orderBy: {
        createdAt: 'desc', // Uses index
      },
      take: limit,
      select: {
        id: true,
        projectId: true,
        userId: true,
        status: true,
        target: true,
        createdAt: true,
        completedAt: true,
      },
    });
  },
};

/**
 * Optimized deployment queries
 */
export const optimizedDeploymentQueries = {
  /**
   * Find deployments by project, environment, and status (uses composite index)
   */
  async findByProjectEnvironmentAndStatus(
    projectId: string,
    environment: string,
    status: string
  ) {
    return prisma.deployment.findMany({
      where: {
        projectId,
        environment,
        status,
      },
      orderBy: {
        deployedAt: 'desc', // Uses index
      },
      take: 50,
      select: {
        id: true,
        status: true,
        environment: true,
        version: true,
        url: true,
        createdAt: true,
        deployedAt: true,
      },
    });
  },
};

/**
 * Optimized event queries
 */
export const optimizedEventQueries = {
  /**
   * Find events by subsystem and type (uses composite index)
   */
  async findBySubsystemAndType(subsystem: string, type: string, limit: number = 100) {
    return prisma.event.findMany({
      where: {
        subsystem,
        type,
      },
      orderBy: {
        createdAt: 'desc', // Uses index
      },
      take: limit,
    });
  },

  /**
   * Find recent events for a project (uses composite index)
   */
  async findRecentByProject(projectId: string, limit: number = 50) {
    return prisma.event.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: 'desc', // Uses composite index
      },
      take: limit,
    });
  },
};

