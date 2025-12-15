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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const newsletterController = __importStar(require("../controllers/newsletterController"));
const auth_1 = require("../middleware/auth");
const antiSpam_1 = require("../middleware/antiSpam");
const router = (0, express_1.Router)();
// Public routes with anti-spam protection
router.post('/subscribe', (0, antiSpam_1.antiSpamMiddleware)({
    minFormTime: 2, // Minimum 2 seconds for newsletter (shorter form)
    maxSubmissionsPerHour: 10, // Max 10 subscriptions per hour per IP
    honeypotFieldName: 'website',
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    recaptchaMinScore: 0.5, // Minimum score (0.0-1.0)
    requireRecaptcha: !!process.env.RECAPTCHA_SECRET_KEY, // Require if secret key is set
}), newsletterController.subscribe);
router.post('/unsubscribe', newsletterController.unsubscribe);
// Admin routes (require authentication)
router.get('/subscribers', auth_1.authMiddleware, newsletterController.getSubscribers);
router.get('/statistics', auth_1.authMiddleware, newsletterController.getStatistics);
router.delete('/subscribers/:id', auth_1.authMiddleware, newsletterController.deleteSubscriber);
exports.default = router;
//# sourceMappingURL=newsletter.js.map