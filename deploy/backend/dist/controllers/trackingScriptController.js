"use strict";
// Tracking Script Controller
// Ecommerce Backend - Only public endpoint (getActiveScripts)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveScripts = void 0;
const database_1 = __importDefault(require("../config/database"));
const sequelize_1 = require("sequelize");
// Get active scripts for frontend (public endpoint)
const getActiveScripts = async (req, res) => {
    try {
        const { page = 'all' } = req.query;
        // Build query to check if page matches
        const query = `
      SELECT id, name, type, provider, position, script_code, load_strategy, priority
      FROM tracking_scripts
      WHERE is_active = TRUE
        AND (
          pages @> '["all"]'::jsonb 
          OR pages @> :page::jsonb
        )
      ORDER BY priority ASC, created_at ASC
    `;
        const result = await database_1.default.query(query, {
            replacements: { page: JSON.stringify([page]) },
            type: sequelize_1.QueryTypes.SELECT,
        });
        res.json({ success: true, data: result });
    }
    catch (error) {
        console.error('Failed to fetch active tracking scripts:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch active tracking scripts' });
    }
};
exports.getActiveScripts = getActiveScripts;
// Note: Admin CRUD functions (getTrackingScripts, createTrackingScript, etc.) 
// are not available in Ecommerce Backend - these are CMS Backend only
//# sourceMappingURL=trackingScriptController.js.map