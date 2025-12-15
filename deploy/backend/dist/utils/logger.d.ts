/**
 * Logger utility for production-safe logging
 * Only logs in development mode, except for errors and warnings
 */
export declare const logger: {
    /**
     * Debug logs - only in development
     */
    debug: (...args: any[]) => void;
    /**
     * Info logs - only in development
     */
    info: (...args: any[]) => void;
    /**
     * Warning logs - always logged
     */
    warn: (...args: any[]) => void;
    /**
     * Error logs - always logged
     */
    error: (...args: any[]) => void;
    /**
     * Log - only in development (alias for info)
     */
    log: (...args: any[]) => void;
};
//# sourceMappingURL=logger.d.ts.map