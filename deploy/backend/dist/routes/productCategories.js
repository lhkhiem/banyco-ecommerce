"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Ecommerce Backend - Public read only
const express_1 = require("express");
const productCategoryController_1 = require("../controllers/productCategoryController");
const router = (0, express_1.Router)();
// Public GET routes only
router.get('/slug/:slug', productCategoryController_1.getCategoryBySlug);
router.get('/', productCategoryController_1.getCategories);
// Admin CRUD routes - COMMENTED (CMS Backend only)
// router.get('/:id/relationships', authMiddleware, checkCategoryRelationships);
// router.get('/:id', getCategoryById);
// router.post('/', authMiddleware, createCategory);
// router.put('/:id', authMiddleware, updateCategory);
// router.delete('/:id', authMiddleware, deleteCategory);
exports.default = router;
//# sourceMappingURL=productCategories.js.map