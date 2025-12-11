/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Remove X-Powered-By header for security
  compress: true, // Enable response compression
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
};

module.exports = nextConfig;

