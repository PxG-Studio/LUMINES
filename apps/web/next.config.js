/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

