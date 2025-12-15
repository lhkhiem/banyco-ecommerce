"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyReCaptchaToken = verifyReCaptchaToken;
const axios_1 = __importDefault(require("axios"));
/**
 * Verify reCAPTCHA v3 token with Google
 */
async function verifyReCaptchaToken(token, secretKey) {
    if (!token || !secretKey) {
        return { success: false, error: 'Missing token or secret key' };
    }
    try {
        const response = await axios_1.default.post('https://www.google.com/recaptcha/api/siteverify', new URLSearchParams({
            secret: secretKey,
            response: token,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            timeout: 5000,
        });
        const { success, score, 'error-codes': errorCodes } = response.data;
        if (!success) {
            const errors = errorCodes || ['unknown-error'];
            return {
                success: false,
                error: errors.join(', '),
            };
        }
        // reCAPTCHA v3 returns a score from 0.0 to 1.0
        // 1.0 = very likely a human
        // 0.0 = very likely a bot
        // Typically, scores above 0.5 are considered legitimate
        return {
            success: true,
            score: score || 0,
        };
    }
    catch (error) {
        console.error('[ReCaptcha] Verification error:', error);
        return {
            success: false,
            error: error.message || 'Failed to verify reCAPTCHA token',
        };
    }
}
//# sourceMappingURL=recaptcha.js.map