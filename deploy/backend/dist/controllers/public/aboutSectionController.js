"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAboutSections = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const domainUtils_1 = require("../../utils/domainUtils");
/**
 * Public About Section Controller
 *
 * Fetches About sections directly from database (no CMS backend dependency)
 * Based on CMS backend implementation - ensures data integrity and complete separation
 * Normalizes image URLs to use ecommerce-api.banyco.vn domain.
 */
const getAboutSections = async (req, res) => {
    try {
        const { active_only, section_key } = req.query;
        // Build WHERE clause
        const conditions = [];
        const replacements = {};
        if (active_only === 'true' || active_only === undefined) {
            conditions.push('is_active = TRUE');
        }
        if (section_key) {
            conditions.push('section_key = :section_key');
            replacements.section_key = section_key;
        }
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        const query = `
      SELECT 
        id,
        section_key,
        title,
        content,
        image_url,
        button_text,
        button_link,
        list_items,
        order_index,
        is_active,
        created_at,
        updated_at
      FROM about_sections
      ${whereClause}
      ORDER BY order_index ASC, created_at DESC
    `;
        const sections = await database_1.default.query(query, {
            replacements,
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Normalize image URLs in response data
        const normalizedSections = sections.map((section) => {
            if (section.image_url) {
                const normalizedUrl = (0, domainUtils_1.normalizeMediaUrl)(section.image_url);
                if (normalizedUrl) {
                    section.image_url = normalizedUrl;
                }
            }
            return section;
        });
        res.json({ success: true, data: normalizedSections });
    }
    catch (error) {
        console.error('[getAboutSections] Failed to fetch about sections:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch about sections',
        });
    }
};
exports.getAboutSections = getAboutSections;
//# sourceMappingURL=aboutSectionController.js.map