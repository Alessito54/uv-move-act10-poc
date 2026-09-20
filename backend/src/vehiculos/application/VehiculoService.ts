import { Db2Connection } from "../../infrastructure/db2/Db2Connection";
import { VehiculoServicePort } from "../../shared/ports/VehiculoServicePort";
import { EstadoVehiculo } from "../domain/Vehiculo";
import { PoliticaVehiculoDTO } from "../domain/PoliticaVehiculoDTO";

export class VehiculoService implements VehiculoServicePort {
    async consultarDisponibilidad(vehiculoId: string, inicio: Date, fin: Date): Promise<boolean> {
        // Verifica que el vehículo exista y esté DISPONIBLE
        const queryVehiculo = `SELECT ESTADO FROM VEHICULO WHERE ID_VEHICULO = ?`;
        const resVehiculo = await Db2Connection.executeQuery(queryVehiculo, [vehiculoId]);
        
        if (resVehiculo.length === 0) return false;
        if (resVehiculo[0].ESTADO !== EstadoVehiculo.DISPONIBLE) return false;

        // Comprobar que no haya reservaciones traslapadas activas
        // RN02: No puede existir traslape
        const queryTraslapes = `
            SELECT COUNT(*) AS CANTIDAD
            FROM RESERVACION
            WHERE ID_VEHICULO = ?
            AND ESTADO = 'ACTIVA'
            AND (INICIO < ? AND FIN > ?)
        `;
        const resTraslapes = await Db2Connection.executeQuery(queryTraslapes, [vehiculoId, fin, inicio]);
        
        return parseInt(resTraslapes[0].CANTIDAD, 10) === 0;
    }

    async obtenerPoliticaAplicable(tipoVehiculoId: string): Promise<PoliticaVehiculoDTO> {
        const query = `
            SELECT ID_POLITICA, ID_TIPO, TARIFA_HORA, TIEMPO_MAX_MIN, RESTRICCIONES, VIGENTE
            FROM POLITICA_VEHICULO
            WHERE ID_TIPO = ? AND VIGENTE = 1
        `;
        const res = await Db2Connection.executeQuery(query, [tipoVehiculoId]);
        
        if (res.length === 0) {
            throw new Error(`No se encontró política vigente para el tipo de vehículo: ${tipoVehiculoId}`);
        }

        const row = res[0];
        return {
            id: row.ID_POLITICA,
            tipoId: row.ID_TIPO,
            tarifaHora: parseFloat(row.TARIFA_HORA),
            tiempoMaxMin: row.TIEMPO_MAX_MIN,
            restricciones: row.RESTRICCIONES,
            vigente: row.VIGENTE === 1
        };
    }

    async cambiarEstado(vehiculoId: string, nuevoEstado: EstadoVehiculo): Promise<void> {
        const query = `UPDATE VEHICULO SET ESTADO = ? WHERE ID_VEHICULO = ?`;
        await Db2Connection.executeQuery(query, [nuevoEstado, vehiculoId]);
    }

    // Métodos extra para consultar el listado de vehículos para el front
    async listarVehiculos(): Promise<any[]> {
        const query = `
            SELECT v.ID_VEHICULO as id, v.CODIGO as codigo, v.ESTADO as estado, 
                   t.ID_TIPO as tipoId, t.NOMBRE as tipoNombre, t.DESCRIPCION as tipoDescripcion
            FROM VEHICULO v
            JOIN TIPO_VEHICULO t ON v.ID_TIPO = t.ID_TIPO
        `;
        return Db2Connection.executeQuery(query);
    }
    
    async obtenerVehiculo(vehiculoId: string): Promise<any> {
        const query = `
            SELECT v.ID_VEHICULO as id, v.CODIGO as codigo, v.ESTADO as estado, 
                   t.ID_TIPO as tipoId, t.NOMBRE as tipoNombre, t.DESCRIPCION as tipoDescripcion
            FROM VEHICULO v
            JOIN TIPO_VEHICULO t ON v.ID_TIPO = t.ID_TIPO
            WHERE v.ID_VEHICULO = ?
        `;
        const res = await Db2Connection.executeQuery(query, [vehiculoId]);
        if (res.length === 0) return null;
        return res[0];
    }
}
