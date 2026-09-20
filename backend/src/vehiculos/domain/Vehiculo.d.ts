export declare enum EstadoVehiculo {
    DISPONIBLE = "DISPONIBLE",
    EN_USO = "EN_USO",
    MANTENIMIENTO = "MANTENIMIENTO"
}
export interface Vehiculo {
    id: string;
    codigo: string;
    tipoId: string;
    estado: EstadoVehiculo;
}
export interface TipoVehiculo {
    id: string;
    nombre: string;
    descripcion: string;
}
//# sourceMappingURL=Vehiculo.d.ts.map