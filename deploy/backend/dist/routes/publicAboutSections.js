"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const aboutSectionController_1 = require("../controllers/public/aboutSectionController");
const router = express_1.default.Router();
// GET /api/public/about-sections
router.get('/', aboutSectionController_1.getAboutSections);
exports.default = router;
//# sourceMappingURL=publicAboutSections.js.map