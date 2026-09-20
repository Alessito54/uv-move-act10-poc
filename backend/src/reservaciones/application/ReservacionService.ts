import { v4 as uuidv4 } from 'uuid';
import { Db2Connection } from "../../infrastructure/db2/Db2Connection";
import { VehiculoServicePort } from "../../shared/ports/VehiculoServicePort";
import { EstadoReservacion, Reservacion } from "../domain/Reservacion";

export class ReservacionService {
    private vehiculoService: VehiculoServicePort;

    constructor(vehiculoService: VehiculoServicePort) {
        this.vehiculoService = vehiculoService;
    }

    async crearReservacion(
        vehiculoId: string, 
        usuarioId: string, 
        inicioStr: string, 
        finStr: string
    ): Promise<Reservacion> {
        const inicio = new Date(inicioStr);
        const fin = new Date(finStr);

        if (inicio >= fin) {
            throw new Error("La fecha de inicio debe ser anterior a la fecha de fin.");
        }

        // RN03 y RN04: Obtener política aplicable del vehículo usando el contrato
        const vehiculoInfo = await this.vehiculoService.obtenerVehiculo(vehiculoId);
        if (!vehiculoInfo) {
            const error: any = new Error("Vehículo no encontrado");
            error.status = 404;
            throw error;
        }

        const tipoVehiculoId = vehiculoInfo.tipoId;
        const politica = await this.vehiculoService.obtenerPoliticaAplicable(tipoVehiculoId);

        // Validar RN03: Tiempo máximo
        const duracionMinutos = (fin.getTime() - inicio.getTime()) / (1000 * 60);
        if (duracionMinutos > politica.tiempoMaxMin) {
            const error: any = new Error(`La reservación excede el tiempo máximo permitido de ${politica.tiempoMaxMin} minutos.`);
            error.status = 400;
            throw error;
        }

        // Calcular costo estimado basado en tarifa
        const horas = duracionMinutos / 60;
        const totalEstimado = horas * politica.tarifaHora;

        const idReservacion = uuidv4();
        const codigoReserva = `RES-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

        // Formatear fechas para Db2 TIMESTAMP: 'YYYY-MM-DD HH:MM:SS'
        const formatDb2Date = (d: Date) => d.toISOString().replace('T', ' ').substring(0, 19);

        // Transacción para garantizar RN02 (evitar traslapes bajo concurrencia)
        await Db2Connection.executeTransactionWithLogic(async (conn: any) => {
            // Verificar disponibilidad (estado del vehículo)
            const queryVehiculo = `SELECT ESTADO FROM VEHICULO WHERE ID_VEHICULO = ?`;
            const resVehiculo = await new Promise<any[]>((resolve, reject) => {
                conn.query(queryVehiculo, [vehiculoId], (err: any, data: any) => err ? reject(err) : resolve(data));
            });
            if (resVehiculo.length === 0 || resVehiculo[0].ESTADO !== 'DISPONIBLE') {
                const error: any = new Error("El vehículo no está disponible.");
                error.status = 409;
                throw error;
            }

            // Verificar traslapes activos
            const queryTraslapes = `
                SELECT COUNT(*) AS CANTIDAD
                FROM RESERVACION
                WHERE ID_VEHICULO = ?
                AND ESTADO = 'ACTIVA'
                AND (INICIO < ? AND FIN > ?)
            `;
            const resTraslapes = await new Promise<any[]>((resolve, reject) => {
                conn.query(queryTraslapes, [vehiculoId, formatDb2Date(fin), formatDb2Date(inicio)], (err: any, data: any) => err ? reject(err) : resolve(data));
            });
            
            if (parseInt(resTraslapes[0].CANTIDAD, 10) > 0) {
                const error: any = new Error("El vehículo no está disponible para el periodo seleccionado (traslape).");
                error.status = 409;
                throw error;
            }

            // Insertar reservación
            const insertQuery = `
                INSERT INTO RESERVACION 
                (ID_RESERVACION, CODIGO_RESERVA, ID_VEHICULO, ID_USUARIO, INICIO, FIN, ESTADO, TOTAL_ESTIMADO)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const params = [
                idReservacion,
                codigoReserva,
                vehiculoId,
                usuarioId,
                formatDb2Date(inicio),
                formatDb2Date(fin),
                EstadoReservacion.ACTIVA,
                totalEstimado
            ];
            
            await new Promise<void>((resolve, reject) => {
                conn.query(insertQuery, params, (err: any) => err ? reject(err) : resolve());
            });
        });
        
        return {
            id: idReservacion,
            codigoReserva,
            vehiculoId,
            usuarioId,
            inicio,
            fin,
            estado: EstadoReservacion.ACTIVA,
            totalEstimado,
            fechaCreacion: new Date()
        };
    }
    
    async obtenerReservacionPorCodigo(codigo: string): Promise<any> {
        const query = `SELECT * FROM RESERVACION WHERE CODIGO_RESERVA = ?`;
        const res = await Db2Connection.executeQuery(query, [codigo]);
        if (res.length === 0) return null;
        return res[0];
    }
}
