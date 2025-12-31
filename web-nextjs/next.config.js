/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: { allowedOrigins: ['*'] },
  },
  reactStrictMode: true,
};

module.exports = nextConfig;

module.exports = require('@aws-amplify/adapter-nextjs/config').withAmplifyAdapter(nextConfig);
