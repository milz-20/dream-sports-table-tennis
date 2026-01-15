/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable server-side features (NextAuth, API routes)
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
