"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ReservacionController_1 = require("../controllers/ReservacionController");
const SupabaseMiddleware_1 = require("../../infrastructure/auth/SupabaseMiddleware");
const router = (0, express_1.Router)();
const controller = new ReservacionController_1.ReservacionController();
// Rutas protegidas
router.post('/', SupabaseMiddleware_1.authMiddleware, controller.crearReservacion);
router.get('/:codigo', SupabaseMiddleware_1.authMiddleware, controller.obtenerReservacion);
exports.default = router;
