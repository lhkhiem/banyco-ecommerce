"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pageMetadataController_1 = require("../controllers/public/pageMetadataController");
const router = (0, express_1.Router)();
// Public route - no auth required
router.get('/:path(*)', pageMetadataController_1.getPageMetadata);
exports.default = router;
//# sourceMappingURL=publicPageMetadata.js.map