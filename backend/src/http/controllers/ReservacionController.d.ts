import { Request, Response } from 'express';
export declare class ReservacionController {
    private reservacionService;
    constructor();
    crearReservacion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    obtenerReservacion: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=ReservacionController.d.ts.map