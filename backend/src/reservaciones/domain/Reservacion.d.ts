export declare enum EstadoReservacion {
    ACTIVA = "ACTIVA",
    COMPLETADA = "COMPLETADA",
    CANCELADA = "CANCELADA"
}
export interface Reservacion {
    id: string;
    codigoReserva: string;
    vehiculoId: string;
    usuarioId: string;
    inicio: Date;
    fin: Date;
    estado: EstadoReservacion;
    totalEstimado: number;
    fechaCreacion: Date;
}
//# sourceMappingURL=Reservacion.d.ts.map