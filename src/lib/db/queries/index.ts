/**
 * Database Query Abstractions
 * 
 * Centralized query functions for database operations using Prisma
 */

import { prisma } from '../client';
import type { Prisma } from '@prisma/client';

/**
 * User queries
 */
export const userQueries = {
  findById: async (id: string) => {
    return prisma.user.findUnique({
      where: { id },
      include: {
        projects: true,
      },
    });
  },

  findByEmail: async (email: string) => {
    return prisma.user.findUnique({
      where: { email },
      include: {
        projects: true,
      },
    });
  },

  findByNocturnaId: async (nocturnaId: string) => {
    return prisma.user.findUnique({
      where: { nocturnaId },
    });
  },

  create: async (data: Prisma.UserCreateInput) => {
    return prisma.user.create({
      data,
    });
  },

  update: async (id: string, data: Prisma.UserUpdateInput) => {
    return prisma.user.update({
      where: { id },
      data,
    });
  },
};

/**
 * Project queries
 */
export const projectQueries = {
  findAll: async (userId?: string) => {
    return prisma.project.findMany({
      where: userId ? { userId } : undefined,
      include: {
        user: true,
        template: true,
        _count: {
          select: {
            components: true,
            builds: true,
            deployments: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  },

  findById: async (id: string) => {
    return prisma.project.findUnique({
      where: { id },
      include: {
        user: true,
        template: true,
        components: true,
        builds: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
        deployments: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  },

  findBySlug: async (slug: string) => {
    return prisma.project.findUnique({
      where: { slug },
      include: {
        user: true,
      },
    });
  },

  create: async (data: Prisma.ProjectCreateInput) => {
    return prisma.project.create({
      data,
      include: {
        user: true,
      },
    });
  },

  update: async (id: string, data: Prisma.ProjectUpdateInput) => {
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.project.delete({
      where: { id },
    });
  },
};

/**
 * Component queries (SPARK)
 */
export const componentQueries = {
  findAll: async (projectId?: string) => {
    return prisma.component.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        user: true,
        project: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findByProjectId: async (projectId: string) => {
    return prisma.component.findMany({
      where: { projectId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findById: async (id: string) => {
    return prisma.component.findUnique({
      where: { id },
      include: {
        user: true,
        project: true,
      },
    });
  },

  create: async (data: Prisma.ComponentCreateInput) => {
    return prisma.component.create({
      data,
      include: {
        user: true,
        project: true,
      },
    });
  },

  update: async (id: string, data: Prisma.ComponentUpdateInput) => {
    return prisma.component.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.component.delete({
      where: { id },
    });
  },
};

/**
 * Token queries (SLATE)
 */
export const tokenQueries = {
  findAll: async () => {
    return prisma.designToken.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' },
      ],
    });
  },

  findByCategory: async (category: string) => {
    return prisma.designToken.findMany({
      where: { category },
      orderBy: { name: 'asc' },
    });
  },

  findByGroup: async (group: string) => {
    return prisma.designToken.findMany({
      where: { group },
      orderBy: { name: 'asc' },
    });
  },

  findById: async (id: string) => {
    return prisma.designToken.findUnique({
      where: { id },
    });
  },

  create: async (data: Prisma.DesignTokenCreateInput) => {
    return prisma.designToken.create({
      data,
    });
  },

  update: async (id: string, data: Prisma.DesignTokenUpdateInput) => {
    return prisma.designToken.update({
      where: { id },
      data,
    });
  },

  upsert: async (name: string, category: string, data: Prisma.DesignTokenCreateInput) => {
    return prisma.designToken.upsert({
      where: {
        name_category: {
          name,
          category,
        },
      },
      update: data,
      create: data,
    });
  },
};

/**
 * Build queries (IGNIS)
 */
export const buildQueries = {
  findAll: async (projectId?: string) => {
    return prisma.build.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findByProjectId: async (projectId: string) => {
    return prisma.build.findMany({
      where: { projectId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to recent builds
    });
  },

  findById: async (id: string) => {
    return prisma.build.findUnique({
      where: { id },
      include: {
        project: true,
        user: true,
      },
    });
  },

  create: async (data: Prisma.BuildCreateInput) => {
    return prisma.build.create({
      data,
      include: {
        project: true,
      },
    });
  },

  update: async (id: string, data: Prisma.BuildUpdateInput) => {
    return prisma.build.update({
      where: { id },
      data,
    });
  },
};

/**
 * Deployment queries (WAYPOINT)
 */
export const deploymentQueries = {
  findAll: async (projectId?: string) => {
    return prisma.deployment.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: true,
        user: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findByProjectId: async (projectId: string) => {
    return prisma.deployment.findMany({
      where: { projectId },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to recent deployments
    });
  },

  findById: async (id: string) => {
    return prisma.deployment.findUnique({
      where: { id },
      include: {
        project: true,
        user: true,
      },
    });
  },

  create: async (data: Prisma.DeploymentCreateInput) => {
    return prisma.deployment.create({
      data,
      include: {
        project: true,
      },
    });
  },

  update: async (id: string, data: Prisma.DeploymentUpdateInput) => {
    return prisma.deployment.update({
      where: { id },
      data,
    });
  },
};

/**
 * Template queries (IGNITION)
 */
export const templateQueries = {
  findAll: async (engine?: string) => {
    return prisma.template.findMany({
      where: engine ? { engine } : undefined,
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  findBySlug: async (slug: string) => {
    return prisma.template.findUnique({
      where: { slug },
    });
  },

  findById: async (id: string) => {
    return prisma.template.findUnique({
      where: { id },
    });
  },

  create: async (data: Prisma.TemplateCreateInput) => {
    return prisma.template.create({
      data,
    });
  },
};

/**
 * Event queries (Audit log)
 */
export const eventQueries = {
  create: async (data: Prisma.EventCreateInput) => {
    return prisma.event.create({
      data,
    });
  },

  findBySubsystem: async (subsystem: string, limit = 100) => {
    return prisma.event.findMany({
      where: { subsystem },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  },

  findByProjectId: async (projectId: string, limit = 100) => {
    return prisma.event.findMany({
      where: { projectId },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  },
};

