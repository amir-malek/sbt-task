#!/usr/bin/env node

const { build } = require('esbuild');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Generate a simple hash for cache busting
function generateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
}

// Scan directory for files to precache
function scanDirectory(dir, baseDir = dir, extensions = ['.js', '.css', '.html', '.json', '.png', '.svg', '.ico']) {
  const files = [];
  
  if (!fs.existsSync(dir)) return files;
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip certain directories
      if (['node_modules', '.git', '.next'].includes(item)) continue;
      files.push(...scanDirectory(fullPath, baseDir, extensions));
    } else {
      const ext = path.extname(item);
      if (extensions.includes(ext)) {
        const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
        const content = fs.readFileSync(fullPath);
        const hash = generateHash(content);
        
        files.push({
          url: '/' + relativePath,
          revision: hash
        });
      }
    }
  }
  
  return files;
}

async function buildServiceWorker() {
  console.log('Building service worker...');
  
  try {
    // Generate precache manifest for public assets
    const publicFiles = scanDirectory('./public');
    
    // Add critical app pages
    const criticalPages = [
      { url: '/', revision: generateHash('homepage') },
      { url: '/articles', revision: generateHash('articles') },
      { url: '/offline', revision: generateHash('offline') }
    ];
    
    const precacheManifest = [...publicFiles, ...criticalPages];
    
    // Create a temporary file with the manifest
    const manifestContent = `self.__PRECACHE_MANIFEST = ${JSON.stringify(precacheManifest, null, 2)};`;
    fs.writeFileSync('./worker/manifest.js', manifestContent);
    
    // Create the entry point for the service worker
    const entryContent = `
// Import the manifest
import './manifest.js';
// Import the main service worker
import './index.js';
`;
    fs.writeFileSync('./worker/entry.js', entryContent);
    
    // Build with esbuild
    await build({
      entryPoints: ['./worker/entry.js'],
      bundle: true,
      outfile: './public/sw.js',
      target: 'es2020',
      format: 'iife',
      minify: process.env.NODE_ENV === 'production',
      sourcemap: process.env.NODE_ENV !== 'production',
      define: {
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      },
    });
    
    console.log('Service worker built successfully!');
    console.log(`Precached ${precacheManifest.length} files`);
    
    // Clean up temporary files
    fs.unlinkSync('./worker/manifest.js');
    fs.unlinkSync('./worker/entry.js');
    
  } catch (error) {
    console.error('Service worker build failed:', error);
    process.exit(1);
  }
}

buildServiceWorker();