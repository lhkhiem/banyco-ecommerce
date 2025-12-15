import { Request, Response } from 'express';
export declare const submitConsultation: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getConsultations: (req: any, res: Response) => Promise<void>;
export declare const getConsultationById: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateConsultation: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteConsultation: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getConsultationStats: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=consultationController.d.ts.map