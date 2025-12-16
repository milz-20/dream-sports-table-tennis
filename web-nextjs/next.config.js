/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
