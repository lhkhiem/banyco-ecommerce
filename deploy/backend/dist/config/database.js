"use strict";
// Cấu hình kết nối PostgreSQL qua Sequelize
// - Đọc thông tin kết nối từ env vars
// - SECURITY: DB_PASSWORD is required in production
// - Logging SQL chỉ trong môi trường development
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Load .env.local or .env
const backendRoot = path_1.default.resolve(__dirname, '../..');
const envLocalPath = path_1.default.join(backendRoot, '.env.local');
const envPath = path_1.default.join(backendRoot, '.env');
if (fs_1.default.existsSync(envLocalPath)) {
    dotenv_1.default.config({ path: envLocalPath });
}
else if (fs_1.default.existsSync(envPath)) {
    dotenv_1.default.config({ path: envPath });
}
else {
    dotenv_1.default.config();
}
// SECURITY: Validate DB_PASSWORD in production
if (process.env.NODE_ENV === 'production' && !process.env.DB_PASSWORD) {
    throw new Error('DB_PASSWORD environment variable is required in production. ' +
        'Please set a strong database password in your .env.local file.');
}
const sequelize = new sequelize_1.Sequelize({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'spa_cms_user',
    password: process.env.DB_PASSWORD || 'spa_cms_password', // Fallback only for development
    database: process.env.DB_NAME || 'spa_cms_db',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
});
exports.default = sequelize;
//# sourceMappingURL=database.js.map