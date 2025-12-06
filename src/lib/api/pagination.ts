/**
 * API Pagination Utilities
 * Helper functions for pagination in API endpoints
 */

import { NextRequest, NextResponse } from 'next/server';

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Parse pagination parameters from request
 */
export function parsePagination(request: NextRequest): PaginationParams {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get('page') ? parseInt(searchParams.get('page')!, 10) : 1;
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!, 10) : 20;

  // Validate
  const validPage = Math.max(1, page);
  const validLimit = Math.min(100, Math.max(1, limit)); // Max 100 items per page

  return {
    page: validPage,
    limit: validLimit,
    offset: (validPage - 1) * validLimit,
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams
): PaginationResult<T> {
  const totalPages = Math.ceil(total / pagination.limit!);

  return {
    data,
    pagination: {
      page: pagination.page!,
      limit: pagination.limit!,
      total,
      totalPages,
      hasNext: pagination.page! < totalPages,
      hasPrev: pagination.page! > 1,
    },
  };
}

/**
 * Add pagination headers to response
 */
export function addPaginationHeaders(
  response: NextResponse,
  pagination: PaginationParams,
  total: number
): void {
  const totalPages = Math.ceil(total / pagination.limit!);

  response.headers.set('X-Page', pagination.page!.toString());
  response.headers.set('X-Limit', pagination.limit!.toString());
  response.headers.set('X-Total', total.toString());
  response.headers.set('X-Total-Pages', totalPages.toString());
  response.headers.set('X-Has-Next', (pagination.page! < totalPages).toString());
  response.headers.set('X-Has-Prev', (pagination.page! > 1).toString());
}

