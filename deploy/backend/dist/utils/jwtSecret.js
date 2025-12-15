"use strict";
/**
 * JWT Secret validation utility
 * Ensures JWT_SECRET is set and not using default weak value
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJWTSecret = getJWTSecret;
exports.getJWTRefreshSecret = getJWTRefreshSecret;
// Load environment variables
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
/**
 * Get and validate JWT_SECRET from environment
 * Throws error if JWT_SECRET is missing or using default weak value
 */
function getJWTSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET environment variable is required. ' +
            'Please set a strong JWT_SECRET (at least 32 characters) in your .env.local file.');
    }
    if (secret === 'secret' || secret.length < 32) {
        throw new Error('JWT_SECRET must be a strong secret (at least 32 characters). ' +
            'Using default or weak secret is a security risk. ' +
            'Generate a new secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    }
    return secret;
}
/**
 * Get and validate JWT_REFRESH_SECRET from environment
 * Throws error if JWT_REFRESH_SECRET is missing or using default weak value
 */
function getJWTRefreshSecret() {
    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET environment variable is required. ' +
            'Please set a strong JWT_REFRESH_SECRET (at least 32 characters) in your .env.local file.');
    }
    if (secret === 'refresh-secret' || secret.length < 32) {
        throw new Error('JWT_REFRESH_SECRET must be a strong secret (at least 32 characters). ' +
            'Using default or weak secret is a security risk. ' +
            'Generate a new secret: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
    }
    return secret;
}
//# sourceMappingURL=jwtSecret.js.map