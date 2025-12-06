/**
 * CDN Configuration
 * 
 * Configures CDN for static assets, optimizes delivery, and sets cache headers
 */

export interface CDNConfig {
  provider: 'cloudflare' | 'aws-cloudfront' | 'vercel' | 'custom';
  domain: string;
  cacheControl: {
    static: string;
    api: string;
    images: string;
    fonts: string;
  };
  compression: {
    enabled: boolean;
    algorithms: ('gzip' | 'brotli')[];
  };
  headers: Record<string, string>;
}

/**
 * Cloudflare CDN Configuration
 */
export const cloudflareConfig: CDNConfig = {
  provider: 'cloudflare',
  domain: process.env.CDN_DOMAIN || 'cdn.spark.example.com',
  cacheControl: {
    static: 'public, max-age=31536000, immutable', // 1 year for static assets
    api: 'public, max-age=0, must-revalidate', // No cache for API
    images: 'public, max-age=86400', // 1 day for images
    fonts: 'public, max-age=31536000, immutable', // 1 year for fonts
  },
  compression: {
    enabled: true,
    algorithms: ['gzip', 'brotli'],
  },
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  },
};

/**
 * AWS CloudFront CDN Configuration
 */
export const cloudfrontConfig: CDNConfig = {
  provider: 'aws-cloudfront',
  domain: process.env.CDN_DOMAIN || 'd1234567890.cloudfront.net',
  cacheControl: {
    static: 'public, max-age=31536000, immutable',
    api: 'public, max-age=0, must-revalidate',
    images: 'public, max-age=86400',
    fonts: 'public, max-age=31536000, immutable',
  },
  compression: {
    enabled: true,
    algorithms: ['gzip', 'brotli'],
  },
  headers: {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  },
};

/**
 * Vercel CDN Configuration (built-in)
 */
export const vercelConfig: CDNConfig = {
  provider: 'vercel',
  domain: process.env.VERCEL_URL || '',
  cacheControl: {
    static: 'public, max-age=31536000, immutable',
    api: 'public, max-age=0, must-revalidate',
    images: 'public, max-age=86400',
    fonts: 'public, max-age=31536000, immutable',
  },
  compression: {
    enabled: true,
    algorithms: ['gzip', 'brotli'],
  },
  headers: {},
};

/**
 * Get CDN configuration based on provider
 */
export function getCDNConfig(): CDNConfig {
  const provider = process.env.CDN_PROVIDER || 'vercel';

  switch (provider) {
    case 'cloudflare':
      return cloudflareConfig;
    case 'aws-cloudfront':
      return cloudfrontConfig;
    case 'vercel':
      return vercelConfig;
    default:
      return vercelConfig;
  }
}

/**
 * Get cache control header for a file type
 */
export function getCacheControlHeader(fileType: 'static' | 'api' | 'images' | 'fonts'): string {
  const config = getCDNConfig();
  return config.cacheControl[fileType];
}

/**
 * Set CDN headers on response
 */
export function setCDNHeaders(
  response: Response,
  fileType: 'static' | 'api' | 'images' | 'fonts' = 'static'
): void {
  const config = getCDNConfig();

  // Set cache control
  response.headers.set('Cache-Control', getCacheControlHeader(fileType));

  // Set CDN-specific headers
  Object.entries(config.headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Set compression headers if enabled
  if (config.compression.enabled) {
    const acceptEncoding = response.headers.get('Accept-Encoding') || '';
    if (acceptEncoding.includes('br') && config.compression.algorithms.includes('brotli')) {
      response.headers.set('Content-Encoding', 'br');
    } else if (acceptEncoding.includes('gzip') && config.compression.algorithms.includes('gzip')) {
      response.headers.set('Content-Encoding', 'gzip');
    }
  }
}

/**
 * Next.js middleware for CDN headers
 */
export function cdnMiddleware(request: Request): Headers {
  const headers = new Headers();
  const url = new URL(request.url);
  const config = getCDNConfig();

  // Determine file type from path
  let fileType: 'static' | 'api' | 'images' | 'fonts' = 'static';
  if (url.pathname.startsWith('/api/')) {
    fileType = 'api';
  } else if (url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
    fileType = 'images';
  } else if (url.pathname.match(/\.(woff|woff2|ttf|otf|eot)$/i)) {
    fileType = 'fonts';
  }

  // Set cache control
  headers.set('Cache-Control', config.cacheControl[fileType]);

  // Set security headers
  Object.entries(config.headers).forEach(([key, value]) => {
    headers.set(key, value);
  });

  return headers;
}

