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
if (fs.existsSync(standaloneDir)) {
  // Copy standalone server
  copyRecursive(standaloneDir, computeDir);
} else {
  // If standalone doesn't exist, copy the entire .next directory
  copyRecursive(path.join(__dirname, '.next'), path.join(computeDir, '.next'));
  copyRecursive(path.join(__dirname, 'node_modules'), path.join(computeDir, 'node_modules'));
  copyRecursive(path.join(__dirname, 'public'), path.join(computeDir, 'public'));
}

// Copy static assets
const nextStaticDir = path.join(__dirname, '.next', 'static');
if (fs.existsSync(nextStaticDir)) {
  const targetStaticDir = path.join(staticDir, '_next', 'static');
  fs.mkdirSync(targetStaticDir, { recursive: true });
  copyRecursive(nextStaticDir, targetStaticDir);
}

// Copy public folder to static
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  copyRecursive(publicDir, staticDir);
}

// Create server.js entry point for compute
const serverJs = `
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const http = require('http');
  
  http.createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  }).listen(port, (err) => {
    if (err) throw err;
    console.log(\`> Ready on http://\${hostname}:\${port}\`);
  });
});
`;

fs.writeFileSync(path.join(computeDir, 'server.js'), serverJs.trim());

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

console.log('✓ Created .amplify-hosting directory structure');
console.log('✓ Generated deploy-manifest.json');

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
