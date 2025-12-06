/**
 * Database Client
 * PostgreSQL client using Prisma ORM
 */

import { PrismaClient } from '@prisma/client';
import { databaseConfig, getDatabaseUrl } from '../config/database';
import type { DatabaseClient } from './types';

// PrismaClient singleton pattern for Next.js
// Prevents multiple instances in development hot-reload

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Database client implementation
export const db: DatabaseClient = {
  query: async (sql: string, params?: any[]) => {
    // For raw SQL queries, use Prisma's $queryRaw
    // Note: This is a simplified interface - Prisma handles type-safe queries differently
    if (params && params.length > 0) {
      return prisma.$queryRawUnsafe(sql, ...params);
    }
    return prisma.$queryRawUnsafe(sql);
  },
  close: async () => {
    await prisma.$disconnect();
  },
};

/**
 * Health check for database connection
 */
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}

// Export Prisma client for type-safe queries
export { PrismaClient } from '@prisma/client';
