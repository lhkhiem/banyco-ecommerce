"use strict";
// Ecommerce Backend Models
// Only models needed for Ecommerce operations (public APIs)
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutSection = exports.FAQQuestion = exports.FAQCategory = exports.PageMetadata = exports.ContactMessage = exports.ConsultationSubmission = exports.NewsletterSubscription = exports.Address = exports.User = void 0;
const User_1 = __importDefault(require("./User"));
exports.User = User_1.default;
const Address_1 = __importDefault(require("./Address"));
exports.Address = Address_1.default;
const NewsletterSubscription_1 = __importDefault(require("./NewsletterSubscription"));
exports.NewsletterSubscription = NewsletterSubscription_1.default;
// CMS-only models - COMMENTED (not used in Ecommerce Backend)
// import Post from './Post';
// import Topic from './Topic';
// import Tag from './Tag';
// import Asset from './Asset';
// import AssetFolder from './AssetFolder';
// import MediaFolder from './MediaFolder';
// import MenuLocation from './MenuLocation';
// import MenuItem from './MenuItem';
// import EducationResource from './EducationResource';
// import Testimonial from './Testimonial';
// import ValueProp from './ValueProp';
const ContactMessage_1 = __importDefault(require("./ContactMessage"));
exports.ContactMessage = ContactMessage_1.default;
const ConsultationSubmission_1 = __importDefault(require("./ConsultationSubmission"));
exports.ConsultationSubmission = ConsultationSubmission_1.default;
const PageMetadata_1 = __importDefault(require("./PageMetadata"));
exports.PageMetadata = PageMetadata_1.default;
const FAQCategory_1 = require("./FAQCategory");
Object.defineProperty(exports, "FAQCategory", { enumerable: true, get: function () { return FAQCategory_1.FAQCategory; } });
const FAQQuestion_1 = require("./FAQQuestion");
Object.defineProperty(exports, "FAQQuestion", { enumerable: true, get: function () { return FAQQuestion_1.FAQQuestion; } });
const AboutSection_1 = __importDefault(require("./AboutSection"));
exports.AboutSection = AboutSection_1.default;
// import PageMetadata from './PageMetadata';
// import Slider from './Slider';
// import TrackingScript from './TrackingScript';
// import Analytics from './Analytics';
// import ActivityLog from './ActivityLog';
// import CartItem from './CartItem';
// import WishlistItem from './WishlistItem';
// import ProductReview from './ProductReview';
// Define associations (only for Ecommerce models)
// Note: Order and OrderItem are interfaces, not Sequelize models
// Associations are not needed as we use raw SQL queries
// Order.hasMany(OrderItem, {
//   foreignKey: 'order_id',
//   as: 'items',
// });
// OrderItem.belongsTo(Order, {
//   foreignKey: 'order_id',
//   as: 'order',
// });
Address_1.default.belongsTo(User_1.default, {
    foreignKey: 'user_id',
    as: 'user',
});
User_1.default.hasMany(Address_1.default, {
    foreignKey: 'user_id',
    as: 'addresses',
});
//# sourceMappingURL=index.js.map