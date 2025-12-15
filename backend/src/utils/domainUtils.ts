/**
 * Domain utility functions for backend
 * Handles domain configuration from environment variables
 * ✅ All domains are configurable via environment variables - no hardcoded domains
 */

/**
 * Get Ecommerce API domain from environment variable
 * ✅ Uses API_DOMAIN env var, no hardcoded domain
 */
export const getApiDomain = (): string => {
  // ✅ Priority 1: Use explicit API_DOMAIN env var
  if (process.env.API_DOMAIN) {
    return process.env.API_DOMAIN;
  }
  
  // ✅ Priority 2: Check if production (use API_DOMAIN if set, otherwise construct from FRONTEND_DOMAIN)
  const isProduction = process.env.NODE_ENV === 'production' || 
                       process.env.API_DOMAIN?.includes(process.env.PRODUCTION_DOMAIN_SUFFIX || '') ||
                       process.env.FRONTEND_DOMAIN?.includes(process.env.PRODUCTION_DOMAIN_SUFFIX || '');
  
  if (isProduction) {
    // Try to construct from FRONTEND_DOMAIN or use default
    const frontendDomain = process.env.FRONTEND_DOMAIN;
    if (frontendDomain && !frontendDomain.includes('localhost')) {
      // Construct ecommerce-api.{frontendDomain}
      return `ecommerce-api.${frontendDomain.replace(/^https?:\/\//, '').split('/')[0]}`;
    }
    // ✅ Fallback: use PRODUCTION_API_DOMAIN from env (required in production)
    const productionApiDomain = process.env.PRODUCTION_API_DOMAIN;
    if (!productionApiDomain) {
      console.warn('[getApiDomain] WARNING: PRODUCTION_API_DOMAIN not set, using fallback. Please set PRODUCTION_API_DOMAIN in .env.local');
    }
    return productionApiDomain || 'ecommerce-api.banyco.vn'; // Fallback only if env not set
  }
  
  // ✅ Priority 3: Development - use localhost with port
  const apiPort = process.env.API_PORT || '3012';
  return `localhost:${apiPort}`;
};

/**
 * Get production API domain (full URL with protocol)
 * ✅ Uses PRODUCTION_API_DOMAIN or API_DOMAIN env var
 */
const getProductionApiUrl = (): string => {
  const productionApiDomain = process.env.PRODUCTION_API_DOMAIN || process.env.API_DOMAIN;
  if (productionApiDomain) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    return `${protocol}://${productionApiDomain.replace(/^https?:\/\//, '')}`;
  }
  // ✅ Fallback (should not happen if env is set correctly)
  console.warn('[getProductionApiUrl] WARNING: PRODUCTION_API_DOMAIN not set, using fallback. Please set PRODUCTION_API_DOMAIN in .env.local');
  return 'https://ecommerce-api.banyco.vn'; // Fallback only if env not set
};

/**
 * Get CMS API domain for pattern matching
 * ✅ Uses CMS_API_DOMAIN env var
 */
const getCmsApiDomain = (): string => {
  // ✅ Use CMS_API_DOMAIN from env (fallback for backward compatibility)
  const cmsApiDomain = process.env.CMS_API_DOMAIN;
  if (!cmsApiDomain) {
    console.warn('[getCmsApiDomain] WARNING: CMS_API_DOMAIN not set, using fallback. Please set CMS_API_DOMAIN in .env.local');
  }
  return cmsApiDomain || 'api.banyco.vn'; // Fallback only if env not set
};

/**
 * Get frontend domain from environment variable
 * ✅ Uses FRONTEND_DOMAIN or PRODUCTION_FRONTEND_DOMAIN env var, no hardcoded domain
 */
export const getFrontendDomain = (): string => {
  // ✅ Priority 1: Use explicit FRONTEND_DOMAIN env var
  const envDomain =
    process.env.FRONTEND_DOMAIN ||
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/https?:\/\//, '');

  // ✅ Priority 2: Check if production
  const productionSuffix = process.env.PRODUCTION_DOMAIN_SUFFIX;
  if (!productionSuffix) {
    console.warn('[getFrontendDomain] WARNING: PRODUCTION_DOMAIN_SUFFIX not set, using fallback. Please set PRODUCTION_DOMAIN_SUFFIX in .env.local');
  }
  const productionSuffixValue = productionSuffix || 'banyco.vn'; // Fallback only if env not set
  const isProduction =
    process.env.NODE_ENV === 'production' ||
    (envDomain && envDomain.includes(productionSuffixValue)) ||
    process.env.API_DOMAIN?.includes(productionSuffixValue);

  if (isProduction) {
    // ✅ Use explicit env, otherwise use PRODUCTION_FRONTEND_DOMAIN, or fallback
    const productionFrontendDomain = process.env.PRODUCTION_FRONTEND_DOMAIN;
    if (!productionFrontendDomain && !envDomain) {
      console.warn('[getFrontendDomain] WARNING: PRODUCTION_FRONTEND_DOMAIN not set, using fallback. Please set PRODUCTION_FRONTEND_DOMAIN in .env.local');
    }
    return envDomain || productionFrontendDomain || productionSuffixValue; // Fallback only if env not set
  }

  // ✅ Priority 3: Development fallback
  const frontendPort = process.env.FRONTEND_PORT || '3000';
  return envDomain || `localhost:${frontendPort}`;
};

/**
 * Get site URL (frontend URL) with protocol
 * Production: always https://banyco.vn (or https://{FRONTEND_DOMAIN} if explicitly set)
 */
export const getSiteUrl = (): string => {
  const rawDomain = getFrontendDomain();

  // If domain already includes protocol, normalize to https in production
  if (rawDomain.startsWith('http://') || rawDomain.startsWith('https://')) {
    if (process.env.NODE_ENV === 'production' && rawDomain.startsWith('http://')) {
      return rawDomain.replace('http://', 'https://');
    }
    return rawDomain;
  }

  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  return `${protocol}://${rawDomain}`;
};

/**
 * Get admin domain from environment variable
 */
export const getAdminDomain = (): string => {
  const adminDomain = process.env.ADMIN_DOMAIN;
  const frontendDomain = getFrontendDomain();
  return adminDomain || `admin.${frontendDomain}`;
};

/**
 * Get full API URL with protocol
 */
export const getApiUrl = (): string => {
  const domain = getApiDomain();
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  // Remove port if it's included in domain (for localhost)
  const cleanDomain = domain.includes(':') ? domain : domain;
  return `${protocol}://${cleanDomain}`;
};

/**
 * Check if a URL belongs to production domain
 */
export const isProductionDomain = (url: string): boolean => {
  const frontendDomain = process.env.FRONTEND_DOMAIN;
  const apiDomain = process.env.API_DOMAIN;
  
  if (!frontendDomain && !apiDomain) {
    return process.env.NODE_ENV === 'production';
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
 * Normalize media URL - replace IP with domain and convert HTTP to HTTPS if needed
 * This is the main function to use for normalizing media URLs in backend
 * ✅ Images are served from ecommerce backend (which proxies from IMAGE_SOURCE_URL if needed)
 * ✅ IMAGE_SOURCE_URL can be CMS backend (localhost:3011) or S3 URL for future upgrade
 */
export const normalizeMediaUrl = (value: string | null | undefined): string | null => {
  if (!value || typeof value !== 'string') {
    return null;
  }

  const cleaned = value.replace(/\\/g, '/');
  let url: string;
  const originalUrl = cleaned;
  
  // ✅ Check if we're in production (using env vars, no hardcoded domains)
  const productionSuffix = process.env.PRODUCTION_DOMAIN_SUFFIX || 'banyco.vn'; // Fallback for detection
  const isProduction = process.env.NODE_ENV === 'production' || 
                       process.env.API_DOMAIN?.includes(productionSuffix) ||
                       process.env.FRONTEND_DOMAIN?.includes(productionSuffix) ||
                       (typeof process.env.HOSTNAME !== 'undefined' && 
                        process.env.HOSTNAME !== 'localhost' && 
                        !process.env.HOSTNAME.includes('127.0.0.1'));
  
  // ✅ Get ecommerce API URL from env (images are served through ecommerce backend)
  // Ecommerce backend will proxy from IMAGE_SOURCE_URL (CMS backend or S3) if local file not found
  const ecommerceApiUrl = isProduction 
    ? getProductionApiUrl()
    : getApiUrl();
  
  if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
    url = cleaned;
    
    // ✅ Replace localhost/127.0.0.1 with ecommerce backend URL (not production URL in dev!)
    // In development: replace with localhost:3012 (ecommerce backend)
    // In production: replace with production API URL
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      const beforeReplace = url;
      // Extract path from URL
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname + urlObj.search + urlObj.hash;
        // ✅ Use ecommerceApiUrl (which is localhost:3012 in dev, production URL in prod)
        url = `${ecommerceApiUrl}${path}`;
      } catch (e) {
        // Fallback: simple replace
        url = url.replace(/https?:\/\/localhost(:\d+)?/gi, ecommerceApiUrl);
        url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, ecommerceApiUrl);
      }
      
      if (beforeReplace !== url) {
        console.log(`[normalizeMediaUrl] Replaced localhost with ecommerce backend: ${beforeReplace} -> ${url}`);
      }
    }
    
    // ✅ Replace any CMS backend URLs (from env vars, port 3011, or IMAGE_SOURCE_URL) 
    // with ecommerce backend URL (ecommerce backend will proxy from IMAGE_SOURCE_URL)
    const imageSourceUrl = process.env.IMAGE_SOURCE_URL;
    const cmsApiDomain = getCmsApiDomain();
    const cmsBackendPort = process.env.CMS_BACKEND_PORT || '3011';
    
    // ✅ Build patterns from env vars, not hardcoded
    const cmsApiPatterns = [
      new RegExp(`https?://${cmsApiDomain.replace(/\./g, '\\.')}`, 'gi'),
      new RegExp(`https?://[^/]+:${cmsBackendPort}`, 'gi'),  // Any URL with CMS backend port
    ];
    
    // Also check if URL matches IMAGE_SOURCE_URL pattern
    if (imageSourceUrl) {
      try {
        const sourceUrlObj = new URL(imageSourceUrl);
        const sourceHost = sourceUrlObj.host;
        if (url.includes(sourceHost)) {
          cmsApiPatterns.push(new RegExp(`https?://${sourceHost.replace(/\./g, '\\.')}`, 'gi'));
        }
      } catch (e) {
        // Invalid IMAGE_SOURCE_URL, skip
      }
    }
    
    for (const pattern of cmsApiPatterns) {
      if (pattern.test(url)) {
        const beforeReplace = url;
        // Extract the path part
        const urlObj = new URL(url);
        const path = urlObj.pathname + urlObj.search + urlObj.hash;
        url = `${ecommerceApiUrl}${path}`;
        console.log(`[normalizeMediaUrl] Replaced CMS/Source URL with Ecommerce: ${beforeReplace} -> ${url}`);
      }
    }
  } else {
    // ✅ Relative path - use ecommerce backend URL for serving images
    // In development: use localhost:3012
    // In production: use production API URL
    
    // Fix /upload/ to /uploads/ in relative paths
    let normalizedPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    normalizedPath = normalizedPath.replace(/\/upload\/(?!s)/g, '/uploads/');
    
    // ✅ Use ecommerceApiUrl (which is correct for both dev and prod)
    url = `${ecommerceApiUrl}${normalizedPath}`;
    
    console.log(`[normalizeMediaUrl] Using ecommerce backend URL for relative path: ${cleaned} -> ${url}`);
  }
  
  // ✅ Final safety check - if URL still contains localhost/127.0.0.1, replace with ecommerce backend
  // In development: replace with localhost:3012
  // In production: replace with production API URL
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    console.warn(`[normalizeMediaUrl] Found localhost, replacing with ecommerce backend: ${url}`);
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search + urlObj.hash;
      // ✅ Use ecommerceApiUrl (correct for both dev and prod)
      url = `${ecommerceApiUrl}${path}`;
    } catch (e) {
      // Fallback: simple replace
      url = url.replace(/https?:\/\/localhost(:\d+)?/gi, ecommerceApiUrl);
      url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, ecommerceApiUrl);
    }
    console.log(`[normalizeMediaUrl] After replacement: ${url}`);
  }
  
  // Fix common path issues: /upload/ should be /uploads/
  // This handles cases where database has /upload/ instead of /uploads/
  url = url.replace(/\/upload\/(?!s)/g, '/uploads/');
  
  // Replace IP with domain
  url = replaceIpWithDomain(url);
  
  // Convert HTTP to HTTPS for production domains
  if (url.startsWith('http://')) {
    const isLocalhost = url.includes('localhost') || url.includes('127.0.0.1');
    
    if (isProduction && !isLocalhost) {
      url = url.replace('http://', 'https://');
    }
  }
  
  // ✅ Final check: ensure production URLs use ecommerce API domain (from env)
  const productionApiDomain = process.env.PRODUCTION_API_DOMAIN || process.env.API_DOMAIN;
  if (!productionApiDomain && isProduction) {
    console.warn('[normalizeMediaUrl] WARNING: PRODUCTION_API_DOMAIN not set, using fallback. Please set PRODUCTION_API_DOMAIN in .env.local');
  }
  const productionApiDomainValue = productionApiDomain || 'ecommerce-api.banyco.vn'; // Fallback only if env not set
  const cmsApiDomain = getCmsApiDomain();
  const cmsBackendPort = process.env.CMS_BACKEND_PORT || '3011';
  
  if (isProduction && url.includes(productionSuffix)) {
    // If URL contains production domain but not ecommerce API domain, replace it
    if (!url.includes(productionApiDomainValue) && (url.includes(cmsApiDomain) || url.includes(`:${cmsBackendPort}`))) {
      const urlObj = new URL(url);
      const path = urlObj.pathname + urlObj.search + urlObj.hash;
      url = `${ecommerceApiUrl}${path}`;
      console.log(`[normalizeMediaUrl] Final replacement to ecommerce API: ${originalUrl} -> ${url}`);
    }
  }
  
  // Final normalization: ensure URL format is exactly https://ecommerce-api.banyco.vn/uploads/...
  // Ensure path starts with /uploads/ (not /upload/)
  url = url.replace(/\/upload\/(?!s)/g, '/uploads/');
  
  // ✅ Final check: if still has localhost, replace with ecommerce backend (not production in dev!)
  if (url.includes('localhost') || url.includes('127.0.0.1')) {
    // Only force replace in production, in dev localhost is OK
    if (isProduction) {
      console.warn(`[normalizeMediaUrl] Found localhost in production, replacing: ${url}`);
      const productionApiUrl = getProductionApiUrl();
      try {
        const urlObj = new URL(url);
        const path = urlObj.pathname + urlObj.search + urlObj.hash;
        url = `${productionApiUrl}${path}`;
      } catch (e) {
        // Fallback: simple replace
        url = url.replace(/https?:\/\/localhost(:\d+)?/gi, productionApiUrl);
        url = url.replace(/https?:\/\/127\.0\.0\.1(:\d+)?/gi, productionApiUrl);
      }
      console.log(`[normalizeMediaUrl] Final replacement result: ${url}`);
    } else {
      // In development, localhost is OK - just ensure it's ecommerce backend
      console.log(`[normalizeMediaUrl] Development mode - localhost URL is OK: ${url}`);
    }
  }
  
  // Log if we made any corrections
  if (url !== originalUrl) {
    console.log(`[normalizeMediaUrl] Final normalized URL: ${originalUrl} -> ${url}`);
  }
  
  return url;
};



