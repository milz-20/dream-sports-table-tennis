const fs = require('fs');
const path = require('path');

// Create the deployment manifest for Amplify Hosting
const manifest = {
  version: 1,
  framework: {
    name: "next",
    version: "14.2.33"
  },
  imageSettings: {
    domains: [],
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false
  },
  routes: [
    {
      path: "/_next/image",
      target: "compute",
      type: "imageOptimizer"
    },
    {
      path: "/_next/data/*",
      target: "compute",
      type: "data"
    },
    {
      path: "/_next/*",
      target: "static"
    },
    {
      path: "/api/*",
      target: "compute",
      type: "function"
    },
    {
      path: "/*",
      target: "compute",
      fallthrough: true
    }
  ]
};

// Write the manifest to the .next directory
const manifestPath = path.join(__dirname, '.next', 'deploy-manifest.json');
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log('✓ Generated deploy-manifest.json for Amplify Hosting');
