"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Only public route for ecommerce backend - admin routes are in CMS backend
const consultationController_1 = require("../controllers/consultationController");
const antiSpam_1 = require("../middleware/antiSpam");
const router = (0, express_1.Router)();
// Public route - submit consultation form with anti-spam protection
router.post('/', (0, antiSpam_1.antiSpamMiddleware)({
    minFormTime: 3, // Minimum 3 seconds to fill form
    maxSubmissionsPerHour: 5, // Max 5 submissions per hour per IP
    honeypotFieldName: 'website',
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    recaptchaMinScore: 0.5, // Minimum score (0.0-1.0)
    requireRecaptcha: !!process.env.RECAPTCHA_SECRET_KEY, // Require if secret key is set
}), consultationController_1.submitConsultation);
// Note: Admin routes (GET, PUT, DELETE) are handled by CMS backend
// Ecommerce backend only handles public form submissions
exports.default = router;
//# sourceMappingURL=consultations.js.map