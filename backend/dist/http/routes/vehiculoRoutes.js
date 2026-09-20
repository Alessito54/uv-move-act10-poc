"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VehiculoController_1 = require("../controllers/VehiculoController");
const SupabaseMiddleware_1 = require("../../infrastructure/auth/SupabaseMiddleware");
const router = (0, express_1.Router)();
const controller = new VehiculoController_1.VehiculoController();
// Rutas protegidas
router.get('/', SupabaseMiddleware_1.authMiddleware, controller.listarVehiculos);
router.get('/:id', SupabaseMiddleware_1.authMiddleware, controller.obtenerVehiculo);
exports.default = router;
