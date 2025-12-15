import { Request, Response } from 'express';
export declare const submitContact: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getContacts: (req: any, res: Response) => Promise<void>;
export declare const getContactById: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateContact: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteContact: (req: any, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getContactStats: (req: any, res: Response) => Promise<void>;
//# sourceMappingURL=contactController.d.ts.map