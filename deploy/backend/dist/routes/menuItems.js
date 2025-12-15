"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Admin routes removed - Ecommerce Backend only provides public GET endpoints
// import { authMiddleware } from '../middleware/auth';
const menuItemController_1 = require("../controllers/menuItemController");
const router = (0, express_1.Router)();
// Public GET routes only
router.get('/', menuItemController_1.getMenuItems);
router.get('/:id', menuItemController_1.getMenuItemById);
// Admin CRUD routes - COMMENTED (CMS Backend only)
// router.post('/', authMiddleware, createMenuItem);
// router.put('/:id', authMiddleware, updateMenuItem);
// router.patch('/:id', authMiddleware, updateMenuItem);
// router.delete('/:id', authMiddleware, deleteMenuItem);
// router.post('/bulk/update-order', authMiddleware, updateMenuItemsOrder);
exports.default = router;
//# sourceMappingURL=menuItems.js.map