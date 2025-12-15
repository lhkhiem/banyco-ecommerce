"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settingsController_1 = require("../controllers/public/settingsController");
const router = (0, express_1.Router)();
// GET /api/public/settings/appearance
// Read-only settings for Ecommerce storefront (logo, favicon, etc.)
router.get('/appearance', settingsController_1.getAppearanceSettings);
// GET /api/public/settings/general
// Read-only general settings for Ecommerce storefront (business info, working hours, etc.)
router.get('/general', settingsController_1.getGeneralSettings);
exports.default = router;
//# sourceMappingURL=publicSettings.js.map