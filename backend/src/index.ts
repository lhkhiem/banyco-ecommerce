// Server entry: use app + ready()
// IMPORTANT: Disable dev logs in production - must be first import
import './utils/disableDevLogs';

import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { app, ready } from './app';

// Load environment variables with priority:
// 1. .env.local (highest priority - for actual values)
// 2. .env.production (if NODE_ENV=production and .env.local doesn't exist)
// 3. .env (fallback)
// 4. System environment variables

// Fix: Handle both dev (src/) and production (dist/) paths
// Strategy: Try multiple possible locations for .env.local
// Priority: backend/.env.local > project_root/.env.local

// Option 1: If running from dist/, __dirname = backend/dist, so backendRoot = backend/
// Option 2: If running from src/ with ts-node, __dirname = backend/dist (compiled) or backend/src
let backendRoot: string;
if (__dirname.includes('dist')) {
  // Running from compiled dist/ - backendRoot should be backend/
  backendRoot = path.resolve(__dirname, '..');
} else if (__dirname.includes('src')) {
  // Running from src/ with ts-node - backendRoot should be backend/
  backendRoot = path.resolve(__dirname, '..');
} else {
  // Fallback: assume we're in backend/ already
  backendRoot = __dirname;
}

const envLocalPath = path.join(backendRoot, '.env.local');
const envProductionPath = path.join(backendRoot, '.env.production');
const envPath = path.join(backendRoot, '.env');

// Also try project root as fallback
const projectRoot = path.resolve(backendRoot, '..');
const envLocalPathProjectRoot = path.join(projectRoot, '.env.local');

// Log paths for debugging
console.log('[Env] Checking environment files:', {
  backendRoot,
  projectRoot,
  envLocalPath,
  envLocalPathProjectRoot,
  envProductionPath,
  envPath,
  envLocalExists: fs.existsSync(envLocalPath),
  envLocalExistsProjectRoot: fs.existsSync(envLocalPathProjectRoot),
  envProductionExists: fs.existsSync(envProductionPath),
  envExists: fs.existsSync(envPath),
  __dirname,
});

// Try backend/.env.local first, then project root
if (fs.existsSync(envLocalPath)) {
  // ✅ Priority 1: backend/.env.local (for actual dev/prod values)
  dotenv.config({ path: envLocalPath });
  console.log('[Env] ✅ Loaded .env.local from:', envLocalPath);
  // Log ZaloPay config status (without exposing values)
  console.log('[Env] ZaloPay config check:', {
    ZP_APP_ID: process.env.ZP_APP_ID ? 'SET' : 'MISSING',
    ZP_KEY1: process.env.ZP_KEY1 ? 'SET' : 'MISSING',
    ZP_CALLBACK_KEY: process.env.ZP_CALLBACK_KEY ? 'SET' : 'MISSING',
    ZP_CALLBACK_URL: process.env.ZP_CALLBACK_URL || 'NOT SET',
  });
} else if (fs.existsSync(envLocalPathProjectRoot)) {
  // ✅ Priority 1b: project_root/.env.local (fallback)
  dotenv.config({ path: envLocalPathProjectRoot });
  console.log('[Env] ✅ Loaded .env.local from project root:', envLocalPathProjectRoot);
  // Log ZaloPay config status (without exposing values)
  console.log('[Env] ZaloPay config check:', {
    ZP_APP_ID: process.env.ZP_APP_ID ? 'SET' : 'MISSING',
    ZP_KEY1: process.env.ZP_KEY1 ? 'SET' : 'MISSING',
    ZP_CALLBACK_KEY: process.env.ZP_CALLBACK_KEY ? 'SET' : 'MISSING',
    ZP_CALLBACK_URL: process.env.ZP_CALLBACK_URL || 'NOT SET',
  });
} else if (process.env.NODE_ENV === 'production' && fs.existsSync(envProductionPath)) {
  // Priority 2: .env.production (production template)
  dotenv.config({ path: envProductionPath });
  console.log('[Env] Loaded .env.production');
} else if (fs.existsSync(envPath)) {
  // Priority 3: .env (fallback)
  dotenv.config({ path: envPath });
  console.log('[Env] Loaded .env');
} else {
  // Priority 4: System environment variables
  dotenv.config();
  console.log('[Env] Loaded from system environment');
}

const PORT = process.env.PORT || 3012;

const startServer = async () => {
  try {
    await ready();
    console.log('App is ready');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

