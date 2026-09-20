"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReservacionController = void 0;
const express_1 = require("express");
const ReservacionService_1 = require("../../reservaciones/application/ReservacionService");
const VehiculoService_1 = require("../../vehiculos/application/VehiculoService");
class ReservacionController {
    reservacionService;
    constructor() {
        const vehiculoService = new VehiculoService_1.VehiculoService();
        this.reservacionService = new ReservacionService_1.ReservacionService(vehiculoService);
    }
    crearReservacion = async (req, res) => {
        try {
            const { vehiculoId, inicio, fin } = req.body;
            const usuarioId = req.user?.id || 'TEST_USER_ID'; // Fallback for local testing if auth is mocked
            if (!vehiculoId || !inicio || !fin) {
                return res.status(400).json({ error: 'Faltan datos obligatorios (vehiculoId, inicio, fin)' });
            }
            const reservacion = await this.reservacionService.crearReservacion(vehiculoId, usuarioId, inicio, fin);
            return res.status(201).json(reservacion);
        }
        catch (error) {
            console.error("Error crearReservacion:", error);
            // Si el error tiene status, lo usamos (ej: 409 para traslapes o 400 para reglas de negocio)
            const status = error.status || 500;
            return res.status(status).json({ error: error.message || 'Error interno del servidor' });
        }
    };
    obtenerReservacion = async (req, res) => {
        try {
            const { codigo } = req.params;
            const reservacion = await this.reservacionService.obtenerReservacionPorCodigo(codigo);
            if (!reservacion) {
                return res.status(404).json({ error: 'Reservación no encontrada' });
            }
            return res.status(200).json(reservacion);
        }
        catch (error) {
            console.error("Error obtenerReservacion:", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}
exports.ReservacionController = ReservacionController;
//# sourceMappingURL=ReservacionController.js.map