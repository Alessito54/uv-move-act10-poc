import { Request, Response } from 'express';
export declare class VehiculoController {
    private vehiculoService;
    constructor();
    listarVehiculos: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
    obtenerVehiculo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=VehiculoController.d.ts.map