"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Only public route for ecommerce backend - admin routes are in CMS backend
const analyticsController_1 = require("../controllers/analyticsController");
const router = (0, express_1.Router)();
// Public endpoint - Track pageview
router.post('/track', analyticsController_1.trackPageview);
// Note: Admin routes (GET /stats, GET /realtime) are handled by CMS backend
// Ecommerce backend only handles public tracking
exports.default = router;
//# sourceMappingURL=analytics.js.map