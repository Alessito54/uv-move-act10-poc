import { VehiculoServicePort } from "../../shared/ports/VehiculoServicePort";
import { Reservacion } from "../domain/Reservacion";
export declare class ReservacionService {
    private vehiculoService;
    constructor(vehiculoService: VehiculoServicePort);
    crearReservacion(vehiculoId: string, usuarioId: string, inicioStr: string, finStr: string): Promise<Reservacion>;
    obtenerReservacionPorCodigo(codigo: string): Promise<any>;
}
//# sourceMappingURL=ReservacionService.d.ts.map