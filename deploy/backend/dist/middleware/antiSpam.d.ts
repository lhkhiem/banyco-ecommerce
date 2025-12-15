import { Request, Response, NextFunction } from 'express';
/**
 * Anti-spam middleware for form submissions
 * Implements:
 * 1. Honeypot field check
 * 2. Time-based validation (minimum time to fill form)
 * 3. Rate limiting by IP
 * 4. Google reCAPTCHA v3 verification (optional)
 */
export declare const antiSpamMiddleware: (options?: {
    minFormTime?: number;
    maxSubmissionsPerHour?: number;
    honeypotFieldName?: string;
    recaptchaSecretKey?: string;
    recaptchaMinScore?: number;
    requireRecaptcha?: boolean;
}) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=antiSpam.d.ts.map