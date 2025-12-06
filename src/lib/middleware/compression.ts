/**
 * Response Compression Middleware
 * Compresses HTTP responses using gzip/brotli
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Check if response should be compressed
 */
function shouldCompress(response: NextResponse, request: NextRequest): boolean {
  // Check content type
  const contentType = response.headers.get('content-type') || '';
  const compressibleTypes = [
    'application/json',
    'application/javascript',
    'text/css',
    'text/html',
    'text/javascript',
    'text/plain',
    'text/xml',
    'application/xml',
  ];

  if (!compressibleTypes.some(type => contentType.includes(type))) {
    return false;
  }

  // Check content encoding (already compressed)
  if (response.headers.get('content-encoding')) {
    return false;
  }

  // Check content length (only compress if > 1KB)
  const contentLength = response.headers.get('content-length');
  if (contentLength && parseInt(contentLength) < 1024) {
    return false;
  }

  // Check accept-encoding header
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  if (!acceptEncoding.includes('gzip') && !acceptEncoding.includes('br')) {
    return false;
  }

  return true;
}

/**
 * Compress response body
 */
async function compressResponse(
  response: NextResponse,
  request: NextRequest
): Promise<NextResponse> {
  if (!shouldCompress(response, request)) {
    return response;
  }

  try {
    // Clone response to read body
    const clonedResponse = response.clone();
    const body = await clonedResponse.text();

    // Get accept-encoding
    const acceptEncoding = request.headers.get('accept-encoding') || '';

    // Prefer brotli, fallback to gzip
    let compressed: Buffer;
    let encoding: string;

    if (acceptEncoding.includes('br')) {
      // Use Node.js zlib for brotli (if available)
      const { brotliCompressSync } = await import('zlib');
      compressed = brotliCompressSync(Buffer.from(body));
      encoding = 'br';
    } else if (acceptEncoding.includes('gzip')) {
      // Use Node.js zlib for gzip
      const { gzipSync } = await import('zlib');
      compressed = gzipSync(Buffer.from(body));
      encoding = 'gzip';
    } else {
      // No compression supported
      return response;
    }

    // Create new response with compressed body
    const compressedResponse = new NextResponse(compressed, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    // Set content encoding
    compressedResponse.headers.set('content-encoding', encoding);
    
    // Update content length
    compressedResponse.headers.set('content-length', compressed.length.toString());
    
    // Add vary header
    const vary = response.headers.get('vary') || '';
    if (!vary.includes('Accept-Encoding')) {
      compressedResponse.headers.set('vary', `${vary ? vary + ', ' : ''}Accept-Encoding`);
    }

    return compressedResponse;
  } catch (error) {
    // If compression fails, return original response
    console.error('Response compression failed:', error);
    return response;
  }
}

/**
 * Compression middleware wrapper
 */
export function withCompression<T extends NextRequest>(
  handler: (req: T) => Promise<NextResponse>
): (req: T) => Promise<NextResponse> {
  return async (request: T) => {
    const response = await handler(request);
    return compressResponse(response, request);
  };
}

