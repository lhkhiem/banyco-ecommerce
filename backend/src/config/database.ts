// Cấu hình kết nối PostgreSQL qua Sequelize
// - Đọc thông tin kết nối từ env vars
// - SECURITY: DB_PASSWORD is required in production
// - Logging SQL chỉ trong môi trường development

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env.local or .env
const backendRoot = path.resolve(__dirname, '../..');
const envLocalPath = path.join(backendRoot, '.env.local');
const envPath = path.join(backendRoot, '.env');

if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// SECURITY: Validate DB_PASSWORD in production
if (process.env.NODE_ENV === 'production' && !process.env.DB_PASSWORD) {
  throw new Error(
    'DB_PASSWORD environment variable is required in production. ' +
    'Please set a strong database password in your .env.local file.'
  );
}

const sequelize = new Sequelize({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'spa_cms_user',
  password: process.env.DB_PASSWORD || 'spa_cms_password', // Fallback only for development
  database: process.env.DB_NAME || 'spa_cms_db',
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

export default sequelize;

