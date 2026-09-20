import { EstadoVehiculo } from "../../vehiculos/domain/Vehiculo";
import { PoliticaVehiculoDTO } from "../../vehiculos/domain/PoliticaVehiculoDTO";

export interface VehiculoServicePort {
    consultarDisponibilidad(
        vehiculoId: string,
        inicio: Date,
        fin: Date
    ): Promise<boolean>;

    obtenerPoliticaAplicable(
        tipoVehiculoId: string
    ): Promise<PoliticaVehiculoDTO>;

    obtenerVehiculo(
        vehiculoId: string
    ): Promise<any>;

    cambiarEstado(
        vehiculoId: string,
        nuevoEstado: EstadoVehiculo
    ): Promise<void>;
}
