#!/usr/bin/env node
/**
 * Production Server for SolidStart/Vinxi
 * This serves the built application for Cloudflare Tunnel access
 */

import { createServer } from 'http';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3000;

// Simple static file server for production build
const server = createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  // For now, return a simple response
  // We'll use vinxi's built-in production server instead
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end('Production server - use: cd apps/web && PORT=3000 npx vinxi start');
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Production server running at http://0.0.0.0:${PORT}`);
});
