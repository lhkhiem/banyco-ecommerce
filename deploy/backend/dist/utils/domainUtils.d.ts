/**
 * Domain utility functions for backend
 * Handles domain configuration from environment variables
 * ✅ All domains are configurable via environment variables - no hardcoded domains
 */
/**
 * Get Ecommerce API domain from environment variable
 * ✅ Uses API_DOMAIN env var, no hardcoded domain
 */
export declare const getApiDomain: () => string;
/**
 * Get frontend domain from environment variable
 * ✅ Uses FRONTEND_DOMAIN or PRODUCTION_FRONTEND_DOMAIN env var, no hardcoded domain
 */
export declare const getFrontendDomain: () => string;
/**
 * Get site URL (frontend URL) with protocol
 * Production: always https://banyco.vn (or https://{FRONTEND_DOMAIN} if explicitly set)
 */
export declare const getSiteUrl: () => string;
/**
 * Get admin domain from environment variable
 */
export declare const getAdminDomain: () => string;
/**
 * Get full API URL with protocol
 */
export declare const getApiUrl: () => string;
/**
 * Check if a URL belongs to production domain
 */
export declare const isProductionDomain: (url: string) => boolean;
/**
 * Replace IP address with configured API domain
 */
export declare const replaceIpWithDomain: (url: string) => string;
/**
 * Normalize media URL - replace IP with domain and convert HTTP to HTTPS if needed
 * This is the main function to use for normalizing media URLs in backend
 * ✅ Images are served from ecommerce backend (which proxies from IMAGE_SOURCE_URL if needed)
 * ✅ IMAGE_SOURCE_URL can be CMS backend (localhost:3011) or S3 URL for future upgrade
 */
export declare const normalizeMediaUrl: (value: string | null | undefined) => string | null;
//# sourceMappingURL=domainUtils.d.ts.map