"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneralSettings = exports.getAppearanceSettings = void 0;
const database_1 = __importDefault(require("../../config/database"));
const sequelize_1 = require("sequelize");
const domainUtils_1 = require("../../utils/domainUtils");
const getAppearanceSettings = async (_req, res) => {
    try {
        const result = await database_1.default.query('SELECT value FROM settings WHERE namespace = :ns', {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { ns: 'appearance' },
        });
        const row = result[0];
        const rawValue = row?.value || {};
        // Prefer ecommerce-specific branding; fallback to general logo/fav if not set
        const logoUrl = rawValue.ecommerce_logo_url ||
            rawValue.logo_url ||
            null;
        const faviconUrl = rawValue.ecommerce_favicon_url ||
            rawValue.favicon_url ||
            null;
        const responsePayload = {
            logo_asset_id: rawValue.ecommerce_logo_asset_id || rawValue.logo_asset_id || null,
            favicon_asset_id: rawValue.ecommerce_favicon_asset_id || rawValue.favicon_asset_id || null,
            logo_url: logoUrl,
            favicon_url: faviconUrl,
            topBannerText: rawValue.topBannerText || null,
            // Normalized URLs for direct use on the storefront
            logoUrl: (0, domainUtils_1.normalizeMediaUrl)(logoUrl),
            faviconUrl: (0, domainUtils_1.normalizeMediaUrl)(faviconUrl),
        };
        return res.json({
            success: true,
            data: responsePayload,
        });
    }
    catch (error) {
        console.error('[PublicSettings] Failed to load appearance settings:', {
            message: error?.message,
            stack: error?.stack,
            code: error?.code,
        });
        return res.status(500).json({
            success: false,
            error: 'Failed to load appearance settings',
        });
    }
};
exports.getAppearanceSettings = getAppearanceSettings;
const getGeneralSettings = async (_req, res) => {
    try {
        const result = await database_1.default.query('SELECT value FROM settings WHERE namespace = :ns', {
            type: sequelize_1.QueryTypes.SELECT,
            replacements: { ns: 'general' },
        });
        const row = result[0];
        const rawValue = row?.value || {};
        // Only expose business info and working hours for public use
        const responsePayload = {
            businessInfo: rawValue.businessInfo || {},
            workingHours: rawValue.workingHours || {},
        };
        return res.json({
            success: true,
            data: responsePayload,
        });
    }
    catch (error) {
        console.error('[PublicSettings] Failed to load general settings:', {
            message: error?.message,
            stack: error?.stack,
            code: error?.code,
        });
        return res.status(500).json({
            success: false,
            error: 'Failed to load general settings',
        });
    }
};
exports.getGeneralSettings = getGeneralSettings;
//# sourceMappingURL=settingsController.js.map