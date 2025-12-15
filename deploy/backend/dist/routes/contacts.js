"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// Only public route for ecommerce backend - admin routes are in CMS backend
const contactController_1 = require("../controllers/contactController");
const router = (0, express_1.Router)();
// Public route - submit contact form
router.post('/', contactController_1.submitContact);
// Note: Admin routes (GET, PUT, DELETE, stats) are handled by CMS backend
// Ecommerce backend only handles public form submissions
exports.default = router;
//# sourceMappingURL=contacts.js.map