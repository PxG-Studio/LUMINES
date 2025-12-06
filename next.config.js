/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compress: true, // Enable response compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  experimental: {
    appDir: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
  },
  // Bundle optimization
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side optimizations
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunks
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)?.[1];
                return `lib-${packageName?.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              name(module, chunks) {
                return 'shared-' + chunks.map((c) => c.name).join('-');
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
  images: {
    // Use environment variables with fallbacks
    formats: ['image/avif', 'image/webp'], // Use modern formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: process.env.REGISTRY_HOST || '192.168.86.27',
        port: process.env.REGISTRY_PORT || '5000',
      },
      {
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_LUMENFORGE_DOMAIN || 'lumenforge.io',
      },
      {
        protocol: 'http',
        hostname: process.env.REGISTRY_HOST || '192.168.86.27',
        port: process.env.REGISTRY_PORT || '5000',
      },
    ],
    // Legacy domains support (deprecated, use remotePatterns above)
    domains: [
      process.env.REGISTRY_HOST || '192.168.86.27',
      process.env.NEXT_PUBLIC_LUMENFORGE_DOMAIN || 'lumenforge.io',
    ],
  },
  env: {
    NEXT_PUBLIC_NOCTURNA_ID_URL: process.env.NEXT_PUBLIC_NOCTURNA_ID_URL || 'https://nocturnaID.org',
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE || 'https://api.lumenforge.io',
    NEXT_PUBLIC_LUMENFORGE_DOMAIN: process.env.NEXT_PUBLIC_LUMENFORGE_DOMAIN || 'lumenforge.io',
  },
  // Headers for performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig
