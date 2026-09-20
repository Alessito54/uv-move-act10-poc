"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiculoController = void 0;
const VehiculoService_1 = require("../../vehiculos/application/VehiculoService");
class VehiculoController {
    vehiculoService;
    constructor() {
        this.vehiculoService = new VehiculoService_1.VehiculoService();
    }
    listarVehiculos = async (req, res) => {
        try {
            const vehiculos = await this.vehiculoService.listarVehiculos();
            return res.status(200).json(vehiculos);
        }
        catch (error) {
            console.error("Error listarVehiculos:", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
    obtenerVehiculo = async (req, res) => {
        try {
            const id = req.params.id;
            const vehiculo = await this.vehiculoService.obtenerVehiculoPorId(id);
            if (!vehiculo) {
                return res.status(404).json({ error: 'Vehículo no encontrado' });
            }
            // Adjuntamos la política para que el frontend pueda mostrarla sin hacer otro llamado (optimización permitida)
            const politica = await this.vehiculoService.obtenerPoliticaAplicable(vehiculo.TIPOID);
            return res.status(200).json({ vehiculo, politica });
        }
        catch (error) {
            console.error("Error obtenerVehiculo:", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
}
exports.VehiculoController = VehiculoController;
