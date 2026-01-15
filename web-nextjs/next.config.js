/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for AWS Amplify SSR deployment
  output: 'standalone',
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
