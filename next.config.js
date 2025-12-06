/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    // TODO: Use environment config instead of hardcoded IPs
    // domains will be set from env.NEXT_PUBLIC_IMAGE_DOMAINS in future update
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
}

module.exports = nextConfig
