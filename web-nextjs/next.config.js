/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
    unoptimized: false, // Enable image optimization
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Generate fully static assets so Amplify can serve the site from S3/CloudFront
  output: 'export',
  // Default Next.js output - supports SSR/ISR on Amplify Gen 2
}

module.exports = nextConfig
