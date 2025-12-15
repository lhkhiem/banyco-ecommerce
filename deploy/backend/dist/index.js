"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Server entry: use app + ready()
// IMPORTANT: Disable dev logs in production - must be first import
require("./utils/disableDevLogs");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const app_1 = require("./app");
// Load environment variables with priority:
// 1. .env.local (highest priority - for actual values)
// 2. .env.production (if NODE_ENV=production and .env.local doesn't exist)
// 3. .env (fallback)
// 4. System environment variables
const backendRoot = path_1.default.resolve(__dirname, '../..');
const envLocalPath = path_1.default.join(backendRoot, '.env.local');
const envProductionPath = path_1.default.join(backendRoot, '.env.production');
const envPath = path_1.default.join(backendRoot, '.env');
if (fs_1.default.existsSync(envLocalPath)) {
    // ✅ Priority 1: .env.local (for actual dev/prod values)
    dotenv_1.default.config({ path: envLocalPath });
    console.log('[Env] Loaded .env.local');
}
else if (process.env.NODE_ENV === 'production' && fs_1.default.existsSync(envProductionPath)) {
    // Priority 2: .env.production (production template)
    dotenv_1.default.config({ path: envProductionPath });
    console.log('[Env] Loaded .env.production');
}
else if (fs_1.default.existsSync(envPath)) {
    // Priority 3: .env (fallback)
    dotenv_1.default.config({ path: envPath });
    console.log('[Env] Loaded .env');
}
else {
    // Priority 4: System environment variables
    dotenv_1.default.config();
    console.log('[Env] Loaded from system environment');
}
const PORT = process.env.PORT || 3012;
const startServer = async () => {
    try {
        await (0, app_1.ready)();
        console.log('App is ready');
        app_1.app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map