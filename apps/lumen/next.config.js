/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable response compression
  // TODO: Future migration - Add path aliases for packages once migrated
  // experimental: {
  //   turbo: {
  //     resolveAlias: {
  //       '@lumines/ui': '../../packages/ui',
  //       '@lumines/tokens': '../../packages/tokens',
  //     },
  //   },
  // },
};

module.exports = nextConfig;

