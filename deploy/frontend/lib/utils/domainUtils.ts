/**
 * Domain utility functions for frontend
 * Handles domain configuration from environment variables
 */

import { buildFromApiOrigin } from '@/config/site';

/**
 * Get API domain from environment variable
 */
export const getApiDomain = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: use env var or current hostname
    return process.env.NEXT_PUBLIC_API_DOMAIN || window.location.hostname;
  }
  // Server-side: use env var
  return process.env.NEXT_PUBLIC_API_DOMAIN || 'localhost';
};

/**
 * Get frontend domain from environment variable
 */
export const getFrontendDomain = (): string => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || window.location.hostname;
  }
  return process.env.NEXT_PUBLIC_FRONTEND_DOMAIN || 'localhost';
};

/**
 * Get full API URL with protocol
 */
export const getApiUrl = (): string => {
  const domain = getApiDomain();
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    return `${protocol}//${domain}`;
  }
  // Server-side: default to HTTPS for production
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? `https://${domain}` : `http://${domain}`;
};

/**
 * Check if a URL belongs to production domain
 */
export const isProductionDomain = (url: string): boolean => {
  const frontendDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  
  if (!frontendDomain && !apiDomain) {
    return false; // Development mode
  }
  
  const domains = [frontendDomain, apiDomain].filter(Boolean);
  return domains.some(domain => domain && url.includes(domain));
};

/**
 * Replace IP address with configured API domain
 */
export const replaceIpWithDomain = (url: string): string => {
  const ipPattern = /https?:\/\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?/;
  const ipMatch = url.match(ipPattern);
  
  if (ipMatch) {
    const apiUrl = getApiUrl();
    return url.replace(ipMatch[0], apiUrl);
  }
  
  return url;
};

/**
 * Get API origin URL from environment variables
 * Returns the base URL for API (without /api suffix)
 */
const getApiOriginFromEnv = (): string => {
  // Client-side: use env var or construct from current location
  if (typeof window !== 'undefined') {
    const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
    if (apiDomain) {
      const protocol = window.location.protocol;
      return `${protocol}//${apiDomain}`;
    }
    // Fallback: use current hostname with port
    const apiPort = process.env.NEXT_PUBLIC_API_PORT || '3012';
    return `${window.location.protocol}//${window.location.hostname}:${apiPort}`;
  }
  
  // Server-side: use env var or default to localhost
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  if (apiDomain) {
    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction ? `https://${apiDomain}` : `http://${apiDomain}`;
  }
  
  // Fallback: localhost
  const apiPort = process.env.NEXT_PUBLIC_API_PORT || '3012';
  return `http://localhost:${apiPort}`;
};

/**
 * Check if currently running in production environment
 */
const isProductionEnvironment = (): boolean => {
  // Check NODE_ENV first
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  
  // Client-side: check hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    // If hostname is not localhost/127.0.0.1 and has env domain set, assume production
    if (hostname !== 'localhost' && !hostname.includes('127.0.0.1')) {
      const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
      const frontendDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
      if (apiDomain && !apiDomain.includes('localhost')) {
        return true;
      }
      if (frontendDomain && !frontendDomain.includes('localhost')) {
        return true;
      }
    }
  }
  
  return false;
};

/**
 * Normalize media URL - replace IP with domain and convert HTTP to HTTPS if needed
 * This is the main function to use for normalizing media URLs in frontend
 * ✅ Uses environment variables - no hardcoded domains
 */
export const normalizeMediaUrl = (raw: unknown): string | null => {
  if (!raw || typeof raw !== 'string') {
    return null;
  }

  const cleaned = raw.replace(/\\/g, '/');
  let url: string;
  
  // Get API origin from env (not hardcoded)
  const apiOrigin = getApiOriginFromEnv();
  const isProduction = isProductionEnvironment();
  
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    url = cleaned;
    
    // ✅ Replace localhost/127.0.0.1 with API origin from env
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      const beforeReplace = url;
      url = url.replace(/https?:\/\/localhost(:\d+)?/gi, apiOrigin);
      url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, apiOrigin);
      if (beforeReplace !== url) {
        console.log(`[normalizeMediaUrl] Replaced localhost with API origin: ${beforeReplace} -> ${url}`);
      }
    }
    
    // Replace IP addresses with API origin
    url = replaceIpWithDomain(url);
  } else {
    // Relative path - use API origin from env
    url = `${apiOrigin}${cleaned.startsWith('/') ? '' : '/'}${cleaned}`;
  }
  
  // Fix common path issues: /upload/ should be /uploads/
  url = url.replace(/\/upload\/(?!s)/g, '/uploads/');
  
  // Convert HTTP to HTTPS for production domains (based on env, not hardcoded)
  if (url.startsWith('http://') && isProduction) {
    url = url.replace('http://', 'https://');
  }
  
  // Final check: ensure no localhost in production
  if (isProduction && (url.includes('localhost') || url.includes('127.0.0.1'))) {
    console.warn(`[normalizeMediaUrl] Found localhost in production, replacing: ${url}`);
    url = url.replace(/https?:\/\/localhost(:\d+)?/gi, apiOrigin);
    url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, apiOrigin);
  }
  
  return url;
};

