/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
  images: {
    domains: [],
    unoptimized: false,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
