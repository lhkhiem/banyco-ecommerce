"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFAQs = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
/**
 * Public FAQ Controller
 *
 * Fetches FAQs directly from database (no CMS backend dependency)
 * Based on CMS backend implementation - ensures data integrity and complete separation
 */
const getFAQs = async (req, res) => {
    try {
        const { active_only } = req.query;
        const categoriesWhere = active_only === 'true' ? 'WHERE c.is_active = TRUE' : '';
        const questionsWhere = active_only === 'true' ? 'AND q.is_active = TRUE' : '';
        const query = `
      SELECT 
        c.id as category_id,
        c.name as category_name,
        c.slug as category_slug,
        c.sort_order as category_sort_order,
        q.id as question_id,
        q.question,
        q.answer,
        q.sort_order as question_sort_order
      FROM faq_categories c
      LEFT JOIN faq_questions q ON c.id = q.category_id ${questionsWhere}
      ${categoriesWhere}
      ORDER BY c.sort_order ASC, c.created_at ASC, q.sort_order ASC, q.created_at ASC
    `;
        const results = await database_1.default.query(query, {
            type: sequelize_1.QueryTypes.SELECT,
        });
        // Group by category
        const categoriesMap = new Map();
        results.forEach((row) => {
            if (!categoriesMap.has(row.category_id)) {
                categoriesMap.set(row.category_id, {
                    id: row.category_id,
                    name: row.category_name,
                    slug: row.category_slug,
                    sort_order: row.category_sort_order,
                    questions: [],
                });
            }
            if (row.question_id) {
                categoriesMap.get(row.category_id).questions.push({
                    id: row.question_id,
                    question: row.question,
                    answer: row.answer,
                    sort_order: row.question_sort_order,
                });
            }
        });
        const categories = Array.from(categoriesMap.values());
        res.json({ success: true, data: categories });
    }
    catch (error) {
        console.error('[getFAQs] Failed to fetch FAQs:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch FAQs' });
    }
};
exports.getFAQs = getFAQs;
//# sourceMappingURL=faqController.js.map