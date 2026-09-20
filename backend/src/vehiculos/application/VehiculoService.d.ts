import { VehiculoServicePort } from "../../shared/ports/VehiculoServicePort";
import { EstadoVehiculo } from "../domain/Vehiculo";
import { PoliticaVehiculoDTO } from "../domain/PoliticaVehiculoDTO";
export declare class VehiculoService implements VehiculoServicePort {
    consultarDisponibilidad(vehiculoId: string, inicio: Date, fin: Date): Promise<boolean>;
    obtenerPoliticaAplicable(tipoVehiculoId: string): Promise<PoliticaVehiculoDTO>;
    cambiarEstado(vehiculoId: string, nuevoEstado: EstadoVehiculo): Promise<void>;
    listarVehiculos(): Promise<any[]>;
    obtenerVehiculoPorId(vehiculoId: string): Promise<any>;
}
//# sourceMappingURL=VehiculoService.d.ts.map