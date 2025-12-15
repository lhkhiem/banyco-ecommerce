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
const backendRoot = path.resolve(__dirname, '../..');
const envLocalPath = path.join(backendRoot, '.env.local');
const envProductionPath = path.join(backendRoot, '.env.production');
const envPath = path.join(backendRoot, '.env');

if (fs.existsSync(envLocalPath)) {
  // ✅ Priority 1: .env.local (for actual dev/prod values)
  dotenv.config({ path: envLocalPath });
  console.log('[Env] Loaded .env.local');
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

