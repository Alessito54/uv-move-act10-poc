import { Request, Response } from 'express';
import { VehiculoService } from '../../vehiculos/application/VehiculoService';

export class VehiculoController {
    private vehiculoService: VehiculoService;

    constructor() {
        this.vehiculoService = new VehiculoService();
    }

    listarVehiculos = async (req: Request, res: Response) => {
        try {
            const vehiculos = await this.vehiculoService.listarVehiculos();
            return res.status(200).json(vehiculos);
        } catch (error: any) {
            console.error("Error listarVehiculos:", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };

    obtenerVehiculo = async (req: Request, res: Response) => {
        try {
            const id = req.params.id as string;
            const vehiculo = await this.vehiculoService.obtenerVehiculo(id);
            if (!vehiculo) {
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            }
            
            // Adjuntamos la política para que el frontend pueda mostrarla sin hacer otro llamado (optimización permitida)
            const politica = await this.vehiculoService.obtenerPoliticaAplicable(vehiculo.TIPOID);
            
            return res.status(200).json({ vehiculo, politica });
        } catch (error: any) {
            console.error("Error obtenerVehiculo:", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}
