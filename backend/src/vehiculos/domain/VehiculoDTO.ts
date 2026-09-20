import { EstadoVehiculo } from "./Vehiculo";

export interface VehiculoDTO {
    id: string;
    codigo: string;
    estado: EstadoVehiculo;
    tipoId: string;
    tipoNombre?: string;
    tipoDescripcion?: string;
}
