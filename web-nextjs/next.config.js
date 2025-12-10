/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: true, // For static export if needed
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Optionally enable static export
  // output: 'export',
}

module.exports = nextConfig
