const fs = require('fs');
const path = require('path');

// Create .amplify-hosting directory structure
const amplifyDir = path.join(__dirname, '.amplify-hosting');
const computeDir = path.join(amplifyDir, 'compute', 'default');
const staticDir = path.join(amplifyDir, 'static');

// Clean and create directories
if (fs.existsSync(amplifyDir)) {
  fs.rmSync(amplifyDir, { recursive: true });
}
fs.mkdirSync(computeDir, { recursive: true });
fs.mkdirSync(staticDir, { recursive: true });

// Copy Next.js standalone output to compute
const standaloneDir = path.join(__dirname, '.next', 'standalone');
if (!fs.existsSync(standaloneDir)) {
  throw new Error('Standalone output not found. Make sure output: "standalone" is set in next.config.js');
}

// Copy standalone server files (this includes server.js, node_modules, package.json, etc.)
copyRecursive(standaloneDir, computeDir);

// Standalone build expects .next directory in the same location
// Copy the full .next directory structure
const nextDir = path.join(__dirname, '.next');
const computeNextDir = path.join(computeDir, '.next');
fs.mkdirSync(computeNextDir, { recursive: true });

// Copy required .next subdirectories
['static', 'server', 'BUILD_ID', 'routes-manifest.json'].forEach(item => {
  const src = path.join(nextDir, item);
  const dest = path.join(computeNextDir, item);
  if (fs.existsSync(src)) {
    if (fs.statSync(src).isDirectory()) {
      copyRecursive(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
});

// Copy public folder to compute (standalone server serves these)
const publicDir = path.join(__dirname, 'public');
const computePublicDir = path.join(computeDir, 'public');
if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, computePublicDir);
}

// Copy .next/static to both compute (for server) and static (for CDN)
const nextStaticDir = path.join(__dirname, '.next', 'static');
if (fs.existsSync(nextStaticDir)) {
  // Copy to compute for server access
  const computeNextDir = path.join(computeDir, '.next', 'static');
  fs.mkdirSync(path.join(computeDir, '.next'), { recursive: true });
  copyRecursive(nextStaticDir, computeNextDir);
  
  // Copy to static for CDN
  const targetStaticDir = path.join(staticDir, '_next', 'static');
  fs.mkdirSync(path.join(staticDir, '_next'), { recursive: true });
  copyRecursive(nextStaticDir, targetStaticDir);
}

// Copy public folder to static (for CDN direct access)
const publicStaticDir = path.join(__dirname, 'public');
if (fs.existsSync(publicStaticDir)) {
  copyRecursive(publicStaticDir, staticDir);
}

console.log('✓ Using Next.js standalone server.js');

// Create deploy-manifest.json
const manifest = {
  version: 1,
  framework: {
    name: "nextjs",
    version: "14.2.33"
  },
  imageSettings: {
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: [],
    remotePatterns: [],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: false
  },
  routes: [
    {
      path: "/_next/image",
      target: {
        kind: "ImageOptimization",
        cacheControl: "public, max-age=3600, immutable"
      }
    },
    {
      path: "/_next/static/*",
      target: {
        kind: "Static",
        cacheControl: "public, max-age=31536000, immutable"
      }
    },
    {
      path: "/_next/*",
      target: {
        kind: "Compute",
        src: "default"
      }
    },
    {
      path: "/api/*",
      target: {
        kind: "Compute",
        src: "default"
      }
    },
    {
      path: "/*.*",
      target: {
        kind: "Static"
      },
      fallback: {
        kind: "Compute",
        src: "default"
      }
    },
    {
      path: "/*",
      target: {
        kind: "Compute",
        src: "default"
      }
    }
  ],
  computeResources: [
    {
      name: "default",
      runtime: "nodejs20.x",
      entrypoint: "server.js"
    }
  ]
};

fs.writeFileSync(
  path.join(amplifyDir, 'deploy-manifest.json'),
  JSON.stringify(manifest, null, 2)
);

// Get size of compute bundle
const computeSize = getDirSize(computeDir);
const computeSizeMB = (computeSize / 1024 / 1024).toFixed(2);
console.log(`✓ Created .amplify-hosting directory structure`);
console.log(`✓ Generated deploy-manifest.json`);
console.log(`✓ Compute bundle size: ${computeSizeMB} MB`);

if (computeSize > 220 * 1024 * 1024) {
  console.warn(`⚠ Warning: Compute bundle exceeds 220MB limit`);
}

// Helper function to copy directories recursively
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    files.forEach(file => {
      copyRecursive(path.join(src, file), path.join(dest, file));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Helper function to get directory size
function getDirSize(dirPath) {
  let size = 0;
  
  if (!fs.existsSync(dirPath)) return 0;
  
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      size += getDirSize(filePath);
    } else {
      size += stats.size;
    }
  });
  
  return size;
}
