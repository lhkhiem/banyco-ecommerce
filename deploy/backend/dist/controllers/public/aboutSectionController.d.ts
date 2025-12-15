import { Request, Response } from 'express';
/**
 * Public About Section Controller
 *
 * Fetches About sections directly from database (no CMS backend dependency)
 * Based on CMS backend implementation - ensures data integrity and complete separation
 * Normalizes image URLs to use ecommerce-api.banyco.vn domain.
 */
export declare const getAboutSections: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=aboutSectionController.d.ts.map