/**
 * JWT Secret validation utility
 * Ensures JWT_SECRET is set and not using default weak value
 */
/**
 * Get and validate JWT_SECRET from environment
 * Throws error if JWT_SECRET is missing or using default weak value
 */
export declare function getJWTSecret(): string;
/**
 * Get and validate JWT_REFRESH_SECRET from environment
 * Throws error if JWT_REFRESH_SECRET is missing or using default weak value
 */
export declare function getJWTRefreshSecret(): string;
//# sourceMappingURL=jwtSecret.d.ts.map