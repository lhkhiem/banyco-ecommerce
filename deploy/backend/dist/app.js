"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.ready = ready;
// Ecommerce Backend - Public APIs only
// Independent from CMS Backend
// IMPORTANT: Disable dev logs in production - must be first import
require("./utils/disableDevLogs");
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const promises_1 = __importDefault(require("fs/promises"));
const axios_1 = __importDefault(require("axios"));
const database_1 = __importDefault(require("./config/database"));
// Import models to initialize associations
require("./models");
// Public routes only
const publicProducts_1 = __importDefault(require("./routes/publicProducts"));
const publicAuth_1 = __importDefault(require("./routes/publicAuth")); // Customer authentication
const publicHomepage_1 = __importDefault(require("./routes/publicHomepage")); // Homepage data (hero, testimonials, etc.)
const publicPosts_1 = __importDefault(require("./routes/publicPosts")); // Public blog posts
const orders_1 = __importDefault(require("./routes/orders")); // Create order + lookup
const payments_1 = __importDefault(require("./routes/payments")); // Payment gateway (ZaloPay)
const newsletter_1 = __importDefault(require("./routes/newsletter")); // Newsletter subscriptions
const trackingScripts_1 = __importDefault(require("./routes/trackingScripts")); // Tracking scripts (analytics)
const menuLocations_1 = __importDefault(require("./routes/menuLocations")); // Menu locations (public GET only)
const menuItems_1 = __importDefault(require("./routes/menuItems")); // Menu items (public GET only)
const health_1 = __importStar(require("./routes/health"));
const publicSettings_1 = __importDefault(require("./routes/publicSettings")); // Read-only storefront settings (logo, favicon, etc.)
// Public read routes (modify to remove admin CRUD)
const productCategories_1 = __importDefault(require("./routes/productCategories")); // Only GET routes
const brands_1 = __importDefault(require("./routes/brands")); // Only GET routes
// CMS-only routes - COMMENTED (not used in Ecommerce Backend)
// import authRoutes from './routes/auth'; // Admin auth - CMS only
// import postRoutes from './routes/posts'; // CMS only
// import topicRoutes from './routes/topics'; // CMS only
// import tagRoutes from './routes/tags'; // CMS only
// import productRoutes from './routes/products'; // Admin CRUD - CMS only
// import assetRoutes from './routes/assets'; // CMS only
// import usersRoutes from './routes/users'; // Admin users - CMS only
// import settingsRoutes from './routes/settings'; // CMS only
// import mediaRoutes from './routes/media'; // CMS only
// import menuLocationRoutes from './routes/menuLocations'; // CMS only
// import menuItemRoutes from './routes/menuItems'; // CMS only
// import trackingScriptRoutes from './routes/trackingScripts'; // CMS only
const analytics_1 = __importDefault(require("./routes/analytics")); // Public analytics tracking
// import homepageRoutes from './routes/homepage'; // CMS only
// import sliderRoutes from './routes/sliders'; // CMS only
// import aboutSectionRoutes from './routes/aboutSections'; // CMS only
// import publicPostsRoutes from './routes/publicPosts'; // CMS only
// import publicHomepageRoutes from './routes/publicHomepage'; // CMS only
const publicPageMetadata_1 = __importDefault(require("./routes/publicPageMetadata")); // Public SEO metadata for pages
const publicFAQs_1 = __importDefault(require("./routes/publicFAQs")); // Public FAQs
const publicAboutSections_1 = __importDefault(require("./routes/publicAboutSections")); // Public About Sections
const contacts_1 = __importDefault(require("./routes/contacts")); // Public contact form submissions
const consultations_1 = __importDefault(require("./routes/consultations")); // Public consultation form submissions
// import emailRoutes from './routes/email'; // CMS only
// import inventoryRoutes from './routes/inventory'; // CMS only
// import activityLogRoutes from './routes/activityLogs'; // CMS only
// import syncMetadataRoutes from './routes/syncMetadata'; // CMS only
// import debugSeoRoutes from './routes/debugSeo'; // CMS only
// import pageMetadataRoutes from './routes/pageMetadata'; // CMS only
dotenv_1.default.config();
exports.app = (0, express_1.default)();
// Middleware
// CORS - chỉ cho phép Ecommerce Frontend
const buildAllowedOrigins = () => {
    const origins = [];
    // Development origins
    origins.push(process.env.ECOMMERCE_FRONTEND_ORIGIN || 'http://localhost:3000', 'http://localhost:3000', 'http://127.0.0.1:3000');
    // Production domains
    const frontendDomain = process.env.FRONTEND_DOMAIN;
    if (frontendDomain) {
        origins.push(`http://${frontendDomain}`, `https://${frontendDomain}`, `http://www.${frontendDomain}`, `https://www.${frontendDomain}`);
    }
    // Explicitly add banyco.vn domains
    origins.push('https://banyco.vn', 'http://banyco.vn', 'https://www.banyco.vn', 'http://www.banyco.vn');
    // Legacy support
    if (process.env.WEBSITE_ORIGIN && process.env.WEBSITE_ORIGIN.startsWith('http')) {
        origins.push(process.env.WEBSITE_ORIGIN);
        if (process.env.WEBSITE_ORIGIN.startsWith('http://')) {
            origins.push(process.env.WEBSITE_ORIGIN.replace('http://', 'https://'));
        }
    }
    return [...new Set(origins)];
};
const allowedOrigins = buildAllowedOrigins();
exports.app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`[CORS] Origin not allowed: ${origin}`);
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
}));
exports.app.use(express_1.default.json({ limit: '50mb' }));
exports.app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
exports.app.use((0, cookie_parser_1.default)());
// ✅ SECURITY: Rate limiting để chống DDoS và brute force
const rateLimitStore = new Map();
// Export rate limit store for health check endpoint (development only)
(0, health_1.setRateLimitStore)(rateLimitStore);
// Optimized cleanup: only run if store has entries, use recursive setTimeout to avoid overlap
function cleanupRateLimitStore() {
    if (rateLimitStore.size === 0) {
        // No entries to clean, schedule next check in 5 minutes
        setTimeout(cleanupRateLimitStore, 5 * 60 * 1000);
        return;
    }
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of rateLimitStore.entries()) {
        if (entry.resetTime < now && (!entry.blockUntil || entry.blockUntil < now)) {
            rateLimitStore.delete(key);
            cleaned++;
        }
    }
    // Schedule next cleanup (sooner if we cleaned many entries)
    const nextInterval = cleaned > 100 ? 1 * 60 * 1000 : 5 * 60 * 1000;
    setTimeout(cleanupRateLimitStore, nextInterval);
}
// Start cleanup cycle
cleanupRateLimitStore();
exports.app.use((req, res, next) => {
    const ip = req.ip ||
        req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        req.connection.remoteAddress ||
        'unknown';
    // ✅ DEVELOPMENT: Disable rate limiting for localhost in development
    const isDevelopment = process.env.NODE_ENV !== 'production';
    const isLocalhost = ip === '127.0.0.1' ||
        ip === '::1' ||
        ip === '::ffff:127.0.0.1' ||
        ip.includes('localhost') ||
        ip === 'unknown' ||
        (req.headers.host && req.headers.host.includes('localhost'));
    if (isDevelopment && isLocalhost) {
        // Skip rate limiting for localhost in development
        next();
        return;
    }
    const now = Date.now();
    const entry = rateLimitStore.get(ip);
    // Check if IP is blocked
    if (entry?.blocked && entry.blockUntil && entry.blockUntil > now) {
        const remainingTime = Math.ceil((entry.blockUntil - now) / 1000 / 60);
        console.warn(`[RateLimit] Blocked IP ${ip} - ${remainingTime} minutes remaining`);
        return res.status(429).json({
            success: false,
            error: 'Too many requests. Your IP has been temporarily blocked.',
            retryAfter: remainingTime,
        });
    }
    // Reset if block expired
    if (entry?.blocked && entry.blockUntil && entry.blockUntil <= now) {
        rateLimitStore.delete(ip);
    }
    // ✅ Rate limiting: Higher limits for development, stricter for production
    const maxRequests = isDevelopment ? 1000 : 150; // 1000 requests in dev, 150 in prod
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const blockDuration = isDevelopment ? 5 * 60 * 1000 : 60 * 60 * 1000; // 5 min in dev, 1 hour in prod
    if (entry && entry.resetTime > now) {
        if (entry.count >= maxRequests) {
            // Exceeded limit - block IP
            entry.blocked = true;
            entry.blockUntil = now + blockDuration;
            console.warn(`[RateLimit] IP ${ip} exceeded limit - blocked for ${blockDuration / 1000 / 60} minutes`);
            return res.status(429).json({
                success: false,
                error: 'Too many requests. Your IP has been temporarily blocked.',
                retryAfter: Math.ceil(blockDuration / 1000 / 60),
            });
        }
        entry.count++;
    }
    else {
        rateLimitStore.set(ip, { count: 1, resetTime: now + windowMs });
    }
    // Add rate limit headers
    const currentEntry = rateLimitStore.get(ip);
    if (currentEntry) {
        res.setHeader('X-RateLimit-Limit', maxRequests);
        res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - currentEntry.count));
        res.setHeader('X-RateLimit-Reset', new Date(currentEntry.resetTime).toISOString());
    }
    next();
});
// ✅ SECURITY: Security headers để chống các tấn công phổ biến
exports.app.use((req, res, next) => {
    // Xóa headers có thể leak thông tin server
    res.removeHeader('X-Powered-By');
    res.removeHeader('Server');
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');
    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');
    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');
    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    // HSTS (chỉ cho HTTPS)
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
    }
    // Content Security Policy
    res.setHeader('Content-Security-Policy', "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https: http:; " +
        "connect-src 'self' https:; " +
        "frame-ancestors 'none';");
    // Permissions Policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), gyroscope=()');
    // Prevent caching of sensitive data
    if (req.path.startsWith('/api/auth')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }
    next();
});
// Ecommerce Public Routes
exports.app.use('/api/products', publicProducts_1.default); // Public product listing & detail
exports.app.use('/api/product-categories', productCategories_1.default); // Public category listing (GET only)
exports.app.use('/api/brands', brands_1.default); // Public brand listing (GET only)
exports.app.use('/api/public/homepage', publicHomepage_1.default); // Homepage data (hero, testimonials, etc.)
exports.app.use('/api/public/posts', publicPosts_1.default); // Public blog posts
exports.app.use('/api/menu-locations', menuLocations_1.default); // Menu locations (public GET only)
exports.app.use('/api/menu-items', menuItems_1.default); // Menu items (public GET only)
exports.app.use('/api/public/settings', publicSettings_1.default); // Public read-only settings (appearance, etc.)
exports.app.use('/api/orders', orders_1.default); // Create order + lookup (POST, GET)
exports.app.use('/api/payments', payments_1.default); // Payment gateway (ZaloPay)
exports.app.use('/api/auth', publicAuth_1.default); // Customer authentication
exports.app.use('/api/newsletter', newsletter_1.default); // Newsletter subscriptions
exports.app.use('/api/consultations', consultations_1.default); // Consultation form submissions (public POST only)
exports.app.use('/api/contacts', contacts_1.default); // Contact form submissions (public POST only)
exports.app.use('/api/analytics', analytics_1.default); // Analytics tracking (public POST /track only)
exports.app.use('/api/tracking-scripts', trackingScripts_1.default); // Tracking scripts (analytics) - public endpoint only
exports.app.use('/api/public/page-metadata', publicPageMetadata_1.default); // Public SEO metadata (used by ecommerce frontend)
exports.app.use('/api/public/faqs', publicFAQs_1.default); // Public FAQs (used by ecommerce frontend)
exports.app.use('/api/public/about-sections', publicAboutSections_1.default); // Public About Sections (used by ecommerce frontend)
exports.app.use('/api/health', health_1.default); // Health check
// Ensure upload and temp dirs on boot and serve uploads
(async () => {
    try {
        // Use absolute path from project root (not relative to dist/)
        // __dirname in compiled code: /var/www/Spa/Ecommerce/backend/dist
        // Go up to project root: /var/www/Spa
        const projectRoot = path_1.default.resolve(__dirname, '../../../');
        const cmsUploadDir = path_1.default.join(projectRoot, 'CMS/backend/storage/uploads');
        const ecommerceUploadDir = process.env.UPLOAD_PATH || path_1.default.resolve(__dirname, '../storage/uploads');
        const tempDir = path_1.default.resolve(__dirname, '../storage/temp');
        // Ensure temp directory exists
        await promises_1.default.mkdir(tempDir, { recursive: true });
        // Check if CMS storage exists and is accessible
        let uploadDir = cmsUploadDir;
        try {
            const stats = await promises_1.default.stat(cmsUploadDir);
            if (stats.isDirectory()) {
                uploadDir = cmsUploadDir;
                console.log('[Ecommerce Backend] Serving uploads from CMS storage:', uploadDir);
            }
        }
        catch (e) {
            // CMS storage not available, try to use ecommerce storage
            try {
                await promises_1.default.mkdir(ecommerceUploadDir, { recursive: true });
                uploadDir = ecommerceUploadDir;
                console.log('[Ecommerce Backend] Serving uploads from ecommerce storage:', uploadDir);
            }
            catch (mkdirError) {
                console.warn('[Ecommerce Backend] Failed to create ecommerce upload dir:', mkdirError);
            }
        }
        // Serve uploads - CMS storage first (shared), then fallbacks
        // Add CORS headers for static files (images) - allow all origins for images
        const staticOptions = {
            setHeaders: (res, filePath) => {
                // Allow all origins for images (no CORS restrictions for static assets)
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
            }
        };
        // ✅ Image Proxy: Proxy images from CMS backend (or S3) if not found locally
        // This allows using CMS backend images or S3 in the future via IMAGE_SOURCE_URL env
        const imageSourceUrl = process.env.IMAGE_SOURCE_URL; // e.g., http://localhost:3011 or https://s3.amazonaws.com/bucket
        if (imageSourceUrl) {
            // ✅ Image proxy route - MUST be defined BEFORE static middleware
            // This route will try local file first, then proxy from IMAGE_SOURCE_URL
            exports.app.get('/uploads/*', async (req, res) => {
                const imagePath = req.path.replace('/uploads', '');
                try {
                    // ✅ Step 1: Try to serve from local storage first (if exists)
                    const localPath = path_1.default.join(uploadDir, imagePath);
                    try {
                        const stats = await promises_1.default.stat(localPath);
                        if (stats.isFile()) {
                            console.log(`[Image Proxy] Serving local file: ${imagePath}`);
                            return res.sendFile(localPath, {
                                headers: {
                                    'Cache-Control': 'public, max-age=31536000',
                                    'Access-Control-Allow-Origin': '*',
                                }
                            });
                        }
                    }
                    catch (localError) {
                        // Local file not found, continue to proxy
                        console.log(`[Image Proxy] Local file not found, proxying: ${imagePath}`);
                    }
                    // ✅ Step 2: If not found locally, proxy from IMAGE_SOURCE_URL (CMS backend or S3)
                    const sourceImageUrl = `${imageSourceUrl.replace(/\/$/, '')}/uploads${imagePath}`;
                    console.log(`[Image Proxy] Proxying from: ${sourceImageUrl}`);
                    try {
                        const response = await axios_1.default.get(sourceImageUrl, {
                            responseType: 'stream',
                            timeout: 15000, // Increased timeout
                            validateStatus: (status) => status === 200,
                        });
                        // Set headers
                        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
                        res.setHeader('Cache-Control', 'public, max-age=31536000');
                        res.setHeader('Access-Control-Allow-Origin', '*');
                        // Stream image from source to client
                        response.data.pipe(res);
                        console.log(`[Image Proxy] Successfully proxied: ${imagePath}`);
                    }
                    catch (proxyError) {
                        console.error(`[Image Proxy] Failed to proxy image: ${imagePath}`, {
                            message: proxyError.message,
                            code: proxyError.code,
                            url: sourceImageUrl,
                        });
                        res.status(404).json({
                            error: 'Image not found',
                            path: imagePath,
                            source: sourceImageUrl,
                        });
                    }
                }
                catch (error) {
                    console.error(`[Image Proxy] Error processing request: ${imagePath}`, {
                        message: error.message,
                        stack: error.stack,
                    });
                    res.status(500).json({
                        error: 'Internal server error',
                        path: imagePath,
                    });
                }
            });
            console.log(`[Ecommerce Backend] ✅ Image proxy enabled - source: ${imageSourceUrl}`);
        }
        else {
            console.warn('[Ecommerce Backend] ⚠️ IMAGE_SOURCE_URL not set - image proxy disabled');
        }
        // Static file serving (fallback for local files)
        exports.app.use('/uploads', express_1.default.static(uploadDir, staticOptions));
        exports.app.use('/uploads', express_1.default.static(path_1.default.resolve(__dirname, '../uploads'), staticOptions));
    }
    catch (e) {
        console.warn('Failed to ensure upload/temp dirs:', e);
    }
})();
async function ready() {
    await database_1.default.authenticate();
    console.log('Ecommerce Backend: Database connected');
}
//# sourceMappingURL=app.js.map