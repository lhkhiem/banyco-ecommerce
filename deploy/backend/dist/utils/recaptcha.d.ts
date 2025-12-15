/**
 * Verify reCAPTCHA v3 token with Google
 */
export declare function verifyReCaptchaToken(token: string, secretKey: string): Promise<{
    success: boolean;
    score?: number;
    error?: string;
}>;
//# sourceMappingURL=recaptcha.d.ts.map