"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const faqController_1 = require("../controllers/public/faqController");
const router = (0, express_1.Router)();
// GET /api/public/faqs
router.get('/', faqController_1.getFAQs);
exports.default = router;
//# sourceMappingURL=publicFAQs.js.map