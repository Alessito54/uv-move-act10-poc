import { EstadoVehiculo } from "../../vehiculos/domain/Vehiculo";
import { PoliticaVehiculoDTO } from "../../vehiculos/domain/PoliticaVehiculoDTO";
import { VehiculoDTO } from "../../vehiculos/domain/VehiculoDTO";

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
    ): Promise<VehiculoDTO | null>;

    cambiarEstado(
        vehiculoId: string,
        nuevoEstado: EstadoVehiculo
    ): Promise<void>;
}
