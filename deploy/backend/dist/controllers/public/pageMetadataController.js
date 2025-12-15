"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageMetadata = void 0;
const PageMetadata_1 = __importDefault(require("../../models/PageMetadata"));
const metadataHelpers_1 = require("../../utils/metadataHelpers");
function normalizePathForComparison(pathToNormalize) {
    if (!pathToNormalize)
        return '/';
    // Remove trailing slash (except for root)
    let normalized = pathToNormalize.replace(/\/+$/, '') || '/';
    const pathParts = normalized.split('/');
    if (pathParts.length >= 3) {
        const prefix = pathParts.slice(0, -1).join('/');
        const slug = pathParts[pathParts.length - 1];
        const normalizedSlug = (0, metadataHelpers_1.normalizeSlug)(slug);
        normalized = `${prefix}/${normalizedSlug}`;
    }
    else if (pathParts.length === 2 && pathParts[1]) {
        const slug = pathParts[1];
        const normalizedSlug = (0, metadataHelpers_1.normalizeSlug)(slug);
        normalized = `/${normalizedSlug}`;
    }
    return normalized || '/';
}
// Public: GET /api/public/page-metadata/:path(*) - no auth
const getPageMetadata = async (req, res) => {
    try {
        let { path } = req.params;
        if (!path.startsWith('/')) {
            path = '/' + path;
        }
        if (path.includes('?')) {
            path = path.split('?')[0];
        }
        path = path.replace(/\/+$/, '') || '/';
        const normalizedRequestPath = normalizePathForComparison(path);
        const page = await PageMetadata_1.default.findOne({
            where: {
                path: normalizedRequestPath,
                enabled: true,
            },
        });
        if (!page && (path === '/' || path === '')) {
            const homePage = await PageMetadata_1.default.findOne({
                where: {
                    path: '/',
                    enabled: true,
                },
            });
            if (homePage) {
                return res.json({
                    title: homePage.title || 'Banyco',
                    description: homePage.description || '',
                    ogImage: homePage.og_image || '',
                    keywords: homePage.keywords || [],
                });
            }
            return res.json({
                title: 'Banyco',
                description: '',
                ogImage: '',
                keywords: [],
            });
        }
        if (page) {
            return res.json({
                title: page.title || '',
                description: page.description || '',
                ogImage: page.og_image || '',
                keywords: page.keywords || [],
            });
        }
        res.status(404).json({ error: 'Page metadata not found' });
    }
    catch (err) {
        console.error('[Ecommerce getPageMetadata] Error:', err);
        res.status(500).json({ error: 'Failed to load page metadata' });
    }
};
exports.getPageMetadata = getPageMetadata;
//# sourceMappingURL=pageMetadataController.js.map