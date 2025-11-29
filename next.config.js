/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['192.168.86.27', 'lumenforge.io'], // Synology NAS, LumenForge domains
  },
  env: {
    NEXT_PUBLIC_NOCTURNA_ID_URL: 'https://nocturnaID.org',
    NEXT_PUBLIC_API_BASE: 'https://api.lumenforge.io',
    NEXT_PUBLIC_LUMENFORGE_DOMAIN: 'lumenforge.io',
  },
}

module.exports = nextConfig
