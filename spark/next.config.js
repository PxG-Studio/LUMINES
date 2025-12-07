const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    // turbopack removed - not supported in Next.js 14.2
  },
}

module.exports = nextConfig
