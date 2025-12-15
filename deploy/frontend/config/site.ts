const DEFAULT_SITE_PORT = 3000;
const DEFAULT_API_PORT = 3012; // Ecommerce Backend port
const DEFAULT_API_PATH = '/api';

const trimTrailingSlash = (value?: string | null): string => {
  if (!value) return '';
  return value.replace(/\/+$/, '');
};

const ensureLeadingSlash = (value: string): string => {
  if (!value) return '';
  return value.startsWith('/') ? value : `/${value}`;
};

const buildUrl = (base: string, path = ''): string => {
  const normalizedBase = trimTrailingSlash(base);
  if (!path) return normalizedBase;
  return `${normalizedBase}${ensureLeadingSlash(path)}`;
};

const resolveSiteUrl = (): string => {
  // Priority 1: Use explicit env variable
  const envUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL);
  if (envUrl) return envUrl;

  // Priority 2: Client-side - use current origin (always correct)
  if (typeof window !== 'undefined') {
    return trimTrailingSlash(window.location.origin);
  }

  // Priority 3: Server-side rendering - use env variable
  const frontendDomain = process.env.NEXT_PUBLIC_FRONTEND_DOMAIN;
  if (frontendDomain) {
    const nodeEnv = process.env.NODE_ENV;
    const isProduction = nodeEnv === 'production';
    return isProduction ? `https://${frontendDomain}` : `http://${frontendDomain}`;
  }

  // Priority 4: Check VERCEL_URL or HOSTNAME (for deployment platforms)
  const hostname = process.env.VERCEL_URL || process.env.HOSTNAME;
  if (hostname) {
    return `https://${hostname}`;
  }

  // Priority 5: Development fallback (only for local development)
  return `http://localhost:${DEFAULT_SITE_PORT}`;
};

const resolveApiUrl = (): string => {
  // Priority 1: Use explicit NEXT_PUBLIC_API_URL (full URL)
  const envUrl = trimTrailingSlash(process.env.NEXT_PUBLIC_API_URL);
  if (envUrl) {
    // If env URL already includes /api, use as is, otherwise append /api
    if (envUrl.endsWith('/api')) {
      return envUrl;
    }
    return buildUrl(envUrl, DEFAULT_API_PATH);
  }

  // Priority 2: Use NEXT_PUBLIC_API_DOMAIN to construct URL
  const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN;
  if (apiDomain) {
    if (typeof window !== 'undefined') {
      // Client-side: use current protocol with API domain
      const protocol = window.location.protocol;
      return `${protocol}//${apiDomain}${DEFAULT_API_PATH}`;
    }
    // Server-side: use HTTPS for production, HTTP for development
    const nodeEnv = process.env.NODE_ENV;
    const isProduction = nodeEnv === 'production';
    return `${isProduction ? 'https' : 'http'}://${apiDomain}${DEFAULT_API_PATH}`;
  }

  // Priority 3: Fallback to localhost (development only)
  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;
    const apiPort = process.env.NEXT_PUBLIC_API_PORT || `${DEFAULT_API_PORT}`;
    return buildUrl(`${protocol}//${hostname}${apiPort ? `:${apiPort}` : ''}`, DEFAULT_API_PATH);
  }

  // Server-side fallback
  const apiPort = process.env.NEXT_PUBLIC_API_PORT || `${DEFAULT_API_PORT}`;
  return `http://localhost:${apiPort}${DEFAULT_API_PATH}`;
};

const removeApiSuffix = (url: string): string => {
  return trimTrailingSlash(url).replace(/\/api$/, '');
};

export const getSiteUrl = () => resolveSiteUrl();
export const getApiUrl = () => resolveApiUrl();
export const getApiOrigin = () => removeApiSuffix(resolveApiUrl());
export const buildSiteUrl = (path = '') => buildUrl(resolveSiteUrl(), path);
export const buildApiUrl = (path = '') => buildUrl(resolveApiUrl(), path);
export const buildFromApiOrigin = (path = '') => buildUrl(getApiOrigin(), path);

// Site configuration
export const siteConfig = {
  name: 'Banyco',
  description: 'Leading supplier of spa and salon supplies, products, and equipment',
  get url(): string {
    return getSiteUrl();
  },
  get apiUrl(): string {
    return getApiUrl();
  },
  ogImage: '/images/og-image.jpg',
  links: {
    twitter: 'https://twitter.com/universalcos',
    facebook: 'https://www.facebook.com/universalcompaniesinc',
    instagram: 'https://www.instagram.com/universalcos/',
    youtube: 'https://www.youtube.com/@UniversalCos',
    linkedin: 'https://www.linkedin.com/company/universal-companies',
    tiktok: 'https://www.tiktok.com/@universalcompanies',
    pinterest: 'https://www.pinterest.com/universalcos/',
  },
  contact: {
    email: 'info@universalcompanies.com',
    phone: '1-800-558-5571',
  },
};

// Shipping thresholds
export const shippingConfig = {
  freeShippingThreshold: 749,
  reducedShippingThreshold: 199,
  reducedShippingCost: 4.99,
  standardShippingCost: 9.99,
};

// Pagination defaults
export const paginationConfig = {
  defaultPageSize: 24,
  pageSizeOptions: [12, 24, 48, 96],
};
