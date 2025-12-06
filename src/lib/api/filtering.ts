/**
 * API Filtering & Sorting Utilities
 * Helper functions for filtering and sorting in API endpoints
 */

import { NextRequest } from 'next/server';

export interface FilterParams {
  [key: string]: string | string[] | undefined;
}

export interface SortParams {
  field: string;
  direction: 'asc' | 'desc';
}

/**
 * Parse filter parameters from request
 */
export function parseFilters(request: NextRequest): FilterParams {
  const searchParams = request.nextUrl.searchParams;
  const filters: FilterParams = {};

  // Common filter patterns
  for (const [key, value] of searchParams.entries()) {
    // Skip pagination and sorting params
    if (key === 'page' || key === 'limit' || key === 'sort' || key === 'order') {
      continue;
    }

    // Handle array values (e.g., ?status=pending&status=completed)
    if (filters[key]) {
      const existing = filters[key];
      if (Array.isArray(existing)) {
        existing.push(value);
      } else {
        filters[key] = [existing as string, value];
      }
    } else {
      filters[key] = value;
    }
  }

  return filters;
}

/**
 * Parse sort parameters from request
 */
export function parseSort(request: NextRequest): SortParams | null {
  const searchParams = request.nextUrl.searchParams;
  const sortParam = searchParams.get('sort');
  const orderParam = searchParams.get('order') || 'asc';

  if (!sortParam) {
    return null;
  }

  const direction = orderParam.toLowerCase() === 'desc' ? 'desc' : 'asc';

  return {
    field: sortParam,
    direction,
  };
}

/**
 * Build Prisma where clause from filters
 */
export function buildWhereClause(filters: FilterParams): any {
  const where: any = {};

  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === null) {
      continue;
    }

    // Handle array values (IN clause)
    if (Array.isArray(value)) {
      where[key] = { in: value };
    }
    // Handle date ranges (e.g., createdAt_from, createdAt_to)
    else if (key.endsWith('_from')) {
      const field = key.replace('_from', '');
      if (!where[field]) {
        where[field] = {};
      }
      where[field].gte = new Date(value);
    } else if (key.endsWith('_to')) {
      const field = key.replace('_to', '');
      if (!where[field]) {
        where[field] = {};
      }
      where[field].lte = new Date(value);
    }
    // Handle search (contains)
    else if (key.endsWith('_search')) {
      const field = key.replace('_search', '');
      where[field] = { contains: value, mode: 'insensitive' };
    }
    // Handle exact match
    else {
      where[key] = value;
    }
  }

  return where;
}

/**
 * Build Prisma orderBy clause from sort params
 */
export function buildOrderBy(sort: SortParams | null, defaultSort?: SortParams): any {
  if (!sort && !defaultSort) {
    return { createdAt: 'desc' }; // Default sort
  }

  const sortToUse = sort || defaultSort;
  if (!sortToUse) {
    return {};
  }

  return {
    [sortToUse.field]: sortToUse.direction,
  };
}

/**
 * Validate filter parameters
 */
export function validateFilters(
  filters: FilterParams,
  allowedFields: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const key of Object.keys(filters)) {
    // Remove suffixes for validation
    const baseKey = key.replace(/_from$|_to$|_search$/, '');
    
    if (!allowedFields.includes(baseKey)) {
      errors.push(`Invalid filter field: ${key}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

