"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const vehiculoRoutes_1 = __importDefault(require("./http/routes/vehiculoRoutes"));
const reservacionRoutes_1 = __importDefault(require("./http/routes/reservacionRoutes"));
// Cargar variables de entorno
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Rutas
app.use('/vehiculos', vehiculoRoutes_1.default);
app.use('/reservaciones', reservacionRoutes_1.default);
// Manejo de errores global simple
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal en el servidor.' });
});
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}
exports.default = app;
