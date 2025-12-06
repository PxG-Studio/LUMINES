/**
 * Query Optimization Utilities
 * Helpers for optimizing database queries
 */

import { Prisma } from '@prisma/client';

/**
 * Optimize select fields - only select what's needed
 */
export function optimizeSelect<T extends Record<string, any>>(
  fields: (keyof T)[]
): Record<keyof T, true> {
  return fields.reduce((acc, field) => {
    acc[field] = true;
    return acc;
  }, {} as Record<keyof T, true>);
}

/**
 * Build optimized where clause with indexed fields
 */
export function buildOptimizedWhere<T extends Prisma.UserWhereInput | Prisma.ProjectWhereInput | Prisma.ComponentWhereInput>(
  filters: Record<string, any>
): T {
  // Remove undefined/null values
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== null) {
      cleaned[key] = value;
    }
  }
  return cleaned as T;
}

/**
 * Build optimized orderBy - prefer indexed fields
 */
export function buildOptimizedOrderBy(
  field: string,
  direction: 'asc' | 'desc' = 'desc'
): Record<string, 'asc' | 'desc'> {
  // Prefer indexed fields for sorting
  const indexedFields = [
    'createdAt',
    'updatedAt',
    'completedAt',
    'deployedAt',
    'name',
    'email',
  ];

  // If field is indexed, use it directly
  if (indexedFields.includes(field)) {
    return { [field]: direction };
  }

  // Default to createdAt for non-indexed fields
  return { createdAt: direction };
}

/**
 * Limit query results to prevent large datasets
 */
export function applyQueryLimits(
  take?: number,
  maxTake: number = 100
): number {
  if (!take) {
    return maxTake;
  }
  return Math.min(take, maxTake);
}

/**
 * Check if query should use cache
 */
export function shouldCacheQuery(
  operation: 'read' | 'write',
  complexity: 'simple' | 'complex'
): boolean {
  // Only cache read operations
  if (operation !== 'read') {
    return false;
  }

  // Prefer caching simple queries
  return complexity === 'simple';
}

