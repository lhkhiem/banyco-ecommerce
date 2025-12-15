"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Ecommerce Backend - Public read only
const express_1 = require("express");
const brandController_1 = require("../controllers/brandController");
const router = (0, express_1.Router)();
// Public GET routes only
router.get('/', brandController_1.getBrands);
router.get('/slug/:slug', brandController_1.getBrandBySlug);
// Admin CRUD routes - COMMENTED (CMS Backend only)
// router.get('/:id', getBrandById);
// router.post('/', authMiddleware, createBrand);
// router.put('/:id', authMiddleware, updateBrand);
// router.delete('/:id', authMiddleware, deleteBrand);
exports.default = router;
//# sourceMappingURL=brands.js.map