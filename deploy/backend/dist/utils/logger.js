"use strict";
/**
 * Logger utility for production-safe logging
 * Only logs in development mode, except for errors and warnings
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const isDevelopment = process.env.NODE_ENV === 'development';
exports.logger = {
    /**
     * Debug logs - only in development
     */
    debug: (...args) => {
        if (isDevelopment) {
            console.log('[DEBUG]', ...args);
        }
    },
    /**
     * Info logs - only in development
     */
    info: (...args) => {
        if (isDevelopment) {
            console.log('[INFO]', ...args);
        }
    },
    /**
     * Warning logs - always logged
     */
    warn: (...args) => {
        console.warn('[WARN]', ...args);
    },
    /**
     * Error logs - always logged
     */
    error: (...args) => {
        console.error('[ERROR]', ...args);
    },
    /**
     * Log - only in development (alias for info)
     */
    log: (...args) => {
        if (isDevelopment) {
            console.log(...args);
        }
    },
};
//# sourceMappingURL=logger.js.map