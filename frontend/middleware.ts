import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ✅ SECURITY: Simple in-memory rate limit store (use Redis in production)
interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup expired entries periodically
function cleanupRateLimitStore() {
  if (rateLimitStore.size === 0) {
    setTimeout(cleanupRateLimitStore, 5 * 60 * 1000);
    return;
  }
  
  const now = Date.now();
  let cleaned = 0;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
      cleaned++;
    }
  }
  
  const nextInterval = cleaned > 100 ? 1 * 60 * 1000 : 5 * 60 * 1000;
  setTimeout(cleanupRateLimitStore, nextInterval);
}

// Start cleanup cycle
if (typeof globalThis !== 'undefined') {
  cleanupRateLimitStore();
}

function rateLimit(ip: string, limit = 100, window = 60000): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  
  if (entry && entry.resetTime > now) {
    if (entry.count >= limit) {
      return false;
    }
    entry.count++;
  } else {
    rateLimitStore.set(ip, { count: 1, resetTime: now + window });
  }
  
  return true;
}

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  
  // Get client IP
  const ip = request.ip || 
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
    request.headers.get('x-real-ip') ||
    'unknown';
  
  // ✅ SECURITY: Rate limiting for login endpoint
  if (pathname.startsWith('/api/auth/login') && request.method === 'POST') {
    if (!rateLimit(ip, 5, 15 * 60 * 1000)) { // 5 requests per 15 minutes
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }
  }
  
  // ✅ SECURITY: General rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    if (!rateLimit(ip, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
  }
  
  // Set no-cache headers for pages with dynamic metadata to prevent social media crawlers from caching
  const dynamicMetadataPaths = [
    '/about',
    '/contact',
    '/products',
    '/posts',
  ];
  
  // Check if this is a dynamic metadata page
  const isDynamicMetadataPage = dynamicMetadataPaths.some(path => 
    pathname === path || pathname.startsWith(`${path}/`)
  );
  
  if (isDynamicMetadataPage) {
    // Set headers to prevent caching by social media crawlers (Zalo, Facebook, etc.)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    response.headers.set('X-Content-Type-Options', 'nosniff');
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};






