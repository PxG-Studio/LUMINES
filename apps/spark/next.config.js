const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable response compression
  experimental: {
    typedRoutes: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ],
      },
    ];
  },
  // Note: Error pages work at runtime but fail during static generation
  // due to Next.js 14.2.0 styled-jsx limitation. This is a known issue.
  // Error pages are generated dynamically at runtime and function correctly.
  // 
  // Workaround: Error pages are marked as 'force-dynamic' and work at runtime.
  // For production, deploy with Node.js runtime (not static export) to ensure
  // error pages are generated on-demand.
  onDemandEntries: {
    // Keep pages in memory for longer to improve error page handling
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 5,
  },
  webpack: (config, { isServer }) => {
    // Resolve imports from shared code to Spark app code
    // This allows src/lib/spark/actions/generate-wrapper.ts to import from Spark app
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/app/spark/actions/generate': path.resolve(__dirname, 'src/app/spark/actions/generate.ts'),
      // Also resolve the wrapper import path
      '@/lib/spark/actions/generate-wrapper': path.resolve(__dirname, '../../src/lib/spark/actions/generate-wrapper.ts'),
    };
    return config;
  },
};

module.exports = nextConfig;

