import { Router, Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import sequelize from '../config/database';

const router = Router();

// ✅ DEVELOPMENT: Clear rate limit store (only in development)
// This helps when rate limiting blocks legitimate requests during development
let rateLimitStore: Map<string, any> | null = null;

export function setRateLimitStore(store: Map<string, any>) {
  rateLimitStore = store;
}

router.get('/', (_req, res) => {
  res.json({ status: 'ok' });
});

router.get('/db', async (_req, res) => {
  try {
    await sequelize.authenticate();
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'DB unavailable' });
  }
});

router.get('/storage', async (_req, res) => {
  try {
    const dir = process.env.UPLOAD_PATH || path.resolve(__dirname, '../../storage/uploads');
    await fs.mkdir(dir, { recursive: true });
    await fs.access(dir);
    res.json({ ok: true, dir });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Storage not writable' });
  }
});

// ✅ DEVELOPMENT: Clear rate limit store
router.post('/clear-rate-limit', (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Not available in production' });
  }
  
  if (rateLimitStore) {
    const size = rateLimitStore.size;
    rateLimitStore.clear();
    res.json({ 
      success: true, 
      message: `Cleared ${size} rate limit entries`,
      cleared: size 
    });
  } else {
    res.json({ 
      success: true, 
      message: 'Rate limit store not initialized',
      cleared: 0 
    });
  }
});

export default router;
