"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Admin routes removed - Ecommerce Backend only provides public GET endpoints
// import { authMiddleware } from '../middleware/auth';
const menuLocationController_1 = require("../controllers/menuLocationController");
const router = (0, express_1.Router)();
// Public GET routes only
router.get('/', menuLocationController_1.getMenuLocations);
router.get('/:id', menuLocationController_1.getMenuLocationById);
// Admin CRUD routes - COMMENTED (CMS Backend only)
// router.post('/', authMiddleware, createMenuLocation);
// router.put('/:id', authMiddleware, updateMenuLocation);
// router.patch('/:id', authMiddleware, updateMenuLocation);
// router.delete('/:id', authMiddleware, deleteMenuLocation);
exports.default = router;
//# sourceMappingURL=menuLocations.js.map