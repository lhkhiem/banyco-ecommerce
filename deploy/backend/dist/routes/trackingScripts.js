"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Admin routes removed - Ecommerce Backend only provides public endpoint
// import { authMiddleware } from '../middleware/auth';
const trackingScriptController_1 = require("../controllers/trackingScriptController");
const router = (0, express_1.Router)();
// Public endpoint - Get active scripts for frontend
router.get('/active', trackingScriptController_1.getActiveScripts);
// Admin routes - COMMENTED (CMS Backend only)
// router.get('/', authMiddleware, getTrackingScripts);
// router.get('/:id', authMiddleware, getTrackingScriptById);
// router.post('/', authMiddleware, createTrackingScript);
// router.put('/:id', authMiddleware, updateTrackingScript);
// router.patch('/:id', authMiddleware, updateTrackingScript);
// router.delete('/:id', authMiddleware, deleteTrackingScript);
// router.patch('/:id/toggle', authMiddleware, toggleTrackingScript);
exports.default = router;
//# sourceMappingURL=trackingScripts.js.map