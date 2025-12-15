"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripHtmlAndDecode = stripHtmlAndDecode;
exports.normalizeSlug = normalizeSlug;
function stripHtmlAndDecode(text) {
    if (!text)
        return '';
    let cleaned = text.replace(/<[^>]*>/g, '');
    cleaned = cleaned.replace(/&#(\d+);/g, (match, dec) => {
        try {
            return String.fromCharCode(parseInt(dec, 10));
        }
        catch {
            return match;
        }
    });
    cleaned = cleaned.replace(/&#x([0-9A-Fa-f]+);/gi, (match, hex) => {
        try {
            return String.fromCharCode(parseInt(hex, 16));
        }
        catch {
            return match;
        }
    });
    const entities = {
        '&nbsp;': ' ',
        '&amp;': '&',
        '&lt;': '<',
        '&gt;': '>',
        '&quot;': '"',
        '&#39': "'",
    };
    for (const [entity, char] of Object.entries(entities)) {
        cleaned = cleaned.replace(new RegExp(entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), char);
    }
    cleaned = cleaned.replace(/\s+/g, ' ').trim();
    return cleaned;
}
function normalizeSlug(slug) {
    if (!slug)
        return '';
    try {
        slug = decodeURIComponent(slug);
    }
    catch {
        // ignore
    }
    return slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}
//# sourceMappingURL=metadataHelpers.js.map