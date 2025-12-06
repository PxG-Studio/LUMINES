/**
 * Request/Response Logging Middleware
 * Logs all HTTP requests and responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { logger } from '../monitoring/logger';
import { incrementApiRequest, recordApiDuration } from '../monitoring/metrics';
import { v4 as uuidv4 } from 'uuid';

export interface LoggedRequest extends NextRequest {
  requestId?: string;
  startTime?: number;
}

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  try {
    // Try to use uuid if available
    return uuidv4();
  } catch {
    // Fallback to timestamp + random
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Extract request body (safely)
 */
async function getRequestBody(request: NextRequest): Promise<any> {
  try {
    // Clone request to avoid consuming the stream
    const cloned = request.clone();
    
    // Only try to read body for POST/PUT/PATCH
    if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
      const contentType = request.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        return await cloned.json();
      }
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await cloned.formData();
        const body: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
          body[key] = value.toString();
        }
        return body;
      }
    }
    
    return undefined;
  } catch (error) {
    // Ignore errors reading body
    return undefined;
  }
}

/**
 * Logging middleware
 */
export async function logRequest(
  request: NextRequest,
  handler: (req: LoggedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const requestId = generateRequestId();
  const startTime = Date.now();
  
  // Attach request ID to request
  const loggedRequest = request as LoggedRequest;
  loggedRequest.requestId = requestId;
  loggedRequest.startTime = startTime;

  // Extract request information
  const url = new URL(request.url);
  const requestBody = await getRequestBody(request);

  // Log request
  logger.logRequest({
    requestId,
    method: request.method,
    url: request.url,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams.entries()),
    headers: Object.fromEntries(request.headers.entries()),
    body: requestBody,
    timestamp: new Date().toISOString(),
  });

  // Execute handler
  let response: NextResponse;
  try {
    response = await handler(loggedRequest);
  } catch (error) {
    logger.error('Request handler error', error as Error, { requestId });
    throw error;
  }

  // Calculate duration
  const duration = Date.now() - startTime;

  // Extract response body (safely)
  let responseBody: any;
  try {
    const cloned = response.clone();
    const contentType = cloned.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      responseBody = await cloned.json();
    }
  } catch {
    // Ignore errors reading response body
  }

  // Log response
  logger.logResponse({
    requestId,
    statusCode: response.status,
    statusText: response.statusText,
    headers: Object.fromEntries(response.headers.entries()),
    body: responseBody,
    duration,
    timestamp: new Date().toISOString(),
  });

  // Record metrics
  incrementApiRequest(request.method, url.pathname, response.status);
  recordApiDuration(request.method, url.pathname, duration);

  // Add request ID to response headers
  response.headers.set('X-Request-ID', requestId);
  response.headers.set('X-Response-Time', `${duration}ms`);

  return response;
}

