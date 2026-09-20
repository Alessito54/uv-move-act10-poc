import { Request, Response } from 'express';
import { ReservacionService } from '../../reservaciones/application/ReservacionService';
import { VehiculoService } from '../../vehiculos/application/VehiculoService';

export class ReservacionController {
    private reservacionService: ReservacionService;

    constructor() {
        const vehiculoService = new VehiculoService();
        this.reservacionService = new ReservacionService(vehiculoService);
    }

    crearReservacion = async (req: Request, res: Response) => {
        try {
            const { vehiculoId, inicio, fin } = req.body;
            const usuarioId = (req as any).user?.id || 'TEST_USER_ID'; // Fallback for local testing if auth is mocked
            
            if (!vehiculoId || !inicio || !fin) {
                return res.status(400).json({ error: 'Faltan datos obligatorios (vehiculoId, inicio, fin)' });
            }

            const reservacion = await this.reservacionService.crearReservacion(vehiculoId, usuarioId, inicio, fin);
            return res.status(201).json(reservacion);
        } catch (error: any) {
            console.error("Error crearReservacion:", error);
            // Si el error tiene status, lo usamos (ej: 409 para traslapes o 400 para reglas de negocio)
            const status = error.status || 500;
            return res.status(status).json({ error: error.message || 'Error interno del servidor' });
        }
    };

    obtenerReservacion = async (req: Request, res: Response) => {
        try {
            const codigo = req.params.codigo as string;
            const reservacion = await this.reservacionService.obtenerReservacionPorCodigo(codigo);
            if (!reservacion) {
                return res.status(404).json({ error: 'Reservación no encontrada' });
            }
            return res.status(200).json(reservacion);
        } catch (error: any) {
            console.error("Error obtenerReservacion:", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}
